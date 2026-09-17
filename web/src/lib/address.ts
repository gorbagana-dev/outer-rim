import { PublicKey } from "@solana/web3.js";

export function truncateAddress(address: string, chars = 4) {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

export function isValidPubkey(value: string): boolean {
  try {
    // eslint-disable-next-line no-new
    new PublicKey(value.trim());
    return value.trim().length >= 32;
  } catch {
    return false;
  }
}

export function parsePubkey(value: string): PublicKey | null {
  try {
    return new PublicKey(value.trim());
  } catch {
    return null;
  }
}
