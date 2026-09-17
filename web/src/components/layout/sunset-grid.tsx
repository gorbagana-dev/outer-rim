export function SunsetGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -ml-[210px] rounded-full opacity-90 bg-[var(--gradient-sunset)]" />
      <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -ml-[210px] rounded-full bg-[var(--gradient-sunset-stripes)]" />
      <div
        className="absolute -left-[200px] -right-[200px] bottom-0 h-[300px] opacity-80 origin-bottom"
        style={{
          backgroundImage: "var(--bg-grid)",
          backgroundSize: "56px 56px",
          transform: "perspective(400px) rotateX(58deg)",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--void-1)]" />
    </div>
  );
}
