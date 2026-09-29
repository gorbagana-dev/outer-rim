import { PublicKey } from "@solana/web3.js";
import { connectionFor } from "./balances";
import type { ChainId } from "./chains";
import { isPubkeyLike, type PublicBridgeConfig } from "./types";

const DISPATCH = /Dispatched message to \d+, ID (0x[0-9a-fA-F]{64})/;
const POLL_MS = 4_000;
const MAX_WAIT_MS = 45_000;
const SCAN_LIMIT = 12;

export async function findDestinationTx(opts: {
  config: PublicBridgeConfig;
  origin: ChainId;
  destination: ChainId;
  originTx: string;
  poll?: boolean;
}): Promise<string | null> {
  const mailbox = opts.destination === "solana" ? opts.config.solanaMailbox : opts.config.gorchainMailbox;
  if (!isPubkeyLike(mailbox)) return null;

  const started = Date.now();
  const seen = new Set<string>();
  do {
    const messageId = await dispatchId(opts.config, opts.origin, opts.originTx);
    if (messageId) {
      const signature = await scanMailbox(opts.config, opts.destination, mailbox, messageId, seen);
      if (signature) return signature;
    }
    if (!opts.poll) return null;
    await sleep(POLL_MS);
  } while (Date.now() - started < MAX_WAIT_MS);

  return null;
}

async function dispatchId(config: PublicBridgeConfig, origin: ChainId, signature: string) {
  try {
    const tx = await connectionFor(origin, config).getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    const logs = tx?.meta?.logMessages ?? [];
    for (const line of logs) {
      const match = line.match(DISPATCH);
      if (match) return match[1].toLowerCase();
    }
  } catch {
    return null;
  }
  return null;
}

async function scanMailbox(
  config: PublicBridgeConfig,
  destination: ChainId,
  mailbox: string,
  messageId: string,
  seen: Set<string>,
) {
  const connection = connectionFor(destination, config);
  let signatures;
  try {
    signatures = await connection.getSignaturesForAddress(new PublicKey(mailbox), { limit: SCAN_LIMIT });
  } catch {
    return null;
  }

  for (const row of signatures) {
    if (row.err || seen.has(row.signature)) continue;
    try {
      const tx = await connection.getTransaction(row.signature, {
        commitment: "confirmed",
        maxSupportedTransactionVersion: 0,
      });
      if (!tx) continue;
      seen.add(row.signature);
      const logs = tx.meta?.logMessages ?? [];
      const processed = logs.some(
        (line) => /processed message/i.test(line) && line.toLowerCase().includes(messageId),
      );
      if (processed && !tx.meta?.err) return row.signature;
    } catch {
      // Try this signature again on the next pass.
    }
  }
  return null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
