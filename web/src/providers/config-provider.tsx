"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { emptyConfig, type PublicBridgeConfig } from "@/lib/types";

const ConfigContext = createContext<PublicBridgeConfig>(emptyConfig());

export function useBridgeConfig() {
  return useContext(ConfigContext);
}

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PublicBridgeConfig>(emptyConfig());

  useEffect(() => {
    let alive = true;
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: PublicBridgeConfig) => {
        if (alive) setConfig({ ...emptyConfig(), ...data });
      })
      .catch(() => {
        if (alive) setConfig(emptyConfig());
      });
    return () => {
      alive = false;
    };
  }, []);

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}
