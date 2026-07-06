import { useCart } from "@/feature/cart/hooks/useCart";
import { createClient } from "@/shared/lib/client";
import { Home, ShoppingCart, UserRound, LogOut } from "lucide-react";
import { Link, Outlet, useNavigate } from "react-router";
import Tooltip from "../../shared/components/Tooltip";
import { Toaster } from "@/shared/components/ui/sonner";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useLanguageSync } from "@/shared/i18n/useLanguageSync";
import { useTranslation } from "react-i18next";

const Layout = () => {
  useCart();
  useLanguageSync();

  const supabase = createClient();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex gap-2 bg-amber-200 w-full">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 ">
          <nav className="flex w-full items-center justify-between text-amber-900">
            <Tooltip label={t("nav.home")}>
              <Link to="/" className="hover:opacity-70">
                <Home className="hover:scale-105 transition-transform" />
              </Link>
            </Tooltip>

            <div className="flex gap-4">
              <LanguageSwitcher />
              <Tooltip label={t("nav.cart")}>
                <Link to="/cart" className="hover:opacity-70">
                  <ShoppingCart className="hover:scale-105 transition-transform" />
                </Link>
              </Tooltip>
              <Tooltip label={t("nav.account")}>
                <Link to="/account" className="flex hover:opacity-70 ">
                  <UserRound className="hover:scale-105 transition-transform" />
                </Link>
              </Tooltip>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="flex items-center justify-between bg-amber-200 w-full px-4 py-3 text-amber-900">
        <div className="w-10" />
        <p className=" text-sm">© ingzenegger</p>
        <Tooltip label={t("nav.logOut")}>
          <button
            onClick={handleLogOut}
            className="w-10 flex justify-end hover:opacity-70 transition-opacity cursor-pointer"
          >
            <LogOut
              size={20}
              className="hover:scale-105 transition-transform"
            />
          </button>
        </Tooltip>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
};

export default Layout;
