import LogOut from "@/feature/auth/components/logout";
import { NavLink } from "react-router";

const links = [
  { to: "/account/orders", label: "My Orders" },
  { to: "/account/custom-orders", label: "Custom Orders" },
  { to: "/account/settings", label: "Account Settings" },
];

export default function Sidebar() {
  return (
    <nav className="flex flex-col gap-1 w-48 shrink-0">
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
          {link.label}
        </NavLink>
      ))}
      <div className="mt-4 pt-4 border-t border-amber-200">
        <LogOut />
      </div>
    </nav>
  );
}