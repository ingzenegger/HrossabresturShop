import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useState } from "react";

export type AttributeFormValues = {
  key: string;
  valueEn: string;
  valueIs: string;
};

type AttributeFormProps = {
  initialValues: AttributeFormValues;
  submitLabel: string;
  onSubmit: (values: AttributeFormValues) => Promise<void>;
};

export default function AttributeForm({
  initialValues,
  submitLabel,
  onSubmit,
}: AttributeFormProps) {
  const [key, setKey] = useState(initialValues.key);
  const [valueEn, setValueEn] = useState(initialValues.valueEn);
  const [valueIs, setValueIs] = useState(initialValues.valueIs);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        try {
          await onSubmit({ key, valueEn, valueIs });
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "something went wrong. Try again",
          );
        }
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="attributeKey">Attribute</Label>
        <Select value={key} onValueChange={setKey}>
          <SelectTrigger id="attributeKey">
            <SelectValue placeholder="Select attribute" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="category">Category</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="attributeValueIs">Value (Icelandic)</Label>
        <Input
          id="attributeValueIs"
          value={valueIs}
          onChange={(e) => setValueIs(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="attributeValueEn">Value (English)</Label>
        <Input
          id="attributeValueEn"
          value={valueEn}
          onChange={(e) => setValueEn(e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
