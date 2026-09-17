"use client";

import { ConfigProvider } from "./config-provider";
import { SvmWalletProvider } from "./svm-wallet-provider";
import { ToastProvider } from "./toast-provider";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider>
      <SvmWalletProvider>
        <ToastProvider>{children}</ToastProvider>
      </SvmWalletProvider>
    </ConfigProvider>
  );
}
