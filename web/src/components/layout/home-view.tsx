"use client";

import { BridgeCard } from "@/components/bridge/bridge-card";
import { HistoryDrawer } from "@/components/bridge/history-drawer";
import { Header } from "@/components/layout/header";
import { Footer, Marquee } from "@/components/layout/chrome";
import { SunsetGrid } from "@/components/layout/sunset-grid";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import { useHistory } from "@/hooks/use-history";
import { GOR_MINT } from "@/lib/chains";
import { truncateAddress } from "@/lib/address";
import { useBridgeConfig } from "@/providers/config-provider";
import { useState } from "react";

/* ─────────────────────────────────────────────────────────
 * PAGE CONTENT STORYBOARD
 *
 * Static shell (nav) never re-animates.
 *
 *    0ms   nav + form visible (first action)
 *  120ms   hero copy fades
 *  240ms   notice stickers
 *  360ms   footer
 * ───────────────────────────────────────────────────────── */

const TIMING = {
  hero: 120,
  notices: 240,
};

export function HomeView() {
  const { items, save } = useHistory();
  const [historyOpen, setHistoryOpen] = useState(false);
  const config = useBridgeConfig();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)]">
      <Header onHistory={() => setHistoryOpen(true)} historyOpen={historyOpen} />
      <Marquee />
      <main className="relative flex-1">
        <section className="relative overflow-hidden border-b border-[var(--border-subtle)] bg-[var(--gradient-void)]">
          <SunsetGrid />
          <div className="relative mx-auto max-w-container px-4 md:px-8 pt-10 pb-16 md:pt-16 md:pb-24 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 items-start">
            <div
              className="motion-enter flex flex-col gap-5 max-w-xl"
              style={{ animationDelay: `${TIMING.hero}ms` }}
            >
              <div className="flex flex-wrap gap-2">
                <Tag variant="sticker" tilt={-3}>
                  Scrap-metal border
                </Tag>
                <Tag variant="sticker" tilt={2}>
                  Native ↔ collateral
                </Tag>
              </div>
              <h1 className="m-0 font-display uppercase text-[48px] md:text-[64px] leading-[0.95] text-acid-500 [text-shadow:var(--text-glow-acid)]">
                Outer Rim
              </h1>
              <p className="m-0 font-body text-lg font-medium text-[var(--text-primary)]">
                Move{" "}
                <span className="font-display text-pink-500 [text-shadow:var(--text-glow-pink)]">
                  $GOR
                </span>{" "}
                between Gorchain and Solana. Lock native gas on one lid, unlock SPL on the other.
                Hyperlane warp. Landfill manners.
              </p>
              <p className="m-0 font-mono text-xs text-[var(--text-secondary)]">
                Mint {truncateAddress(GOR_MINT, 6)} · 9 dec native · 6 dec SPL
              </p>
            </div>
            <div className="motion-enter" style={{ animationDelay: "80ms" }}>
              <BridgeCard onHistoryItem={save} />
            </div>
          </div>
        </section>
        <section
          className="motion-enter mx-auto max-w-[960px] px-4 md:px-8 py-16 grid md:grid-cols-2 gap-8 items-stretch"
          style={{ animationDelay: `${TIMING.notices}ms` }}
        >
          <Card variant="sticker" tilt={-2} header="Trash Council · Border notice">
            <p className="m-0 font-display text-[22px] leading-snug">
              Papers please. One asset. Two chains. Bring your own lid.
            </p>
          </Card>
          <Card variant="cardboard" header="Fuel depot">
            <p className="m-0 font-display text-[22px]">GAS: $GOR</p>
            <p className="mt-2 mb-0 text-sm text-[var(--ink-900)]">
              {config.routeReady
                ? "Route programs are configured. Sign on the origin chain. The relayer dumps the rest."
                : "Warp program IDs are not in env yet. Connect a wallet, size a dump, and wait on deploy."}
            </p>
          </Card>
        </section>
      </main>
      <Footer />
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={items}
        onSelect={() => setHistoryOpen(false)}
      />
    </div>
  );
}
