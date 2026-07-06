//because Chrome doesn't show dates in is-IS (but firefox does! good old firefox)

import type { Language } from "@/shared/types/language";

const months: Record<Language, string[]> = {
  is: [
    "janúar", "febrúar", "mars", "apríl", "maí", "júní",
    "júlí", "ágúst", "september", "október", "nóvember", "desember",
  ],
  en: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
};

export function formatDate(date: string | Date, language: Language): string {
  const d = new Date(date);
  const day = d.getDate();
  const month = months[language][d.getMonth()];
  const year = d.getFullYear();

  return language === "is"
    ? `${day}. ${month} ${year}`   // 6. júlí 2026
    : `${day} ${month} ${year}`;   // 6 July 2026
}