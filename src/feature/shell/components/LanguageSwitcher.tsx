import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { useAppStore } from "@/shared/store/appStore";
import { Languages } from "lucide-react";
import type { Language } from "@/shared/types/language";
import { LanguageSchema } from "@/shared/types/language";
import isFlag from "@/assets/flags/is.svg";
import gbFlag from "@/assets/flags/gb.svg";

const languages: {
  code: Language;
  name: string;
  flagUrl: string;
  short: string;
}[] = [
  { code: "is", name: "Íslenska", flagUrl: isFlag, short: "IS" },
  { code: "en", name: "English", flagUrl: gbFlag, short: "EN" },
];

export default function LanguageSwitcher() {
  const language = useAppStore((state) => state.language);
  const setLanguage = useAppStore((state) => state.setLanguage);

  const selectedLanguage = languages.find((lang) => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:opacity-70 hover:scale-105 hover:bg-amber-200 hover:text-amber-900 transition-transform"
        >
          <Languages />
          <span className="hidden sm:inline">{selectedLanguage?.name}</span>
          <span className="sm:hidden">
            <img
              src={selectedLanguage?.flagUrl}
              alt=""
              className="size-5 rounded-full object-cover"
            />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={language}
          onValueChange={(value) => {
            const parsed = LanguageSchema.safeParse(value);
            if (parsed.success) setLanguage(parsed.data);
          }}
        >
          {languages.map((lang) => (
            <DropdownMenuRadioItem
              value={lang.code}
              key={lang.code}
              className="flex items-center justify-between cursor-pointer"
            >
              <img
                src={lang.flagUrl}
                alt=""
                className="size-5 rounded-full object-cover"
              />
              {lang.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
