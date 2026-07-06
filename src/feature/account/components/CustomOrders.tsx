import { useTranslation } from "react-i18next";

export default function CustomOrders() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">{t("account.customOrders")}</h2>
      <p className="text-sm text-muted-foreground">
        {t("account.customOrdersComingSoon")}
      </p>
    </div>
  );
}
