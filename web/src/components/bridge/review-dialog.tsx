"use client";

import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { CHAINS, GOR_DECIMALS, explorerAddressUrl, type ChainId } from "@/lib/chains";
import { formatTokenAmount } from "@/lib/format";
import { truncateAddress } from "@/lib/address";
import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useBridgeConfig } from "@/providers/config-provider";

export function ReviewDialog({
  open,
  onClose,
  onConfirm,
  origin,
  destination,
  amount,
  recipient,
  sender,
  busy,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  origin: ChainId;
  destination: ChainId;
  amount: string;
  recipient: string;
  sender: string;
  busy: boolean;
}) {
  const config = useBridgeConfig();
  const [copied, setCopied] = useState<string | null>(null);
  const shown = formatTokenAmount(amount, {
    context: "detailed",
    tokenDecimals: GOR_DECIMALS[origin],
  });
  const mismatch = sender && recipient && sender !== recipient;

  return (
    <Dialog
      open={open}
      onClose={busy ? () => undefined : onClose}
      eyebrow="Customs inspection"
      title="Dump this $GOR?"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={onConfirm} loading={busy} iconRight={null}>
            {busy ? "Signing" : "Sign and send"}
          </Button>
        </>
      }
    >
      <dl className="m-0 grid gap-3 text-sm">
        <Row label="From" value={CHAINS[origin].displayName} />
        <Row label="To" value={CHAINS[destination].displayName} />
        <Row
          label="Amount"
          value={
            <span className="font-mono tabular text-[var(--text-primary)]">
              <span aria-label={shown.aria}>{shown.text}</span> $GOR
            </span>
          }
        />
        <Row
          label="You receive"
          value={
            <span className="font-mono tabular text-acid-500">
              <span aria-label={shown.aria}>{shown.text}</span> $GOR
            </span>
          }
        />
        <Row
          label="Recipient"
          value={
            <span className="inline-flex items-center gap-1">
              <button
                type="button"
                className="font-mono text-cyan-500"
                onClick={async () => {
                  await navigator.clipboard.writeText(recipient);
                  setCopied("recipient");
                  setTimeout(() => setCopied(null), 1000);
                }}
                title={recipient}
              >
                {copied === "recipient" ? "Copied" : truncateAddress(recipient)}
              </button>
              <a
                href={explorerAddressUrl(
                  destination,
                  recipient,
                  destination === "solana" ? config.solanaExplorer : config.gorchainExplorer,
                )}
                target="_blank"
                rel="noreferrer"
                aria-label="Open recipient on explorer"
              >
                <ExternalLink size={12} aria-hidden />
              </a>
            </span>
          }
        />
      </dl>
      {mismatch && (
        <p className="mt-4 mb-0 text-sm text-[var(--yellow-500)]">
          Recipient is not your connected wallet. Confirm the address before you sign.
        </p>
      )}
      <ul className="mt-4 mb-0 pl-4 text-sm text-[var(--text-muted)] space-y-1">
        <li>This calls the Hyperlane warp program on {CHAINS[origin].shortName}.</li>
        <li>Sealevel does not quote interchain gas. Relayer enforcement is off.</li>
        {origin === "gorchain" && (
          <li>Unlocks on Solana come from SPL already sitting in the escrow. Dry escrow means a stuck message.</li>
        )}
        <li>ISM is 1-of-1. One validator key authorizes the far side.</li>
      </ul>
      <p className="mt-3 mb-0 text-[11px] font-mono text-[var(--text-muted)] inline-flex items-center gap-1">
        <Copy size={12} aria-hidden /> Copy gives the raw amount {shown.copy || amount}
      </p>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="font-body text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="m-0 text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
