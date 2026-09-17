import { Wordmark } from "./wordmark";

const SLOGANS = [
  "BUILD. DUMP. REPEAT.",
  "GAS: $GOR",
  "TRASH HAS FINALITY",
  "WELCOME TO THE LANDFILL",
  "NO ROADMAP. CHECK THE DUMPSTER.",
  "SAME TRASH, DIFFERENT VIBES",
];

export function Marquee() {
  const items = [...SLOGANS, ...SLOGANS];
  return (
    <div className="marquee overflow-hidden border-y border-pink-500 bg-[var(--void-0)] py-2.5 whitespace-nowrap">
      <div className="marquee-track inline-flex gap-12 font-display text-base text-pink-500 [text-shadow:var(--text-glow-pink)]">
        {items.map((t, i) => (
          <span key={`${t}-${i}`}>
            {t} <span className="text-acid-500 mx-2">✕</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] px-8 pt-12 pb-8 bg-[var(--void-0)]">
      <div className="mx-auto max-w-container grid gap-8 md:grid-cols-[2fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Wordmark size={28} />
          <p className="m-0 max-w-xs text-sm text-[var(--text-muted)]">
            Outer Rim is the scrap-metal border between Gorchain and Solana. Native $GOR in. SPL $GOR
            out. Serious lock. Unserious lid.
          </p>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
            Network
          </div>
          <a href="https://www.gorbagana.wtf/" target="_blank" rel="noreferrer">
            Gorbagana
          </a>
          <a href="https://docs.gorbagana.wtf/" target="_blank" rel="noreferrer">
            Docs
          </a>
          <a href="https://github.com/hyperlane-xyz/hyperlane-warp-ui-template" target="_blank" rel="noreferrer">
            Warp UI reference
          </a>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
            Facts
          </div>
          <p className="m-0 text-sm text-[var(--text-secondary)]">
            SPL mint <span className="font-mono text-cyan-500">71Jvq4…FELvg</span>
          </p>
          <p className="m-0 text-sm text-[var(--text-muted)]">9 decimals on Gorchain. 6 on Solana. 1:1 $GOR.</p>
        </div>
      </div>
      <div className="mx-auto max-w-container mt-10 pt-5 border-t border-[var(--border-subtle)] flex flex-col gap-2 sm:flex-row sm:justify-between font-mono text-[11px] text-[var(--text-muted)]">
        <span>Outer Rim · no roadmap, check the dumpster</span>
        <span>THE CHAIN IS TRASH. THAT&apos;S THE POINT.</span>
      </div>
    </footer>
  );
}
