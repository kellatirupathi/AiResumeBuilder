import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { Button } from "../ui/button";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import ChangePasswordModal from "./ChangePasswordModal";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  Key,
  Bell,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Resumes", href: "/resumes" },
  { label: "Cover Letters", href: "/cover-letters" },
  { label: "ATS Checker", href: "/ats-checker" },
  { label: "Docs", href: "/documentation" },
];

function Header({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(addUserData(""));
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "border-b border-slate-200/70 bg-white/85 backdrop-blur-xl"
            : "border-b border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <NxtResumeLogoMark className="h-8 w-8" />
            <span
              className="text-[18px] font-semibold tracking-tight text-slate-900"
              style={{ fontFamily: "Fraunces, Georgia, serif" }}
            >
              NxtResume
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  location.pathname === link.href
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth area (desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 text-[13px] font-medium text-slate-800 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                    {initials}
                  </span>
                  <span className="max-w-[100px] truncate">
                    {user.fullName?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    <div className="border-b border-slate-100 px-4 py-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {user.fullName || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {user.email || ""}
                      </p>
                    </div>
                    <div className="py-1">
                      <MenuItem
                        icon={<LayoutDashboard className="h-3.5 w-3.5" />}
                        label="Dashboard"
                        onClick={() => navigate("/dashboard")}
                      />
                      <MenuItem
                        icon={<Bell className="h-3.5 w-3.5" />}
                        label="Notifications"
                        onClick={() => navigate("/notifications")}
                      />
                      <MenuItem
                        icon={<Key className="h-3.5 w-3.5" />}
                        label="Change password"
                        onClick={() => setShowChangePassword(true)}
                      />
                    </div>
                    <div className="border-t border-slate-100 py-1">
                      <MenuItem
                        icon={<LogOut className="h-3.5 w-3.5" />}
                        label="Sign out"
                        onClick={handleLogout}
                        danger
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/auth/sign-in"
                  className="px-3 py-1.5 text-[13px] font-medium text-slate-700 transition-colors hover:text-slate-900"
                >
                  Sign in
                </Link>
                <Link to="/auth/sign-in">
                  <Button className="h-9 rounded-full bg-slate-900 px-4 text-[13px] font-medium text-white shadow-sm hover:bg-slate-800">
                    Get started
                    <ArrowUpRight className="ml-0.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile trigger */}
          <button
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-700 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="flex flex-col px-5 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-200 px-5 py-3">
              {user ? (
                <div className="space-y-1">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </button>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Key className="h-4 w-4" /> Change password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/auth/sign-in"
                    className="rounded-md px-2 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Sign in
                  </Link>
                  <Link to="/auth/sign-in">
                    <Button className="w-full rounded-full bg-slate-900 text-white hover:bg-slate-800">
                      Get started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Spacer to prevent content jumping under the fixed header */}
      <div className="h-16" />

      <ChangePasswordModal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
      />
    </>
  );
}

function MenuItem({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[13px] transition-colors ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default Header;
