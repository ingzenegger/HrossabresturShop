import { createClient } from "@/shared/lib/client";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function UpdatePassword() {
  const supabase = createClient();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setSuccess(false);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;

    if (!password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setError(error.message);
      setLoading(false);
      setSuccess(false);
      return;
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-0 w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("auth.resetPasswordTitle")}
              </CardTitle>
              <CardDescription>
                {t("account.newPasswordDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password">{t("account.newPassword")}</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder={t("account.newPassword")}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  {success && (
                    <p className="text-sm text-green-500">
                      {t("account.passwordUpdated")}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={loading}
                  >
                    {loading
                      ? t("account.saving")
                      : t("account.saveNewPassword")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
