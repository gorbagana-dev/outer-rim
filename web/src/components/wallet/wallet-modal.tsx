"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletReadyState } from "@solana/wallet-adapter-base";
import { ExternalLink } from "lucide-react";

export function WalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { wallets, select } = useWallet();
  const installed = wallets.filter((w) => w.readyState === WalletReadyState.Installed);
  const loadable = wallets.filter((w) => w.readyState !== WalletReadyState.Installed);

  return (
    <Dialog open={open} onClose={onClose} eyebrow="Landfill customs" title="Connect wallet">
      <p className="m-0 mb-4 text-sm">
        Same key works on Gorchain and Solana. Point the wallet at this page, then sign on the origin
        chain.
      </p>
      <ul className="flex flex-col gap-2 m-0 p-0 list-none">
        {installed.length === 0 && (
          <li className="text-sm text-[var(--text-muted)]">No wallet detected in this browser.</li>
        )}
        {installed.map((w) => (
          <li key={w.adapter.name}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                select(w.adapter.name);
                onClose();
              }}
            >
              {w.adapter.name}
            </Button>
          </li>
        ))}
      </ul>
      {loadable.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">
          <p className="m-0 mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
            Not installed
          </p>
          <ul className="flex flex-col gap-1 m-0 p-0 list-none">
            {loadable.slice(0, 4).map((w) => (
              <li key={w.adapter.name}>
                <a
                  href={w.adapter.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm"
                >
                  {w.adapter.name}
                  <ExternalLink size={12} aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Dialog>
  );
}
