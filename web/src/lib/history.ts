import type { HistoryItem } from "./types";

const KEY = "outer-rim.transfers.v1";

export function loadHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 40)));
}

export function upsertHistory(item: HistoryItem) {
  const items = loadHistory();
  const next = [item, ...items.filter((i) => i.id !== item.id)];
  saveHistory(next);
  return next;
}
