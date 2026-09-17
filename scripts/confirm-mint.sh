#!/usr/bin/env bash
# Confirm the Solana GOR mint is classic SPL collateral we can escrow.
# Fails if decimals / token program / freeze authority do not match gor.yml.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
. "${SCRIPT_DIR}/lib.sh"
load_env
require_cmd curl jq python3

ROUTE_YML="${OUTER_RIM_ROOT}/config/warp-routes/gor.yml"
MINT=$(jq -er '.remote.token' "$ROUTE_YML")
EXPECT_DECIMALS=$(jq -er '.remote.decimals' "$ROUTE_YML")
ORIGIN_DECIMALS=$(jq -er '.origin.decimals' "$ROUTE_YML")
ORIGIN_WIRE_DECIMALS=$(jq -er '.origin.remoteDecimals' "$ROUTE_YML")
REMOTE_WIRE_DECIMALS=$(jq -er '.remote.remoteDecimals' "$ROUTE_YML")
RPC="${SOLANA_RPC_URL:?SOLANA_RPC_URL must be set}"

if [ "$ORIGIN_DECIMALS" -ne 9 ] \
  || [ "$ORIGIN_WIRE_DECIMALS" -ne 9 ] \
  || [ "$REMOTE_WIRE_DECIMALS" -ne 9 ]; then
  echo "ERROR: GOR route requires 9 origin decimals and remoteDecimals=9 on both sides." >&2
  echo "Changing these values can create a 1000x accounting error." >&2
  exit 1
fi

body=$(printf '{"jsonrpc":"2.0","id":1,"method":"getAccountInfo","params":["%s",{"encoding":"jsonParsed"}]}' "$MINT")
resp=$(curl -sS -X POST "$RPC" -H 'Content-Type: application/json' -d "$body")

python3 - "$resp" "$MINT" "$EXPECT_DECIMALS" <<'PY'
import json, sys
resp, mint, expect_decimals = sys.argv[1], sys.argv[2], int(sys.argv[3])
d = json.loads(resp)
value = (d.get("result") or {}).get("value")
if not value:
    print(f"ERROR: mint {mint} not found on this RPC", file=sys.stderr)
    sys.exit(1)
owner = value.get("owner")
spl = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
token2022 = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb"
info = (((value.get("data") or {}).get("parsed") or {}).get("info") or {})
decimals = info.get("decimals")
mint_auth = info.get("mintAuthority")
freeze_auth = info.get("freezeAuthority")
print(f"mint:            {mint}")
print(f"token program:   {owner}")
print(f"decimals:        {decimals}")
print(f"mintAuthority:   {mint_auth}")
print(f"freezeAuthority: {freeze_auth}")
if owner != spl:
    if owner == token2022:
        print("ERROR: mint is Token-2022. Outer Rim v1 collateral path is verified for classic SPL (Tokenkeg). Stop and confirm the Hyperlane collateral program against this mint before deploy.", file=sys.stderr)
    else:
        print(f"ERROR: mint owner {owner} is not classic SPL Tokenkeg", file=sys.stderr)
    sys.exit(1)
if decimals != expect_decimals:
    print(f"ERROR: on-chain decimals {decimals} != gor.yml remote.decimals {expect_decimals}", file=sys.stderr)
    sys.exit(1)
if freeze_auth:
    print("ERROR: freeze authority is set; the warp escrow ATA could be frozen. Do not deploy until freeze is revoked or you accept that risk.", file=sys.stderr)
    sys.exit(1)
if mint_auth:
    print("NOTE: mint authority is still live. Collateral warp does not need it (it escrows), but the supply can still change outside the bridge.")
else:
    print("mint authority revoked — supply is fixed; collateral escrow is appropriate.")
print("OK: mint is usable as Hyperlane collateral (classic SPL, freeze-revoked).")
PY
