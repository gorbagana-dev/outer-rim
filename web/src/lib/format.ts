const SUBSCRIPT = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

function subscript(n: number) {
  return String(n)
    .split("")
    .map((d) => SUBSCRIPT[Number(d)] ?? d)
    .join("");
}

function leadingZerosAfterDecimal(value: string) {
  const [, frac = ""] = value.split(".");
  let n = 0;
  for (const ch of frac) {
    if (ch === "0") n += 1;
    else break;
  }
  return n;
}

function trimTrailingZeros(value: string) {
  if (!value.includes(".")) return value;
  return value.replace(/\.?0+$/, "");
}

function toNumber(raw: string | number | bigint | null | undefined): number | null {
  if (raw == null) return null;
  if (typeof raw === "bigint") return Number(raw);
  if (typeof raw === "number") return Number.isFinite(raw) ? raw : null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function formatTokenAmount(
  human: string | number | bigint | null | undefined,
  opts: {
    context?: "compact" | "detailed";
    tokenDecimals?: number;
    tokenPriceUsd?: number;
  } = {},
): { text: string; aria: string; copy: string } {
  const context = opts.context ?? "compact";
  const n = toNumber(human);
  if (n == null || !Number.isFinite(n)) {
    return { text: "--", aria: "unavailable", copy: "" };
  }
  if (Object.is(n, -0) || n === 0) {
    return { text: "0", aria: "0", copy: "0" };
  }

  const abs = Math.abs(n);
  const sign = n < 0 ? "-" : "";
  const raw = abs.toString();

  if (context === "compact" && abs >= 1_000) {
    const units = [
      { v: 1e12, s: "T" },
      { v: 1e9, s: "B" },
      { v: 1e6, s: "M" },
      { v: 1e3, s: "K" },
    ];
    for (const u of units) {
      if (abs >= u.v) {
        const q = abs / u.v;
        const t = `${sign}${trimTrailingZeros(q.toFixed(1))}${u.s}`;
        return { text: t, aria: t, copy: String(n) };
      }
    }
  }

  const zeros = leadingZerosAfterDecimal(raw);
  if (zeros >= 3 && abs < 1) {
    const frac = raw.split(".")[1] ?? "";
    const digits = frac.slice(zeros);
    const sig = context === "compact" ? 2 : 4;
    const shown = digits.slice(0, sig) || "0";
    const text = `${sign}0.0${subscript(zeros)}${shown}`;
    return { text, aria: String(n), copy: String(n) };
  }

  let decimals = context === "detailed" ? (opts.tokenDecimals ?? 9) : 4;
  if (opts.tokenPriceUsd && opts.tokenPriceUsd > 0) {
    const threshold = context === "compact" ? 0.01 : 0.0001;
    const computed = Math.ceil(-Math.log10(threshold / opts.tokenPriceUsd));
    const clamp = context === "compact" ? [0, 6] : [0, 12];
    decimals = Math.min(clamp[1], Math.max(clamp[0], computed));
  }
  if (abs >= 1000 && context === "compact") decimals = Math.min(decimals, 2);
  if (abs >= 1 && context === "compact") decimals = Math.min(decimals, 4);

  const rounded = Number(abs.toFixed(decimals));
  if (rounded === 0) {
    const tiny = context === "compact" ? "<0.001" : `<${Math.pow(10, -decimals)}`;
    return { text: `${sign}${tiny.replace("-", "")}`, aria: String(n), copy: String(n) };
  }

  const [int, frac] = rounded.toFixed(decimals).split(".");
  const intFmt = Number(int).toLocaleString("en-US");
  const text = frac && frac.replace(/0+$/, "").length
    ? `${sign}${intFmt}.${frac.replace(/0+$/, "")}`
    : `${sign}${intFmt}`;
  return { text, aria: text, copy: String(n) };
}

export function parseHumanAmount(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  return trimmed;
}

export function humanToBaseUnits(human: string, decimals: number): bigint {
  const [int = "0", frac = ""] = human.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(int) * 10n ** BigInt(decimals) + BigInt(fracPadded || "0");
}

export function baseUnitsToHuman(amount: bigint, decimals: number): string {
  const neg = amount < 0n;
  const abs = neg ? -amount : amount;
  const base = 10n ** BigInt(decimals);
  const int = abs / base;
  const frac = (abs % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  const body = frac ? `${int}.${frac}` : `${int}`;
  return neg ? `-${body}` : body;
}
