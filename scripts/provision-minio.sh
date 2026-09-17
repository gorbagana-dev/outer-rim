#!/bin/sh
# MinIO bucket + IAM provisioner. Idempotent.
# Creates hyperlane-validator-<label> with anonymous download (relayer) and
# per-validator IAM write.
set -e

MINIO_URL="${MINIO_URL:-http://minio:9000}"

echo "Waiting for MinIO at ${MINIO_URL}..."
retries=0
until mc alias set local "${MINIO_URL}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}" 2>/dev/null \
      && mc ls local 2>/dev/null; do
  retries=$((retries + 1))
  if [ "${retries}" -ge 90 ]; then
    echo "MinIO not ready after 180s, giving up"
    exit 1
  fi
  echo "MinIO not ready yet, retrying in 2s..."
  sleep 2
done
echo "MinIO is ready"

provision_validator() {
  label="$1"
  key_id="$2"
  secret="$3"
  if [ -z "${key_id}" ] || [ -z "${secret}" ]; then
    echo "ERROR: MinIO credentials are not set for '${label}'"
    exit 1
  fi

  bucket="hyperlane-validator-${label}"
  policy_name="policy-${label}"

  echo "Provisioning label=${label} bucket=${bucket}..."
  mc mb --ignore-existing "local/${bucket}"

  retries=0
  until mc anonymous set download "local/${bucket}"; do
    retries=$((retries + 1))
    if [ "${retries}" -ge 30 ]; then
      echo "Failed to set anonymous policy on ${bucket} after 30 retries"
      exit 1
    fi
    echo "Retrying anonymous set for ${bucket} in 3s..."
    sleep 3
  done

  mc admin user add local "${key_id}" "${secret}" || true

  tmp_policy="$(mktemp)"
  cat > "${tmp_policy}" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:*"],
      "Resource": [
        "arn:aws:s3:::${bucket}",
        "arn:aws:s3:::${bucket}/*"
      ]
    }
  ]
}
EOF
  mc admin policy create local "${policy_name}" "${tmp_policy}" || true
  rm -f "${tmp_policy}"
  mc admin policy attach local "${policy_name}" --user "${key_id}"
  echo "Provisioned ${label}: user=${key_id}, bucket=${bucket}, policy=${policy_name}"
}

provision_validator \
  "gorchain-primary" \
  "${GORCHAIN_PRIMARY_KEY_ID:-}" \
  "${GORCHAIN_PRIMARY_SECRET:-}"
provision_validator \
  "solana-primary" \
  "${SOLANA_PRIMARY_KEY_ID:-}" \
  "${SOLANA_PRIMARY_SECRET:-}"

echo "All validators provisioned successfully"
