import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/getAdminProducts";

export function useAdminProducts() {
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: getAdminProducts,
  });
  return { data, isLoading, error };
}
