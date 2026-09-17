# Outer Rim web

Gorbagana-branded UI for the Gorchain ↔ Solana Hyperlane warp. Native **$GOR** (9 decimals) locks on Gorchain against SPL **$GOR** `71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg` (6 decimals) on Solana.

The flow follows [hyperlane-warp-ui-template](https://github.com/hyperlane-xyz/hyperlane-warp-ui-template): origin / destination, amount, recipient, review, sign, wait on the relayer. It is **not** a fork of that template. Latest upstream Warp UI talks to Hyperlane's Universal Router API, which does not know Gorchain. This app uses local `WarpCore` against the Outer Rim programs.

Visual language comes from `design-system/gorbagana/` (void purple, acid green, sticker paper, Permanent Marker / Space Grotesk / JetBrains Mono).

## Run

```bash
cd outer-rim/web
cp .env.example .env.local
# fill mailboxes + warp program ids after deploy, or leave blank to browse the form
bun install
bun run dev
```

Open http://localhost:3000.

The browser never sees RPC API keys. `/api/rpc/gorchain` and `/api/rpc/solana` proxy an allowlisted JSON-RPC set. `/api/config` also reads `../state/program-ids.json` and warp deploy outputs when they exist.

## Wallets

Any Solana Wallet Standard wallet (Phantom, Nightly, Solflare, Backpack). The same pubkey works on both SVM chains. `sendTransaction` is submitted to the **origin** RPC, not the wallet's default cluster.

## Honest limits

- Interchain gas is not quoted. Sealevel `process_estimate_costs` returns zeros; relayer enforcement is off.
- Delivery tracking needs a message explorer. Without `NEXT_PUBLIC_EXPLORER_URL`, status stops at "waiting on relayer" after the origin tx confirms.
- Gorchain → Solana unlocks require SPL already in the Solana escrow.
