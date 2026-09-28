#!/usr/bin/env bash
# Finish an interrupted core deploy WITHOUT deploying any new programs.
#
# Reuses the already-deployed programs recorded in state/program-ids.json and
# only runs the idempotent finishing steps that never completed:
#   1. Create any missing IGP overhead account (Solana's was never created).
#   2. Configure the crossed 1-of-1 multisig ISM on both chains.
#   3. Configure the IGP gas oracle + overhead on both chains.
#   4. Write the remaining state artifacts (agent-config, gas-oracle, multisig,
#      registry) exactly like scripts/deploy-core.sh does.
#
# Every on-chain step is idempotent: existing accounts/config are left alone.
# This spends only tiny transaction fees; it deploys NO programs.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
. "${SCRIPT_DIR}/lib.sh"
load_env

if [ "${OUTER_RIM_IN_CONTAINER:-}" != "1" ]; then
  require_cmd docker jq
  require_vars GORCHAIN_RPC_URL SOLANA_RPC_URL GORCHAIN_DOMAIN_ID SOLANA_DOMAIN_ID \
    GORCHAIN_CHAIN_ID SOLANA_CHAIN_ID GORCHAIN_VALIDATOR_ADDRESS SOLANA_VALIDATOR_ADDRESS
  require_h160 GORCHAIN_VALIDATOR_ADDRESS SOLANA_VALIDATOR_ADDRESS
  PIDS_HOST="${OUTER_RIM_ROOT}/state/program-ids.json"
  if [ ! -s "$PIDS_HOST" ] || [ "$(cat "$PIDS_HOST")" = "{}" ]; then
    echo "ERROR: ${PIDS_HOST} is missing/empty. Reconstruct it from the deploy log first." >&2
    exit 1
  fi
  echo "=== Outer Rim finish-core (via $(deployer_image)) ==="
  run_in_deployer "finish-core.sh" "$@"
  exit
fi

echo "=== Hyperlane SVM Core Finisher (no new program deploys) ==="

STATE_DIR="${STATE_OUTPUT_DIR:-/outer-rim/state}"
LOGS_DIR="${LOGS_OUTPUT_DIR:-/outer-rim/logs}"
DEPLOYER_KEY_FILE="${DEPLOYER_KEY_FILE:-/keys/deployer-keypair.json}"
[ -s "${DEPLOYER_KEY_FILE}" ] || { echo "ERROR: deployer keypair missing at ${DEPLOYER_KEY_FILE}"; exit 1; }

PIDS="${STATE_DIR}/program-ids.json"
[ -s "$PIDS" ] || { echo "ERROR: ${PIDS} missing inside container"; exit 1; }

LOG_FILE="${LOGS_DIR}/svm-finish-core-$(date -u +%Y%m%dT%H%M%SZ).log"
exec > >(redact_deploy_logs | stdbuf -o0 tee -a "${LOG_FILE}") 2>&1
echo "Logging to ${LOG_FILE}"

# hyperlane-sealevel-client loads the solana CLI config on startup (for the
# default signer/commitment); --url/--keypair are still passed per-command.
mkdir -p /root/.config/solana/cli
cat > /root/.config/solana/cli/config.yml <<SOLCFG
json_rpc_url: "${GORCHAIN_RPC_URL}"
websocket_url: ""
keypair_path: "${DEPLOYER_KEY_FILE}"
commitment: finalized
SOLCFG

WORK_DIR="/tmp/hyperlane-finish"
ENVIRONMENTS_DIR="${WORK_DIR}/environments"
ENVIRONMENT="e2e"
mkdir -p "${ENVIRONMENTS_DIR}"

GAS_ORACLE_CONFIG="/outer-rim/config/gas-oracle-configs.json"
REGISTRY_DIR="/outer-rim/config"
MULTISIG_CONFIG_DIR="/outer-rim/config/multisig"

pid() { jq -r --arg c "$1" --arg f "$2" '.[$c][$f] // empty' "$PIDS"; }

GOR_MAILBOX=$(pid gorchain mailbox)
GOR_VALIDATOR_ANNOUNCE=$(pid gorchain validator_announce)
GOR_ISM=$(pid gorchain multisig_ism_message_id)
GOR_IGP=$(pid gorchain igp_program_id)
GOR_IGP_ACCOUNT=$(pid gorchain igp_account)
GOR_OVERHEAD_IGP=$(pid gorchain overhead_igp_account)

SOL_MAILBOX=$(pid solana mailbox)
SOL_VALIDATOR_ANNOUNCE=$(pid solana validator_announce)
SOL_ISM=$(pid solana multisig_ism_message_id)
SOL_IGP=$(pid solana igp_program_id)
SOL_IGP_ACCOUNT=$(pid solana igp_account)

for v in GOR_MAILBOX GOR_VALIDATOR_ANNOUNCE GOR_ISM GOR_IGP GOR_IGP_ACCOUNT GOR_OVERHEAD_IGP \
         SOL_MAILBOX SOL_VALIDATOR_ANNOUNCE SOL_ISM SOL_IGP SOL_IGP_ACCOUNT; do
  [ -n "${!v}" ] || { echo "ERROR: reconstructed program-ids.json is missing $v" >&2; exit 1; }
done

section "Preflight: confirm reused programs exist on-chain (no deploys)"
PREFLIGHT_FAILED=0
check_program() {
  local label="$1" rpc="$2" id="$3"
  if solana program show "$id" -u "$rpc" -k "${DEPLOYER_KEY_FILE}" >/dev/null 2>&1; then
    echo "OK: ${label} (${id}) is an executable program"
  else
    echo "ERROR: ${label} (${id}) is not an executable program on-chain"
    PREFLIGHT_FAILED=1
  fi
}
check_program "gorchain.mailbox"            "$GORCHAIN_RPC_URL" "$GOR_MAILBOX"
check_program "gorchain.validator_announce" "$GORCHAIN_RPC_URL" "$GOR_VALIDATOR_ANNOUNCE"
check_program "gorchain.ism"                "$GORCHAIN_RPC_URL" "$GOR_ISM"
check_program "gorchain.igp"                "$GORCHAIN_RPC_URL" "$GOR_IGP"
check_program "solana.mailbox"              "$SOLANA_RPC_URL"   "$SOL_MAILBOX"
check_program "solana.validator_announce"   "$SOLANA_RPC_URL"   "$SOL_VALIDATOR_ANNOUNCE"
check_program "solana.ism"                  "$SOLANA_RPC_URL"   "$SOL_ISM"
check_program "solana.igp"                  "$SOLANA_RPC_URL"   "$SOL_IGP"
if [ "$PREFLIGHT_FAILED" -ne 0 ]; then
  echo "FATAL: one or more reused programs are missing. Aborting before any transaction." >&2
  exit 1
fi

section "Rendering config templates"
RENDERED_REGISTRY_DIR="${WORK_DIR}/registry"
mkdir -p "${RENDERED_REGISTRY_DIR}/chains"
envsubst < "${REGISTRY_DIR}/metadata.yaml.tmpl" > "${RENDERED_REGISTRY_DIR}/chains/metadata.yaml"
echo "Registry rendered at ${RENDERED_REGISTRY_DIR}/chains/metadata.yaml"

RENDERED_MULTISIG_DIR="${WORK_DIR}/multisig"
mkdir -p "${RENDERED_MULTISIG_DIR}"
envsubst < "${MULTISIG_CONFIG_DIR}/gorchain-multisig.json.tmpl" > "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json"
envsubst < "${MULTISIG_CONFIG_DIR}/solana-multisig.json.tmpl" > "${RENDERED_MULTISIG_DIR}/solana-multisig.json"
echo "gorchain ISM will trust (solana-origin validators): $(cat "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json")"
echo "solana ISM will trust (gorchain-origin validators): $(cat "${RENDERED_MULTISIG_DIR}/solana-multisig.json")"

section "Ensuring IGP overhead accounts exist (idempotent; creates missing Solana one)"
init_overhead() {
  local chain="$1" rpc="$2" igp="$3" inner="$4"
  echo "init-overhead-igp-account on ${chain} (igp=${igp}, inner=${inner})..."
  hyperlane-sealevel-client \
    --url "$rpc" \
    --keypair "${DEPLOYER_KEY_FILE}" \
    igp init-overhead-igp-account \
    --program-id "$igp" \
    --chain "$chain" \
    --inner-igp-account "$inner" \
    --environment "$ENVIRONMENT" \
    --environments-dir "$ENVIRONMENTS_DIR"
}
init_overhead gorchain "$GORCHAIN_RPC_URL" "$GOR_IGP" "$GOR_IGP_ACCOUNT"
init_overhead solana   "$SOLANA_RPC_URL"   "$SOL_IGP" "$SOL_IGP_ACCOUNT"

GOR_OVERHEAD_ARTIFACT="${ENVIRONMENTS_DIR}/${ENVIRONMENT}/igp/gorchain/default/igp-accounts.json"
SOL_OVERHEAD_ARTIFACT="${ENVIRONMENTS_DIR}/${ENVIRONMENT}/igp/solana/default/igp-accounts.json"
SOL_OVERHEAD_IGP=$(jq -r '.overhead_igp_account // empty' "$SOL_OVERHEAD_ARTIFACT")
GOR_OVERHEAD_IGP_CHECK=$(jq -r '.overhead_igp_account // empty' "$GOR_OVERHEAD_ARTIFACT")
[ -n "$SOL_OVERHEAD_IGP" ] || { echo "ERROR: could not read Solana overhead IGP account from ${SOL_OVERHEAD_ARTIFACT}" >&2; exit 1; }
echo "Solana overhead IGP account: ${SOL_OVERHEAD_IGP}"
if [ -n "$GOR_OVERHEAD_IGP_CHECK" ] && [ "$GOR_OVERHEAD_IGP_CHECK" != "$GOR_OVERHEAD_IGP" ]; then
  echo "ERROR: gorchain overhead IGP mismatch: state=${GOR_OVERHEAD_IGP} derived=${GOR_OVERHEAD_IGP_CHECK}" >&2
  exit 1
fi

# Persist the newly-created Solana overhead IGP account into program-ids.json.
tmp_pids=$(jq --arg o "$SOL_OVERHEAD_IGP" '.solana.overhead_igp_account = $o' "$PIDS")
printf '%s\n' "$tmp_pids" | jq -S '.' > "$PIDS"
echo "Updated ${PIDS} with solana.overhead_igp_account=${SOL_OVERHEAD_IGP}"

section "Configuring Multisig ISM (1-of-1, each chain trusts the OTHER chain's validator)"
echo "Configuring ISM on Gorchain (program: ${GOR_ISM})..."
hyperlane-sealevel-client \
  --url "${GORCHAIN_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  multisig-ism-message-id configure \
  --program-id "${GOR_ISM}" \
  --multisig-config-file "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json" \
  --registry "${RENDERED_REGISTRY_DIR}"

echo "Configuring ISM on Solana (program: ${SOL_ISM})..."
hyperlane-sealevel-client \
  --url "${SOLANA_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  multisig-ism-message-id configure \
  --program-id "${SOL_ISM}" \
  --multisig-config-file "${RENDERED_MULTISIG_DIR}/solana-multisig.json" \
  --registry "${RENDERED_REGISTRY_DIR}"

section "Configuring IGP gas oracle (idempotent)"
hyperlane-sealevel-client \
  --url "${GORCHAIN_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  igp configure \
  --program-id "${GOR_IGP}" \
  --chain gorchain \
  --gas-oracle-config-file "${GAS_ORACLE_CONFIG}" \
  --registry "${RENDERED_REGISTRY_DIR}"

hyperlane-sealevel-client \
  --url "${SOLANA_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  igp configure \
  --program-id "${SOL_IGP}" \
  --chain solana \
  --gas-oracle-config-file "${GAS_ORACLE_CONFIG}" \
  --registry "${RENDERED_REGISTRY_DIR}"

section "Building agent-config.json"
export GORCHAIN_MAILBOX="$GOR_MAILBOX"
export GORCHAIN_OVERHEAD_IGP="$GOR_OVERHEAD_IGP"
export GORCHAIN_ISM="$GOR_ISM"
export GORCHAIN_VALIDATOR_ANNOUNCE="$GOR_VALIDATOR_ANNOUNCE"
export SOLANA_MAILBOX="$SOL_MAILBOX"
export SOLANA_OVERHEAD_IGP="$SOL_OVERHEAD_IGP"
export SOLANA_ISM="$SOL_ISM"
export SOLANA_VALIDATOR_ANNOUNCE="$SOL_VALIDATOR_ANNOUNCE"
envsubst < /outer-rim/config/agent-config.json.tmpl > "${WORK_DIR}/agent-config.json"
jq -e . "${WORK_DIR}/agent-config.json" >/dev/null

echo ""
echo "=== Writing deployment artifacts to ${STATE_DIR} ==="
cp "${WORK_DIR}/agent-config.json" "${STATE_DIR}/agent-config.json"
cp "${GAS_ORACLE_CONFIG}" "${STATE_DIR}/gas-oracle-config.json"

gor_ms=$(cat "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json")
sol_ms=$(cat "${RENDERED_MULTISIG_DIR}/solana-multisig.json")
jq -nS --argjson g "${gor_ms}" --argjson s "${sol_ms}" \
  '{gorchain: $g, solana: $s}' > "${STATE_DIR}/multisig-config.json"

rm -rf "${STATE_DIR}/registry"
mkdir -p "${STATE_DIR}/registry"
GORCHAIN_RPC_URL="http://rpc-placeholder.invalid" \
SOLANA_RPC_URL="http://rpc-placeholder.invalid" \
  envsubst < "${REGISTRY_DIR}/metadata.yaml.tmpl" > "${STATE_DIR}/registry/metadata.yaml"

EXPECTED=(
  "${STATE_DIR}/program-ids.json"
  "${STATE_DIR}/agent-config.json"
  "${STATE_DIR}/gas-oracle-config.json"
  "${STATE_DIR}/multisig-config.json"
  "${STATE_DIR}/registry/metadata.yaml"
)
MISSING=()
for f in "${EXPECTED[@]}"; do
  [ -s "$f" ] || MISSING+=("$f")
done
if [ "${#MISSING[@]}" -ne 0 ]; then
  echo "ERROR: finish preflight failed — expected outputs missing or empty:"
  for f in "${MISSING[@]}"; do echo "  - $f"; done
  exit 1
fi

echo ""
echo "=== Core finish complete ==="
echo "Reused programs (no new deploys). Artifacts:"
for f in "${EXPECTED[@]}"; do
  echo "  - ${f#"${STATE_DIR}"/}"
done
echo
echo "IGP note: agent-config.interchainGasPaymaster is the overhead IGP account."
echo "Solana overhead IGP account created this run: ${SOL_OVERHEAD_IGP}"
