"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tag } from "@/components/ui/tag";
import { WalletModal } from "@/components/wallet/wallet-modal";
import { ReviewDialog } from "./review-dialog";
import { StatusPanel } from "./status-panel";
import { CHAINS, GOR_DECIMALS, OTHER_CHAIN, type ChainId } from "@/lib/chains";
import { formatTokenAmount, parseHumanAmount } from "@/lib/format";
import { isValidPubkey, truncateAddress } from "@/lib/address";
import { sendWarpTransfer } from "@/lib/transfer";
import { humanError, WALLET_REJECTED } from "@/lib/errors";
import type { HistoryItem } from "@/lib/types";
import { useBalances } from "@/hooks/use-balances";
import { useBridgeConfig } from "@/providers/config-provider";
import { useToasts } from "@/providers/toast-provider";
import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowDownUp, Recycle, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";

function parseChain(value: string | null): ChainId {
  return value === "solana" ? "solana" : "gorchain";
}

export function BridgeCard({
  onHistoryItem,
}: {
  onHistoryItem: (item: HistoryItem) => void;
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

  const balances = useBalances(origin, config);

  useEffect(() => {
    if (publicKey && !recipientTouched) {
      setRecipient(publicKey.toBase58());
    }
  }, [publicKey, recipientTouched]);

  useEffect(() => {
    const next = new URLSearchParams(params.toString());
    next.set("from", origin);
    next.set("to", destination);
    if (amount) next.set("amount", amount);
    else next.delete("amount");
    router.replace(`?${next.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin, destination, amount]);

  const parsed = parseHumanAmount(amount);
  const originDecimals = GOR_DECIMALS[origin];
  const receive = parsed
    ? formatTokenAmount(parsed, { context: "detailed", tokenDecimals: originDecimals })
    : null;

  function validate() {
    let ok = true;
    if (!parsed || Number(parsed) <= 0) {
      setAmountError("Enter an amount greater than 0.");
      ok = false;
    } else if (balances.gor && Number(parsed) > Number(balances.gor.human)) {
      setAmountError("Amount is above your $GOR balance.");
      ok = false;
    } else {
      setAmountError(undefined);
    }
    if (!isValidPubkey(recipient)) {
      setRecipientError("That is not a valid Solana / Gorchain address.");
      ok = false;
    } else {
      setRecipientError(undefined);
    }
    return ok;
  }

  function swap() {
    setOrigin(destination);
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
    try {
      const { signature } = await sendWarpTransfer({
        config,
        origin,
        destination,
        amountHuman: parsed ?? amount,
        recipient,
        wallet,
        onStatus: (status, sig) => {
          const next = { ...item, status, originTx: sig ?? item.originTx, updatedAt: Date.now() };
          setActive(next);
          onHistoryItem(next);
        },
      });
      const waiting: HistoryItem = {
        ...item,
        originTx: signature,
        status: "waiting-relayer",
        updatedAt: Date.now(),
      };
      setActive(waiting);
      onHistoryItem(waiting);
      setReview(false);
      push({
        tone: "success",
        title: "Locked on origin",
        description: "Waiting on the relayer to dump it on the far lid.",
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
        status: "failed",
        error: msg,
        updatedAt: Date.now(),
      };
      setActive(failed);
      onHistoryItem(failed);
      push({ tone: "danger", title: "Transfer failed", description: msg });
    }
  }

  const balanceText = balances.loading
    ? null
    : balances.gor
      ? formatTokenAmount(balances.gor.human, { context: "compact", tokenDecimals: originDecimals })
      : null;

  const submitDisabled = Boolean(amountError || recipientError) && (amount.length > 0 || recipientTouched);
  const ctaBusy = Boolean(
    active && ["signing", "submitted", "confirming"].includes(active.status),
  );

  const routeHint = useMemo(() => {
    if (!config.routeReady) {
      return "Warp programs are not configured yet. The form still works; sending waits on deploy.";
    }
    return origin === "gorchain"
      ? "Locks native $GOR on Gorchain. Unlocks SPL $GOR from the Solana escrow."
      : "Locks SPL $GOR on Solana. Unlocks native $GOR from the Gorchain collateral PDA.";
  }, [config.routeReady, origin]);

  return (
    <>
      <Card variant="neon" accent="acid" padding="p-0" className="relative">
        <form
          className="p-5 md:p-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!validate()) {
              const first = document.getElementById(amountError ? amountId : recipientId) as
                | HTMLInputElement
                | null;
              first?.focus();
              return;
            }
            if (!connected) {
              setWalletOpen(true);
              return;
            }
            setReview(true);
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-pink-500">
                Hyperlane warp
              </p>
              <h2 className="m-0 font-display text-[28px] uppercase leading-none text-[var(--text-primary)]">
                Bridge $GOR
              </h2>
            </div>
            <Tag variant="sticker" tilt={-3}>
              1:1
            </Tag>
          </div>

          <ChainRow
            label="From"
            chain={origin}
            balance={balanceText}
            loading={balances.loading}
            error={balances.error}
            onRetry={balances.refresh}
          />

          <Input
            id={amountId}
            name="amount"
            label="Amount"
            hint="Same $GOR on the far side. Decimals: 9 native / 6 SPL."
            error={amountError}
            placeholder="0.00"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            mono
            inputSize="lg"
            suffix="$GOR"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setAmountError(undefined);
            }}
            onBlur={() => {
              if (amount) validate();
            }}
          />
          <div className="flex justify-end -mt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!balances.gor || balances.gor.human === "0"}
              onClick={() => {
                setAmount(balances.maxHuman);
                setAmountError(undefined);
              }}
            >
              Max
            </Button>
          </div>

          <div className="flex justify-center -my-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              aria-label="Swap origin and destination"
              onClick={swap}
              iconLeft={<ArrowDownUp size={16} aria-hidden />}
            >
              Swap
            </Button>
          </div>

          <ChainRow label="To" chain={destination} receive={receive} />

          <Input
            id={recipientId}
            name="recipient"
            label="Recipient"
            hint="Defaults to your connected wallet. Same pubkey on both SVM chains."
            error={recipientError}
            placeholder="Gorchain / Solana address"
            autoComplete="off"
            spellCheck={false}
            mono
            value={recipient}
            onChange={(e) => {
              setRecipientTouched(true);
              setRecipient(e.target.value);
              setRecipientError(undefined);
            }}
            onBlur={() => {
              setRecipientTouched(true);
              if (recipient) validate();
            }}
          />

          <p className="m-0 text-sm text-[var(--text-muted)]">{routeHint}</p>

          {!connected ? (
            <Button
              type="button"
              size="lg"
              fullWidth
              loading={connecting}
              iconLeft={<Wallet size={18} aria-hidden />}
              onClick={() => setWalletOpen(true)}
            >
              Connect wallet
            </Button>
          ) : (
            <Button
              type="submit"
              size="lg"
              fullWidth
              disabled={submitDisabled || ctaBusy}
              loading={ctaBusy}
              iconLeft={<Recycle size={18} aria-hidden />}
            >
              {config.routeReady ? "Bridge $GOR" : "Route not deployed"}
            </Button>
          )}
        </form>
      </Card>

      <StatusPanel item={active} onDismiss={() => setActive(null)} />

      <ReviewDialog
        open={review}
        onClose={() => setReview(false)}
        onConfirm={() => void confirm()}
        origin={origin}
        destination={destination}
        amount={parsed ?? amount}
        recipient={recipient}
        sender={publicKey?.toBase58() ?? ""}
        busy={ctaBusy}
      />
      <WalletModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </>
  );
}

function ChainRow({
  label,
  chain,
  balance,
  receive,
  loading,
  error,
  onRetry,
}: {
  label: string;
  chain: ChainId;
  balance?: { text: string; aria: string } | null;
  receive?: { text: string; aria: string } | null;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const meta = CHAINS[chain];
  return (
    <div className="flex items-center gap-3 rounded-md border border-[var(--border-default)] bg-[var(--void-0)] px-3 py-3">
      <img src={meta.mark} alt="" width={40} height={40} className="rounded-sm shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="m-0 font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {label}
        </p>
        <p className="m-0 font-bold text-[var(--text-primary)]">{meta.displayName}</p>
      </div>
      <div className="text-right">
        {loading && <div className="skeleton h-5 w-20 rounded-xs ml-auto" />}
        {!loading && balance && (
          <p className="m-0 font-mono text-sm tabular text-[var(--text-secondary)]">
            <span aria-label={balance.aria}>{balance.text}</span> $GOR
          </p>
        )}
        {!loading && error && (
          <button type="button" onClick={onRetry} className="text-xs text-[var(--status-danger)]">
            Retry balance
          </button>
        )}
        {receive && (
          <p className="m-0 font-mono text-sm tabular text-acid-500">
            <span aria-label={receive.aria}>{receive.text}</span> $GOR
          </p>
        )}
        <p className="m-0 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          {chain === "gorchain" ? "Native · 9 dec" : "SPL · 6 dec"}
        </p>
      </div>
    </div>
  );
}
