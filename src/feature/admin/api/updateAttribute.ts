import { createClient } from "@/shared/lib/client";
import type { NewAttribute } from "@/shared/types/product";

export async function updateAttribute(id: string, attribute:NewAttribute) {
    const supabase = createClient();

    const {data, error} = await supabase.from("product_attributes").update({
        key: attribute.key,
        value: attribute.value
    }).eq("id", id).select().single();

    if(error) {
        console.error("Update error", error);
        throw error;
    }

    return data;
}