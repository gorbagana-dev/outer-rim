"use client";

import { CHAINS } from "@/lib/chains";
import { ESCROW_ACCOUNTS } from "@/lib/deployed";
import { formatTokenAmount } from "@/lib/format";
import { truncateAddress } from "@/lib/address";
import { useEscrow, type EscrowSide } from "@/hooks/use-escrow";
import { useBridgeConfig } from "@/providers/config-provider";
import { RefreshCw } from "lucide-react";

export function WarpFloat() {
  const config = useBridgeConfig();
  const { gorchain, solana, loading, error, refresh } = useEscrow(config);
  const gor = Number(gorchain?.human ?? 0);
  const sol = Number(solana?.human ?? 0);
  const total = gor + sol;
  const gorPct = total > 0 ? (gor / total) * 100 : 0;
  const solPct = total > 0 ? 100 - gorPct : 0;
  const totalText = formatTokenAmount(total, { context: "detailed", tokenDecimals: 2 });

  return (
    <section className="bg-[rgba(7,3,15,0.92)] px-3.5 pb-3.5 pt-3">
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-500">
            Both lids
          </p>
          <p className="m-0 mt-1 font-mono text-[22px] leading-none tabular text-white">
            {loading ? (
              <span className="skeleton inline-block h-5 w-28 rounded-xs align-middle" />
            ) : (
              <>
                <span aria-label={totalText.aria}>{totalText.text}</span>
                <span className="ml-1.5 font-display text-base text-pink-500 [text-shadow:var(--text-glow-pink)]">
                  $GOR
                </span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          className="mb-0.5 inline-flex shrink-0 items-center gap-1 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-secondary)]"
          aria-label="Refresh escrow balances"
        >
          <RefreshCw size={12} className={loading ? "motion-safe:animate-spin" : undefined} aria-hidden />
          Refresh
        </button>
      </div>
      <div className="mt-2.5 flex h-1 overflow-hidden rounded-full bg-[var(--white-12)]">
        <div className="h-full bg-acid-500 shadow-acid" style={{ width: `${gorPct}%` }} />
        <div className="h-full bg-cyan-500" style={{ width: `${solPct}%` }} />
      </div>
      <div className="mt-2 grid grid-cols-2 gap-3">
        <SideRow
          chain="gorchain"
          kind="Native"
          account={ESCROW_ACCOUNTS.gorchain}
          pct={gorPct}
          side={gorchain}
          loading={loading}
        />
        <SideRow
          chain="solana"
          kind="SPL"
          account={ESCROW_ACCOUNTS.solana}
          pct={solPct}
          side={solana}
          loading={loading}
        />
      </div>
      {error && <p className="m-0 mt-2 text-xs text-[var(--status-danger)]">{error}</p>}
    </section>
  );
}

function SideRow({
  chain,
  kind,
  account,
  pct,
  side,
  loading,
}: {
  chain: "gorchain" | "solana";
  kind: string;
  account: string;
  pct: number;
  side: EscrowSide | null;
  loading: boolean;
}) {
  const meta = CHAINS[chain];
  const shown = formatTokenAmount(side?.human ?? "0", {
    context: "detailed",
    tokenDecimals: 2,
  });
  const tone = chain === "gorchain" ? "text-acid-500" : "text-cyan-500";
  return (
    <div className="min-w-0">
      <p className={`m-0 font-body text-[10px] font-bold uppercase tracking-[0.12em] ${tone}`}>
        {meta.shortName} {pct.toFixed(0)}%
      </p>
      <p className="m-0 mt-1 flex items-center gap-1.5">
        <img src={meta.mark} alt="" width={16} height={16} className="rounded-xs" />
        <span className="truncate text-xs font-bold text-white">{kind}</span>
      </p>
      <p className="m-0 mt-0.5 truncate font-mono text-sm tabular text-white">
        {loading ? (
          <span className="skeleton inline-block h-4 w-16 rounded-xs align-middle" />
        ) : (
          <span aria-label={shown.aria}>{shown.text}</span>
        )}
      </p>
      <p className="m-0 mt-0.5 truncate font-mono text-[10px] text-cyan-500" title={account}>
        {truncateAddress(account)}
      </p>
    </div>
  );
}
