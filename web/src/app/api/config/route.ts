import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { GOR_MINT } from "@/lib/chains";
import { isPubkeyLike, type PublicBridgeConfig } from "@/lib/types";

async function readJson(file: string) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Record<string, Record<string, unknown>>;
  } catch {
    return null;
  }
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "base58" in value) {
    const inner = (value as { base58?: unknown }).base58;
    return typeof inner === "string" ? inner : "";
  }
  return "";
}

export async function GET() {
  const stateDir = path.resolve(process.cwd(), "..", "state");
  const core = await readJson(path.join(stateDir, "program-ids.json"));
  const warp = await readJson(
    path.join(
      stateDir,
      "generated",
      "warp-routes",
      "gor",
      "warp-deploy-outputs",
      "program-ids.json",
    ),
  );

  const gorchainMailbox =
    process.env.NEXT_PUBLIC_GORCHAIN_MAILBOX || str(core?.gorchain?.mailbox);
  const solanaMailbox = process.env.NEXT_PUBLIC_SOLANA_MAILBOX || str(core?.solana?.mailbox);
  const gorchainWarp = process.env.NEXT_PUBLIC_GORCHAIN_WARP_PROGRAM || str(warp?.gorchain);
  const solanaWarp = process.env.NEXT_PUBLIC_SOLANA_WARP_PROGRAM || str(warp?.solana);

  const config: PublicBridgeConfig = {
    gorchainRpc: "/api/rpc/gorchain",
    solanaRpc: "/api/rpc/solana",
    gorchainMailbox,
    solanaMailbox,
    gorchainWarp,
    solanaWarp,
    gorMint: GOR_MINT,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL ?? "",
    gorchainExplorer: process.env.NEXT_PUBLIC_GORCHAIN_EXPLORER ?? "https://scan.gorbagana.wtf",
    solanaExplorer: process.env.NEXT_PUBLIC_SOLANA_EXPLORER ?? "https://solscan.io",
    routeReady:
      isPubkeyLike(gorchainWarp) &&
      isPubkeyLike(solanaWarp) &&
      isPubkeyLike(gorchainMailbox) &&
      isPubkeyLike(solanaMailbox),
  };

  return NextResponse.json(config);
}
