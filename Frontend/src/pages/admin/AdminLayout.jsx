import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { checkAdminSession, logoutAdmin } from "@/Services/adminApi";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import { LayoutDashboard, Users, FileText, Fingerprint, Bell, LogOut } from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Resumes", icon: FileText, path: "/admin/resumes" },
  { label: "Student IDs", icon: Fingerprint, path: "/admin/student-ids" },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAdminSession()
      .then(() => setChecking(false))
      .catch(() => {
        toast.error("Session invalid or expired", { description: "Redirecting to admin login." });
        navigate("/admin/login");
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      toast.success("Logged out successfully.");
      navigate("/admin/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 shadow-xl">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <NxtResumeLogoMark className="h-10 w-10" />
            <div>
              <p className="text-base font-bold leading-tight text-white">NxtResume</p>
              <p className="text-xs text-indigo-400">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Management
          </p>
          {NAV.map(({ label, icon: Icon, path }) => {
            const active = location.pathname === path || (path !== "/admin/dashboard" && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-indigo-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:text-red-300"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-64 flex h-screen min-h-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
