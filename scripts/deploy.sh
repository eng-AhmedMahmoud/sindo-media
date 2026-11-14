#!/usr/bin/env bash
# Production deploy to the Devya VPS (the site left Vercel after the
# 2026-11-13 account pause). The VPS never builds: this script builds the
# Next.js standalone server on this Mac from a clean export of origin/main,
# swaps in Linux x86-64 native binaries, and ships only that built tree over
# SSH into /home/devya/projects/<app>/releases/<sha>, with a `current` symlink.
# A stock node image runs `current` read-only (docker-compose.prod.yml has no
# build step) behind nginx.
#
#   bash scripts/deploy.sh             # build origin/main here, ship it, restart the container
#   bash scripts/deploy.sh --stage     # build and ship the release, stage the nginx file; start nothing
#   bash scripts/deploy.sh --rollback  # put the previous release back and restart it
#
# Env: DEPLOY_HOST (default root@72.61.81.59), DEPLOY_REF (default origin/main),
# DEPLOY_NO_LOCK=1 skips the Mac load check and the shared build lock.
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
NPM_TARGET=(--os=linux --cpu=x64 --libc=musl)  # node:24.22.1-alpine on an x86-64 VPS

HOST="${DEPLOY_HOST:-root@72.61.81.59}"
REF="${DEPLOY_REF:-origin/main}"
VPS_IP="72.61.81.59"
APP_DIR="/home/devya/projects/$APP"
ENV_FILE="/home/devya/projects/$APP.env"
LOCK="/tmp/vx-mac-build.lock"         # shared by every agent building on this Mac

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

# One heavy job at a time on this Mac across all sessions: wait for the 1-min
# load to drop below 15, then take the shared build lock (released on exit).
wait_for_mac() {
  [ "${DEPLOY_NO_LOCK:-}" = 1 ] && return 0
  while [ "$(sysctl -n vm.loadavg 2>/dev/null | awk '{print int($2)}')" -ge 15 ] 2>/dev/null; do
    echo "· waiting for the Mac's load to drop below 15"; sleep 20
  done
  until mkdir "$LOCK" 2>/dev/null; do echo "· waiting for $LOCK"; sleep 20; done
  HAVE_LOCK=1
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
set -Eeuo pipefail
trap 'echo "✗ remote step failed (line $LINENO): $BASH_COMMAND" >&2' ERR
value() { sed -n "s/^$1=//p" "$ENV_FILE" | tail -1 | sed -E "s/^'(.*)'\$/\\1/; s/^\"(.*)\"\$/\\1/"; }

preflight() {  # read-only: what the Mac build and the start need from ENV_FILE
  [ -f "$ENV_FILE" ] || { echo "NOFILE"; return 0; }
  local k
  for k in "${REQUIRED_KEYS[@]}"; do [ -n "$(value "$k")" ] || echo "MISSING $k"; done
  for k in "${BUILD_PUBLIC_KEYS[@]}"; do echo "PUBLIC $k=$(value "$k")"; done
}

# Layout: $APP_DIR/{docker-compose.prod.yml, nginx.conf, current -> releases/<sha>,
# previous -> releases/<sha>, releases/<sha>/ (the standalone server)}.
point() {  # point <link> <target>: atomic symlink swap
  ln -sfn "$2" "$APP_DIR/.$1.new" && mv -Tf "$APP_DIR/.$1.new" "$APP_DIR/$1"
}

ship() {
  local in="$APP_DIR/releases/.incoming-$SHA" cur=""
  mkdir -p "$APP_DIR/releases"
  rm -rf "$in" && mkdir -p "$in"
  tar --no-same-owner -xzf "/tmp/$APP-$SHA.tgz" -C "$in"
  rm -f "/tmp/$APP-$SHA.tgz"
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $SHA" > "$in/app/.deployed-commit"
  cp "$in/docker-compose.prod.yml" "$APP_DIR/docker-compose.prod.yml"
  cp "$in/deploy/nginx.conf" "$APP_DIR/nginx.conf"
  [ -L "$APP_DIR/current" ] && cur="$(readlink "$APP_DIR/current")"
  if [ "$cur" = "releases/$SHA" ]; then
    echo "releases/$SHA is already current; restarting it"
  else
    rm -rf "$APP_DIR/releases/$SHA" && mv "$in/app" "$APP_DIR/releases/$SHA"
    [ -n "$cur" ] && point previous "$cur"
    point current "releases/$SHA"
  fi
  rm -rf "$in"
  # Keep the three newest releases plus whatever current/previous point at.
  local keep r
  keep="$(readlink "$APP_DIR/current" 2>/dev/null || true) $(readlink "$APP_DIR/previous" 2>/dev/null || true)"
  for r in $(ls -1t "$APP_DIR/releases" | tail -n +4); do
    [[ " $keep " == *" releases/$r "* ]] || rm -rf "$APP_DIR/releases/$r"
  done
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
  if [ ! -e "$site" ]; then cp "$APP_DIR/nginx.conf" "$site"; echo "nginx: installed $site"; fi
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
    prev="$(readlink "$APP_DIR/previous" 2>/dev/null || true)"
    [ -n "$prev" ] && [ -d "$APP_DIR/$prev" ] || { echo "✗ no previous release" >&2; exit 1; }
    cur="$(readlink "$APP_DIR/current")"
    point current "$prev" && point previous "$cur"
    echo "rolled back to $prev ($(cat "$APP_DIR/$prev/.deployed-commit" 2>/dev/null || echo unknown))"
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
  mkdir -p "$R/app/.next/cache"   # mount point for the container's writable tmpfs
  cp -a "$S/.next/static" "$R/app/.next/static"
  if [ -d "$S/public" ]; then cp -a "$S/public" "$R/app/public"; fi
  cp "$S/docker-compose.prod.yml" "$R/"
  cp "$S/deploy/nginx.conf" "$R/deploy/"

  # Native modules: every copy of sharp in the standalone tree (Next.js ships
  # its own nested one) gets its sibling @img dir replaced by the Linux x86-64
  # musl build of the same version, to match node:alpine. Leftover macOS
  # builds (pnpm keeps them under .pnpm) are dropped, and nothing that is not
  # an ELF x86-64 binary may ship.
  while IFS= read -r pkg; do
    modules="$(dirname "$(dirname "$pkg")")"
    version="$(node -p "require(process.argv[1]).version" "$pkg")"
    natives="$WORK/natives/$version"
    if [ ! -d "$natives/node_modules/@img" ]; then
      mkdir -p "$natives"
      npm install --prefix "$natives" --no-save --no-audit --no-fund \
        "${NPM_TARGET[@]}" "sharp@$version" >/dev/null
    fi
    rm -rf "$modules/@img" && mkdir -p "$modules/@img"
    cp -R "$natives/node_modules/@img/." "$modules/@img/"
    echo "· sharp $version: Linux natives in ${modules#"$R/app/"}"
  done < <(find "$R/app" -path '*/node_modules/sharp/package.json')
  find "$R/app" -name 'sharp-*darwin*' -prune -exec rm -rf {} + 2>/dev/null || true
  bad="$(find "$R/app" -name '*.node' -exec file {} + | grep -v 'ELF 64-bit LSB.*x86-64' || true)"
  [ -z "$bad" ] || { echo "✗ non-Linux native modules in the release:" >&2; echo "$bad" >&2; exit 1; }

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
