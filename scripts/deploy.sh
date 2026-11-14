#!/usr/bin/env bash
# Production deploy to the Devya VPS (the site left Vercel after the
# 2026-11-13 account pause). The VPS never builds: this script builds the
# Next.js standalone server on this Mac from a clean export of origin/main,
# swaps in Linux x86-64 native binaries, and ships only that built tree over
# SSH. On the VPS a stock node image runs it (docker-compose.prod.yml has no
# build step) behind nginx.
#
#   bash scripts/deploy.sh             # build origin/main here, ship it, restart the container
#   bash scripts/deploy.sh --stage     # build and ship the release, stage the nginx file; start nothing
#   bash scripts/deploy.sh --rollback  # put the previous release back and restart it
#
# Env: DEPLOY_HOST (default root@72.61.81.59), DEPLOY_REF (default origin/main),
# DEPLOY_NO_LOCK=1 skips the Mac load check and the shared heavy-job lock.
# Runtime config lives in ENV_FILE on the VPS (chmod 600, never in git); the
# deploy refuses to start the container while a REQUIRED_KEYS entry is empty.
set -euo pipefail

APP="sindo-media"                    # VPS dir, compose service and container name
PORT=3192                            # 127.0.0.1:PORT on the VPS (docker-compose.prod.yml)
HOSTS=(www.sindo-media.agency)       # server_name in deploy/nginx.conf; the first names the cert
APEX="sindo-media.agency"            # 301 to https://${HOSTS[0]} via apex-redirect ("" for none)
CHECK_PATH="/"                       # page whose <title> must contain TITLE
TITLE="Sindo Media"
REQUIRED_KEYS=()                     # the SMTP_* keys are optional: without them the forms answer 500 "Email service not configured"
BUILD_PUBLIC_KEYS=()                 # NEXT_PUBLIC_* inlined at build time, read from ENV_FILE on the VPS
BUILD_ENV=()                         # extra build-only variables (KEY=value)
INSTALL=(npm ci --no-audit --no-fund)
BUILD=(npm run build)
PLATFORM="linuxmusl-x64"             # node:24.22.1-alpine on an x86-64 VPS

HOST="${DEPLOY_HOST:-root@72.61.81.59}"
REF="${DEPLOY_REF:-origin/main}"
VPS_IP="72.61.81.59"
APP_DIR="/home/devya/projects/$APP"
ENV_FILE="/home/devya/projects/$APP.env"
LOCK="$HOME/Projects/_wt/.heavy-lock"

MODE="deploy"
case "${1:-}" in
  --stage) MODE="stage" ;;
  --rollback) MODE="rollback" ;;
  "") ;;
  *) echo "usage: $0 [--stage|--rollback]" >&2; exit 2 ;;
esac

cd "$(git rev-parse --show-toplevel)"
git fetch origin --quiet
SHA="$(git rev-parse --short "$REF")"

WORK="$(mktemp -d -t "$APP-deploy")"
HAVE_LOCK=0
release_mac() { if [ "$HAVE_LOCK" = 1 ]; then rmdir "$LOCK" 2>/dev/null || true; HAVE_LOCK=0; fi; }
trap 'release_mac; rm -rf "$WORK"' EXIT
SSH=(ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=8 "$HOST")

# One heavy job at a time on this Mac: wait for the 1-min load to drop below
# 15, then take the lock other sessions share (stale after 20 minutes).
wait_for_mac() {
  [ "${DEPLOY_NO_LOCK:-}" = 1 ] && return 0
  while [ "$(sysctl -n vm.loadavg 2>/dev/null | awk '{print int($2)}')" -ge 15 ] 2>/dev/null; do
    echo "· waiting for the Mac's load to drop below 15"; sleep 20
  done
  if [ -d "$(dirname "$LOCK")" ]; then
    until mkdir "$LOCK" 2>/dev/null; do
      if [ -n "$(find "$LOCK" -maxdepth 0 -mmin +20 2>/dev/null)" ]; then rmdir "$LOCK" 2>/dev/null || true; fi
      sleep 15
    done
    HAVE_LOCK=1
  fi
}

# The remote half runs from a file with stdin closed (a `bash -s` heredoc can be
# eaten by a child process and end the deploy early without an error).
{
  printf 'APP=%q APP_DIR=%q ENV_FILE=%q PORT=%q SHA=%q\n' "$APP" "$APP_DIR" "$ENV_FILE" "$PORT" "$SHA"
  printf 'CHECK_PATH=%q TITLE=%q APEX=%q\n' "$CHECK_PATH" "$TITLE" "$APEX"
  printf 'HOSTS=(%s)\n' "${HOSTS[*]}"
  printf 'REQUIRED_KEYS=(%s)\n' "${REQUIRED_KEYS[*]:-}"
  printf 'BUILD_PUBLIC_KEYS=(%s)\n' "${BUILD_PUBLIC_KEYS[*]:-}"
  cat <<'REMOTE'
set -euo pipefail
value() { sed -n "s/^$1=//p" "$ENV_FILE" | tail -1 | sed -E "s/^'(.*)'\$/\\1/; s/^\"(.*)\"\$/\\1/"; }

preflight() {  # read-only: what the Mac build and the start need from ENV_FILE
  [ -f "$ENV_FILE" ] || { echo "NOFILE"; return 0; }
  local k
  for k in "${REQUIRED_KEYS[@]}"; do [ -n "$(value "$k")" ] || echo "MISSING $k"; done
  for k in "${BUILD_PUBLIC_KEYS[@]}"; do echo "PUBLIC $k=$(value "$k")"; done
}

ship() {
  rm -rf "$APP_DIR.next" && mkdir -p "$APP_DIR.next"
  tar --no-same-owner -xzf "/tmp/$APP-$SHA.tgz" -C "$APP_DIR.next"
  rm -f "/tmp/$APP-$SHA.tgz"
  chown -R 1000:1000 "$APP_DIR.next/app"   # the container runs as node (1000)
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $SHA" > "$APP_DIR.next/.deployed-commit"
  if [ -d "$APP_DIR" ]; then rm -rf "$APP_DIR.prev" && mv "$APP_DIR" "$APP_DIR.prev"; fi
  mv "$APP_DIR.next" "$APP_DIR"
}

start() {
  cd "$APP_DIR"
  docker compose -f docker-compose.prod.yml up -d --force-recreate
  local code="000" title="" i
  for i in $(seq 1 40); do
    code="$(curl -s -o /dev/null -m 10 -w '%{http_code}' "http://127.0.0.1:$PORT$CHECK_PATH" || true)"
    [ "$code" = 200 ] && break
    sleep 3
  done
  title="$(curl -s -m 10 "http://127.0.0.1:$PORT$CHECK_PATH" | grep -o '<title>[^<]*</title>' | head -1 || true)"
  echo "GET 127.0.0.1:$PORT$CHECK_PATH → $code $title"
  if [ "$code" != 200 ] || [[ "$title" != *"$TITLE"* ]]; then
    docker logs "$APP" --tail 40 >&2 || true
    echo "✗ the release is not serving; roll back with: bash scripts/deploy.sh --rollback" >&2
    return 1
  fi
}

# nginx: the site file is installed once (HTTP only); pending-certs issues the
# certificate once every host resolves here and certbot then edits the file in
# place, so later deploys never overwrite it. Change it on the box, not here.
nginx_site() {  # stage | enable
  local site="/etc/nginx/sites-available/$APP" link="/etc/nginx/sites-enabled/$APP"
  if [ ! -e "$site" ]; then cp "$APP_DIR/deploy/nginx.conf" "$site"; echo "nginx: installed $site"; fi
  [ "$1" = enable ] || { echo "nginx: $site staged (not enabled)"; return 0; }
  if [ ! -e "$link" ]; then
    ln -s "$site" "$link"
    if ! nginx -t; then rm -f "$link"; echo "✗ nginx rejected $site; left disabled" >&2; return 1; fi
    systemctl reload nginx
    echo "nginx: enabled $site"
  fi
  pending-certs add "$APP" "${HOSTS[@]}"
  if [ -n "$APEX" ]; then apex-redirect add "$APEX" "${HOSTS[0]}"; fi
}

case "${1:?action}" in
  preflight) preflight ;;
  deploy)
    pre="$(preflight)"
    if grep -q -e '^NOFILE' -e '^MISSING' <<<"$pre"; then
      rm -f "/tmp/$APP-$SHA.tgz"; echo "✗ $ENV_FILE is missing or incomplete; $APP not started" >&2; exit 1
    fi
    ship
    start
    nginx_site enable
    ;;
  stage)
    ship
    nginx_site stage
    ;;
  rollback)
    [ -d "$APP_DIR.prev" ] || { echo "✗ no previous release at $APP_DIR.prev" >&2; exit 1; }
    rm -rf "$APP_DIR.failed" && mv "$APP_DIR" "$APP_DIR.failed" && mv "$APP_DIR.prev" "$APP_DIR"
    echo "rolled back to $(cat "$APP_DIR/.deployed-commit" 2>/dev/null || echo unknown)"
    start
    ;;
esac
REMOTE
} > "$WORK/remote.sh"
scp -q "$WORK/remote.sh" "$HOST:/tmp/$APP-deploy.sh"
remote() { "${SSH[@]}" "bash /tmp/$APP-deploy.sh $1" </dev/null; }

if [ "$MODE" != rollback ]; then
  # 1. Preflight on the VPS (read-only): env file present, required keys set,
  #    and the public values the build inlines.
  pre="$(remote preflight)"
  if grep -q '^NOFILE' <<<"$pre"; then echo "✗ $ENV_FILE is missing on the VPS; create it (chmod 600) first" >&2; exit 1; fi
  missing="$(sed -n 's/^MISSING //p' <<<"$pre" | tr '\n' ' ')"
  if [ -n "$missing" ]; then
    echo "! $ENV_FILE has no value for: $missing" >&2
    [ "$MODE" = stage ] || { echo "✗ $APP not deployed" >&2; exit 1; }
  fi
  PUB_ENV=()
  while IFS= read -r kv; do [ -n "$kv" ] && PUB_ENV+=("$kv"); done < <(sed -n 's/^PUBLIC //p' <<<"$pre")

  # 2. Build on this Mac from a clean export of the ref (no local env files).
  wait_for_mac
  echo "→ building $REF ($SHA) on this Mac"
  mkdir "$WORK/src"
  git archive "$REF" | tar -x -C "$WORK/src"
  (
    cd "$WORK/src"
    "${INSTALL[@]}"
    env NEXT_TELEMETRY_DISABLED=1 ${PUB_ENV[@]+"${PUB_ENV[@]}"} ${BUILD_ENV[@]+"${BUILD_ENV[@]}"} "${BUILD[@]}"
  )
  release_mac

  # 3. The release: the standalone server plus its static files, with Linux
  #    native binaries in place of the macOS ones.
  S="$WORK/src"; R="$WORK/release"
  [ -f "$S/.next/standalone/server.js" ] || { echo "✗ no .next/standalone/server.js (next.config needs output: 'standalone')" >&2; exit 1; }
  mkdir -p "$R/app/.next" "$R/deploy"
  cp -a "$S/.next/standalone/." "$R/app/"
  cp -a "$S/.next/static" "$R/app/.next/static"
  if [ -d "$S/public" ]; then cp -a "$S/public" "$R/app/public"; fi
  cp "$S/docker-compose.prod.yml" "$R/"
  cp "$S/deploy/nginx.conf" "$R/deploy/"

  # sharp (Next.js image optimizer) ships per-platform binaries as optional
  # dependencies; the Mac install only has the darwin ones. Fetch the
  # $PLATFORM pair at the exact versions sharp pins and drop the darwin ones.
  mkdir -p "$WORK/pack"
  while IFS= read -r pkg; do
    for spec in $(node -e '
      const p = require(process.argv[1]), plat = process.argv[2];
      for (const [n, v] of Object.entries(p.optionalDependencies || {}))
        if (n === "@img/sharp-" + plat || n === "@img/sharp-libvips-" + plat) console.log(n + "@" + v);
    ' "$pkg" "$PLATFORM"); do
      name="${spec%@*}"
      [ -e "$R/app/node_modules/$name" ] && continue
      file="$(cd "$WORK/pack" && npm pack --silent "$spec" | tail -1)"
      mkdir -p "$R/app/node_modules/$name"
      tar -xzf "$WORK/pack/$file" -C "$R/app/node_modules/$name" --strip-components=1
      echo "· added $spec"
    done
  done < <(find "$R/app/node_modules" -path '*/node_modules/sharp/package.json' 2>/dev/null)
  find "$R/app/node_modules" -name 'sharp-*darwin*' -prune -exec rm -rf {} + 2>/dev/null || true
  bad="$(find "$R/app" -name '*.node' -not -path "*/@img/sharp-$PLATFORM/*" | sed "s#^$R/app/##")"
  if [ -n "$bad" ]; then echo "✗ native modules built for macOS in the release:" >&2; echo "$bad" >&2; exit 1; fi
  for f in $(find "$R/app" -name '*.node'); do
    file -b "$f" | grep -q 'ELF 64-bit.*x86-64' || { echo "✗ $f is not a Linux x86-64 binary" >&2; exit 1; }
  done

  COPYFILE_DISABLE=1 tar --no-xattrs --no-mac-metadata -czf "$WORK/release.tgz" -C "$R" .
  echo "→ shipping $SHA ($(du -h "$WORK/release.tgz" | cut -f1)) to $HOST:$APP_DIR"
  scp -q "$WORK/release.tgz" "$HOST:/tmp/$APP-$SHA.tgz"
fi

rc=0
remote "$MODE" || rc=$?
"${SSH[@]}" "rm -f /tmp/$APP-deploy.sh" </dev/null || true
[ "$rc" = 0 ] || exit "$rc"
[ "$MODE" = stage ] && { echo "✓ $SHA staged; nothing started"; exit 0; }

# Public checks. Before DNS points at the VPS, go through its nginx by --resolve.
fail=0
for h in "${HOSTS[@]}" ${APEX:+"$APEX"}; do
  ips="$(dig +short A "$h" @1.1.1.1 | grep -E '^[0-9.]+$' | sort -u | tr '\n' ' ' || true)"
  if [ "$ips" = "$VPS_IP " ]; then
    out="$(curl -s -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' "https://$h$CHECK_PATH" || true)"
    [ "${out%% *}" = 000 ] && out="$(curl -s -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' "http://$h$CHECK_PATH" || true) (http; certificate pending)"
  else
    out="$(curl -s -o /dev/null -m 20 -w '%{http_code} %{redirect_url}' --resolve "$h:80:$VPS_IP" "http://$h$CHECK_PATH" || true) (DNS not on the VPS yet: ${ips:-none}; checked by --resolve)"
  fi
  echo "· $h$CHECK_PATH → $out"
  case "${out%% *}" in 200|301|308) ;; *) fail=1 ;; esac
done
[ "$fail" = 0 ] || { echo "✗ a public check failed; roll back with: bash scripts/deploy.sh --rollback" >&2; exit 1; }
echo "✓ $SHA is live"
