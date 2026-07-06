import { z } from "zod";

export const LanguageSchema = z.enum(["en", "is"]);
export type Language = z.infer<typeof LanguageSchema>;

export const TranslatedTextSchema = z.object({
  en: z.string(),
  is: z.string(),
});
export type TranslatedText = z.infer<typeof TranslatedTextSchema>;
