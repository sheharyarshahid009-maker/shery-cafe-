/** Default store currency: PKR (JazzCash / EasyPaisa are PKR rails). */
export const DEFAULT_CURRENCY = "PKR" as const;

/** Format an integer cents amount, e.g. 129900 -> "Rs 1,299.00". */
export function formatPKR(cents: number): string {
  const value = cents / 100;
  return `Rs ${value.toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Generic cents formatter for any ISO currency. */
export function formatMoney(cents: number, currency = DEFAULT_CURRENCY): string {
  if (currency === "PKR") return formatPKR(cents);
  const value = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

/** Parse a "12.99" style string into integer cents. */
export function toCents(amount: string | number): number {
  return Math.round(Number(amount) * 100);
}

/** Today's date key YYYY-MM-DD in local time (for "orders today" stats). */
export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}
