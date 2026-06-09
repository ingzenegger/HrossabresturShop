import { Navigate, Outlet } from "react-router";
import { useAppStore } from "@/shared/store/appStore";
import Sidebar from "./components/Sidebar";

export default function AccountLayout() {
  const user = useAppStore((state) => state.user);
  const customerName = useAppStore((state) => state.customerName);

  if (!user) return <Navigate to="/login" />;

  const displayName =
    customerName && customerName.trim() !== "" ? customerName : user.email;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 flex flex-col gap-6">
      <p>
        Hello, <span className="text-primary font-semibold">{displayName}</span>
      </p>
      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
