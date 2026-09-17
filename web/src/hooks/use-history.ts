"use client";

import { loadHistory, upsertHistory } from "@/lib/history";
import type { HistoryItem } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  const save = useCallback((item: HistoryItem) => {
    setItems(upsertHistory(item));
  }, []);

  return { items, save };
}
