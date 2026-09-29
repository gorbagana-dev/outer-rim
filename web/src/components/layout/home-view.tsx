"use client";

import { BridgeCard } from "@/components/bridge/bridge-card";
import { WarpFloat } from "@/components/bridge/warp-float";
import { HistoryDrawer } from "@/components/bridge/history-drawer";
import { BridgeNotice } from "@/components/layout/bridge-notice";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/chrome";
import { Badge } from "@/components/ui/badge";
import { useHistory } from "@/hooks/use-history";
import { CHAINS } from "@/lib/chains";
import { formatTokenAmount } from "@/lib/format";
import type { HistoryItem } from "@/lib/types";
import { useState } from "react";

const STATUS_LABEL: Record<HistoryItem["status"], string> = {
  idle: "Idle",
  review: "Review",
  signing: "Signing",
  submitted: "Submitted",
  confirming: "Confirming",
  "waiting-relayer": "Landed",
  delivered: "Landed",
  failed: "Failed",
};

export function HomeView() {
  const { items, save } = useHistory();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const recent = items.slice(0, 3);

  function openTrip(item: HistoryItem) {
    setFocusId(item.id);
    setHistoryOpen(false);
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--bg-app)]">
      <div className="z-[100] shrink-0">
        <BridgeNotice />
        <Header onHistory={() => setHistoryOpen(true)} historyOpen={historyOpen} />
      </div>
      <main className="relative min-h-0 flex-1 overflow-y-auto">
        <div className="relative flex h-full flex-col px-4 py-4 md:px-6">
        <h1 className="sr-only">Move $GOR</h1>
        <div className="grid min-h-0 flex-1 grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
          <div className="order-2 flex min-h-0 flex-col">
          <div className="motion-enter flex h-full min-h-0 flex-1 flex-col">
            <BridgeCard onHistoryItem={save} items={items} focusId={focusId} />
          </div>
          {recent.length > 0 && (
            <section className="motion-enter mt-8" style={{ animationDelay: "160ms" }} aria-label="Recent transfers">
              <div className="mb-1 flex items-baseline justify-between">
                <h2 className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  Recent
                </h2>
                <button
                  type="button"
                  onClick={() => setHistoryOpen(true)}
                  className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-500"
                >
                  All trips
                </button>
              </div>
              <ul className="m-0 list-none p-0">
                {recent.map((item) => {
                  const amount = formatTokenAmount(item.amount, { context: "compact", tokenDecimals: 6 });
                  return (
                    <li key={item.id} className="border-b border-[var(--border-subtle)]">
                      <button
                        type="button"
                        onClick={() => openTrip(item)}
                        className="flex w-full items-center gap-3 py-3 text-left"
                      >
                        <span className="font-mono text-sm tabular text-[var(--text-primary)]">
                          <span aria-label={amount.aria}>{amount.text}</span>
                          <span className="ml-1 text-[var(--text-muted)]">$GOR</span>
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs text-[var(--text-muted)]">
                          {CHAINS[item.origin].shortName} → {CHAINS[item.destination].shortName}
                        </span>
                        <Badge
                          tone={
                            item.status === "delivered" || item.status === "waiting-relayer"
                              ? "acid"
                              : item.status === "failed"
                                ? "danger"
                                : "cyan"
                          }
                        >
                          {STATUS_LABEL[item.status]}
                        </Badge>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          </div>
          <div className="order-1 min-h-[320px] lg:min-h-0">
            <div className="relative h-full overflow-hidden rounded-xl border-2 border-pink-500 shadow-[var(--glow-pink-strong)]">
              <img
                src="/gor-pfp.webp"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-[var(--border-subtle)]">
                <WarpFloat />
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
      <HistoryDrawer
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        items={items}
        onSelect={openTrip}
      />
    </div>
  );
}
