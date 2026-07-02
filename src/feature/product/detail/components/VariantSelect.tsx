import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { ProductVariant } from "@/shared/types/product";

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
  // console.log("product variants:", productVariants);

  function handleValueChange(value: string) {
    // console.log("value change triggered, value:", value);
    const selected = productVariants.find((variant) => variant.name === value);
    if (!selected) return;
    // console.log("selected:", selected);
    setSelectedVariant(selected);
  }

  return (
    <div>
      <Select
        value={selectedVariant.name}
        onValueChange={(value) => {
          handleValueChange(value);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {productVariants.map((variant) => (
              <SelectItem value={variant.name} key={variant.id}>
                {variant.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default VariantSelect;
