import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { GOR_MINT } from "@/lib/chains";
import { DEPLOYED_ROUTE } from "@/lib/deployed";
import { isPubkeyLike, type PublicBridgeConfig } from "@/lib/types";

async function readJson(file: string) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Record<string, Record<string, unknown>>;
  } catch {
    return null;
  }
}

async function readWarpProgramIds(stateDir: string) {
  const preferred = path.join(
    stateDir,
    "warp-routes",
    "GOR-gorchain-solana",
    "warp-deploy-outputs",
    "program-ids.json",
  );
  const direct = await readJson(preferred);
  if (direct) return direct;

  try {
    const routesDir = path.join(stateDir, "warp-routes");
    const names = await fs.readdir(routesDir);
    for (const name of names) {
      const candidate = path.join(
        routesDir,
        name,
        "warp-deploy-outputs",
        "program-ids.json",
      );
      const json = await readJson(candidate);
      if (json) return json;
    }
  } catch {
    // no warp-routes dir yet
  }
  return null;
}

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "base58" in value) {
    const inner = (value as { base58?: unknown }).base58;
    return typeof inner === "string" ? inner : "";
  }
  return "";
}

function stateDirs() {
  const cwd = process.cwd();
  return [
    path.resolve(cwd, "..", "state"),
    path.resolve(cwd, "state"),
    path.resolve(cwd, "outer-rim", "state"),
  ];
}

export async function GET() {
  let core: Record<string, Record<string, unknown>> | null = null;
  let warp: Record<string, Record<string, unknown>> | null = null;
  for (const stateDir of stateDirs()) {
    core ??= await readJson(path.join(stateDir, "program-ids.json"));
    warp ??= await readWarpProgramIds(stateDir);
  }

  const gorchainMailbox =
    process.env.NEXT_PUBLIC_GORCHAIN_MAILBOX ||
    str(core?.gorchain?.mailbox) ||
    DEPLOYED_ROUTE.gorchainMailbox;
  const solanaMailbox =
    process.env.NEXT_PUBLIC_SOLANA_MAILBOX ||
    str(core?.solana?.mailbox) ||
    DEPLOYED_ROUTE.solanaMailbox;
  const gorchainWarp =
    process.env.NEXT_PUBLIC_GORCHAIN_WARP_PROGRAM ||
    str(warp?.gorchain) ||
    DEPLOYED_ROUTE.gorchainWarp;
  const solanaWarp =
    process.env.NEXT_PUBLIC_SOLANA_WARP_PROGRAM ||
    str(warp?.solana) ||
    DEPLOYED_ROUTE.solanaWarp;

  const config: PublicBridgeConfig = {
    gorchainRpc: "/api/rpc/gorchain",
    solanaRpc: "/api/rpc/solana",
    gorchainMailbox,
    solanaMailbox,
    gorchainWarp,
    solanaWarp,
    gorMint: GOR_MINT,
    explorerUrl: process.env.NEXT_PUBLIC_EXPLORER_URL ?? "",
    gorchainExplorer: process.env.NEXT_PUBLIC_GORCHAIN_EXPLORER ?? "https://explorer.gorbagana.wtf",
    solanaExplorer: process.env.NEXT_PUBLIC_SOLANA_EXPLORER ?? "https://solscan.io",
    routeReady:
      isPubkeyLike(gorchainWarp) &&
      isPubkeyLike(solanaWarp) &&
      isPubkeyLike(gorchainMailbox) &&
      isPubkeyLike(solanaMailbox),
  };

  return NextResponse.json(config);
}
