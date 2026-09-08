import { createClient } from "@/shared/lib/client";

const MAX_FILE_SIZE_BYTES = 1 * 1024 * 1024; //1MB as is the bucket limit in Supabase storage

export async function uploadAsset(file: File, productId: string) {

    if (file.size > MAX_FILE_SIZE_BYTES) {
        throw new Error ("Image is too large - please use a file under 5MB");
    }

  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (uploadError) {
    console.error("Upload error", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
