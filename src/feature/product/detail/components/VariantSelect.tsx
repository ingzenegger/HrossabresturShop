import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useAppStore } from "@/shared/store/appStore";
import type { ProductVariant } from "@/shared/types/product";
import { useTranslation } from "react-i18next";

type props = {
  productVariants: ProductVariant[];
  selectedVariant: ProductVariant;
  setSelectedVariant: (variant: ProductVariant) => void;
};

const VariantSelect = ({
  productVariants,
  selectedVariant,
  setSelectedVariant,
}: props) => {
  const language = useAppStore((state) => state.language);
  const { t } = useTranslation();

  function handleValueChange(value: string) {
    const selected = productVariants.find((variant) => variant.id === value);
    if (!selected) return;
    setSelectedVariant(selected);
  }

  return (
    <div>
      <Select
        value={selectedVariant.id}
        onValueChange={(value) => {
          handleValueChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder={t("product.selectVariant")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {productVariants.map((variant) => (
              <SelectItem value={variant.id} key={variant.id}>
                {variant.name[language]}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelect;
