#!/usr/bin/env bash
# Generate hot signing keys + MinIO IAM users for Outer Rim.
# Never overwrites existing key files.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
. "${SCRIPT_DIR}/lib.sh"
load_env
require_cmd solana-keygen python3 openssl

CRED_DIR="${CRED_DIR:-${OUTER_RIM_ROOT}/keys}"
mkdir -p "$CRED_DIR"
chmod 700 "$CRED_DIR" 2>/dev/null || true

H160_HELPER="${SCRIPT_DIR}/h160_from_secp256k1.py"
python3 "$H160_HELPER" --self-check >/dev/null

SUMMARY=()

gen_keypair_json() {
  local file="$CRED_DIR/$1" label="$2" addr
  if [ -e "$file" ]; then
    addr=$(solana-keygen pubkey "$file" 2>/dev/null || echo "?")
    echo "  exists:  $1  ($label)"
  else
    solana-keygen new --no-bip39-passphrase --silent --force -o "$file" >/dev/null
    addr=$(solana-keygen pubkey "$file")
    echo "  created: $1  ($label)"
  fi
  chmod 600 "$file" 2>/dev/null || true
  SUMMARY+=("svm|$label|$1|$addr")
}

gen_hex_key() {
  local file="$CRED_DIR/$1" label="$2" tmp addr
  if [ -e "$file" ]; then
    addr=$(cat "$file.pub" 2>/dev/null || true)
    echo "  exists:  $1  ($label)"
    chmod 600 "$file" 2>/dev/null || true
    SUMMARY+=("svm|$label|$1|${addr:-(exists)}")
    return
  fi
  tmp=$(mktemp)
  solana-keygen new --no-bip39-passphrase --silent --force -o "$tmp" >/dev/null
  python3 -c "import json; b=json.load(open('$tmp'))[:32]; open('$file','w').write('0x'+bytes(b).hex())"
  addr=$(solana-keygen pubkey "$tmp")
  rm -f "$tmp"
  chmod 600 "$file"
  printf '%s\n' "$addr" > "$file.pub"
  echo "  created: $1  ($label)"
  SUMMARY+=("svm|$label|$1|$addr")
}

gen_secp256k1_key() {
  local file="$CRED_DIR/$1" label="$2" pem priv h160
  if [ -e "$file" ]; then
    chmod 600 "$file" 2>/dev/null || true
    h160=$(python3 "$H160_HELPER" "$file")
    printf '%s\n' "$h160" > "$file.h160"
    echo "  exists:  $1  ($label) $h160"
    SUMMARY+=("ism|$label|$1|$h160")
    return
  fi
  pem=$(mktemp)
  openssl ecparam -name secp256k1 -genkey -noout -out "$pem"
  priv=$(openssl ec -in "$pem" -noout -text 2>/dev/null | awk '/priv:/{p=1;next}/pub:/{p=0}p' | tr -d ' \n:')
  rm -f "$pem"
  if [[ ! "$priv" =~ ^[0-9a-fA-F]+$ ]]; then
    echo "ERROR: openssl did not emit a secp256k1 private key" >&2
    exit 1
  fi
  printf '0x%064s\n' "$priv" | tr ' ' '0' > "$file"
  chmod 600 "$file"
  h160=$(python3 "$H160_HELPER" "$file")
  printf '%s\n' "$h160" > "$file.h160"
  echo "  created: $1  ($label) $h160"
  SUMMARY+=("ism|$label|$1|$h160")
}

rand_secret() {
  openssl rand -hex 16
}

echo "Generating keyfiles in $CRED_DIR ..."
gen_keypair_json deployer-keypair.json  "deployer — deploys programs; fund heavily on both chains"
gen_hex_key validator-gorchain.key      "gorchain validator announce (HYP_DEFAULTSIGNER_KEY)"
gen_hex_key validator-solana.key        "solana validator announce (HYP_DEFAULTSIGNER_KEY)"
gen_hex_key relayer-gorchain.key        "relayer gorchain signer (HYP_CHAINS_GORCHAIN_SIGNER_KEY)"
gen_hex_key relayer-solana.key          "relayer solana signer (HYP_CHAINS_SOLANA_SIGNER_KEY)"
gen_secp256k1_key validator-ism-gorchain.key "gorchain ISM checkpoint signer (HYP_VALIDATOR_KEY)"
gen_secp256k1_key validator-ism-solana.key   "solana ISM checkpoint signer (HYP_VALIDATOR_KEY)"

IAM_FILE="$CRED_DIR/minio-iam.env"
if [ -e "$IAM_FILE" ]; then
  echo "  exists:  minio-iam.env"
else
  cat > "$IAM_FILE" <<EOF
GORCHAIN_PRIMARY_KEY_ID=gorchain-validator
GORCHAIN_PRIMARY_SECRET=$(rand_secret)
SOLANA_PRIMARY_KEY_ID=solana-validator
SOLANA_PRIMARY_SECRET=$(rand_secret)
EOF
  chmod 600 "$IAM_FILE"
  echo "  created: minio-iam.env"
fi

if [ -f "${OUTER_RIM_ROOT}/.env" ]; then
  python3 - "${OUTER_RIM_ROOT}/.env" "$IAM_FILE" \
    "$CRED_DIR/validator-ism-gorchain.key.h160" \
    "$CRED_DIR/validator-ism-solana.key.h160" <<'PY'
from pathlib import Path
import sys

env_path = Path(sys.argv[1])
iam_path = Path(sys.argv[2])
gor_h160 = Path(sys.argv[3]).read_text().strip()
sol_h160 = Path(sys.argv[4]).read_text().strip()

fill = {}
for line in iam_path.read_text().splitlines():
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    fill[k] = v
fill["GORCHAIN_VALIDATOR_ADDRESS"] = gor_h160
fill["SOLANA_VALIDATOR_ADDRESS"] = sol_h160


def is_blank(key, value):
    cur = value.strip()
    if cur == "":
        return True
    if key in ("GORCHAIN_VALIDATOR_ADDRESS", "SOLANA_VALIDATOR_ADDRESS") and cur.lower() in ("0x", "0x0"):
        return True
    return False

lines = env_path.read_text().splitlines()
keys_seen = set()
out = []
changed = []
for line in lines:
    if "=" in line and not line.startswith("#"):
        k, cur = line.split("=", 1)
        keys_seen.add(k)
        if k in fill and is_blank(k, cur):
            out.append(f"{k}={fill[k]}")
            changed.append(k)
            continue
    out.append(line)
for k, v in fill.items():
    if k not in keys_seen:
        out.append(f"{k}={v}")
        changed.append(k)
env_path.write_text("\n".join(out) + "\n")
if changed:
    print("  merged into .env (empty values only): " + ", ".join(changed))
else:
    print("  .env already has MinIO IAM and validator H160s")
PY
fi

ADDR_FILE="$CRED_DIR/addresses.env"
{
  echo "# generated by generate-keys.sh — addresses of the hot signing keys (not secret)"
  for row in "${SUMMARY[@]}"; do
    IFS='|' read -r kind label file addr <<<"$row"
    case "$addr" in ""|"?"|"(exists)") continue ;; esac
    var=$(basename "$file" | sed 's/\.[^.]*$//' | tr 'a-z-' 'A-Z_')
    echo "${var}_ADDR=$addr  # $label"
  done
} > "$ADDR_FILE"

echo
echo "Addresses exported to $ADDR_FILE"
echo
echo "== ISM H160s (local secp256k1 hex keys; not Solana addresses) =="
for row in "${SUMMARY[@]}"; do
  IFS='|' read -r kind label file addr <<<"$row"
  [ "$kind" = ism ] || continue
  printf "  %-44s # %s\n" "$addr" "$label"
done
echo
echo "== Fund these on BOTH chains =="
for row in "${SUMMARY[@]}"; do
  IFS='|' read -r kind label file addr <<<"$row"
  [ "$kind" = svm ] || continue
  case "$addr" in ""|"?"|"(exists)") continue ;; esac
  printf "  %-44s # %s\n" "$addr" "$label"
done

cat <<NOTE

v1 ISM is 1-of-1: gorchain ISM trusts SOLANA_VALIDATOR_ADDRESS,
solana ISM trusts GORCHAIN_VALIDATOR_ADDRESS.

BRIDGE_OWNER_PUBKEY / IGP_ORACLE_PUBKEY are optional Solana pubkeys.

Next:
  1. Copy .env.example → .env and fill RPCs (generate-keys.sh writes H160s if they are empty)
  2. docker compose up -d minio minio-provision
  3. ./scripts/deploy-core.sh
  4. ./scripts/deploy-warp.sh
  5. docker compose up -d

If core is already deployed with different H160s:
  ./scripts/deploy-core.sh --reconfigure-ism
NOTE
