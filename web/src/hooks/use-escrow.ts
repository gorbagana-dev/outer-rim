"use client";

import { fetchNativeBalance, fetchTokenAccountBalance } from "@/lib/balances";
import { GOR_DECIMALS } from "@/lib/chains";
import { ESCROW_ACCOUNTS } from "@/lib/deployed";
import { baseUnitsToHuman } from "@/lib/format";
import type { PublicBridgeConfig } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export type EscrowSide = { human: string; raw: bigint };

export function useEscrow(config: PublicBridgeConfig) {
  const [gorchain, setGorchain] = useState<EscrowSide | null>(null);
  const [solana, setSolana] = useState<EscrowSide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const [native, spl] = await Promise.all([
      fetchNativeBalance("gorchain", ESCROW_ACCOUNTS.gorchain, config),
      fetchTokenAccountBalance(ESCROW_ACCOUNTS.solana, config),
    ]);
    if (native == null || spl == null) {
      setError("Could not read the escrow.");
      setLoading(false);
      return;
    }
    setGorchain({ raw: native, human: baseUnitsToHuman(native, GOR_DECIMALS.gorchain) });
    setSolana(spl);
    setLoading(false);
  }, [config]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { gorchain, solana, loading, error, refresh };
}
