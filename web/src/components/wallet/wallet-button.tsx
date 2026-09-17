"use client";

import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { truncateAddress } from "@/lib/address";
import { Check, Copy, ExternalLink, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WalletModal } from "./wallet-modal";
import { useBridgeConfig } from "@/providers/config-provider";
import { explorerAddressUrl } from "@/lib/chains";

export function WalletButton() {
  const { connected, connecting, publicKey, disconnect, wallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const config = useBridgeConfig();

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (!connected || !publicKey) {
    return (
      <>
        <Button
          size="sm"
          iconLeft={<Wallet size={14} aria-hidden />}
          loading={connecting}
          onClick={() => setOpen(true)}
        >
          {connecting ? "Connecting" : "Connect"}
        </Button>
        <WalletModal open={open} onClose={() => setOpen(false)} />
      </>
    );
  }

  const address = publicKey.toBase58();

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="outline"
        size="sm"
        iconLeft={
          <span className="h-2 w-2 rounded-full bg-acid-500 shadow-acid" aria-hidden />
        }
        onClick={() => setMenu((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={menu}
      >
        <span className="font-mono normal-case tracking-normal tabular">
          {truncateAddress(address)}
        </span>
      </Button>
      {menu && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 p-1 rounded-sm bg-[var(--void-3)] border border-[var(--border-strong)] shadow-elevated z-[100]"
        >
          <p className="px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {wallet?.adapter.name ?? "Wallet"}
          </p>
          <MenuItem
            onClick={async () => {
              await navigator.clipboard.writeText(address);
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
          >
            {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
            {copied ? "Copied" : "Copy address"}
          </MenuItem>
          <a
            role="menuitem"
            href={explorerAddressUrl("solana", address, config.solanaExplorer)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xs text-sm text-[var(--text-primary)] hover:bg-[var(--white-6)] no-underline"
          >
            <ExternalLink size={14} aria-hidden />
            View on Solscan
          </a>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2 px-3 py-2 rounded-xs text-sm text-[var(--status-danger)] hover:bg-[var(--white-6)]"
            onClick={() => {
              setMenu(false);
              disconnect();
            }}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-3 py-2 rounded-xs text-sm text-[var(--text-primary)] hover:bg-[var(--white-6)]"
    >
      {children}
    </button>
  );
}
