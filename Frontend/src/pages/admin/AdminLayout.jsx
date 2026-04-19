import { useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { logoutAdmin } from "@/Services/adminApi";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";
import {
  LayoutDashboard,
  Users,
  FileText,
  Fingerprint,
  Bell,
  LogOut,
  ShieldCheck,
  Link2,
  Mail,
} from "lucide-react";
import { useAdminSessionQuery } from "@/hooks/useAdminQueryData";

const ACCENT = "#FF4800";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Resumes", icon: FileText, path: "/admin/resumes" },
  { label: "Cover Letters", icon: Mail, path: "/admin/cover-letters" },
  { label: "Invite Users", icon: Link2, path: "/admin/invite-users" },
  { label: "Student IDs", icon: Fingerprint, path: "/admin/student-ids" },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
];

const OWNER_NAV = [
  { label: "Accounts", icon: ShieldCheck, path: "/admin/accounts" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminSessionQuery = useAdminSessionQuery();
  const admin = adminSessionQuery.data;
  const checking = adminSessionQuery.isPending && !admin;

  useEffect(() => {
    if (!adminSessionQuery.isError) {
      return;
    }

    toast.error("Session invalid or expired", {
      description: "Redirecting to admin login.",
    });
    navigate("/admin/login");
  }, [adminSessionQuery.isError, navigate]);

  useEffect(() => {
    if (
      !checking &&
      admin?.role !== "owner" &&
      location.pathname.startsWith("/admin/accounts")
    ) {
      toast.error("Only owner admins can access accounts.");
      navigate("/admin/dashboard", { replace: true });
    }
  }, [admin, checking, location.pathname, navigate]);

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
      <div className="flex h-screen items-center justify-center bg-white">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"
        />
      </div>
    );
  }

  const navItems = admin?.role === "owner" ? [...NAV, ...OWNER_NAV] : NAV;

  const adminName = admin?.fullName || admin?.name || admin?.email || "Admin";
  const adminRole = admin?.role === "owner" ? "Owner Admin" : "Admin";
  const initials = (adminName || "A")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "A";

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 antialiased">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-20 flex h-screen w-[240px] flex-col border-r border-slate-200 bg-white">
        {/* Brand */}
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex items-center justify-between gap-2">
            <NxtResumeWordmark size="20px" color="#0F172A" />
            <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Management
          </p>
          <div className="space-y-0.5">
            {navItems.map(({ label, icon: Icon, path }) => {
              const active =
                location.pathname === path ||
                (path !== "/admin/dashboard" &&
                  location.pathname.startsWith(path));
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] transition-colors ${
                    active
                      ? "bg-slate-50 font-semibold text-slate-900"
                      : "font-medium text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {active && (
                    <span
                      className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                      style={{ backgroundColor: ACCENT }}
                    />
                  )}
                  <Icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Admin user card */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white"
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-semibold text-slate-900">
                {adminName}
              </p>
              <p className="truncate text-[10px] uppercase tracking-wider text-slate-400">
                {adminRole}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-[12px] font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5 flex-shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-[240px] flex h-screen min-h-0 flex-1 flex-col overflow-hidden bg-white">
        <Outlet context={{ admin }} />
      </div>
    </div>
  );
}
