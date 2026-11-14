#!/usr/bin/env bash
# Production deploy to the Devya VPS. The site left Vercel after the
# 2026-11-13 account pause; this is the devya-quote-app / devya-moving-landing
# pattern: a `git archive` of origin/main goes over SSH (the VPS has no GitHub
# credentials), Docker Compose rebuilds the container under the shared build
# lock, and nginx proxies the public hosts to the container on loopback.
#
#   bash scripts/deploy.sh             # deploy origin/main
#   bash scripts/deploy.sh --stage     # ship the release and the nginx file only; start nothing
#   bash scripts/deploy.sh --rollback  # put the previous release back and rebuild it
#
# Env: DEPLOY_HOST (default root@72.61.81.59), DEPLOY_REF (default origin/main).
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

HOST="${DEPLOY_HOST:-root@72.61.81.59}"
REF="${DEPLOY_REF:-origin/main}"
VPS_IP="72.61.81.59"
APP_DIR="/home/devya/projects/$APP"
ENV_FILE="/home/devya/projects/$APP.env"

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
trap 'rm -rf "$WORK"' EXIT

# The remote half runs from a file with stdin closed (a `bash -s` heredoc can be
# eaten by a child process and end the deploy early without an error).
{
  printf 'APP=%q APP_DIR=%q ENV_FILE=%q PORT=%q SHA=%q MODE=%q\n' \
    "$APP" "$APP_DIR" "$ENV_FILE" "$PORT" "$SHA" "$MODE"
  printf 'CHECK_PATH=%q TITLE=%q APEX=%q\n' "$CHECK_PATH" "$TITLE" "$APEX"
  printf 'HOSTS=(%s)\n' "${HOSTS[*]}"
  printf 'REQUIRED_KEYS=(%s)\n' "${REQUIRED_KEYS[*]:-}"
  cat <<'REMOTE'
set -euo pipefail
compose() { docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml "$@"; }

check_env() {
  [ -f "$ENV_FILE" ] || { echo "✗ $ENV_FILE is missing; create it (chmod 600) first" >&2; return 1; }
  local missing=() k
  for k in "${REQUIRED_KEYS[@]}"; do
    [ -n "$(sed -n "s/^$k=//p" "$ENV_FILE" | tail -1 | tr -d "'\"")" ] || missing+=("$k")
  done
  if [ "${#missing[@]}" -gt 0 ]; then
    echo "✗ $ENV_FILE has no value for: ${missing[*]}" >&2
    return 1
  fi
}

ship() {
  rm -rf "$APP_DIR.next" && mkdir -p "$APP_DIR.next"
  tar -xzf "/tmp/$APP-$SHA.tar.gz" -C "$APP_DIR.next"
  rm -f "/tmp/$APP-$SHA.tar.gz"
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $SHA" > "$APP_DIR.next/.deployed-commit"
  if [ -d "$APP_DIR" ]; then rm -rf "$APP_DIR.prev" && mv "$APP_DIR" "$APP_DIR.prev"; fi
  mv "$APP_DIR.next" "$APP_DIR"
}

build_and_start() {
  cd "$APP_DIR"
  # One build at a time on this 2-vCPU box (other deploys share the lock).
  flock /tmp/vx-build.lock docker compose --env-file "$ENV_FILE" -f docker-compose.prod.yml build
  compose up -d
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
  docker image prune -f >/dev/null
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

case "$MODE" in
  deploy)
    check_env || { rm -f "/tmp/$APP-$SHA.tar.gz"; echo "✗ $APP not started" >&2; exit 1; }
    ship
    build_and_start
    nginx_site enable
    ;;
  stage)
    ship
    nginx_site stage
    check_env || echo "! fill those keys in $ENV_FILE, then run bash scripts/deploy.sh" >&2
    ;;
  rollback)
    [ -d "$APP_DIR.prev" ] || { echo "✗ no previous release at $APP_DIR.prev" >&2; exit 1; }
    rm -rf "$APP_DIR.failed" && mv "$APP_DIR" "$APP_DIR.failed" && mv "$APP_DIR.prev" "$APP_DIR"
    echo "rolled back to $(cat "$APP_DIR/.deployed-commit" 2>/dev/null || echo unknown)"
    build_and_start
    ;;
esac
REMOTE
} > "$WORK/remote.sh"

if [ "$MODE" != rollback ]; then
  echo "→ shipping $REF ($SHA) to $HOST:$APP_DIR"
  git archive --format=tar.gz -o "$WORK/release.tar.gz" "$REF"
  scp -q "$WORK/release.tar.gz" "$HOST:/tmp/$APP-$SHA.tar.gz"
fi
scp -q "$WORK/remote.sh" "$HOST:/tmp/$APP-deploy.sh"
ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=8 "$HOST" \
  "bash /tmp/$APP-deploy.sh; rc=\$?; rm -f /tmp/$APP-deploy.sh; exit \$rc" </dev/null

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
