import { NextResponse } from "next/server";

const ALLOWED = new Set([
  "getHealth",
  "getVersion",
  "getSlot",
  "getBlockHeight",
  "getLatestBlockhash",
  "getFeeForMessage",
  "getBalance",
  "getAccountInfo",
  "getMultipleAccounts",
  "getTokenAccountBalance",
  "getTokenAccountsByOwner",
  "getSignatureStatuses",
  "getTransaction",
  "getRecentPrioritizationFees",
  "simulateTransaction",
  "sendTransaction",
  "getEpochInfo",
  "getMinimumBalanceForRentExemption",
]);

function upstream(chain: string) {
  if (chain === "gorchain") return process.env.GORCHAIN_RPC_URL ?? "https://rpc.gorbagana.wtf";
  if (chain === "solana") return process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com";
  return null;
}

export async function POST(
  request: Request,
  context: { params: Promise<{ chain: string }> },
) {
  const { chain } = await context.params;
  const url = upstream(chain);
  if (!url) {
    return NextResponse.json({ error: "Unknown chain" }, { status: 404 });
  }

  let body: { method?: string; id?: unknown; jsonrpc?: string; params?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.method || !ALLOWED.has(body.method)) {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: body.id ?? null,
        error: { code: -32601, message: `Method not allowed: ${body.method}` },
      },
      { status: 400 },
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: body.jsonrpc ?? "2.0",
      id: body.id ?? 1,
      method: body.method,
      params: body.params ?? [],
    }),
  });

  const json = await res.text();
  return new NextResponse(json, {
    status: res.status,
    headers: { "content-type": "application/json" },
  });
}
