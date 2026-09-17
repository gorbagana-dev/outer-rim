# Outer Rim

Gorchain ↔ Solana Hyperlane bridge. **Native GOR** on Gorchain against the existing Solana GOR mint `71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg`.

This is an operator stack around stock Hyperlane SVM programs. It is not laconic-so, Ansible, or kind. Explorer / Grafana / warp-UI are out of scope.

## What it does

| Direction | Lock | Unlock |
|-----------|------|--------|
| Gorchain → Solana | native GOR (gas token) into the native warp collateral PDA | SPL GOR from the Solana warp escrow |
| Solana → Gorchain | SPL GOR into the Solana warp escrow | native GOR from the Gorchain native collateral PDA |

There is no synthetic USDC. There is no second GOR mint on Gorchain. The Solana mint is **collateral** (escrow), not a Hyperlane-minted synthetic.

### On-chain mint (confirmed 2026-09-17)

| Field | Value |
|-------|--------|
| Mint | `71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg` |
| Token program | classic SPL `Tokenkeg…` (not Token-2022) |
| Decimals | **6** (native GOR on Gorchain is **9**) |
| Mint authority | none (supply fixed) |
| Freeze authority | none |

`scripts/deploy-warp.sh` re-checks this before deploy. Collateral warp does not need mint authority; it escrows tokens. Freeze-revoked is required so the escrow ATA cannot be frozen.

`config/warp-routes/gor.yml` sets `remoteDecimals: 9` on **both** sides. If you omit that, each program defaults `remoteDecimals` to its local decimals and 1 native GOR unlocks 1000 SPL GOR. The file uses JSON syntax, which is valid YAML, so deployment scripts can validate it directly with `jq`.

### Liquidity

Gorchain → Solana payouts come from SPL already sitting in the Solana escrow. Seed that escrow with SPL GOR before users bridge out of Gorchain. Solana → Gorchain payouts come from native GOR locked on Gorchain (or from the native collateral PDA once inbound flow has filled it).

## Trust model

- **ISM is 1-of-1.** Gorchain's ISM trusts the Solana validator's secp256k1 H160; Solana's ISM trusts the Gorchain validator. One Privy key authorizes messages for that origin.
- **Gas payment enforcement is off.** Relayer `HYP_GASPAYMENTENFORCEMENT=[{"type":"none"}]` because Sealevel `process_estimate_costs` returns zeros, so on-chain fee quoting does not work. Do not pretend fees are enforced.
- Agent config points `interchainGasPaymaster` at the **overhead** IGP account. Payment PDAs store the **inner** `igp_account`. If you enable enforcement later, point the indexer at the inner account.
- Do not call mailbox `OutboxGetLatestCheckpoint` (copies a 32-byte root into a 31-byte buffer). Agents do not use it.

## Layout

```
outer-rim/
├── docker-compose.yml      # minio, kms-proxy ×2, validator ×2, relayer
├── .env.example
├── config/warp-routes/gor.yml
├── scripts/deploy-core.sh
├── scripts/deploy-warp.sh
├── scripts/generate-keys.sh
├── kms-proxy/              # Privy as fake AWS KMS
└── state/                  # generated program ids (gitignored contents)
```

## Prerequisites

- Docker Compose v2
- `solana-keygen`, `python3`, `curl`, `jq`, `openssl` (for operator scripts)
- Funded deployer keypair on **both** chains (program deploys are not cheap)
- Privy app with two Ethereum (secp256k1) server wallets for validators, optional Solana wallets for bridge owner / IGP oracle
- Solana RPC (Helius or similar) in `.env` — never commit the API key

GHCR images `ghcr.io/gorbagana-dev/hyperlane-agent:v2.2.0-gorbagana.1` and `hyperlane-svm-deployer:v2.2.0-gorbagana.4` are private. If you cannot pull them, rebuild from `../hyperlane-monorepo-audit`:

```bash
./scripts/build-images.sh
```

Then set `HYPERLANE_AGENT_IMAGE` / `HYPERLANE_DEPLOYER_IMAGE` in `.env`. Pin digests after the first pull:

```bash
docker inspect --format='{{index .RepoDigests 0}}' "$HYPERLANE_AGENT_IMAGE"
```

Do not use `:latest`.

On Apple Silicon the agent image is `linux/amd64` (compose already sets `platform`).

## Deploy order

1. **Keys and env**
   ```bash
   cp .env.example .env
   # fill RPCs, Privy ids, validator H160s
   ./scripts/generate-keys.sh
   # fund the addresses printed in keys/addresses.env on both chains
   ```
2. **MinIO**
   ```bash
   docker compose up -d minio minio-provision
   ```
   The provisioner retries authenticated MinIO access until the server is ready, then creates `hyperlane-validator-gorchain-primary` and `hyperlane-validator-solana-primary` with anonymous read (relayer) and per-validator IAM write. Validators require this job to complete successfully.
3. **Core programs** (mailbox, message-id ISM, IGP, validator-announce)
   ```bash
   ./scripts/deploy-core.sh
   ```
   Writes `state/program-ids.json` and `state/agent-config.json`.

   `--force` deploys new program identities and can orphan funded programs. It is a recovery/development option, not the validator-rotation path. It requires the explicit pair `--force --confirm-new-program-ids`. Reconfigure the existing ISM for validator changes.
4. **Warp route** (native GOR ↔ collateral SPL)
   ```bash
   ./scripts/deploy-warp.sh
   ```
   Confirms mint decimals on-chain, enrolls both sides, verifies program hashes, writes `state/relayer-whitelist.json`. Empty whitelist is deny-all; the relayer will not start with `[]`.
5. **Validators then relayer**
   ```bash
   docker compose up -d
   ```
   Relayer `depends_on` both validators **healthy**. Do not start the relayer before validators — it would race checkpoints.

PM2 is a fallback only if you cannot run Docker. Prefer this Compose file.

## Flow after it is up

Users (or a later UI) call the warp programs:

- **Lock GOR on Gorchain** → mailbox message → Solana validator signs a checkpoint → relayer delivers → **unlock SPL GOR** from escrow to the recipient ATA.
- **Lock SPL GOR on Solana** → mailbox message → Gorchain validator signs → relayer delivers → **unlock native GOR**.

`HYP_WHITELIST` is the two warp program ids (32-byte hex). The relayer will not deliver to any other recipient.

## Secrets

Live in `.env` and bind-mounted files under `keys/`. Both are gitignored. Never put key material in `state/` commits or Compose `environment:` literals.

## Rebuild / pin

| Image | Default tag | Rebuild |
|-------|-------------|---------|
| Agent (validator + relayer) | `ghcr.io/gorbagana-dev/hyperlane-agent:v2.2.0-gorbagana.1` | `docker/hyperlane-agent.Dockerfile` |
| SVM deployer | `ghcr.io/gorbagana-dev/hyperlane-svm-deployer:v2.2.0-gorbagana.4` | `docker/hyperlane-svm-deployer.Dockerfile` |
| KMS proxy | `outer-rim/hyperlane-kms-proxy:v1` (local build) | `kms-proxy/` |
| MinIO | `quay.io/minio/minio:RELEASE.2025-09-07T16-13-09Z` | upstream dated tag |

SBPF version is chosen at deploy time per cluster (`enable v3` feature `5cC3foj77…`): Gorchain historically wanted v0; Solana follows the live feature gate. Do not hardcode the `.so` set.

## Out of scope (phase 1)

Explorer, Grafana, warp-UI, gas-oracle daemon. IGP quotes are configured once at core deploy from `config/gas-oracle-configs.json`; they are not live-updated.
