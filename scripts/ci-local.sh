#!/usr/bin/env bash
# The merge gate, step for step what Jenkins runs (Jenkinsfile). Run it from
# anywhere: bash scripts/ci-local.sh
# The repo has no lint, typecheck or test script (`next lint` is gone in
# Next 16); `next build` type-checks the app.
set -euo pipefail
cd "$(dirname "$0")/.."

bash -n scripts/deploy.sh
npm ci --no-audit --no-fund
npm run build
echo "ci-local: all steps passed"
