import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import type { ShippingAddress } from "@/shared/types/order";
import { useTranslation } from "react-i18next";

export type AddressField = keyof ShippingAddress;

type Props = {
  value: ShippingAddress;
  onChange: (field: AddressField, value: string) => void;
  invalidFields: AddressField[];
};

const FIELDS = [
  { name: "name", label: "checkout.address.name", autoComplete: "name" },
  {
    name: "street",
    label: "checkout.address.street",
    autoComplete: "street-address",
  },
  {
    name: "postcode",
    label: "checkout.address.postcode",
    autoComplete: "postal-code",
  },
  {
    name: "city",
    label: "checkout.address.city",
    autoComplete: "address-level2",
  },
] as const;

export default function ShippingAddressFields({
  value,
  onChange,
  invalidFields,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3">
      {FIELDS.map((field) => {
        const id = `address-${field.name}`;
        const isInvalid = invalidFields.includes(field.name);
        return (
          <div key={field.name} className="flex flex-col gap-1">
            <Label htmlFor={id}>{t(field.label)}</Label>
            <Input
              id={id}
              autoComplete={field.autoComplete}
              inputMode={field.name === "postcode" ? "numeric" : undefined}
              maxLength={field.name === "postcode" ? 3 : undefined}
              value={value[field.name]}
              onChange={(e) => onChange(field.name, e.target.value)}
              aria-invalid={isInvalid}
              aria-describedby={isInvalid ? `${id}-error` : undefined}
            />
            {isInvalid && (
              <p id={`${id}-error`} className="text-red-600 text-sm">
                {field.name === "postcode"
                  ? t("checkout.address.postcodeInvalid")
                  : t("checkout.address.required")}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
