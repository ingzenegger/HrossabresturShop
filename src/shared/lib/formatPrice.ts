// export function formatPrice(amount: number, currency: string = "ISK"): string {
//   return amount.toLocaleString("is-IS", { style: "currency", currency });
// }
import type { Language } from "@/shared/types/language";

export function formatPrice(
  amount: number,
  language: Language,
  currency: string = "ISK",
): string {
  if (currency === "ISK") {
    const grouped = amount.toLocaleString("en");
    return language === "is"
      ? `${grouped.replaceAll(",", ".")} kr.`
      : `ISK ${grouped}`;
  }

  // Any future non-ISK currency: let Intl do its best.
  const locale = language === "is" ? "is-IS" : "en-GB";
  return amount.toLocaleString(locale, { style: "currency", currency });
}
