import type { WalletContextState } from "@solana/wallet-adapter-react";
import { Transaction, type Keypair } from "@solana/web3.js";
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
  if (!wallet.publicKey || !wallet.signTransaction) {
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
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error("Connect a Solana-compatible wallet first.");
  }

  const presigned = transaction.signatures.filter((sig) => sig.signature);
  const covered = presigned.every((sig) =>
    signers.some((kp) => kp.publicKey.equals(sig.publicKey)),
  );
  if (!covered) {
    throw new Error("Could not attach a fresh blockhash. The message signer was lost.");
  }

  const latest = await connection.getLatestBlockhash("confirmed");
  // Rebuild instead of mutating the SDK transaction. That object is already
  // partially signed against an older blockhash, and web3.js only keeps the
  // hash when it is passed as `blockhash` alongside lastValidBlockHeight.
  const toSign = new Transaction({
    feePayer: wallet.publicKey,
    blockhash: latest.blockhash,
    lastValidBlockHeight: latest.lastValidBlockHeight,
  }).add(...transaction.instructions);
  toSign.recentBlockhash = latest.blockhash;
  if (signers.length) toSign.partialSign(...signers);
  if (toSign.compileMessage().recentBlockhash !== latest.blockhash) {
    throw new Error("Could not attach a fresh blockhash.");
  }

  // Backpack's sendTransaction uses signAndSendTransaction and broadcasts on
  // the wallet RPC for the wallet-standard chain. A proxied RPC is classified
  // as mainnet or localnet, so that node reports "blockhash not found".
  const signed = await wallet.signTransaction(toSign);
  if (!signed.recentBlockhash) {
    signed.recentBlockhash = latest.blockhash;
    signed.lastValidBlockHeight = latest.lastValidBlockHeight;
  }

  const signature = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: "confirmed",
    maxRetries: 3,
  });
  return {
    signature,
    blockhash: latest.blockhash,
    lastValidBlockHeight: latest.lastValidBlockHeight,
  };
}
