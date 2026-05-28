import { Navigate, Outlet } from "react-router";
import { useAppStore } from "@/shared/store/appStore";
import LogOut from "@/feature/auth/components/logout";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
//   const { supabase } = createClient(request);

//   const { data, error } = await supabase.auth.getUser();
//   if (error || !data?.user) {
//     return redirect("/login");
//   }

//   return data;
// };

export default function AccountLayout() {
  const user = useAppStore((state) => state.user);

  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <div className="flex items-center justify-center h-screen gap-2">
        <p>
          Hello <span className="text-primary font-semibold">{user.email}</span>
        </p>
        <LogOut />
      </div>
      {/* TODO navbar to user settings, purchase history and later custom requests */}
      <div>
        <Outlet />
      </div>
    </>
  );
}
