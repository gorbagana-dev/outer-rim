export function Wordmark({ size = 22 }: { size?: number }) {
  return (
    <span
      className="title-neon font-display uppercase leading-none tracking-[0.01em]"
      style={{ fontSize: size }}
    >
      Gorbagana
    </span>
  );
}
