# Shared helpers for Outer Rim host scripts.
# shellcheck shell=bash

OUTER_RIM_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export OUTER_RIM_ROOT

readonly SBPF_V3_DEPLOY_FEATURE="5cC3foj77CWun58pC51ebHFUWavHWKarWyR5UUik7dnC"

load_env() {
  local env_file="${OUTER_RIM_ROOT}/.env"
  if [ -f "$env_file" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$env_file"
    set +a
  fi
  if [ -f "${OUTER_RIM_ROOT}/keys/minio-iam.env" ]; then
    set -a
    # shellcheck disable=SC1091
    . "${OUTER_RIM_ROOT}/keys/minio-iam.env"
    set +a
  fi
  GORCHAIN_IS_TESTNET="${GORCHAIN_IS_TESTNET:-false}"
  SOLANA_IS_TESTNET="${SOLANA_IS_TESTNET:-false}"
  WARP_ROUTES="${WARP_ROUTES:-gor}"
  export GORCHAIN_IS_TESTNET SOLANA_IS_TESTNET WARP_ROUTES
}

section() {
  printf '\n=== %s ===\n' "$*"
}

require_cmd() {
  local c
  for c in "$@"; do
    command -v "$c" >/dev/null 2>&1 || {
      echo "ERROR: required command not found: $c" >&2
      exit 1
    }
  done
}

require_vars() {
  local v
  for v in "$@"; do
    if [ -z "${!v:-}" ]; then
      echo "ERROR: $v is not set. Copy .env.example to .env and fill it." >&2
      exit 1
    fi
  done
}

require_h160() {
  local name value
  for name in "$@"; do
    value="${!name:-}"
    if [[ ! "$value" =~ ^0x[0-9a-fA-F]{40}$ ]]; then
      echo "ERROR: $name must be a validator H160 (0x + 40 hex characters)." >&2
      exit 1
    fi
  done
}

resolve_path() {
  local p="$1"
  case "$p" in
    /*) printf '%s\n' "$p" ;;
    *) printf '%s\n' "${OUTER_RIM_ROOT}/${p#./}" ;;
  esac
}

parse_force() {
  FORCE_REDEPLOY="${FORCE_REDEPLOY:-false}"
  CONFIRM_FORCE_REDEPLOY="${CONFIRM_FORCE_REDEPLOY:-false}"
  local a
  for a in "$@"; do
    case "$a" in
      --force) FORCE_REDEPLOY=true ;;
      --confirm-new-program-ids) CONFIRM_FORCE_REDEPLOY=true ;;
      *)
        echo "ERROR: unknown argument: $a" >&2
        exit 1
        ;;
    esac
  done
  if [ "$FORCE_REDEPLOY" = "true" ] && [ "$CONFIRM_FORCE_REDEPLOY" != "true" ]; then
    echo "ERROR: forced deployment can create new program IDs and orphan funded programs." >&2
    echo "Re-run with --force --confirm-new-program-ids after reviewing existing state." >&2
    exit 1
  fi
  export FORCE_REDEPLOY CONFIRM_FORCE_REDEPLOY
}

chain_var() {
  local chain suffix="$2"
  chain=$(printf '%s' "$1" | tr '[:lower:]' '[:upper:]')
  local name="${chain}_${suffix}"
  printf '%s' "${!name:-}"
}

sbpf_dir_for() {
  local rpc_url="$1"
  if solana feature status -u "$rpc_url" 2>/dev/null \
    | grep -qE "^${SBPF_V3_DEPLOY_FEATURE} *\\| *active"; then
    printf '%s\n' "/opt/hyperlane/programs/v3"
  else
    printf '%s\n' "/opt/hyperlane/programs/v0"
  fi
}

redact_deploy_logs() {
  local rpc_url="${SOLANA_RPC_URL:-}" escaped
  escaped="${rpc_url//\\/\\\\}"
  escaped="${escaped//#/\\#}"
  escaped="${escaped//&/\\&}"

  if [ -n "$escaped" ]; then
    sed -E \
      -e "s#${escaped}#<SOLANA_RPC_URL>#g" \
      -e 's#api-key=[A-Za-z0-9_-]+#api-key=<REDACTED>#g'
  else
    sed -E 's#api-key=[A-Za-z0-9_-]+#api-key=<REDACTED>#g'
  fi
}

deployer_image() {
  printf '%s\n' "${HYPERLANE_DEPLOYER_IMAGE:-ghcr.io/gorbagana-dev/hyperlane-svm-deployer:v2.2.0-gorbagana.4}"
}

run_in_deployer() {
  # Re-exec this script inside the svm-deployer image.
  local script_path="$1"
  shift
  local keyfile
  keyfile="$(resolve_path "${DEPLOYER_KEYPAIR_FILE:-./keys/deployer-keypair.json}")"
  if [ ! -s "$keyfile" ]; then
    echo "ERROR: deployer keypair not found at $keyfile (run scripts/generate-keys.sh)" >&2
    exit 1
  fi
  mkdir -p "${OUTER_RIM_ROOT}/state" "${OUTER_RIM_ROOT}/logs"
  docker run --rm \
    --name "outer-rim-$(basename "$script_path" .sh)-$$" \
    -e OUTER_RIM_IN_CONTAINER=1 \
    -e FORCE_REDEPLOY="${FORCE_REDEPLOY:-false}" \
    -e CONFIRM_FORCE_REDEPLOY="${CONFIRM_FORCE_REDEPLOY:-false}" \
    -e GORCHAIN_RPC_URL \
    -e SOLANA_RPC_URL \
    -e GORCHAIN_DOMAIN_ID \
    -e SOLANA_DOMAIN_ID \
    -e GORCHAIN_CHAIN_ID \
    -e SOLANA_CHAIN_ID \
    -e GORCHAIN_IS_TESTNET \
    -e SOLANA_IS_TESTNET \
    -e WARP_ROUTES \
    -e BRIDGE_OWNER_PUBKEY \
    -e IGP_ORACLE_PUBKEY \
    -e IGP_BENEFICIARY_PUBKEY \
    -e GORCHAIN_VALIDATOR_ADDRESS \
    -e SOLANA_VALIDATOR_ADDRESS \
    -e STATE_OUTPUT_DIR=/outer-rim/state \
    -e LOGS_OUTPUT_DIR=/outer-rim/logs \
    -e DEPLOYER_KEY_FILE=/keys/deployer-keypair.json \
    -v "${OUTER_RIM_ROOT}/config:/outer-rim/config:ro" \
    -v "${OUTER_RIM_ROOT}/scripts:/outer-rim/scripts:ro" \
    -v "${OUTER_RIM_ROOT}/state:/outer-rim/state" \
    -v "${OUTER_RIM_ROOT}/logs:/outer-rim/logs" \
    -v "${keyfile}:/keys/deployer-keypair.json:ro" \
    "$(deployer_image)" \
    /bin/bash "/outer-rim/scripts/$(basename "$script_path")" "$@"
}
