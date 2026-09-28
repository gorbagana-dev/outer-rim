import type { WalletContextState } from "@solana/wallet-adapter-react";
import type { Keypair, Transaction } from "@solana/web3.js";
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
    for (const { transaction, signers } of txs) {
      opts.onStatus("signing");
      const sent = await sendWithFreshBlockhash(transaction, signers, wallet, connection);
      signature = sent.signature;
      opts.onStatus("submitted", signature);
      opts.onStatus("confirming", signature);
      await connection.confirmTransaction(
        {
          signature,
          blockhash: sent.blockhash,
          lastValidBlockHeight: sent.lastValidBlockHeight,
        },
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

async function sendWithFreshBlockhash(
  transaction: Transaction,
  signers: Keypair[],
  wallet: WalletContextState,
  connection: ReturnType<typeof connectionFor>,
) {
  if (!wallet.publicKey || !wallet.sendTransaction) {
    throw new Error("Connect a Solana-compatible wallet first.");
  }

  const blockhash = await connection.getLatestBlockhash("confirmed");
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = blockhash.blockhash;
  transaction.lastValidBlockHeight = blockhash.lastValidBlockHeight;

  const presigned = transaction.signatures.filter((sig) => sig.signature);
  const covered = presigned.every((sig) =>
    signers.some((kp) => kp.publicKey.equals(sig.publicKey)),
  );
  if (!covered) {
    throw new Error("Could not attach a fresh blockhash. The message signer was lost.");
  }
  if (signers.length) transaction.partialSign(...signers);

  const signature = await wallet.sendTransaction(transaction, connection, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
    maxRetries: 3,
  });
  return {
    signature,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  };
}
