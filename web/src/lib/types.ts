import { GOR_MINT, type ChainId } from "./chains";

export type PublicBridgeConfig = {
  gorchainRpc: string;
  solanaRpc: string;
  gorchainMailbox: string;
  solanaMailbox: string;
  gorchainWarp: string;
  solanaWarp: string;
  gorMint: string;
  explorerUrl: string;
  gorchainExplorer: string;
  solanaExplorer: string;
  routeReady: boolean;
};

export type TransferStatus =
  | "idle"
  | "review"
  | "signing"
  | "submitted"
  | "confirming"
  | "waiting-relayer"
  | "delivered"
  | "failed";

export type HistoryItem = {
  id: string;
  origin: ChainId;
  destination: ChainId;
  amount: string;
  recipient: string;
  sender: string;
  originTx?: string;
  destinationTx?: string;
  status: TransferStatus;
  error?: string;
  createdAt: number;
  updatedAt: number;
};

export function emptyConfig(): PublicBridgeConfig {
  return {
    gorchainRpc: "/api/rpc/gorchain",
    solanaRpc: "/api/rpc/solana",
    gorchainMailbox: "",
    solanaMailbox: "",
    gorchainWarp: "",
    solanaWarp: "",
    gorMint: GOR_MINT,
    explorerUrl: "",
    gorchainExplorer: "https://scan.gorbagana.wtf",
    solanaExplorer: "https://solscan.io",
    routeReady: false,
  };
}

export function isPubkeyLike(value: string | undefined): boolean {
  return Boolean(value && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value));
}
