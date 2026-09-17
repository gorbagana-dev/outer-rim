"use client";

import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { WalletButton } from "@/components/wallet/wallet-button";
import { Wordmark } from "./wordmark";
import { History, Recycle } from "lucide-react";

export function Header({
  onHistory,
  historyOpen,
}: {
  onHistory: () => void;
  historyOpen: boolean;
}) {
  return (
    <header className="sticky top-0 z-[100] flex items-center gap-4 md:gap-8 h-16 px-4 md:px-8 bg-[rgba(13,6,25,0.75)] backdrop-blur-[8px] border-b border-[var(--border-subtle)]">
      <a href="/" className="flex items-center gap-2.5 no-underline text-inherit hover:no-underline">
        <img
          src="/gorbagana-mark.svg"
          alt=""
          width={32}
          height={32}
          className="rounded-sm border border-acid-500"
        />
        <span className="hidden sm:inline">
          <Wordmark />
        </span>
        <span className="hidden md:inline font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500 ml-1">
          Outer Rim
        </span>
      </a>
      <nav className="hidden md:flex items-center gap-1 flex-1">
        <span className="px-3 py-2 rounded-sm font-body text-xs font-bold uppercase tracking-[0.14em] text-acid-500 [text-shadow:var(--text-glow-acid)]">
          Bridge
        </span>
        <a
          href="https://docs.gorbagana.wtf/"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 rounded-sm font-body text-xs font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)] hover:no-underline"
        >
          Docs
        </a>
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Badge tone="acid" dot pulse>
          Mainnet
        </Badge>
        <IconButton
          label={historyOpen ? "Close history" : "Open history"}
          active={historyOpen}
          onClick={onHistory}
        >
          <History size={18} aria-hidden />
        </IconButton>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Recycle size={14} aria-hidden />
          $GOR
        </span>
        <WalletButton />
      </div>
    </header>
  );
}
