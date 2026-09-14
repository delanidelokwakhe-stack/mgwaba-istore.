export type PaymentMethod = "card" | "eft" | "instalment";
export type PaymentStatus = "idle" | "processing" | "approved" | "pending" | "failed";

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  name: string;
  billingAddress: string;
  saveCard: boolean;
}

export interface PaymentResult {
  status: Exclude<PaymentStatus, "idle" | "processing">;
  reference: string;
  message: string;
}

/**
 * Frontend payment service.
 * Swap `processCardPayment` for a real gateway call (Yoco, PayFast,
 * Peach Payments, Stripe, Adyen) — the interface stays identical.
 */
export const detectBrand = (number: string): "visa" | "mastercard" | "unknown" => {
  const digits = number.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(digits)) return "mastercard";
  return "unknown";
};

export const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

export const formatExpiry = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

export const luhnValid = (number: string) => {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13) return false;
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
};

export const generateOrderNumber = () =>
  `MG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;

export async function processCardPayment(card: CardDetails, amount: number): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 2600));
  const reference = generateOrderNumber();
  if (!luhnValid(card.number)) {
    return {
      status: "failed",
      reference,
      message: "Payment failed. Please check your card details or try another payment method.",
    };
  }
  if (amount <= 0) {
    return { status: "failed", reference, message: "Invalid transaction amount." };
  }
  return {
    status: "approved",
    reference,
    message: "Payment approved. Your order is confirmed.",
  };
}

export async function submitEftProof(file: File | null, orderNumber: string): Promise<PaymentResult> {
  await new Promise((r) => setTimeout(r, 1400));
  if (!file) {
    return { status: "failed", reference: orderNumber, message: "Please attach your proof of payment." };
  }
  return {
    status: "pending",
    reference: orderNumber,
    message:
      "Thank you for your payment submission. Your order will be processed once payment has been verified.",
  };
}
