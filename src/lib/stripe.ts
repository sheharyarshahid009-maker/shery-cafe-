import Stripe from "stripe";

export interface MockPaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  mock: true;
}

let stripeSingleton: Stripe | null = null;

/** Returns a Stripe client when STRIPE_SECRET_KEY is set, otherwise null. */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(key, { 
apiVersion: "2025-02-24.acacia" });
  }
  return stripeSingleton;
}

/**
 * Create a PaymentIntent. When no Stripe key is configured (local dev / demo),
 * returns a mock intent object so the checkout flow stays fully functional.
 */
export async function createPaymentIntent(
  amountCents: number,
  currency = "pkr",
  metadata: Record<string, string> = {}
): Promise<{ clientSecret: string; paymentIntentId: string; mock: boolean }> {
  const stripe = getStripe();
  if (!stripe) {
    const mock: MockPaymentIntent = {
      id: `pi_mock_${Date.now()}`,
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      amount: amountCents,
      currency,
      status: "requires_payment_method",
      mock: true,
    };
    return {
      clientSecret: mock.clientSecret,
      paymentIntentId: mock.id,
      mock: true,
    };
  }

  const intent = await stripe.paymentIntents.create({
    amount: amountCents,
    currency,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    metadata,
  });
  return {
    clientSecret: intent.client_secret ?? "",
    paymentIntentId: intent.id,
    mock: false,
  };
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}
