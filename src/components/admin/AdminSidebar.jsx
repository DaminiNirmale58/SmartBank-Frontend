import { NavLink } from "react-router-dom";
import {
  Landmark,
  LayoutDashboard,
  Users,
  CreditCard,
  ClipboardCheck,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Customers",
    path: "/admin/customers",
    icon: Users,
  },
  {
    name: "All Accounts",
    path: "/admin/accounts",
    icon: CreditCard,
  },
  {
    name: "Approvals",
    path: "/admin/approvals",
    icon: ClipboardCheck,
  },
  {
    name: "Transactions",
    path: "/admin/transactions",
    icon: ArrowLeftRight,
  },
];

function AdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#12372a] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="rounded-xl bg-white/10 p-2.5">
          <Landmark size={25} />
        </div>

        <span className="text-2xl font-bold">
          Smart<span className="text-emerald-400">Bank</span>
        </span>
      </div>

      {/* Menu */}
      <div className="px-5 pt-8">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-emerald-300/70">
          Administration
        </p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg"
                      : "text-emerald-100/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto border-t border-white/10 p-5">
        <div className="rounded-xl bg-white/10 p-4">
          <p className="text-sm font-semibold text-emerald-300">Admin Panel</p>

          <p className="mt-1 text-xs leading-5 text-emerald-100/70">
            Manage SmartBank securely.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
