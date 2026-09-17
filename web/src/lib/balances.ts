import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { GOR_DECIMALS, GOR_MINT, type ChainId } from "./chains";
import { baseUnitsToHuman } from "./format";
import type { PublicBridgeConfig } from "./types";

export function connectionFor(chain: ChainId, config: PublicBridgeConfig) {
  const endpoint =
    typeof window === "undefined"
      ? chain === "gorchain"
        ? config.gorchainRpc
        : config.solanaRpc
      : `${window.location.origin}${chain === "gorchain" ? config.gorchainRpc : config.solanaRpc}`;
  return new Connection(endpoint, "confirmed");
}

export async function fetchGorBalance(
  chain: ChainId,
  owner: string,
  config: PublicBridgeConfig,
): Promise<{ human: string; raw: bigint } | null> {
  const connection = connectionFor(chain, config);
  const ownerKey = new PublicKey(owner);
  try {
    if (chain === "gorchain") {
      const lamports = await connection.getBalance(ownerKey, "confirmed");
      const raw = BigInt(lamports);
      return { raw, human: baseUnitsToHuman(raw, GOR_DECIMALS.gorchain) };
    }
    const mint = new PublicKey(config.gorMint || GOR_MINT);
    const ata = getAssociatedTokenAddressSync(mint, ownerKey, true, TOKEN_PROGRAM_ID);
    const account = await connection.getTokenAccountBalance(ata).catch(() => null);
    if (!account?.value) return { raw: 0n, human: "0" };
    const raw = BigInt(account.value.amount);
    return { raw, human: baseUnitsToHuman(raw, account.value.decimals) };
  } catch {
    return null;
  }
}

export async function fetchNativeBalance(chain: ChainId, owner: string, config: PublicBridgeConfig) {
  const connection = connectionFor(chain, config);
  try {
    const lamports = await connection.getBalance(new PublicKey(owner), "confirmed");
    return BigInt(lamports);
  } catch {
    return null;
  }
}
