#!/usr/bin/env bash
# Relayer entrypoint. Loads signer keys from files and HYP_WHITELIST from state.
# Empty whitelist is deny-all. [] is refused (that would relay everything).
set -euo pipefail
if [ ! -s /config/agent-config.json ]; then
  echo "ERROR: /config/agent-config.json missing. Run scripts/deploy-core.sh first."
  exit 1
fi
# shellcheck disable=SC2089 # JSON is intentionally exported as one string.
DENY_ALL='[{"recipientaddress":"0x0000000000000000000000000000000000000000000000000000000000000000"}]'
if [ -s /config/relayer-whitelist.json ]; then
  HYP_WHITELIST="$(cat /config/relayer-whitelist.json)"
else
  echo "WARN: relayer-whitelist.json missing — deny-all (run scripts/deploy-warp.sh)"
  HYP_WHITELIST="$DENY_ALL"
fi
if [ "$HYP_WHITELIST" = "[]" ]; then
  echo "ERROR: empty HYP_WHITELIST would relay everything. Refusing to start."
  exit 1
fi
# shellcheck disable=SC2090 # Hyperlane expects the JSON string in this variable.
export HYP_WHITELIST

read_hex_key() {
  local file="$1" value
  [ -s "$file" ] || { echo "ERROR: missing $file" >&2; return 1; }
  value="$(tr -d ' \n' < "$file")"
  [[ "$value" =~ ^0x[0-9a-fA-F]{64}$ ]] || {
    echo "ERROR: $file must contain a 0x-prefixed 32-byte hex key." >&2
    return 1
  }
  printf '%s' "$value"
}

HYP_CHAINS_GORCHAIN_SIGNER_KEY="$(read_hex_key /keys/relayer-gorchain.key)"
HYP_CHAINS_SOLANA_SIGNER_KEY="$(read_hex_key /keys/relayer-solana.key)"
export HYP_CHAINS_GORCHAIN_SIGNER_KEY HYP_CHAINS_SOLANA_SIGNER_KEY

exec ./relayer \
  --db /data/relayer \
  --relayChains gorchain,solana \
  --allowLocalCheckpointSyncers false \
  --metricsPort 9091
