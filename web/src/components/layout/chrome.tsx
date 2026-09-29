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
    <div className="marquee w-full min-w-0 overflow-hidden border-y border-pink-500 bg-[var(--void-0)] py-2.5 whitespace-nowrap">
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
    <footer className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--void-0)] px-4 py-2 md:px-8">
      <div className="mx-auto flex max-w-[440px] flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-between">
        <Wordmark size={18} />
        <p className="m-0 font-mono text-[11px] text-[var(--text-muted)]">
          SPL <span className="text-cyan-500">71Jvq4…FELvg</span>
          <span className="mx-2 text-[var(--text-muted)]">·</span>
          1:1
        </p>
        <div className="flex gap-4 text-sm">
          <a href="https://www.gorbagana.wtf/" target="_blank" rel="noreferrer">
            Gorbagana
          </a>
          <a href="https://docs.gorbagana.wtf/" target="_blank" rel="noreferrer">
            Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
