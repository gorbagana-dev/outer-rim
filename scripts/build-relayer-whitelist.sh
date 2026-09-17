#!/bin/bash
# Build the relayer message whitelist from warp program hex addresses.
# Empty result → deny-all sentinel. Never emit [] (that means relay everything).
set -euo pipefail

STATE_DIR="${STATE_DIR:-${STATE_OUTPUT_DIR:-/outer-rim/state}}"
WARP_ROUTES_DIR="${WARP_ROUTES_DIR:-${STATE_DIR}/generated/warp-routes}"
: "${WARP_ROUTES:?WARP_ROUTES must be set}"

DENY_ALL='[{"recipientaddress":"0x0000000000000000000000000000000000000000000000000000000000000000"}]'

rules="[]"
for route in $(echo "${WARP_ROUTES}" | tr ',' ' '); do
  cfg="${WARP_ROUTES_DIR}/${route}.json"
  [ -s "$cfg" ] || { echo "ERROR: relayer whitelist: $cfg not found for '${route}'" >&2; exit 1; }
  name=$(jq -r '.name' "$cfg")
  wpids="${STATE_DIR}/warp-routes/${name}/warp-deploy-outputs/program-ids.json"
  [ -s "$wpids" ] || { echo "ERROR: relayer whitelist: missing ${wpids}" >&2; exit 1; }

  for chain in $(jq -r 'keys[]' "$wpids"); do
    hex=$(jq -r --arg c "$chain" '.[$c].hex // ""' "$wpids")
    [ -n "$hex" ] || { echo "ERROR: relayer whitelist: no hex address for ${chain}" >&2; exit 1; }
    case "$hex" in 0x*) ;; *) hex="0x${hex}" ;; esac
    [[ "$hex" =~ ^0x[0-9a-fA-F]{64}$ ]] || {
      echo "ERROR: relayer whitelist: invalid 32-byte hex address for ${chain}" >&2
      exit 1
    }
    rules=$(jq -c --arg r "$hex" '. + [{recipientaddress:$r}]' <<<"$rules")
  done
done

whitelist=$(jq -c 'unique' <<<"$rules")
if [ "$whitelist" = "[]" ]; then
  whitelist="$DENY_ALL"
fi

echo "$whitelist" > "${STATE_DIR}/relayer-whitelist.json"
echo "Wrote ${STATE_DIR}/relayer-whitelist.json ($(jq 'length' <<<"$whitelist") rule(s))"
