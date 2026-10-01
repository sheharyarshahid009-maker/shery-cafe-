import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-gold-500">
        Checkout
      </p>
      <h1 className="section-title mt-1">Complete Your Order</h1>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
