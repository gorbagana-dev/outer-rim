#!/usr/bin/env bash
# Validator entrypoint. Reads announce and ISM hex keys from bind-mounted files.
set -euo pipefail
if [ ! -s /config/agent-config.json ]; then
  echo "ERROR: /config/agent-config.json missing. Run scripts/deploy-core.sh first."
  exit 1
fi

read_hex_key() {
  local file="$1" value
  [ -s "$file" ] || { echo "ERROR: missing $file"; exit 1; }
  value="$(tr -d ' \n' < "$file")"
  if [[ ! "$value" =~ ^0x[0-9a-fA-F]{64}$ ]]; then
    echo "ERROR: $file must contain a 0x-prefixed 32-byte hex key."
    exit 1
  fi
  printf '%s\n' "$value"
}

KEY_FILE="${SIGNER_KEY_FILE:?SIGNER_KEY_FILE must be set}"
ISM_FILE="${ISM_KEY_FILE:?ISM_KEY_FILE must be set}"
HYP_DEFAULTSIGNER_KEY="$(read_hex_key "$KEY_FILE")"
HYP_VALIDATOR_KEY="$(read_hex_key "$ISM_FILE")"
HYP_VALIDATOR_TYPE=hexKey
export HYP_DEFAULTSIGNER_KEY HYP_VALIDATOR_KEY HYP_VALIDATOR_TYPE
exec ./validator
