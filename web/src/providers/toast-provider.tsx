"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Toast, ToastViewport } from "@/components/ui/toast";

type Tone = "success" | "info" | "warning" | "danger" | "gor";

type ToastItem = {
  id: string;
  tone: Tone;
  title: string;
  description?: string;
};

type Ctx = {
  push: (toast: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<Ctx | null>(null);

export function useToasts() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToasts must be used inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setItems((prev) => [...prev, { ...toast, id }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 5200);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport>
        {items.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            title={t.title}
            description={t.description}
            onDismiss={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
          />
        ))}
      </ToastViewport>
    </ToastContext.Provider>
  );
}
