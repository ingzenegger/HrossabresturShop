//component from supabase, no actual email action going on here, but want to keep for future use.
import { Link } from "react-router";
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

export default function SignUp() {
  const supabase = createClient();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const repeatPassword = formData.get("repeat-password") as string;

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-0 md:min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          {/* <div className="flex flex-col gap-6"> */}
          {/* {success ? ( */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("auth.signUpSuccessTitle")}
              </CardTitle>
              <CardDescription>
                {t("auth.signUpSuccessDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t("auth.signUpSuccessBody")}
              </p>
              {/* það er enginn email fítus tengdur, þetta gæti farið út í skiptum fyrir navigate á protected síðu með kannski einhverjum "success" sonner, en held ég hafi þetta svona for future use */}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  {
    /* ) : ( */
  }

  return (
    <div className="flex min-h-0 md:min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("auth.signUp")}</CardTitle>
              <CardDescription>{t("auth.signUpDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t("auth.email")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">{t("auth.password")}</Label>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="repeat-password">
                        {t("auth.repeatPassword")}
                      </Label>
                    </div>
                    <Input
                      id="repeat-password"
                      name="repeat-password"
                      type="password"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? t("auth.creatingAccount") : t("auth.signUp")}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  {t("auth.alreadyHaveAccount")}
                  <Link to="/login" className="underline underline-offset-4">
                    {t("auth.login")}
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
