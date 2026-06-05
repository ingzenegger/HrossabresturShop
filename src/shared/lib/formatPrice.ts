export function formatPrice(amount: number, currency: string = "ISK"): string {
  return amount.toLocaleString("is-IS", { style: "currency", currency });
}
