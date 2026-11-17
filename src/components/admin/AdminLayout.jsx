import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#f3f8f5]">
      <AdminSidebar />

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white px-8 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-[#12372a]">Administration</h1>

            <p className="mt-1 text-xs text-slate-500">
              SmartBank Management Portal
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-700 sm:flex">
              <ShieldCheck size={17} />
              Secure Admin
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                {user.fullName?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-slate-800">
                  {user.fullName || "Admin"}
                </p>

                <p className="text-xs text-emerald-600">
                  {user.role || "ADMIN"}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-xl bg-red-50 p-2.5 text-red-600 transition hover:bg-red-100"
            >
              <LogOut size={19} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
