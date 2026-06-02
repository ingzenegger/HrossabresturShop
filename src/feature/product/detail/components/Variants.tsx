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
  selectedVariant: string | undefined;
  setSelectedVariant: (value: string) => void;
};

const Variants = ({
  productVariants,
  selectedVariant,
  setSelectedVariant,
}: props) => {
  return (
    <div>
      <Select
        value={selectedVariant}
        onValueChange={(value) => setSelectedVariant(value)}
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

export default Variants;
