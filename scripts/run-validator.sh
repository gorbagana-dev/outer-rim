#!/usr/bin/env bash
# Validator entrypoint. Reads the announce key from a bind-mounted file.
set -euo pipefail
if [ ! -s /config/agent-config.json ]; then
  echo "ERROR: /config/agent-config.json missing. Run scripts/deploy-core.sh first."
  exit 1
fi
KEY_FILE="${SIGNER_KEY_FILE:?SIGNER_KEY_FILE must be set}"
[ -s "$KEY_FILE" ] || { echo "ERROR: missing $KEY_FILE"; exit 1; }
HYP_DEFAULTSIGNER_KEY="$(tr -d ' \n' < "$KEY_FILE")"
if [[ ! "$HYP_DEFAULTSIGNER_KEY" =~ ^0x[0-9a-fA-F]{64}$ ]]; then
  echo "ERROR: $KEY_FILE must contain a 0x-prefixed 32-byte hex key."
  exit 1
fi
export HYP_DEFAULTSIGNER_KEY

KMS_HOST="${KMS_HOST:?KMS_HOST must be set}"
echo "Waiting for KMS proxy ${KMS_HOST}:9999..."
for _ in $(seq 1 60); do
  if echo > "/dev/tcp/${KMS_HOST}/9999" 2>/dev/null; then
    echo "KMS proxy is ready, starting validator"
    exec ./validator
  fi
  sleep 1
done
echo "ERROR: KMS proxy ${KMS_HOST}:9999 did not become ready within 60 seconds."
exit 1
