import type { WalletContextState } from "@solana/wallet-adapter-react";
import { connectionFor } from "./balances";
import { getWarp } from "./warp";
import type { ChainId } from "./chains";
import type { PublicBridgeConfig } from "./types";
import { WALLET_REJECTED, humanError } from "./errors";

export async function sendWarpTransfer(opts: {
  config: PublicBridgeConfig;
  origin: ChainId;
  destination: ChainId;
  amountHuman: string;
  recipient: string;
  wallet: WalletContextState;
  onStatus: (status: "signing" | "submitted" | "confirming", signature?: string) => void;
}): Promise<{ signature: string }> {
  const { wallet, config, origin } = opts;
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error("Connect a Solana-compatible wallet first.");
  }

  const warp = await getWarp(config);
  opts.onStatus("signing");

  let txs;
  try {
    txs = await warp.getTransferRemoteTxs({
      origin: opts.origin,
      destination: opts.destination,
      amountHuman: opts.amountHuman,
      sender: wallet.publicKey.toBase58(),
      recipient: opts.recipient,
    });
  } catch (error) {
    const msg = humanError(error);
    if (msg === WALLET_REJECTED) throw Object.assign(new Error(msg), { code: WALLET_REJECTED });
    throw error;
  }

  const connection = connectionFor(origin, config);
  let signature = "";

  try {
    for (const { transaction } of txs) {
      opts.onStatus("signing");
      signature = await wallet.sendTransaction(transaction, connection, {
        skipPreflight: false,
        maxRetries: 3,
      });
      opts.onStatus("submitted", signature);
      opts.onStatus("confirming", signature);
      const latest = await connection.getLatestBlockhash("confirmed");
      await connection.confirmTransaction(
        { signature, ...latest },
        "confirmed",
      );
    }
  } catch (error) {
    const msg = humanError(error);
    if (msg === WALLET_REJECTED) {
      throw Object.assign(new Error(msg), { code: WALLET_REJECTED });
    }
    throw error;
  }

  if (!signature) throw new Error("Wallet returned no signature.");
  return { signature };
}
