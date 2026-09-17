"use client";

import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useBridgeConfig } from "@/providers/config-provider";

export function SvmWalletProvider({ children }: { children: ReactNode }) {
  const config = useBridgeConfig();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const endpoint = useMemo(() => {
    if (typeof window === "undefined") return "https://rpc.gorbagana.wtf";
    const path = config.gorchainRpc;
    if (path.startsWith("http")) return path;
    return `${window.location.origin}${path}`;
  }, [config.gorchainRpc]);

  if (!ready) return <>{children}</>;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={[]} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}
