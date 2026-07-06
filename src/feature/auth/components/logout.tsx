import { useNavigate } from "react-router";
import { createClient } from "@/shared/lib/client";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function LogOut() {
  const supabase = createClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
    <Button
      onClick={handleLogOut}
      disabled={loading}
      className="cursor-pointer"
    >
      {loading ? t("nav.loggingOut") : t("nav.logOut")}
    </Button>
  );
}
