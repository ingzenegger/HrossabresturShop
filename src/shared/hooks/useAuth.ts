import { useEffect } from "react";
import { createClient } from "../lib/client";
import { useAppStore } from "../store/appStore";

export default function useAuth() {
  const supabase = createClient();
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);

      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);
}
