import { type EmailOtpType } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { createClient } from "@/shared/lib/client";
import { useTranslation } from "react-i18next";

export default function AuthConfirm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const supabase = createClient();
  const { t } = useTranslation();

  useEffect(() => {
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next");
    const nextPath = next?.startsWith("/") ? next : "/";

    async function confirm() {
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        });

        if (error) {
          navigate(`/auth/error?error=${error.message}`);
        } else {
          navigate(nextPath);
        }
      } else {
        navigate("/auth/error?error=No token hash or type");
      }
    }

    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-0 md:min-h-svh w-full items-center justify-center">
      <p className="text-muted-foreground text-sm">
        {t("auth.confirmingAccount")}
      </p>
    </div>
  );
}
