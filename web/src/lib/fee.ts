import type { Connection, Transaction } from "@solana/web3.js";
import { connectionFor } from "./balances";
import type { ChainId } from "./chains";
import { baseUnitsToHuman, formatTokenAmount } from "./format";
import type { PublicBridgeConfig } from "./types";
import { getWarp } from "./warp";

/** Dispatched-message account body, measured from a live Gorchain lock. */
const MESSAGE_ACCOUNT_BYTES = 194;
/** Gas-payment account body. Rent for 141 bytes is the amount the IGP asks for. */
const GAS_PAYMENT_ACCOUNT_BYTES = 141;
const TX_FEE_LAMPORTS = 5_000n;

export type OriginFee = {
  /** Lamports the transfer spends on top of the bridged tokens. */
  spend: bigint;
  /** Spend plus the rent the wallet itself must keep. */
  required: bigint;
  symbol: "SOL" | "GOR";
  text: string;
  requiredText: string;
};

export async function quoteOriginFee(opts: {
  config: PublicBridgeConfig;
  origin: ChainId;
  destination: ChainId;
  sender: string;
}): Promise<OriginFee> {
  const warp = await getWarp(opts.config);
  const igp = await warp.quoteInterchainFee({
    origin: opts.origin,
    destination: opts.destination,
    sender: opts.sender,
  });
  const connection = connectionFor(opts.origin, opts.config);
  const [messageRent, gasRent, keep] = await Promise.all([
    connection.getMinimumBalanceForRentExemption(MESSAGE_ACCOUNT_BYTES),
    connection.getMinimumBalanceForRentExemption(GAS_PAYMENT_ACCOUNT_BYTES),
    connection.getMinimumBalanceForRentExemption(0),
  ]);
  const spend = igp + BigInt(messageRent) + BigInt(gasRent) + TX_FEE_LAMPORTS;
  const required = spend + BigInt(keep);
  const symbol = opts.origin === "solana" ? "SOL" : "GOR";
  return {
    spend,
    required,
    symbol,
    text: lamportsText(spend),
    requiredText: lamportsText(required),
  };
}

export async function assertSimulation(
  connection: Connection,
  transaction: Transaction,
  origin: ChainId,
) {
  const sim = await connection.simulateTransaction(transaction);
  if (!sim.value.err) return;

  const logs = sim.value.logs ?? [];
  const lamports = logs.join("\n").match(/insufficient lamports (\d+), need (\d+)/);
  if (lamports && transaction.feePayer) {
    const has = BigInt(lamports[1]);
    const need = BigInt(lamports[2]);
    const short = need > has ? need - has : 0n;
    const balance = BigInt(await connection.getBalance(transaction.feePayer, "confirmed"));
    const keep = BigInt(await connection.getMinimumBalanceForRentExemption(0));
    const required = balance + short + keep;
    const symbol = origin === "solana" ? "SOL" : "GOR";
    throw new Error(
      `Not enough ${symbol} for the network fee. This wallet has ${lamportsText(balance)} ${symbol}. This transfer needs about ${lamportsText(required)} ${symbol}.`,
    );
  }

  if (logs.some((line) => /insufficient funds/i.test(line))) {
    throw new Error("Not enough $GOR in this wallet for that amount.");
  }

  const detail = [...logs].reverse().find((line) => /error|failed|insufficient/i.test(line));
  throw new Error(detail ?? "Simulation failed. The transfer was not submitted.");
}

function lamportsText(raw: bigint) {
  return formatTokenAmount(baseUnitsToHuman(raw, 9), {
    context: "detailed",
    tokenDecimals: 9,
  }).text;
}
