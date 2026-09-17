export type ChainId = "gorchain" | "solana";

export const GOR_MINT = "71Jvq4Epe2FCJ7JFSF7jLXdNk1Wy4Bhqd9iL6bEFELvg";
export const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

export const CHAINS: Record<
  ChainId,
  {
    id: ChainId;
    name: string;
    displayName: string;
    shortName: string;
    nativeSymbol: string;
    nativeDecimals: number;
    domainId: number;
    chainId: number;
    accent: "acid" | "cyan";
    mark: string;
  }
> = {
  gorchain: {
    id: "gorchain",
    name: "gorchain",
    displayName: "Gorbagana",
    shortName: "Gorchain",
    nativeSymbol: "GOR",
    nativeDecimals: 9,
    domainId: Number(process.env.NEXT_PUBLIC_GORCHAIN_DOMAIN_ID ?? 1198486093),
    chainId: Number(process.env.NEXT_PUBLIC_GORCHAIN_CHAIN_ID ?? 1198486093),
    accent: "acid",
    mark: "/gorbagana-mark.svg",
  },
  solana: {
    id: "solana",
    name: "solana",
    displayName: "Solana",
    shortName: "Solana",
    nativeSymbol: "SOL",
    nativeDecimals: 9,
    domainId: Number(process.env.NEXT_PUBLIC_SOLANA_DOMAIN_ID ?? 1399811149),
    chainId: Number(process.env.NEXT_PUBLIC_SOLANA_CHAIN_ID ?? 1399811149),
    accent: "cyan",
    mark: "/solana-mark.svg",
  },
};

export const OTHER_CHAIN: Record<ChainId, ChainId> = {
  gorchain: "solana",
  solana: "gorchain",
};

export const GOR_DECIMALS: Record<ChainId, number> = {
  gorchain: 9,
  solana: 6,
};

export function explorerTxUrl(chain: ChainId, signature: string, base?: string) {
  if (chain === "solana") {
    const root = base ?? process.env.NEXT_PUBLIC_SOLANA_EXPLORER ?? "https://solscan.io";
    return `${root.replace(/\/$/, "")}/tx/${signature}`;
  }
  const root = base ?? process.env.NEXT_PUBLIC_GORCHAIN_EXPLORER ?? "https://scan.gorbagana.wtf";
  return `${root.replace(/\/$/, "")}/tx/${signature}`;
}

export function explorerAddressUrl(chain: ChainId, address: string, base?: string) {
  if (chain === "solana") {
    const root = base ?? process.env.NEXT_PUBLIC_SOLANA_EXPLORER ?? "https://solscan.io";
    return `${root.replace(/\/$/, "")}/account/${address}`;
  }
  const root = base ?? process.env.NEXT_PUBLIC_GORCHAIN_EXPLORER ?? "https://scan.gorbagana.wtf";
  return `${root.replace(/\/$/, "")}/account/${address}`;
}
