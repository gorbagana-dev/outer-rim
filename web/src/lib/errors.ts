export function humanError(error: unknown): string {
  if (!error) return "Something broke in the dumpster.";
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : JSON.stringify(error);

  if (/user rejected|rejected the request|cancelled|canceled/i.test(message)) {
    return "WALLET_REJECTED";
  }
  if (/insufficient|0x1$/i.test(message)) {
    return "Not enough $GOR to cover the amount plus the origin fee.";
  }
  if (/blockhash not found/i.test(message)) {
    return "The network dropped the blockhash. Retry the transfer.";
  }
  if (/simulation failed/i.test(message)) {
    return "Simulation failed. The warp program may be missing, or the escrow is dry.";
  }
  if (/route not/i.test(message)) {
    return "This Outer Rim route is not deployed yet.";
  }
  return message.slice(0, 280);
}

export const WALLET_REJECTED = "WALLET_REJECTED";
