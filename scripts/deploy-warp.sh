#!/usr/bin/env bash
# Deploy the GOR native ↔ Solana collateral warp route and write the relayer whitelist.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
. "${SCRIPT_DIR}/lib.sh"
load_env
parse_force "$@"
WARP_ROUTES="${WARP_ROUTES:-gor}"
export WARP_ROUTES

if [ "${OUTER_RIM_IN_CONTAINER:-}" != "1" ]; then
  require_cmd curl docker jq
  require_vars GORCHAIN_RPC_URL SOLANA_RPC_URL GORCHAIN_DOMAIN_ID SOLANA_DOMAIN_ID \
    GORCHAIN_CHAIN_ID SOLANA_CHAIN_ID
  if [ ! -s "${OUTER_RIM_ROOT}/state/program-ids.json" ]; then
    echo "ERROR: state/program-ids.json missing. Run scripts/deploy-core.sh first." >&2
    exit 1
  fi
  echo "=== Confirming Solana GOR mint before warp deploy ==="
  "${SCRIPT_DIR}/confirm-mint.sh"
  mkdir -p "${OUTER_RIM_ROOT}/state/generated/warp-routes"
  for route in $(echo "${WARP_ROUTES}" | tr ',' ' '); do
    yml="${OUTER_RIM_ROOT}/config/warp-routes/${route}.yml"
    [ -s "$yml" ] || { echo "ERROR: $yml not found" >&2; exit 1; }
    jq -e . "$yml" > "${OUTER_RIM_ROOT}/state/generated/warp-routes/${route}.json"
  done
  echo "=== Outer Rim warp deploy (via $(deployer_image)) ==="
  run_in_deployer "deploy-warp.sh" "$@"
  exit $?
fi

STATE_DIR="${STATE_OUTPUT_DIR:-/outer-rim/state}"
LOGS_DIR="${LOGS_OUTPUT_DIR:-/outer-rim/logs}"
mkdir -p "${STATE_DIR}" "${LOGS_DIR}"

LOG_FILE="${LOGS_DIR}/svm-warp-deployer-$(date -u +%Y%m%dT%H%M%SZ).log"
exec > >(redact_deploy_logs | stdbuf -o0 tee -a "${LOG_FILE}") 2>&1
echo "Logging to ${LOG_FILE}"
echo "=== Hyperlane SVM Warp Route Deployer ==="

PROGRAM_IDS_FILE="${STATE_DIR}/program-ids.json"
if [ ! -s "${PROGRAM_IDS_FILE}" ]; then
  echo "ERROR: ${PROGRAM_IDS_FILE} missing. Run deploy-core.sh first."
  exit 1
fi

DEPLOYER_KEY_FILE="${DEPLOYER_KEY_FILE:-/keys/deployer-keypair.json}"
[ -s "${DEPLOYER_KEY_FILE}" ] || { echo "ERROR: deployer keypair missing"; exit 1; }

so_name_for_type() {
  case "$1" in
    native) echo "hyperlane_sealevel_token_native" ;;
    collateral) echo "hyperlane_sealevel_token_collateral" ;;
    *) echo "" ;;
  esac
}

WORK_DIR="/tmp/hyperlane-warp-deploy"
ENVIRONMENTS_DIR="${WORK_DIR}/environments"
ENVIRONMENT="e2e"
mkdir -p "${ENVIRONMENTS_DIR}" "${WORK_DIR}/output"

echo ""
echo "=== Rendering registry ==="
REGISTRY_DIR="/tmp/registry"
mkdir -p "${REGISTRY_DIR}/chains"
envsubst < /outer-rim/config/metadata.yaml.tmpl > "${REGISTRY_DIR}/chains/metadata.yaml"

# name/symbol are recorded for operators; the sealevel client ignores them on native/collateral.
# remoteDecimals MUST be shared across both sides when local decimals differ (GOR 9 vs SPL 6).
build_side() {
  local chain="$1" type="$2" name="$3" symbol="$4" decimals="$5"
  local token="${6:-}" remote_decimals="${7:-}" progs ism igp
  progs=$(jq -c --arg c "$chain" '.[$c]' "${PROGRAM_IDS_FILE}")
  ism=$(printf '%s' "$progs" | jq -r '.multisig_ism_message_id')
  igp=$(printf '%s' "$progs" | jq -r '.overhead_igp_account')
  jq -n \
    --arg type "$type" --arg name "$name" --arg symbol "$symbol" \
    --argjson decimals "$decimals" --arg token "$token" \
    --arg remoteDecimals "$remote_decimals" \
    --arg ism "$ism" --arg igp "$igp" \
    '{type:$type, name:$name, symbol:$symbol, decimals:$decimals,
      interchainSecurityModule:$ism, interchainGasPaymaster:$igp}
     + (if $remoteDecimals != "" then {remoteDecimals: ($remoteDecimals|tonumber)} else {} end)
     + (if $type=="collateral" then {token:$token} else {} end)'
}

assemble_side() {
  local s_chain="$1" s_type="$2" s_so s_src
  s_so=$(so_name_for_type "$s_type")
  [ -n "$s_so" ] || { echo "ERROR: unknown token type '${s_type}' for ${s_chain}"; exit 1; }
  s_src="$(sbpf_dir_for "$(chain_var "$s_chain" RPC_URL)")/${s_so}.so"
  [ -f "$s_src" ] || { echo "ERROR: built program ${s_src} not found"; exit 1; }
  cp -f "$s_src" "${ROUTE_SO_DIR}/${s_so}.so"
  echo "  ${s_chain} (${s_type}) -> ${s_so}.so [$(basename "$(dirname "$s_src")")]"
}

deploy_route() {
  cfg="$1"
  jq -e '
    .name and
    (.origin.chain == "gorchain") and (.origin.type == "native") and
    (.remote.chain == "solana") and (.remote.type == "collateral") and
    ((.remote.token | type) == "string") and ((.remote.token | length) > 0) and
    ((.origin.decimals | type) == "number") and
    ((.remote.decimals | type) == "number") and
    ((.origin.remoteDecimals | type) == "number") and
    (.origin.remoteDecimals == .remote.remoteDecimals)
  ' "$cfg" >/dev/null || {
    echo "ERROR: route must be gorchain native → solana collateral with a shared wire decimal." >&2
    exit 1
  }

  WARP_ROUTE_NAME=$(jq -r '.name' "$cfg")
  WARP_ORIGIN_CHAIN=$(jq -r '.origin.chain' "$cfg")
  WARP_ORIGIN_TYPE=$(jq -r '.origin.type' "$cfg")
  WARP_ORIGIN_TOKEN=$(jq -r '.origin.token // ""' "$cfg")
  WARP_ORIGIN_NAME=$(jq -r '.origin.name' "$cfg")
  WARP_ORIGIN_SYMBOL=$(jq -r '.origin.symbol' "$cfg")
  WARP_ORIGIN_DECIMALS=$(jq -r '.origin.decimals' "$cfg")
  WARP_ORIGIN_REMOTE_DECIMALS=$(jq -r '.origin.remoteDecimals // .origin.remote_decimals // ""' "$cfg")
  WARP_REMOTE_CHAIN=$(jq -r '.remote.chain' "$cfg")
  WARP_REMOTE_TYPE=$(jq -r '.remote.type' "$cfg")
  WARP_REMOTE_TOKEN=$(jq -r '.remote.token // ""' "$cfg")
  WARP_REMOTE_NAME=$(jq -r '.remote.name' "$cfg")
  WARP_REMOTE_SYMBOL=$(jq -r '.remote.symbol' "$cfg")
  WARP_REMOTE_DECIMALS=$(jq -r '.remote.decimals' "$cfg")
  WARP_REMOTE_REMOTE_DECIMALS=$(jq -r '.remote.remoteDecimals // .remote.remote_decimals // ""' "$cfg")

  ROUTE_STATE_DIR="${STATE_DIR}/warp-routes/${WARP_ROUTE_NAME}"
  mkdir -p "${ROUTE_STATE_DIR}"

  if [ "${FORCE_REDEPLOY:-false}" != "true" ]; then
    EXISTING_PIDS="${ROUTE_STATE_DIR}/warp-deploy-outputs/program-ids.json"
    if [ -s "${ROUTE_STATE_DIR}/token-config.json" ]; then
      if [ ! -s "$EXISTING_PIDS" ]; then
        echo "ERROR: token-config.json exists for ${WARP_ROUTE_NAME} but warp program-ids.json is missing."
        echo "State is inconsistent. Pass --force after inspecting ${ROUTE_STATE_DIR}."
        exit 1
      fi
      missing=0
      for CHAIN_NAME in $(jq -r 'keys[]' "$EXISTING_PIDS"); do
        PROGRAM_ID=$(jq -r --arg c "$CHAIN_NAME" '.[$c].base58 // empty' "$EXISTING_PIDS")
        RPC_URL=$(chain_var "$CHAIN_NAME" RPC_URL)
        if [ -z "$PROGRAM_ID" ] || [ -z "$RPC_URL" ]; then
          echo "ERROR: cannot check on-chain program for ${CHAIN_NAME}"
          exit 1
        fi
        if ! solana program show "$PROGRAM_ID" -u "$RPC_URL" >/dev/null 2>&1; then
          echo "ERROR: recorded warp program ${PROGRAM_ID} on ${CHAIN_NAME} is not executable."
          missing=1
        fi
      done
      if [ "$missing" -ne 0 ]; then
        echo "Pass --force to redeploy. Refusing to skip without on-chain programs."
        exit 1
      fi
      echo "Warp route ${WARP_ROUTE_NAME} already on-chain. Pass --force to redeploy. Skipping."
      return 0
    fi
  fi

  echo "Warp route name: ${WARP_ROUTE_NAME}"
  echo "Origin chain: ${WARP_ORIGIN_CHAIN} (${WARP_ORIGIN_TYPE})"
  echo "Remote chain: ${WARP_REMOTE_CHAIN} (${WARP_REMOTE_TYPE})"

  for side_chain in "${WARP_ORIGIN_CHAIN}" "${WARP_REMOTE_CHAIN}"; do
    progs=$(jq -c --arg c "$side_chain" '.[$c] // {}' "${PROGRAM_IDS_FILE}")
    if [ "$progs" = "{}" ]; then
      echo "ERROR: program-ids.json missing data for ${side_chain}"
      exit 1
    fi
  done

  mkdir -p /root/.config/solana/cli
  cat > /root/.config/solana/cli/config.yml <<SOLCFG
json_rpc_url: "$(chain_var "${WARP_ORIGIN_CHAIN}" RPC_URL)"
websocket_url: ""
keypair_path: "${DEPLOYER_KEY_FILE}"
commitment: finalized
SOLCFG

  for side_chain in "${WARP_ORIGIN_CHAIN}" "${WARP_REMOTE_CHAIN}"; do
    mkdir -p "${ENVIRONMENTS_DIR}/${ENVIRONMENT}/${side_chain}/core"
    jq -c --arg c "$side_chain" '.[$c]' "${PROGRAM_IDS_FILE}" \
      > "${ENVIRONMENTS_DIR}/${ENVIRONMENT}/${side_chain}/core/program-ids.json"
  done

  for side in origin remote; do
    if [ "$side" = origin ]; then
      t="${WARP_ORIGIN_TYPE}"; tok="${WARP_ORIGIN_TOKEN}"
    else
      t="${WARP_REMOTE_TYPE}"; tok="${WARP_REMOTE_TOKEN}"
    fi
    if [ "$t" = "collateral" ]; then
      case "${tok:-}" in
        "" | REPLACE_WITH_*)
          echo "ERROR: ${side}.type is collateral but token is unset or placeholder ('${tok}')."
          exit 1
          ;;
      esac
    fi
  done

  jq -n \
    --arg oc "${WARP_ORIGIN_CHAIN}" \
    --argjson o "$(build_side "${WARP_ORIGIN_CHAIN}" "${WARP_ORIGIN_TYPE}" "${WARP_ORIGIN_NAME}" "${WARP_ORIGIN_SYMBOL}" "${WARP_ORIGIN_DECIMALS}" "${WARP_ORIGIN_TOKEN}" "${WARP_ORIGIN_REMOTE_DECIMALS}")" \
    --arg rc "${WARP_REMOTE_CHAIN}" \
    --argjson r "$(build_side "${WARP_REMOTE_CHAIN}" "${WARP_REMOTE_TYPE}" "${WARP_REMOTE_NAME}" "${WARP_REMOTE_SYMBOL}" "${WARP_REMOTE_DECIMALS}" "${WARP_REMOTE_TOKEN}" "${WARP_REMOTE_REMOTE_DECIMALS}")" \
    '{($oc):$o, ($rc):$r}' > "${WORK_DIR}/token-config.json"
  echo "Token config:"; cat "${WORK_DIR}/token-config.json"

  ROUTE_SO_DIR="${WORK_DIR}/built-so/${WARP_ROUTE_NAME}"
  rm -rf "${ROUTE_SO_DIR}"; mkdir -p "${ROUTE_SO_DIR}"
  echo "Assembling SBPF program set for route ${WARP_ROUTE_NAME}:"
  assemble_side "${WARP_ORIGIN_CHAIN}" "${WARP_ORIGIN_TYPE}"
  assemble_side "${WARP_REMOTE_CHAIN}" "${WARP_REMOTE_TYPE}"

  echo ""
  echo "=== Deploying warp routes ==="
  hyperlane-sealevel-client \
    --keypair "${DEPLOYER_KEY_FILE}" \
    warp-route deploy \
    --environment "${ENVIRONMENT}" \
    --environments-dir "${ENVIRONMENTS_DIR}" \
    --built-so-dir "${ROUTE_SO_DIR}" \
    --warp-route-name "${WARP_ROUTE_NAME}" \
    --token-config-file "${WORK_DIR}/token-config.json" \
    --registry "${REGISTRY_DIR}" \
    --ata-payer-funding-amount 1000000000

  WARP_OUTPUT_DIR="${ENVIRONMENTS_DIR}/${ENVIRONMENT}/warp-routes/${WARP_ROUTE_NAME}"
  echo ""
  echo "=== Checking deployment outputs ==="
  if [ -d "${WARP_OUTPUT_DIR}" ]; then
    ls -la "${WARP_OUTPUT_DIR}/"
  else
    echo "ERROR: Expected output directory ${WARP_OUTPUT_DIR} not found."
    find "${ENVIRONMENTS_DIR}" -name "*.json" -type f 2>/dev/null || true
    exit 1
  fi

  WARP_PROGRAMS_FILE="${WARP_OUTPUT_DIR}/program-ids.json"
  if [ ! -s "${WARP_PROGRAMS_FILE}" ]; then
    echo "ERROR: ${WARP_PROGRAMS_FILE} missing after warp-route deploy"
    exit 1
  fi

  echo ""
  echo "=== Verifying deployed warp route program hashes ==="
  VERIFY_FAILED=0
  for CHAIN_NAME in $(jq -r 'keys[]' "${WARP_PROGRAMS_FILE}"); do
    PROGRAM_ID=$(jq -r --arg c "$CHAIN_NAME" '.[$c].base58 // empty' "${WARP_PROGRAMS_FILE}")
    RPC_URL=$(chain_var "$CHAIN_NAME" RPC_URL)
    if [ "$CHAIN_NAME" = "${WARP_ORIGIN_CHAIN}" ]; then
      TYPE="${WARP_ORIGIN_TYPE}"
    else
      TYPE="${WARP_REMOTE_TYPE}"
    fi
    SO_FILE="${ROUTE_SO_DIR}/$(so_name_for_type "$TYPE").so"
    if [ -z "$PROGRAM_ID" ] || [ ! -f "$SO_FILE" ]; then
      echo "ERROR: cannot verify ${CHAIN_NAME} (program_id='${PROGRAM_ID}' so='${SO_FILE}')"
      VERIFY_FAILED=1
      continue
    fi
    LOCAL_HASH=$(solana-verify get-executable-hash "$SO_FILE" 2>/dev/null || echo "unknown")
    ONCHAIN_HASH=$(solana-verify get-program-hash -u "$RPC_URL" "$PROGRAM_ID" 2>/dev/null || echo "unknown")
    if [ "$LOCAL_HASH" != "$ONCHAIN_HASH" ] || [ "$LOCAL_HASH" = "unknown" ]; then
      echo "ERROR: Hash mismatch for ${TYPE} warp program on ${CHAIN_NAME} (${PROGRAM_ID})"
      echo "  Local:   ${LOCAL_HASH}"
      echo "  On-chain: ${ONCHAIN_HASH}"
      VERIFY_FAILED=1
    else
      echo "OK: ${CHAIN_NAME} ${TYPE} hash verified (${LOCAL_HASH})"
    fi
  done
  if [ "$VERIFY_FAILED" -ne 0 ]; then
    echo "FATAL: Warp program hash verification failed. Aborting."
    exit 1
  fi

  if [ -n "${BRIDGE_OWNER_PUBKEY:-}" ]; then
    echo ""
    echo "=== Transferring warp route ownership to the bridge owner ==="
    for CHAIN_NAME in $(jq -r 'keys[]' "${WARP_PROGRAMS_FILE}"); do
      PROGRAM_ID=$(jq -r --arg c "$CHAIN_NAME" '.[$c].base58 // empty' "${WARP_PROGRAMS_FILE}")
      RPC_URL=$(chain_var "$CHAIN_NAME" RPC_URL)
      echo "Upgrade authority on ${CHAIN_NAME}: ${PROGRAM_ID}..."
      solana program set-upgrade-authority "$PROGRAM_ID" \
        --new-upgrade-authority "${BRIDGE_OWNER_PUBKEY}" \
        --skip-new-upgrade-authority-signer-check \
        --keypair "${DEPLOYER_KEY_FILE}" \
        --url "$RPC_URL"
      echo "App-level ownership on ${CHAIN_NAME}: ${PROGRAM_ID}..."
      hyperlane-sealevel-client \
        --url "$RPC_URL" \
        --keypair "${DEPLOYER_KEY_FILE}" \
        token transfer-ownership \
        --program-id "$PROGRAM_ID" \
        "${BRIDGE_OWNER_PUBKEY}"
    done
  fi

  echo ""
  echo "=== Building token-config.json ==="
  jq --arg name "${WARP_ROUTE_NAME}" \
    '{warpRoute: ({name:$name} + .)}' \
    "${WORK_DIR}/token-config.json" > "${WORK_DIR}/output/token-config.json"

  cp "${WORK_DIR}/output/token-config.json" "${ROUTE_STATE_DIR}/token-config.json"
  rm -rf "${ROUTE_STATE_DIR}/warp-deploy-outputs"
  mkdir -p "${ROUTE_STATE_DIR}/warp-deploy-outputs"
  cp -a "${WARP_OUTPUT_DIR}/." "${ROUTE_STATE_DIR}/warp-deploy-outputs/"
  rm -rf "${ROUTE_STATE_DIR}/warp-deploy-outputs/keys"

  if [ ! -s "${ROUTE_STATE_DIR}/token-config.json" ]; then
    echo "ERROR: warp-deployer preflight failed: token-config.json missing"
    exit 1
  fi

  echo ""
  echo "=== Warp route deployment complete ==="
  echo "Origin: ${WARP_ORIGIN_CHAIN} (${WARP_ORIGIN_TYPE})"
  echo "Remote: ${WARP_REMOTE_CHAIN} (${WARP_REMOTE_TYPE})"
  echo "Program IDs:"
  cat "${WARP_PROGRAMS_FILE}"
}

echo "=== Deploying warp routes: ${WARP_ROUTES} ==="
for route in $(echo "${WARP_ROUTES}" | tr ',' ' '); do
  cfg="${STATE_DIR}/generated/warp-routes/${route}.json"
  if [ ! -s "$cfg" ]; then
    echo "ERROR: generated route config $cfg not found"
    exit 1
  fi
  deploy_route "$cfg"
done

echo ""
echo "=== Building relayer whitelist ==="
STATE_OUTPUT_DIR="${STATE_DIR}" \
  WARP_ROUTES_DIR="${STATE_DIR}/generated/warp-routes" \
  bash /outer-rim/scripts/build-relayer-whitelist.sh

echo "=== All selected warp routes processed ==="
echo
echo "Fund the Solana collateral escrow with SPL GOR before Gorchain → Solana unlocks can pay out."
echo "Native GOR locked on Gorchain is the other side of that inventory."
