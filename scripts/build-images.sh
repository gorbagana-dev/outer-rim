#!/usr/bin/env bash
# Rebuild Hyperlane images from hyperlane-monorepo-audit when GHCR is unavailable.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# shellcheck disable=SC1091
. "${SCRIPT_DIR}/lib.sh"

MONOREPO="${HYPERLANE_MONOREPO:-${OUTER_RIM_ROOT}/../hyperlane-monorepo-audit}"
if [ ! -d "$MONOREPO/rust" ]; then
  echo "ERROR: monorepo not found at $MONOREPO" >&2
  echo "Set HYPERLANE_MONOREPO to the gorbagana Hyperlane checkout." >&2
  exit 1
fi

AGENT_TAG="${1:-outer-rim/hyperlane-agent:v2.2.0-gorbagana.1}"
DEPLOYER_TAG="${2:-outer-rim/hyperlane-svm-deployer:v2.2.0-gorbagana.4}"

echo "Building agent → ${AGENT_TAG}"
docker build -t "$AGENT_TAG" \
  -f "${OUTER_RIM_ROOT}/docker/hyperlane-agent.Dockerfile" \
  "$MONOREPO"

echo "Building svm-deployer → ${DEPLOYER_TAG} (this compiles Sealevel programs; it is slow)"
docker build -t "$DEPLOYER_TAG" \
  -f "${OUTER_RIM_ROOT}/docker/hyperlane-svm-deployer.Dockerfile" \
  "$MONOREPO"

cat <<EOF

Built:
  ${AGENT_TAG}
  ${DEPLOYER_TAG}

Point .env at them:
  HYPERLANE_AGENT_IMAGE=${AGENT_TAG}
  HYPERLANE_DEPLOYER_IMAGE=${DEPLOYER_TAG}

Then pin digests:
  docker inspect --format='{{index .RepoDigests 0}}' ${AGENT_TAG}
EOF
