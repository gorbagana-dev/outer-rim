export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span
      className="font-display uppercase text-acid-500 [text-shadow:var(--text-glow-acid)] leading-none tracking-[0.02em]"
      style={{ fontSize: size }}
    >
      Gorbagana
    </span>
  );
}
