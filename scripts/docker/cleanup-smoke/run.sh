#!/usr/bin/env bash
set -euo pipefail

cd /repo

export PENGUIN_STATE_DIR="/tmp/penguin-test"
export PENGUIN_CONFIG_PATH="${PENGUIN_STATE_DIR}/penguin.json"

echo "==> Seed state"
mkdir -p "${PENGUIN_STATE_DIR}/credentials"
mkdir -p "${PENGUIN_STATE_DIR}/agents/main/sessions"
echo '{}' >"${PENGUIN_CONFIG_PATH}"
echo 'creds' >"${PENGUIN_STATE_DIR}/credentials/marker.txt"
echo 'session' >"${PENGUIN_STATE_DIR}/agents/main/sessions/sessions.json"

echo "==> Reset (config+creds+sessions)"
pnpm penguin reset --scope config+creds+sessions --yes --non-interactive

test ! -f "${PENGUIN_CONFIG_PATH}"
test ! -d "${PENGUIN_STATE_DIR}/credentials"
test ! -d "${PENGUIN_STATE_DIR}/agents/main/sessions"

echo "==> Recreate minimal config"
mkdir -p "${PENGUIN_STATE_DIR}/credentials"
echo '{}' >"${PENGUIN_CONFIG_PATH}"

echo "==> Uninstall (state only)"
pnpm penguin uninstall --state --yes --non-interactive

test ! -d "${PENGUIN_STATE_DIR}"

echo "OK"
