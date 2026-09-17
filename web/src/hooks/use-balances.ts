"use client";

import { fetchGorBalance, fetchNativeBalance } from "@/lib/balances";
import { GOR_DECIMALS, type ChainId } from "@/lib/chains";
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

  const feeBuffer =
    origin === "gorchain" ? 10_000_000n : 0n; /* 0.01 GOR for origin fees */
  const maxHuman =
    gor && gor.raw > feeBuffer
      ? formatMax(gor.raw - (origin === "gorchain" ? feeBuffer : 0n), GOR_DECIMALS[origin])
      : gor?.human ?? "0";

  return { gor, native, loading, error, refresh, maxHuman, connected: Boolean(publicKey) };
}

function formatMax(raw: bigint, decimals: number) {
  const base = 10n ** BigInt(decimals);
  const int = raw / base;
  const frac = (raw % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return frac ? `${int}.${frac}` : `${int}`;
}
