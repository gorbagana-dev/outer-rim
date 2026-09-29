/**
 * Public program ids from the 2026-09-28 deploy (programs.txt).
 * Env vars and state/program-ids.json override these when present.
 */
export const DEPLOYED_ROUTE = {
  gorchainMailbox: "9WsihUTx3zWmrre9kEc4zHomLY7RFqGYVXHJ41DNUsvu",
  solanaMailbox: "6y2UvEjibQm1kej6NwH2SaEWkmQh5rwpKJqvoxGf3zhF",
  gorchainWarp: "7zjUgvWkAyYH9kxNL8TrdQ7RwsGsa8e4oWcucq6QiwJr",
  solanaWarp: "C6BmMEEQQYUrnaCiw1Yd5KXJgLktTVMBmg9hM9oeZSp4",
} as const;

/** Gorchain native left behind so the origin transaction can land. */
export const GORCHAIN_TX_FEE_RAW = 10_000_000n;
export const GORCHAIN_TX_FEE_HUMAN = "0.01";

/** Fixed bridge fee shown in the chute. Display only. */
export const BRIDGE_FEE_GOR = "10,000";

export const ESCROW_ACCOUNTS = {
  gorchain: "GMqTc3BJgLXZgBkoBkfvnBifmP4L9ooHDuvmEeJbVTaJ",
  solana: "A5mYcNre4HXaCAXSfTiwna1C8Wb4bHdH8gSk5UA5mNex",
} as const;
