// listen for auth state changes
//get the user email on sign_in
//upsert into shop_customers table with that email and the shop_id
//take the id from the shop_customers table and save to store
//on signout clear the current customerId from the store

import { useEffect } from "react";
import { myshopId } from "../constants";
import { createClient } from "../lib/client";
import { useAppStore } from "../store/appStore";
import { shopCustomerSchema } from "../types/customer";

export default function useCustomer() {
  const supabase = createClient();
  const setCustomerId = useAppStore((state) => state.setCustomerId);
  const setCustomerName = useAppStore((state) => state.setCustomerName);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (!session) return;

        const updateUser = async () => {
          const { data: customer, error } = await supabase
            .from("shop_customers")
            .upsert(
              { shop_id: myshopId, email: session?.user.email, name: "" },
              { onConflict: "email, shop_id", ignoreDuplicates: true },
            )
            .select();
          if (error) {
            console.error(error);
            return;
          }
          if (customer.length === 0) {
            const { data, error } = await supabase
              .from("shop_customers")
              .select()
              .eq("shop_id", myshopId)
              .eq("email", session?.user.email)
              .single();
            if (error) {
              console.error(error);
              return;
            }
            const parsed = shopCustomerSchema.safeParse(data);
            if (!parsed.success) {
              console.error("Validation error", parsed.error);
              return;
            }
            setCustomerId(parsed.data.id);
            setCustomerName(parsed.data.name);
            return;
          }
          const parsed = shopCustomerSchema.safeParse(customer[0]);
          if (!parsed.success) {
            console.error("Validation error", parsed.error);
            return;
          }
          setCustomerId(parsed.data.id);
          setCustomerName(parsed.data.name);
        };
        updateUser();
      } else if (event === "SIGNED_OUT") {
        setCustomerId(null);
        setCustomerName(null);
      }
    });
    return () => data.subscription.unsubscribe();
  }, []);
}
