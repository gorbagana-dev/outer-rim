"use client";

import { fetchGorBalance, fetchNativeBalance } from "@/lib/balances";
import { GOR_DECIMALS, type ChainId } from "@/lib/chains";
import { GORCHAIN_TX_FEE_RAW } from "@/lib/deployed";
import { baseUnitsToHuman } from "@/lib/format";
import type { PublicBridgeConfig } from "@/lib/types";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";

export function useBalances(origin: ChainId, config: PublicBridgeConfig) {
  const { publicKey } = useWallet();
  const [gor, setGor] = useState<{ human: string; raw: bigint } | null>(null);
  const [native, setNative] = useState<bigint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setGor(null);
      setNative(null);
      return;
    }
    setLoading(true);
    setError(null);
    const owner = publicKey.toBase58();
    const [g, n] = await Promise.all([
      fetchGorBalance(origin, owner, config),
      fetchNativeBalance(origin, owner, config),
    ]);
    setGor(g);
    setNative(n);
    if (g == null) setError("Could not read balance. Retry, or check the RPC.");
    setLoading(false);
  }, [publicKey, origin, config]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const maxHuman = gor ? portionHuman(gor.raw, origin, 10_000) : "0";

  return { gor, native, loading, error, refresh, maxHuman, connected: Boolean(publicKey) };
}

/** Spendable balance in human units. `bps` is parts of 10_000; 10_000 is max. Gorchain keeps 0.01 $GOR for fees. */
export function portionHuman(raw: bigint, origin: ChainId, bps: number) {
  const buffer = origin === "gorchain" ? GORCHAIN_TX_FEE_RAW : 0n;
  const spendable = raw > buffer ? raw - buffer : 0n;
  const cut = bps >= 10_000 ? spendable : (spendable * BigInt(bps)) / 10_000n;
  return baseUnitsToHuman(cut, GOR_DECIMALS[origin]);
}
