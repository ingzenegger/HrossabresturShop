import { useNavigate } from "react-router";
import { createClient } from "@/shared/lib/client";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";

export default function LogOut() {
  const supabase = createClient();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return (
    <Button onClick={handleLogOut} disabled={loading}>
      {loading ? "Logging out..." : "Log Out"}
    </Button>
  );
}
