import Loader from "@/shared/components/Loader";
import { useAppStore } from "@/shared/store/appStore";
import { Navigate, Outlet } from "react-router";

export default function AdminLayout() {
  const user = useAppStore((state) => state.user);
  const userRole = useAppStore((state) => state.userRole);

  if (user === undefined || userRole === undefined)
    return <Loader message="loading user" />;
  if (!user) return <Navigate to="/login" />;
  if (userRole !== "admin") return <Navigate to="/" />;

  return <Outlet />;
}
