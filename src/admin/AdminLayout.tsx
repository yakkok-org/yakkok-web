import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useAdminAuth } from "./hooks/useAdminAuth";

const MENU = [
  { to: "/dashboard", label: "개요", end: true },
  { to: "/dashboard/users", label: "사용자" },
  { to: "/dashboard/medications", label: "복약 기록" },
  { to: "/dashboard/shares", label: "공유코드" },
  { to: "/dashboard/notifications", label: "알림 이력" },
  { to: "/dashboard/devices", label: "디바이스" },
  { to: "/dashboard/system", label: "시스템 로그" },
];

export default function AdminLayout() {
  const { user } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/dashboard/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="메뉴"
          className="p-2 -ml-2"
        >
          <span className="block w-5 h-0.5 bg-gray-800 mb-1" />
          <span className="block w-5 h-0.5 bg-gray-800 mb-1" />
          <span className="block w-5 h-0.5 bg-gray-800" />
        </button>
        <span className="font-bold">
          <span className="text-brand">약꼭</span> 어드민
        </span>
        <span className="w-7" />
      </header>

      <aside
        className={`${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:static z-30 top-0 md:top-auto left-0 h-full md:h-auto w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-200 ease-out pt-14 md:pt-0`}
      >
        <div className="hidden md:flex items-center h-16 px-6 border-b border-gray-100 font-bold text-lg">
          <span className="text-brand mr-1">약꼭</span> 어드민
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              end={m.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-soft text-brand-dark"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            >
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 truncate" title={user?.email ?? ""}>
            {user?.email ?? "비로그인"}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 w-full text-sm text-gray-600 hover:text-gray-900 text-left"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
