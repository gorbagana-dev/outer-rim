import type { PublicBridgeConfig } from "./types";
import { CHAINS, GOR_DECIMALS, GOR_MINT, type ChainId } from "./chains";
import { isPubkeyLike } from "./types";

type WarpHandle = {
  getTransferRemoteTxs: (args: {
    origin: ChainId;
    destination: ChainId;
    amountHuman: string;
    sender: string;
    recipient: string;
  }) => Promise<{ transaction: import("@solana/web3.js").Transaction }[]>;
};

let cached: Promise<WarpHandle> | null = null;

export function routeReady(config: PublicBridgeConfig) {
  return (
    isPubkeyLike(config.gorchainWarp) &&
    isPubkeyLike(config.solanaWarp) &&
    isPubkeyLike(config.gorchainMailbox) &&
    isPubkeyLike(config.solanaMailbox)
  );
}

function absoluteRpc(path: string) {
  if (path.startsWith("http")) return path;
  if (typeof window === "undefined") return `http://127.0.0.1:3000${path}`;
  return `${window.location.origin}${path}`;
}

export async function getWarp(config: PublicBridgeConfig): Promise<WarpHandle> {
  if (!routeReady(config)) {
    throw new Error("This Outer Rim route is not deployed yet.");
  }
  if (!cached) {
    cached = assembleWarp(config);
  }
  return cached;
}

export function resetWarp() {
  cached = null;
}

async function assembleWarp(config: PublicBridgeConfig): Promise<WarpHandle> {
  const sdk = await import("@hyperlane-xyz/sdk");
  const { ProtocolType } = await import("@hyperlane-xyz/utils");

  const MultiProtocolProvider = sdk.MultiProtocolProvider;
  const WarpCore = sdk.WarpCore;
  const TokenStandard = sdk.TokenStandard;

  const chainMetadata = {
    gorchain: {
      protocol: ProtocolType.Sealevel,
      chainId: CHAINS.gorchain.chainId,
      domainId: CHAINS.gorchain.domainId,
      name: "gorchain",
      displayName: "Gorbagana",
      mailbox: config.gorchainMailbox,
      nativeToken: { name: "GOR", symbol: "GOR", decimals: 9 },
      rpcUrls: [{ http: absoluteRpc(config.gorchainRpc) }],
      blocks: { confirmations: 1, reorgPeriod: 0, estimateBlockTime: 0.4 },
    },
    solana: {
      protocol: ProtocolType.Sealevel,
      chainId: CHAINS.solana.chainId,
      domainId: CHAINS.solana.domainId,
      name: "solana",
      displayName: "Solana",
      mailbox: config.solanaMailbox,
      nativeToken: { name: "SOL", symbol: "SOL", decimals: 9 },
      rpcUrls: [{ http: absoluteRpc(config.solanaRpc) }],
      blocks: { confirmations: 1, reorgPeriod: 0, estimateBlockTime: 0.4 },
    },
  };

  const multiProvider = new MultiProtocolProvider(chainMetadata);
  const connectionId = (chain: ChainId, address: string) =>
    `${ProtocolType.Sealevel}|${chain}|${address}`;

  const warpCore = WarpCore.FromConfig(multiProvider, {
    tokens: [
      {
        chainName: "gorchain",
        standard: TokenStandard.SealevelHypNative,
        decimals: GOR_DECIMALS.gorchain,
        symbol: "GOR",
        name: "GOR",
        addressOrDenom: config.gorchainWarp,
        connections: [{ token: connectionId("solana", config.solanaWarp) }],
      },
      {
        chainName: "solana",
        standard: TokenStandard.SealevelHypCollateral,
        decimals: GOR_DECIMALS.solana,
        symbol: "GOR",
        name: "GOR",
        addressOrDenom: config.solanaWarp,
        collateralAddressOrDenom: config.gorMint || GOR_MINT,
        connections: [{ token: connectionId("gorchain", config.gorchainWarp) }],
      },
    ],
  });

  return {
    async getTransferRemoteTxs({ origin, destination, amountHuman, sender, recipient }) {
      const tokens = warpCore.getTokensForRoute(origin, destination);
      if (!tokens.length) {
        throw new Error(`No warp route from ${origin} to ${destination}.`);
      }
      const originToken = tokens[0];
      const originTokenAmount = originToken.amount(
        scaleHuman(amountHuman, Number(originToken.decimals)),
      );

      const txs = await warpCore.getTransferRemoteTxs({
        originTokenAmount,
        destination,
        sender,
        recipient,
      });

      return txs.map((tx: { transaction?: unknown; tx?: unknown }) => {
        const transaction = (tx.transaction ?? tx.tx) as import("@solana/web3.js").Transaction;
        if (!transaction) {
          throw new Error("WarpCore returned an empty transaction.");
        }
        return { transaction };
      });
    },
  };
}

function scaleHuman(human: string, decimals: number): string {
  const [int = "0", frac = ""] = human.split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  const raw = `${int}${fracPadded}`.replace(/^0+(?=\d)/, "");
  return raw || "0";
}
