import LogOut from "@/feature/auth/components/logout";
import { NavLink } from "react-router";
import { useTranslation } from "react-i18next";

const links = [
  { to: "/account/orders", label: "account.myOrders" },
  { to: "/account/custom-orders", label: "account.customOrders" },
  { to: "/account/settings", label: "account.settings" },
] as const;

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav className="flex flex-col gap-1 w-full md:w-48 shrink-0">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-amber-200 text-amber-900"
                : "text-muted-foreground hover:bg-amber-100 hover:text-amber-900"
            }`
          }
        >
          {t(link.label)}
        </NavLink>
      ))}
      <div className="mt-3 py-3 border-y border-amber-200">
        <LogOut />
      </div>
    </nav>
  );
}
