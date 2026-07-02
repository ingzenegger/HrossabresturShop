// listen for auth state changes
//get the user id on sign_in
//select the profile by the session id and save to store
//on signout clear the current customerId from the store

import { useEffect } from "react";
import { createClient } from "../lib/client";
import { useAppStore } from "../store/appStore";

export default function useCustomer() {
  const supabase = createClient();
  const setCustomerId = useAppStore((state) => state.setCustomerId);
  const setCustomerName = useAppStore((state) => state.setCustomerName);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (!session) return;

        const updateUser = async () => {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("id, name")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error(error);
            return;
          }
          setCustomerId(profile.id);
          setCustomerName(profile.name);
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
