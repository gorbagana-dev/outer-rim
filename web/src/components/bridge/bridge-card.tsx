"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { WalletModal } from "@/components/wallet/wallet-modal";
import { ReviewDialog } from "./review-dialog";
import { StatusPanel } from "./status-panel";
import { CHAINS, GOR_DECIMALS, OTHER_CHAIN, type ChainId } from "@/lib/chains";
import { GORCHAIN_TX_FEE_HUMAN } from "@/lib/deployed";
import { quoteOriginFee, type OriginFee } from "@/lib/fee";
import { baseUnitsToHuman, formatTokenAmount, humanToBaseUnits, parseHumanAmount } from "@/lib/format";
import { isValidPubkey } from "@/lib/address";
import { findDestinationTx } from "@/lib/delivery";
import { sendWarpTransfer } from "@/lib/transfer";
import { humanError, WALLET_REJECTED } from "@/lib/errors";
import type { HistoryItem } from "@/lib/types";
import { portionHuman, useBalances } from "@/hooks/use-balances";
import { useBridgeConfig } from "@/providers/config-provider";
import { useToasts } from "@/providers/toast-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { ChevronsDown, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

function parseChain(value: string | null): ChainId {
  return value === "solana" ? "solana" : "gorchain";
}

const SHARES = [
  { label: "25%", bps: 2_500 },
  { label: "50%", bps: 5_000 },
  { label: "Max", bps: 10_000 },
] as const;

export function BridgeCard({
  onHistoryItem,
  items = [],
  focusId = null,
}: {
  onHistoryItem: (item: HistoryItem) => void;
  items?: HistoryItem[];
  focusId?: string | null;
}) {
  const config = useBridgeConfig();
  const params = useSearchParams();
  const router = useRouter();
  const amountId = useId();
  const recipientId = useId();
  const { publicKey, connected, connecting } = useWallet();
  const wallet = useWallet();
  const { push } = useToasts();

  const [origin, setOrigin] = useState<ChainId>(parseChain(params.get("from")));
  const destination = OTHER_CHAIN[origin];
  const [amount, setAmount] = useState(params.get("amount") ?? "");
  const [recipient, setRecipient] = useState("");
  const [recipientTouched, setRecipientTouched] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [review, setReview] = useState(false);
  const [active, setActive] = useState<HistoryItem | null>(null);
  const [amountError, setAmountError] = useState<string | undefined>();
  const [recipientError, setRecipientError] = useState<string | undefined>();
  const [flip, setFlip] = useState(0);
  const [originFee, setOriginFee] = useState<OriginFee | null>(null);
  const [feeLoading, setFeeLoading] = useState(false);

  const balances = useBalances(origin, config);

  useEffect(() => {
    if (!publicKey || !config.routeReady) {
      setOriginFee(null);
      setFeeLoading(false);
      return;
    }
    let alive = true;
    setFeeLoading(true);
    quoteOriginFee({
      config,
      origin,
      destination,
      sender: publicKey.toBase58(),
    })
      .then((fee) => {
        if (alive) setOriginFee(fee);
      })
      .catch(() => {
        if (alive) setOriginFee(null);
      })
      .finally(() => {
        if (alive) setFeeLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [publicKey, origin, destination, config]);
  const lastFocus = useRef<string | null>(null);
  const fillOnConnect = useRef(false);

  function fillRecipient(address: string) {
    setRecipient(address);
    setRecipientTouched(true);
    setRecipientError(undefined);
  }

  function fillFromWallet() {
    if (!publicKey) {
      fillOnConnect.current = true;
      setWalletOpen(true);
      return;
    }
    fillRecipient(publicKey.toBase58());
  }

  useEffect(() => {
    if (!publicKey || !fillOnConnect.current) return;
    fillOnConnect.current = false;
    fillRecipient(publicKey.toBase58());
  }, [publicKey]);

  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    next.set("from", origin);
    next.set("to", destination);
    if (amount) next.set("amount", amount);
    else next.delete("amount");
    router.replace(`?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination, amount]);

  useEffect(() => {
    if (!focusId || focusId === lastFocus.current) return;
    lastFocus.current = focusId;
    const found = items.find((item) => item.id === focusId);
    if (!found) return;
    setActive(found);
    setReview(false);
    document.getElementById("bridge-terminal")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focusId, items]);

  useEffect(() => {
    setActive((current) => {
      if (!current) return current;
      const newer = items.find((item) => item.id === current.id);
      if (!newer || newer.updatedAt < current.updatedAt) return current;
      if (
        newer.status === current.status &&
        newer.originTx === current.originTx &&
        newer.destinationTx === current.destinationTx &&
        newer.error === current.error
      ) {
        return current;
      }
      return newer;
    });
  }, [items]);

  const parsed = parseHumanAmount(amount);
  const originDecimals = GOR_DECIMALS[origin];
  const receive = parsed
    ? formatTokenAmount(parsed, { context: "detailed", tokenDecimals: GOR_DECIMALS[destination] })
    : null;

  function validate(requireRecipient: boolean) {
    let ok = true;
    if (!parsed || Number(parsed) <= 0) {
      setAmountError("Enter an amount greater than 0.");
      ok = false;
    } else if (balances.gor && Number(parsed) > Number(balances.gor.human)) {
      setAmountError("That is more $GOR than this wallet holds.");
      ok = false;
    } else {
      setAmountError(undefined);
    }
    if (requireRecipient) {
      if (!isValidPubkey(recipient)) {
        setRecipientError("That is not a valid address.");
        ok = false;
      } else {
        setRecipientError(undefined);
      }
    }
    return ok;
  }

  function swap() {
    setFlip((n) => n + 180);
    setOrigin(destination);
    setAmountError(undefined);
  }

  function onAmountChange(raw: string) {
    const cleaned = raw.replace(/[^\d.]/g, "");
    const [whole = "", ...rest] = cleaned.split(".");
    const frac = rest.join("").slice(0, originDecimals);
    const next = cleaned.includes(".") ? `${whole}.${frac}` : whole;
    setAmount(next);
    setAmountError(undefined);
  }

  async function confirm() {
    if (!publicKey) return;
    const item: HistoryItem = {
      id: `${Date.now()}`,
      origin,
      destination,
      amount: parsed ?? amount,
      recipient,
      sender: publicKey.toBase58(),
      status: "signing",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setActive(item);
    onHistoryItem(item);
    let originTx: string | undefined;
    try {
      const { signature } = await sendWarpTransfer({
        config,
        origin,
        destination,
        amountHuman: parsed ?? amount,
        recipient,
        wallet,
        onStatus: (status, sig) => {
          if (sig) originTx = sig;
          const next = { ...item, status, originTx, updatedAt: Date.now() };
          setActive(next);
          onHistoryItem(next);
        },
      });
      const landed: HistoryItem = {
        ...item,
        originTx: signature,
        status: "delivered",
        updatedAt: Date.now(),
      };
      setActive(landed);
      onHistoryItem(landed);
      setReview(false);
      push({
        tone: "success",
        title: "Landed",
        description: `$GOR is on ${CHAINS[destination].shortName}.`,
      });
      void findDestinationTx({
        config,
        origin,
        destination,
        originTx: signature,
        poll: true,
      }).then((destinationTx) => {
        if (!destinationTx) return;
        const next = { ...landed, destinationTx, updatedAt: Date.now() };
        setActive((current) => (current?.id === landed.id ? next : current));
        onHistoryItem(next);
      });
    } catch (error) {
      const msg = humanError(error);
      if (msg === WALLET_REJECTED) {
        setReview(false);
        setActive(null);
        return;
      }
      const failed: HistoryItem = {
        ...item,
        originTx,
        status: "failed",
        error: msg,
        updatedAt: Date.now(),
      };
      setActive(failed);
      onHistoryItem(failed);
      setReview(false);
      push({ tone: "danger", title: "Transfer failed", description: msg });
    }
  }

  const balanceText = balances.loading
    ? null
    : balances.gor
      ? formatTokenAmount(balances.gor.human, { context: "compact", tokenDecimals: originDecimals })
      : null;

  const feeShort = originFeeShort(origin, originFee, balances.native, balances.gor?.raw ?? null, parsed);
  const submitDisabled = Boolean(amountError || recipientError) && (amount.length > 0 || recipientTouched);
  const ctaBusy = Boolean(active && ["signing", "submitted", "confirming"].includes(active.status));
  const showChute = Boolean(
    active && !review && !["idle", "review"].includes(active.status),
  );
  const canFill = Boolean(balances.gor && balances.gor.raw > 0n);

  const accent = !showChute || !active ? "acid" : active.status === "failed" ? "pink" : "cyan";

  return (
    <>
      <Card id="bridge-terminal" variant="neon" accent={accent} padding="p-0" className="relative h-full">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-2.5">
          <div>
            <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
              The chute
            </p>
            <h2 className="title-neon m-0 font-display text-[26px] uppercase leading-none tracking-[0.01em]">
              Bridge $GOR
            </h2>
          </div>
          <Tag variant="sticker" tilt={-2}>
            1:1
          </Tag>
        </div>

        {showChute && active ? (
          <div className="flex min-h-0 flex-1 flex-col p-4 md:p-5">
            <StatusPanel item={active} onNew={() => setActive(null)} />
          </div>
        ) : (
          <form
            className="flex min-h-0 flex-1 flex-col gap-2.5 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!config.routeReady) return;
              if (!connected) {
                if (!validate(false)) {
                  document.getElementById(amountId)?.focus();
                  return;
                }
                setWalletOpen(true);
                return;
              }
              if (!validate(true) || feeShort) {
                const first = document.getElementById(amountError ? amountId : recipientId) as
                  | HTMLInputElement
                  | null;
                first?.focus();
                return;
              }
              setReview(true);
            }}
          >
            <div className="relative flex flex-col">
              <Bin label="From" chain={origin} edge="from" active>
                <label className="sr-only" htmlFor={amountId}>
                  Amount
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    id={amountId}
                    name="amount"
                    inputMode="decimal"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="0.00"
                    value={amount}
                    aria-invalid={amountError ? true : undefined}
                    aria-describedby={amountError ? `${amountId}-error` : undefined}
                    onChange={(e) => onAmountChange(e.target.value)}
                    onBlur={() => {
                      if (amount) validate(false);
                    }}
                    className="min-w-0 flex-1 border-0 bg-transparent font-mono text-[28px] leading-none tabular text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                  />
                  <span className="shrink-0 font-display text-lg text-pink-500 [text-shadow:var(--text-glow-pink)]">
                    $GOR
                  </span>
                </div>
                {amountError && (
                  <p id={`${amountId}-error`} className="m-0 mt-2 text-xs text-[var(--status-danger)]">
                    {amountError}
                  </p>
                )}
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <p className="m-0 min-w-0 truncate text-xs text-[var(--text-muted)]">
                    {balances.loading && <span className="skeleton inline-block h-3 w-24 rounded-xs align-middle" />}
                    {!balances.loading && !connected && "Connect to read a balance"}
                    {!balances.loading && connected && balanceText && (
                      <>
                        Balance{" "}
                        <span className="font-mono tabular text-[var(--text-secondary)]" aria-label={balanceText.aria}>
                          {balanceText.text}
                        </span>
                      </>
                    )}
                    {!balances.loading && connected && balances.error && (
                      <button type="button" onClick={balances.refresh} className="text-[var(--status-danger)]">
                        Retry balance
                      </button>
                    )}
                  </p>
                  <div className="flex shrink-0 gap-1">
                    {SHARES.map((share) => (
                      <button
                        key={share.label}
                        type="button"
                        disabled={!canFill}
                        onClick={() => {
                          if (!balances.gor) return;
                          setAmount(portionHuman(balances.gor.raw, origin, share.bps));
                          setAmountError(undefined);
                        }}
                        title={
                          share.bps === 10_000 && origin === "gorchain"
                            ? `Leaves ${GORCHAIN_TX_FEE_HUMAN} $GOR for the network fee`
                            : undefined
                        }
                        className="h-6 rounded-xs border border-[var(--border-default)] px-2 font-body text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--text-secondary)] motion-safe:transition-[border-color,color,transform] motion-safe:duration-fast hover:border-acid-500 hover:text-acid-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {share.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Bin>

              <div className="relative z-10 -my-4 flex justify-center">
                <button
                  type="button"
                  aria-label="Flip direction"
                  onClick={swap}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-acid-500 bg-[var(--surface-1)] text-acid-500 shadow-acid motion-safe:transition-[box-shadow,transform] motion-safe:duration-fast hover:shadow-acid-strong active:scale-95"
                >
                  <ChevronsDown
                    size={18}
                    aria-hidden
                    className="motion-safe:transition-transform motion-safe:duration-slow motion-safe:ease-snap"
                    style={{ transform: `rotate(${flip}deg)` }}
                  />
                </button>
              </div>

              <Bin label="To" chain={destination} edge="to">
                <p className="m-0 flex items-baseline gap-2">
                  <span
                    className={`min-w-0 flex-1 font-mono text-[28px] leading-none tabular ${receive ? "text-acid-500 [text-shadow:var(--text-glow-acid)]" : "text-[var(--text-muted)]"}`}
                    aria-label={receive ? receive.aria : "Enter an amount"}
                  >
                    {receive ? receive.text : "0.00"}
                  </span>
                  <span className="shrink-0 font-display text-lg text-pink-500 [text-shadow:var(--text-glow-pink)]">
                    $GOR
                  </span>
                </p>
              </Bin>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                className="shrink-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-500"
                onClick={fillFromWallet}
              >
                Use my wallet
              </button>
            </div>

            <Input
              id={recipientId}
              name="recipient"
              label="Recipient"
              error={recipientError}
              placeholder="Gorchain or Solana address"
              autoComplete="off"
              spellCheck={false}
              mono
              value={recipient}
              onChange={(e) => {
                setRecipientTouched(true);
                setRecipient(e.target.value.trim());
                setRecipientError(undefined);
              }}
              onBlur={() => {
                setRecipientTouched(true);
                if (recipient) validate(true);
              }}
            />

            <div className="mt-auto flex flex-col gap-2.5">
            <p className="m-0 flex items-baseline justify-between gap-3">
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Fee
              </span>
              <span className="font-mono text-sm tabular text-[var(--text-primary)]">
                {feeLoading && <span className="skeleton inline-block h-3 w-16 rounded-xs align-middle" />}
                {!feeLoading && originFee && (
                  <>
                    {originFee.text}{" "}
                    <span
                      className={
                        originFee.symbol === "SOL"
                          ? "font-display text-cyan-500"
                          : "font-display text-pink-500 [text-shadow:var(--text-glow-pink)]"
                      }
                    >
                      {originFee.symbol}
                    </span>
                  </>
                )}
                {!feeLoading && !originFee && <span className="text-[var(--text-muted)]">—</span>}
              </span>
            </p>
            {feeShort && (
              <p className="m-0 text-xs text-[var(--status-danger)]">{feeShort}</p>
            )}

            {!config.routeReady ? (
              <Button type="submit" size="md" fullWidth disabled>
                Route not deployed
              </Button>
            ) : !connected ? (
              <Button
                type="submit"
                size="md"
                fullWidth
                loading={connecting}
                iconLeft={<Wallet size={18} aria-hidden />}
              >
                Connect wallet
              </Button>
            ) : (
              <Button type="submit" size="md" fullWidth disabled={submitDisabled || ctaBusy || Boolean(feeShort)} loading={ctaBusy}>
                Send through
              </Button>
            )}
            </div>
          </form>
        )}
      </Card>

      <ReviewDialog
        open={review}
        onClose={() => setReview(false)}
        onConfirm={() => void confirm()}
        origin={origin}
        destination={destination}
        amount={parsed ?? amount}
        recipient={recipient}
        sender={publicKey?.toBase58() ?? ""}
        feeText={originFee?.text}
        feeSymbol={originFee?.symbol}
        busy={ctaBusy}
      />
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  );
}

function Bin({
  label,
  chain,
  edge,
  active,
  children,
}: {
  label: string;
  chain: ChainId;
  edge: "from" | "to";
  active?: boolean;
  children: React.ReactNode;
}) {
  const meta = CHAINS[chain];
  const kind = chain === "gorchain" ? "Native · 9 dp" : "SPL · 6 dp";
  return (
    <div
      className={`rounded-md border bg-[var(--void-0)] px-3 shadow-[var(--shadow-inset-bin)] motion-safe:transition-[border-color,box-shadow] motion-safe:duration-fast ${
        edge === "from" ? "pb-5 pt-2" : "pb-2 pt-5"
      } ${
        active
          ? "border-[var(--border-default)] focus-within:border-cyan-500 focus-within:shadow-cyan"
          : "border-[var(--border-default)]"
      }`}
    >
      <div className="mb-1 flex items-center gap-2">
        <img src={meta.mark} alt="" width={22} height={22} className="rounded-sm" />
        <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {label}
        </p>
        <p className="m-0 truncate font-bold leading-none text-[var(--text-primary)]">{meta.displayName}</p>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
          {kind}
        </span>
      </div>
      {children}
    </div>
  );
}

function originFeeShort(
  origin: ChainId,
  fee: OriginFee | null,
  native: bigint | null,
  gorRaw: bigint | null,
  amountHuman: string | null,
) {
  if (!fee) return null;
  if (origin === "solana") {
    if (native == null || native >= fee.required) return null;
    const have = formatTokenAmount(baseUnitsToHuman(native, 9), { context: "detailed", tokenDecimals: 9 });
    return `Need about ${fee.requiredText} SOL for the network fee. This wallet has ${have.text} SOL.`;
  }
  if (gorRaw == null || !amountHuman) return null;
  const amountRaw = humanToBaseUnits(amountHuman, GOR_DECIMALS.gorchain);
  if (gorRaw >= amountRaw + fee.required) return null;
  const have = formatTokenAmount(baseUnitsToHuman(gorRaw, 9), { context: "detailed", tokenDecimals: 9 });
  return `Need the amount plus about ${fee.requiredText} GOR for the network fee. This wallet has ${have.text} GOR.`;
}
