import Loader from "@/shared/components/Loader";
import { useAppStore } from "@/shared/store/appStore";
import { Navigate, Outlet } from "react-router";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout() {
  const user = useAppStore((state) => state.user);
  const userRole = useAppStore((state) => state.userRole);

  if (user === undefined || userRole === undefined)
    return <Loader message="loading user" />;
  if (!user) return <Navigate to="/login" />;
  if (userRole !== "admin") return <Navigate to="/" />;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
