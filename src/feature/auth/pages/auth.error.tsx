import { useSearchParams } from "react-router";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";

export default function AuthError() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  return (
    <div className="flex min-h-0 md:min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t("auth.errorTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              {searchParams?.get("error") ? (
                <p className="text-sm text-muted-foreground">
                  {t("auth.errorCode", { code: searchParams.get("error") })}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t("auth.errorUnspecified")}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
