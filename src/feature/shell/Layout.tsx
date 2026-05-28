import { Button } from "@/shared/components/ui/button";
import { Link, Outlet } from "react-router";

const Layout = () => {
  return (
    <div>
      <header className="flex gap-2 bg-amber-200">
        <div className="mx-auto flex max-w-6x1 flex-wrap items-center justify-between gap-4 px-4 py-4 ">
          <p>Layout</p>

          <nav className="flex">
            <Button>
              <Link to="/">Home</Link>
            </Button>
            <Button>
              <Link to="/login">Log in</Link>
            </Button>
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
