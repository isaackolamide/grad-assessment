// ============================================================================
// CHALLENGE 1: DISCUSSED UNION & EXHAUSTIVENESS CHECKING
//
// Rules:
// 1. Refactor the loose PaymentEvent type into a Discriminated Union.
// 2. Ensure each method type has its exact required fields:
//    - "card": cardNumber (string), cvv (string), amount (number)
//    - "crypto": walletAddress (string), network ("ETH" | "BTC"), amount (number)
//    - "bank": iban (string), bic (string), amount (number)
// 3. Fix processPayment() using a switch-case.
// 4. Implement exhaustive checking so adding a new payment method causes a compile error.
// ============================================================================

// ❌ STARTER BUGGY CODE (Refactor this into proper discriminated union types):
export type PaymentMethod = "card" | "crypto" | "bank";

export interface BuggyPaymentEvent {
  kind: PaymentMethod;
  amount: number;
  cardNumber?: string;
  cvv?: string;
  walletAddress?: string;
  network?: "ETH" | "BTC";
  iban?: string;
  bic?: string;
}

// TODO: Define your discriminated union types here:
// export type CardPayment = ...
// export type CryptoPayment = ...
// export type BankPayment = ...
// export type PaymentEvent = CardPayment | CryptoPayment | BankPayment;

export type PaymentEvent = BuggyPaymentEvent; // Replace this placeholder

export function processPayment(event: PaymentEvent): string {
  // TODO: Fix the compile/logic traps below using a strict switch-case.
  // Must return:
  // - For card: `Processed card ending with <last 4 digits> for $<amount>`
  // - For crypto: `Processed crypto on <network> to <walletAddress> for $<amount>`
  // - For bank: `Processed bank transfer to <iban> for $<amount>`
  // - Exhaustive check: A default case asserting `never`

  switch (event.kind) {
    case "card":
      // TS Error trap: cardNumber might be undefined in the buggy interface
      return `Processed card ending with ${event.cardNumber?.slice(-4)} for $${event.amount}`;
    case "crypto":
      return `Processed crypto on ${event.network} to ${event.walletAddress} for $${event.amount}`;
    // BUG: Missing "bank" case!
    default:
      throw new Error("Unhandled payment method");
  }
}