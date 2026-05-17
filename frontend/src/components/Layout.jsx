import { Bell, BookOpenCheck, LayoutDashboard, LogOut, PlusCircle, Shield, UserRound, Wrench } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/skills", label: "Skills", icon: Wrench },
  { to: "/skills/new", label: "Offer", icon: PlusCircle },
  { to: "/bookings", label: "Bookings", icon: BookOpenCheck },
  { to: "/profile", label: "Profile", icon: UserRound }
];

const Layout = () => {
  const { user, logout } = useAuth();
  const items = user?.role === "admin" ? [...navItems, { to: "/admin", label: "Admin", icon: Shield }] : navItems;

  return (
    <div className="min-h-screen bg-[#f7faf9]">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <NavLink to="/" className="flex items-center gap-2 font-semibold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded bg-mint text-white">SS</span>
              <span className="text-lg">SkillSwap</span>
            </NavLink>
            <div className="flex items-center gap-2 md:hidden">
              <Bell size={19} />
              <button className="focus-ring rounded p-2 text-slate-600" onClick={logout} aria-label="Logout">
                <LogOut size={19} />
              </button>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto">
            {items.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `focus-ring flex items-center gap-2 rounded px-3 py-2 text-sm font-medium ${
                    isActive ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.credits ?? 0} credits</p>
            </div>
            <button className="focus-ring rounded p-2 text-slate-600 hover:bg-slate-100" onClick={logout} aria-label="Logout">
              <LogOut size={19} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
