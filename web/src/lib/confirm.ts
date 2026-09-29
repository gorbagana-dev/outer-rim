import { TransactionExpiredBlockheightExceededError, type Connection } from "@solana/web3.js";
import type { HistoryItem } from "./types";

const POLL_MS = 2_000;
const MAX_WAIT_MS = 90_000;
const SIGNATURE = /[1-9A-HJ-NP-Za-km-z]{80,90}/;

export type SignatureOutcome = "pending" | "success" | "failed";

/**
 * `Connection.confirmTransaction` waits on a websocket subscription. This app
 * reaches RPC through an HTTP proxy, so that subscription never arrives and
 * web3.js throws "block height exceeded" after the transaction has finalized.
 * Poll `getSignatureStatuses` instead.
 */
export async function confirmLanded(connection: Connection, signature: string): Promise<void> {
  const started = Date.now();
  while (Date.now() - started < MAX_WAIT_MS) {
    const outcome = await signatureOutcome(connection, signature);
    if (outcome === "success") return;
    if (outcome === "failed") throw new Error("The lock transaction failed on chain.");
    await sleep(POLL_MS);
  }

  const outcome = await signatureOutcome(connection, signature, true);
  if (outcome === "success") return;
  if (outcome === "failed") throw new Error("The lock transaction failed on chain.");
  throw new TransactionExpiredBlockheightExceededError(signature);
}

export async function signatureOutcome(
  connection: Connection,
  signature: string,
  deep = false,
): Promise<SignatureOutcome> {
  try {
    const { value } = await connection.getSignatureStatuses([signature], {
      searchTransactionHistory: true,
    });
    const status = value[0];
    if (status) {
      if (status.err) return "failed";
      if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") {
        return "success";
      }
      return "pending";
    }
  } catch {
    if (!deep) return "pending";
  }

  if (!deep) return "pending";

  try {
    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });
    if (!tx) return "pending";
    return tx.meta?.err ? "failed" : "success";
  } catch {
    return "pending";
  }
}

export function isExpiryFailure(item: HistoryItem): boolean {
  return item.status === "failed" && /block height exceeded/i.test(item.error ?? "");
}

export function signatureFromItem(item: HistoryItem): string | null {
  if (item.originTx && SIGNATURE.test(item.originTx)) return item.originTx;
  return item.error?.match(SIGNATURE)?.[0] ?? null;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
