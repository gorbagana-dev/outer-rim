"use client";

import { connectionFor } from "@/lib/balances";
import { isExpiryFailure, signatureFromItem, signatureOutcome } from "@/lib/confirm";
import { findDestinationTx } from "@/lib/delivery";
import { loadHistory, upsertHistory } from "@/lib/history";
import { isPubkeyLike, type HistoryItem } from "@/lib/types";
import { useBridgeConfig } from "@/providers/config-provider";
import { useCallback, useEffect, useRef, useState } from "react";

export function useHistory() {
  const config = useBridgeConfig();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const checked = useRef(new Set<string>());

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const save = useCallback((item: HistoryItem) => {
    setItems(upsertHistory(item));
  }, []);

  useEffect(() => {
    let alive = true;
    void (async () => {
      for (const item of loadHistory()) {
        if (!alive) return;
        let current = item;

        if (isExpiryFailure(item)) {
          const signature = signatureFromItem(item);
          if (!signature || checked.current.has(item.id)) continue;
          try {
            const outcome = await signatureOutcome(connectionFor(item.origin, config), signature, true);
            if (!alive) return;
            checked.current.add(item.id);
            if (outcome !== "success") continue;
            current = {
              ...item,
              originTx: signature,
              status: "delivered",
              error: undefined,
              updatedAt: Date.now(),
            };
            save(current);
          } catch {
            continue;
          }
        } else if (item.status === "waiting-relayer") {
          current = { ...item, status: "delivered", error: undefined, updatedAt: Date.now() };
          save(current);
        }

        const key = `dest:${current.id}`;
        const mailbox = current.destination === "solana" ? config.solanaMailbox : config.gorchainMailbox;
        if (
          current.status !== "delivered" ||
          !current.originTx ||
          current.destinationTx ||
          !isPubkeyLike(mailbox) ||
          checked.current.has(key)
        ) {
          continue;
        }
        try {
          const fresh = Date.now() - current.createdAt < 180_000;
          const destinationTx = await findDestinationTx({
            config,
            origin: current.origin,
            destination: current.destination,
            originTx: current.originTx,
            poll: fresh,
          });
          if (!alive) return;
          checked.current.add(key);
          if (!destinationTx) continue;
          save({ ...current, destinationTx, status: "delivered", updatedAt: Date.now() });
        } catch {
          // The trip stays landed. A later load can attach the destination signature.
        }
      }
    })();
    return () => {
      alive = false;
    };
  }, [config, save]);

  return { items, save };
}
