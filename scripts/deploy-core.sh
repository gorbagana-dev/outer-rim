#!/usr/bin/env bash
# Deploy Hyperlane SVM core programs (mailbox, ISM, IGP, validator-announce)
# on Gorchain and Solana. Writes state/program-ids.json and state/agent-config.json.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
. "${SCRIPT_DIR}/lib.sh"
load_env

RECONFIGURE_ISM="${RECONFIGURE_ISM:-false}"
CORE_ARGS=()
for a in "$@"; do
  case "$a" in
    --reconfigure-ism) RECONFIGURE_ISM=true ;;
    *) CORE_ARGS+=("$a") ;;
  esac
done
if [ "${#CORE_ARGS[@]}" -gt 0 ]; then
  parse_force "${CORE_ARGS[@]}"
else
  parse_force
fi
if [ "$RECONFIGURE_ISM" = "true" ] && [ "${FORCE_REDEPLOY:-false}" = "true" ]; then
  echo "ERROR: --reconfigure-ism cannot be combined with --force." >&2
  echo "Reconfigure updates the existing ISM validator set; --force deploys new program IDs." >&2
  exit 1
fi
export RECONFIGURE_ISM

if [ "${OUTER_RIM_IN_CONTAINER:-}" != "1" ]; then
  require_cmd docker
  require_vars GORCHAIN_RPC_URL SOLANA_RPC_URL GORCHAIN_DOMAIN_ID SOLANA_DOMAIN_ID \
    GORCHAIN_CHAIN_ID SOLANA_CHAIN_ID GORCHAIN_VALIDATOR_ADDRESS SOLANA_VALIDATOR_ADDRESS
  require_h160 GORCHAIN_VALIDATOR_ADDRESS SOLANA_VALIDATOR_ADDRESS
  echo "=== Outer Rim core deploy (via $(deployer_image)) ==="
  run_in_deployer "deploy-core.sh" "$@"
  exit
fi

echo "=== Hyperlane SVM Core Deployer ==="
echo "Gorchain domain: ${GORCHAIN_DOMAIN_ID}"
echo "Solana domain: ${SOLANA_DOMAIN_ID}"

STATE_DIR="${STATE_OUTPUT_DIR:-/outer-rim/state}"
LOGS_DIR="${LOGS_OUTPUT_DIR:-/outer-rim/logs}"
mkdir -p "${STATE_DIR}" "${STATE_DIR}/registry" "${LOGS_DIR}"

DEPLOYER_KEY_FILE="${DEPLOYER_KEY_FILE:-/keys/deployer-keypair.json}"
[ -s "${DEPLOYER_KEY_FILE}" ] || { echo "ERROR: deployer keypair missing at ${DEPLOYER_KEY_FILE}"; exit 1; }

check_existing_deployment() {
  local pids="${STATE_DIR}/program-ids.json"
  [ -s "$pids" ] || return 0
  [ "$(cat "$pids")" != "{}" ] || return 0

  local chain rpc field program_id missing=0
  for chain in gorchain solana; do
    rpc=$(chain_var "$chain" RPC_URL)
    for field in mailbox validator_announce multisig_ism_message_id igp_program_id; do
      program_id=$(jq -r --arg chain "$chain" --arg field "$field" \
        '.[$chain][$field] // empty' "$pids")
      if [ -z "$program_id" ] || ! solana program show "$program_id" -u "$rpc" >/dev/null 2>&1; then
        echo "ERROR: recorded ${chain}.${field} is missing or not an executable program." >&2
        missing=1
      fi
    done
  done
  if [ "$missing" -ne 0 ]; then
    echo "State is inconsistent; inspect ${pids}, then pass --force to redeploy." >&2
    exit 1
  fi

  echo "All recorded core programs exist on-chain."
  echo "Pass --reconfigure-ism to update ISM validator H160s without new program IDs."
  echo "Pass --force --confirm-new-program-ids to redeploy (can orphan funded programs)."
  exit 0
}

if [ "${RECONFIGURE_ISM:-false}" != "true" ] && [ "${FORCE_REDEPLOY:-false}" != "true" ]; then
  check_existing_deployment
fi

LOG_FILE="${LOGS_DIR}/svm-deployer-$(date -u +%Y%m%dT%H%M%SZ).log"
exec > >(redact_deploy_logs | stdbuf -o0 tee -a "${LOG_FILE}") 2>&1
echo "Logging to ${LOG_FILE}"

mkdir -p /root/.config/solana/cli
cat > /root/.config/solana/cli/config.yml <<SOLCFG
json_rpc_url: "${GORCHAIN_RPC_URL}"
websocket_url: ""
keypair_path: "${DEPLOYER_KEY_FILE}"
commitment: finalized
SOLCFG

WORK_DIR="/tmp/hyperlane-deploy"
ENVIRONMENTS_DIR="${WORK_DIR}/environments"
ENVIRONMENT="e2e"
mkdir -p "${ENVIRONMENTS_DIR}"

GAS_ORACLE_CONFIG="/outer-rim/config/gas-oracle-configs.json"
REGISTRY_DIR="/outer-rim/config"
MULTISIG_CONFIG_DIR="/outer-rim/config/multisig"

configure_ism() {
  local gor_ism="$1" sol_ism="$2"
  section "Configuring Multisig ISM (1-of-1, each chain trusts the other validator)"
  RENDERED_MULTISIG_DIR="${WORK_DIR}/multisig"
  mkdir -p "${RENDERED_MULTISIG_DIR}"
  envsubst < "${MULTISIG_CONFIG_DIR}/gorchain-multisig.json.tmpl" > "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json"
  envsubst < "${MULTISIG_CONFIG_DIR}/solana-multisig.json.tmpl" > "${RENDERED_MULTISIG_DIR}/solana-multisig.json"

  echo "Configuring ISM on Gorchain (program: ${gor_ism})..."
  hyperlane-sealevel-client \
    --url "${GORCHAIN_RPC_URL}" \
    --keypair "${DEPLOYER_KEY_FILE}" \
    multisig-ism-message-id configure \
    --program-id "${gor_ism}" \
    --multisig-config-file "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json" \
    --registry "${RENDERED_REGISTRY_DIR}"

  echo "Configuring ISM on Solana (program: ${sol_ism})..."
  hyperlane-sealevel-client \
    --url "${SOLANA_RPC_URL}" \
    --keypair "${DEPLOYER_KEY_FILE}" \
    multisig-ism-message-id configure \
    --program-id "${sol_ism}" \
    --multisig-config-file "${RENDERED_MULTISIG_DIR}/solana-multisig.json" \
    --registry "${RENDERED_REGISTRY_DIR}"
}

write_multisig_state() {
  local gor_ms sol_ms
  gor_ms=$(cat "${RENDERED_MULTISIG_DIR}/gorchain-multisig.json")
  sol_ms=$(cat "${RENDERED_MULTISIG_DIR}/solana-multisig.json")
  jq -nS --argjson g "${gor_ms}" --argjson s "${sol_ms}" \
    '{gorchain: $g, solana: $s}' > "${STATE_DIR}/multisig-config.json"
}

if [ "${RECONFIGURE_ISM:-false}" = "true" ]; then
  PIDS="${STATE_DIR}/program-ids.json"
  if [ ! -s "$PIDS" ] || [ "$(cat "$PIDS")" = "{}" ]; then
    echo "ERROR: ${PIDS} is missing. Deploy core before --reconfigure-ism." >&2
    exit 1
  fi
  GORCHAIN_ISM_ID=$(jq -r '.gorchain.multisig_ism_message_id // empty' "$PIDS")
  SOLANA_ISM_ID=$(jq -r '.solana.multisig_ism_message_id // empty' "$PIDS")
  if [ -z "$GORCHAIN_ISM_ID" ] || [ -z "$SOLANA_ISM_ID" ]; then
    echo "ERROR: ${PIDS} is missing multisig_ism_message_id." >&2
    exit 1
  fi
  section "Reconfiguring ISM validator set (no new program IDs)"
  RENDERED_REGISTRY_DIR="${WORK_DIR}/registry"
  mkdir -p "${RENDERED_REGISTRY_DIR}/chains"
  envsubst < "${REGISTRY_DIR}/metadata.yaml.tmpl" > "${RENDERED_REGISTRY_DIR}/chains/metadata.yaml"
  configure_ism "$GORCHAIN_ISM_ID" "$SOLANA_ISM_ID"
  write_multisig_state
  echo
  echo "=== ISM reconfigure complete ==="
  echo "Updated ${STATE_DIR}/multisig-config.json"
  echo "Restart validators so they sign with the new local hex keys."
  exit 0
fi

section "Rendering config templates"
RENDERED_REGISTRY_DIR="${WORK_DIR}/registry"
mkdir -p "${RENDERED_REGISTRY_DIR}/chains"
envsubst < "${REGISTRY_DIR}/metadata.yaml.tmpl" > "${RENDERED_REGISTRY_DIR}/chains/metadata.yaml"
echo "Registry rendered at ${RENDERED_REGISTRY_DIR}/chains/metadata.yaml"

GORCHAIN_SO_DIR=$(sbpf_dir_for "${GORCHAIN_RPC_URL}")
SOLANA_SO_DIR=$(sbpf_dir_for "${SOLANA_RPC_URL}")
echo "SBPF program set: gorchain -> ${GORCHAIN_SO_DIR##*/}, solana -> ${SOLANA_SO_DIR##*/}"

section "Deploying core contracts on Gorchain (domain ${GORCHAIN_DOMAIN_ID})"
hyperlane-sealevel-client \
  --url "${GORCHAIN_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  core deploy \
  --local-domain "${GORCHAIN_DOMAIN_ID}" \
  --environment "${ENVIRONMENT}" \
  --environments-dir "${ENVIRONMENTS_DIR}" \
  --chain gorchain \
  --remote-domains "${SOLANA_DOMAIN_ID}" \
  --gas-oracle-config-file "${GAS_ORACLE_CONFIG}" \
  --built-so-dir "${GORCHAIN_SO_DIR}"

section "Deploying core contracts on Solana (domain ${SOLANA_DOMAIN_ID})"
hyperlane-sealevel-client \
  --url "${SOLANA_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  core deploy \
  --local-domain "${SOLANA_DOMAIN_ID}" \
  --environment "${ENVIRONMENT}" \
  --environments-dir "${ENVIRONMENTS_DIR}" \
  --chain solana \
  --remote-domains "${GORCHAIN_DOMAIN_ID}" \
  --gas-oracle-config-file "${GAS_ORACLE_CONFIG}" \
  --built-so-dir "${SOLANA_SO_DIR}"

GORCHAIN_PROGRAMS="${ENVIRONMENTS_DIR}/${ENVIRONMENT}/gorchain/core/program-ids.json"
SOLANA_PROGRAMS="${ENVIRONMENTS_DIR}/${ENVIRONMENT}/solana/core/program-ids.json"

section "Checking deployment outputs"
ls -la "${GORCHAIN_PROGRAMS}" "${SOLANA_PROGRAMS}"

REQUIRED_FIELDS="mailbox validator_announce multisig_ism_message_id igp_program_id overhead_igp_account igp_account"
for PROGRAMS_FILE_CHECK in "${GORCHAIN_PROGRAMS}" "${SOLANA_PROGRAMS}"; do
  CHAIN_LABEL=$(basename "$(dirname "$(dirname "$PROGRAMS_FILE_CHECK")")")
  for FIELD in $REQUIRED_FIELDS; do
    VALUE=$(jq -r ".${FIELD} // empty" "${PROGRAMS_FILE_CHECK}" 2>/dev/null || true)
    if [ -z "$VALUE" ]; then
      echo "FATAL: Missing required field '${FIELD}' in ${CHAIN_LABEL} program-ids.json"
      echo "  Contents: $(cat "${PROGRAMS_FILE_CHECK}")"
      exit 1
    fi
  done
  echo "OK: All required fields present in ${CHAIN_LABEL} program-ids.json"
done

section "Verifying deployed program hashes"
VERIFY_FAILED=0
for CHAIN_OUTPUT in gorchain solana; do
  if [ "$CHAIN_OUTPUT" = "gorchain" ]; then
    RPC_URL="${GORCHAIN_RPC_URL}"
    PROGRAMS_FILE="${GORCHAIN_PROGRAMS}"
    SO_DIR="${GORCHAIN_SO_DIR}"
  else
    RPC_URL="${SOLANA_RPC_URL}"
    PROGRAMS_FILE="${SOLANA_PROGRAMS}"
    SO_DIR="${SOLANA_SO_DIR}"
  fi

  for ENTRY in mailbox:mailbox validator_announce:validator_announce interchain_gas_paymaster:igp_program_id multisig_ism_message_id:multisig_ism_message_id; do
    PROGRAM="${ENTRY%%:*}"
    JSON_KEY="${ENTRY##*:}"
    SO_FILE="${SO_DIR}/hyperlane_sealevel_${PROGRAM}.so"
    if [ ! -f "$SO_FILE" ]; then
      echo "ERROR: expected build artifact not found: ${SO_FILE}"
      VERIFY_FAILED=1
      continue
    fi
    PROGRAM_ID=$(jq -r ".${JSON_KEY} // empty" "${PROGRAMS_FILE}" 2>/dev/null || true)
    if [ -z "$PROGRAM_ID" ]; then
      echo "ERROR: ${JSON_KEY} missing from ${PROGRAMS_FILE}"
      VERIFY_FAILED=1
      continue
    fi
    LOCAL_HASH=$(solana-verify get-executable-hash "$SO_FILE" 2>/dev/null || echo "unknown")
    ONCHAIN_HASH=$(solana-verify get-program-hash -u "$RPC_URL" "$PROGRAM_ID" 2>/dev/null || echo "unknown")
    if [ "$LOCAL_HASH" != "$ONCHAIN_HASH" ] || [ "$LOCAL_HASH" = "unknown" ]; then
      echo "ERROR: Hash mismatch for ${PROGRAM} on ${CHAIN_OUTPUT}!"
      echo "  Local:   ${LOCAL_HASH}"
      echo "  On-chain: ${ONCHAIN_HASH}"
      VERIFY_FAILED=1
    else
      echo "OK: ${PROGRAM} on ${CHAIN_OUTPUT} hash verified (${LOCAL_HASH})"
    fi
  done
done
if [ "$VERIFY_FAILED" -ne 0 ]; then
  echo "FATAL: Program hash verification failed. Aborting."
  exit 1
fi

GORCHAIN_ISM_ID=$(jq -r '.multisig_ism_message_id' "${GORCHAIN_PROGRAMS}")
SOLANA_ISM_ID=$(jq -r '.multisig_ism_message_id' "${SOLANA_PROGRAMS}")
configure_ism "$GORCHAIN_ISM_ID" "$SOLANA_ISM_ID"

section "Configuring IGP gas oracle"
GORCHAIN_IGP_ID=$(jq -r '.igp_program_id' "${GORCHAIN_PROGRAMS}")
SOLANA_IGP_ID=$(jq -r '.igp_program_id' "${SOLANA_PROGRAMS}")

hyperlane-sealevel-client \
  --url "${GORCHAIN_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  igp configure \
  --program-id "${GORCHAIN_IGP_ID}" \
  --chain gorchain \
  --gas-oracle-config-file "${GAS_ORACLE_CONFIG}" \
  --registry "${RENDERED_REGISTRY_DIR}"

hyperlane-sealevel-client \
  --url "${SOLANA_RPC_URL}" \
  --keypair "${DEPLOYER_KEY_FILE}" \
  igp configure \
  --program-id "${SOLANA_IGP_ID}" \
  --chain solana \
  --gas-oracle-config-file "${GAS_ORACLE_CONFIG}" \
  --registry "${RENDERED_REGISTRY_DIR}"

IGP_BENEFICIARY="${IGP_BENEFICIARY_PUBKEY:-${BRIDGE_OWNER_PUBKEY:-}}"
if [ -n "$IGP_BENEFICIARY" ]; then
  section "Setting IGP fee beneficiary to ${IGP_BENEFICIARY}"
  for CHAIN_OUTPUT in gorchain solana; do
    if [ "$CHAIN_OUTPUT" = "gorchain" ]; then
      RPC_URL="${GORCHAIN_RPC_URL}"
      PROGRAMS_FILE="${GORCHAIN_PROGRAMS}"
    else
      RPC_URL="${SOLANA_RPC_URL}"
      PROGRAMS_FILE="${SOLANA_PROGRAMS}"
    fi
    IGP_ID=$(jq -r '.igp_program_id // empty' "${PROGRAMS_FILE}")
    IGP_ACCOUNT=$(jq -r '.igp_account // empty' "${PROGRAMS_FILE}")
    hyperlane-sealevel-client \
      --url "$RPC_URL" \
      --keypair "${DEPLOYER_KEY_FILE}" \
      igp set-igp-beneficiary \
      --program-id "$IGP_ID" \
      --igp-account "$IGP_ACCOUNT" \
      "$IGP_BENEFICIARY"
  done
fi

if [ -n "${BRIDGE_OWNER_PUBKEY:-}" ]; then
  section "Transferring program ownership to the bridge owner"
  echo "Bridge owner pubkey: ${BRIDGE_OWNER_PUBKEY}"

  for CHAIN_OUTPUT in gorchain solana; do
    if [ "$CHAIN_OUTPUT" = "gorchain" ]; then
      RPC_URL="${GORCHAIN_RPC_URL}"
      PROGRAMS_FILE="${GORCHAIN_PROGRAMS}"
    else
      RPC_URL="${SOLANA_RPC_URL}"
      PROGRAMS_FILE="${SOLANA_PROGRAMS}"
    fi

    for ENTRY in mailbox:mailbox validator_announce:validator_announce interchain_gas_paymaster:igp_program_id multisig_ism_message_id:multisig_ism_message_id; do
      PROGRAM="${ENTRY%%:*}"
      JSON_KEY="${ENTRY##*:}"
      PROGRAM_ID=$(jq -r ".${JSON_KEY} // empty" "${PROGRAMS_FILE}" 2>/dev/null || true)
      if [ -n "$PROGRAM_ID" ]; then
        echo "Transferring upgrade authority for ${PROGRAM} (${PROGRAM_ID}) on ${CHAIN_OUTPUT}..."
        solana program set-upgrade-authority "$PROGRAM_ID" \
          --new-upgrade-authority "${BRIDGE_OWNER_PUBKEY}" \
          --skip-new-upgrade-authority-signer-check \
          --keypair "${DEPLOYER_KEY_FILE}" \
          --url "$RPC_URL"
      fi
    done

    MAILBOX_ID=$(jq -r '.mailbox // empty' "${PROGRAMS_FILE}" 2>/dev/null || true)
    hyperlane-sealevel-client \
      --url "$RPC_URL" \
      --keypair "${DEPLOYER_KEY_FILE}" \
      mailbox transfer-ownership \
      --program-id "$MAILBOX_ID" \
      "${BRIDGE_OWNER_PUBKEY}"

    ISM_ID=$(jq -r '.multisig_ism_message_id // empty' "${PROGRAMS_FILE}" 2>/dev/null || true)
    hyperlane-sealevel-client \
      --url "$RPC_URL" \
      --keypair "${DEPLOYER_KEY_FILE}" \
      multisig-ism-message-id transfer-ownership \
      --program-id "$ISM_ID" \
      "${BRIDGE_OWNER_PUBKEY}"

  done
fi

if [ -n "${IGP_ORACLE_PUBKEY:-}" ]; then
  section "Transferring IGP account ownership to the oracle"
  for CHAIN_OUTPUT in gorchain solana; do
    RPC_URL=$(chain_var "$CHAIN_OUTPUT" RPC_URL)
    PROGRAMS_FILE="${ENVIRONMENTS_DIR}/${ENVIRONMENT}/${CHAIN_OUTPUT}/core/program-ids.json"
    IGP_ID=$(jq -r '.igp_program_id' "${PROGRAMS_FILE}")
    IGP_ACCOUNT=$(jq -r '.igp_account' "${PROGRAMS_FILE}")
    OVERHEAD_IGP_ACCOUNT=$(jq -r '.overhead_igp_account' "${PROGRAMS_FILE}")

    echo "Transferring IGP ownership on ${CHAIN_OUTPUT}..."
    hyperlane-sealevel-client \
      --url "$RPC_URL" \
      --keypair "${DEPLOYER_KEY_FILE}" \
      igp transfer-igp-ownership \
      --program-id "$IGP_ID" \
      --igp-account "$IGP_ACCOUNT" \
      "${IGP_ORACLE_PUBKEY}"
    hyperlane-sealevel-client \
      --url "$RPC_URL" \
      --keypair "${DEPLOYER_KEY_FILE}" \
      igp transfer-overhead-igp-ownership \
      --program-id "$IGP_ID" \
      --igp-account "$OVERHEAD_IGP_ACCOUNT" \
      "${IGP_ORACLE_PUBKEY}"
  done
fi

section "Building agent-config.json"
GORCHAIN_MAILBOX=$(jq -r '.mailbox' "$GORCHAIN_PROGRAMS")
GORCHAIN_OVERHEAD_IGP=$(jq -r '.overhead_igp_account' "$GORCHAIN_PROGRAMS")
GORCHAIN_ISM=$(jq -r '.multisig_ism_message_id' "$GORCHAIN_PROGRAMS")
GORCHAIN_VALIDATOR_ANNOUNCE=$(jq -r '.validator_announce' "$GORCHAIN_PROGRAMS")
SOLANA_MAILBOX=$(jq -r '.mailbox' "$SOLANA_PROGRAMS")
SOLANA_OVERHEAD_IGP=$(jq -r '.overhead_igp_account' "$SOLANA_PROGRAMS")
SOLANA_ISM=$(jq -r '.multisig_ism_message_id' "$SOLANA_PROGRAMS")
SOLANA_VALIDATOR_ANNOUNCE=$(jq -r '.validator_announce' "$SOLANA_PROGRAMS")
export GORCHAIN_MAILBOX GORCHAIN_OVERHEAD_IGP GORCHAIN_ISM GORCHAIN_VALIDATOR_ANNOUNCE
export SOLANA_MAILBOX SOLANA_OVERHEAD_IGP SOLANA_ISM SOLANA_VALIDATOR_ANNOUNCE
envsubst < /outer-rim/config/agent-config.json.tmpl > "${WORK_DIR}/agent-config.json"
jq -e . "${WORK_DIR}/agent-config.json" >/dev/null

echo ""
echo "=== Writing deployment artifacts to ${STATE_DIR} ==="
GORCHAIN_DATA=$(cat "${GORCHAIN_PROGRAMS}")
SOLANA_DATA=$(cat "${SOLANA_PROGRAMS}")
jq -nS --argjson g "${GORCHAIN_DATA}" --argjson s "${SOLANA_DATA}" \
  '{gorchain: $g, solana: $s}' > "${STATE_DIR}/program-ids.json"
cp "${WORK_DIR}/agent-config.json" "${STATE_DIR}/agent-config.json"
cp "${GAS_ORACLE_CONFIG}" "${STATE_DIR}/gas-oracle-config.json"

write_multisig_state

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
  if [ ! -s "$f" ]; then
    MISSING+=("$f")
  fi
done
if [ "${#MISSING[@]}" -ne 0 ]; then
  echo "ERROR: deployer preflight failed — expected outputs missing or empty:"
  for f in "${MISSING[@]}"; do echo "  - $f"; done
  exit 1
fi

echo ""
echo "=== Core deployment complete ==="
echo "Artifacts:"
for f in "${EXPECTED[@]}"; do
  echo "  - ${f#"${STATE_DIR}"/}"
done
echo
echo "IGP note: agent-config.interchainGasPaymaster is the overhead IGP account."
echo "Payment PDAs store the inner igp_account. Keep gas enforcement 'none' for v1."
echo "Do not call mailbox OutboxGetLatestCheckpoint (31-byte buffer bug)."
