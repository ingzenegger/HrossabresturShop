//updateCustomerName function .update() on shop_customers

import { createClient } from "@/shared/lib/client";

type Props = {
  customerId: string;
  name: string;
  setCustomerName: (name: string) => void;
};

export async function updateCustomerName({
  customerId,
  name,
  setCustomerName,
}: Props) {
  const supabase = createClient();

  const { data, error: nameError } = await supabase
    .from("shop_customers")
    .update({ name: name })
    .eq("id", customerId)
    .select()
    .single();

  if (nameError) {
    console.error("Failed to update customer name:", nameError);
    return false;
  }
  setCustomerName(data.name);
  return true;
}
