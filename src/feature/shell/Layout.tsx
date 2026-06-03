import { useCart } from "@/shared/hooks/useCart";
import { Home, ShoppingCart, UserRound } from "lucide-react";
import { Link, Outlet } from "react-router";

const Layout = () => {
  useCart();
  return (
    <div>
      <header className="flex gap-2 bg-amber-200 w-full">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-4 py-4 ">
          <nav className="flex w-full items-center justify-between ">
            {/* TODO: make a seperate navBtn component? would take url and children components */}
            <button>
              <Link to="/">
                <Home />
              </Link>
            </button>
            <div className="flex gap-4">
              <Link to="/cart" className="flex">
                <ShoppingCart />
              </Link>
              <Link to="/account" className="flex">
                <UserRound /> Account
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
