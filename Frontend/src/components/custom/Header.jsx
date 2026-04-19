import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { Button } from "../ui/button";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";
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
  FileText,
  Sparkles,
  Gauge,
  Layout as LayoutIcon,
  Mail,
  PenLine,
  BookOpen,
} from "lucide-react";

const ACCENT = "#FF4800";
const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };

const RESUME_ITEMS = [
  {
    icon: FileText,
    title: "Resume Templates",
    desc: "16 ATS-friendly professional designs.",
    to: "/resumes",
  },
  {
    icon: Sparkles,
    title: "AI Resume Builder",
    desc: "Build a tailored resume with AI assistance.",
    to: "/dashboard",
    authTo: "/auth/sign-in",
  },
  {
    icon: Gauge,
    title: "ATS Checker",
    desc: "Score and optimize your resume.",
    to: "/ats-checker",
  },
  {
    icon: LayoutIcon,
    title: "Portfolio Pages",
    desc: "Publish a portfolio from your resume.",
    to: "/dashboard",
    authTo: "/auth/sign-in",
  },
];

const COVER_ITEMS = [
  {
    icon: Mail,
    title: "Cover Letter Templates",
    desc: "10 professional designs to choose from.",
    to: "/cover-letters",
  },
  {
    icon: PenLine,
    title: "AI Cover Letter Generator",
    desc: "Tailored letters in seconds.",
    to: "/dashboard?tab=cover-letters",
    authTo: "/auth/sign-in",
  },
  {
    icon: BookOpen,
    title: "How to Write",
    desc: "Step-by-step cover letter guide.",
    to: "/documentation",
  },
];

const FLAT_LINKS = [
  { label: "ATS Checker", href: "/ats-checker" },
  { label: "Docs", href: "/documentation" },
];

const MOBILE_LINKS = [
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
  const [openMenu, setOpenMenu] = useState(null); // 'resumes' | 'covers' | null
  const [showChangePassword, setShowChangePassword] = useState(false);

  const profileRef = useRef(null);
  const navRef = useRef(null);

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
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setOpenMenu(null);
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

  const resolveLink = (item) => (user ? item.to : item.authTo || item.to);

  const activePath = (path) =>
    location.pathname === path ||
    (path !== "/" && location.pathname.startsWith(path));

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
          <Link to="/" className="flex items-center group">
            <NxtResumeWordmark size="22px" color="#0F172A" />
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden items-center gap-0.5 md:flex">
            <MegaTrigger
              label="Resumes"
              active={activePath("/resumes")}
              open={openMenu === "resumes"}
              onClick={() =>
                setOpenMenu((m) => (m === "resumes" ? null : "resumes"))
              }
            />
            <MegaTrigger
              label="Cover Letters"
              active={activePath("/cover-letters")}
              open={openMenu === "covers"}
              onClick={() =>
                setOpenMenu((m) => (m === "covers" ? null : "covers"))
              }
            />
            {FLAT_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  activePath(link.href)
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
                  className="inline-flex h-9 items-center rounded-full border border-slate-900 px-4 text-[13px] font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  to="/auth/sign-in"
                  className="inline-flex h-9 items-center gap-1 rounded-full bg-slate-900 px-4 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#FF4800]"
                >
                  Free Account
                  <ArrowUpRight className="h-3.5 w-3.5" />
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

        {/* Mega-menu panel (desktop only) */}
        <AnimatePresence>
          {openMenu && (
            <motion.div
              ref={navRef}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-x-0 top-full hidden md:block"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="mx-auto max-w-6xl px-5 pt-2 lg:px-8">
                <div
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)]"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  {openMenu === "resumes" && (
                    <MegaPanel
                      items={RESUME_ITEMS}
                      resolveLink={resolveLink}
                      title="Craft a resume that gets interviews."
                      desc="Start with a template, tailor with AI, and share a clean PDF or portfolio."
                      ctaLabel="Build your resume"
                      ctaTo={user ? "/dashboard" : "/auth/sign-in"}
                      navigate={navigate}
                      onClose={() => setOpenMenu(null)}
                      variant="resume"
                    />
                  )}
                  {openMenu === "covers" && (
                    <MegaPanel
                      items={COVER_ITEMS}
                      resolveLink={resolveLink}
                      title="Write a cover letter in minutes."
                      desc="Pick a template, describe the role, and let AI draft the rest."
                      ctaLabel="Create cover letter"
                      ctaTo={
                        user ? "/dashboard?tab=cover-letters" : "/auth/sign-in"
                      }
                      navigate={navigate}
                      onClose={() => setOpenMenu(null)}
                      variant="cover"
                    />
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white md:hidden">
            <nav className="flex flex-col px-5 py-3">
              {MOBILE_LINKS.map((link) => (
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
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-900 text-sm font-semibold text-slate-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/sign-in"
                    className="inline-flex h-10 items-center justify-center gap-1 rounded-full bg-slate-900 text-sm font-semibold text-white"
                  >
                    Free Account
                    <ArrowUpRight className="h-3.5 w-3.5" />
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

function MegaTrigger({ label, open, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
        open || active ? "text-slate-900" : "text-slate-600 hover:text-slate-900"
      }`}
    >
      {label}
      <ChevronDown
        className={`h-3.5 w-3.5 transition-transform duration-150 ${
          open ? "rotate-180 text-slate-900" : "text-slate-500"
        }`}
      />
    </button>
  );
}

function MegaPanel({
  items,
  resolveLink,
  title,
  desc,
  ctaLabel,
  ctaTo,
  navigate,
  onClose,
  variant,
}) {
  return (
    <div className="grid grid-cols-[1fr_340px]">
      <div className="grid auto-rows-max grid-cols-2 content-start gap-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              onClick={() => {
                navigate(resolveLink(item));
                onClose();
              }}
              className="group flex h-auto items-start gap-3 self-start rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition-all group-hover:border-[#FF4800] group-hover:text-[#FF4800]">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="text-[13px] font-semibold text-slate-900">
                    {item.title}
                  </span>
                  <ArrowUpRight className="h-3 w-3 text-slate-300 transition-colors group-hover:text-[#FF4800]" />
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-[1.35] text-slate-500">
                  {item.desc}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="relative overflow-hidden border-l border-slate-100 bg-[#FBFAF7] p-5">
        {variant === "resume" ? <MockResumeCard /> : <MockCoverCard />}
        <h3
          className="mt-4 text-[16px] font-semibold leading-tight text-slate-900"
          style={DISPLAY}
        >
          {title}
        </h3>
        <p className="mt-1.5 text-[12px] leading-[1.5] text-slate-600">
          {desc}
        </p>
        <button
          onClick={() => {
            navigate(ctaTo);
            onClose();
          }}
          className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-slate-900 px-4 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#FF4800]"
        >
          {ctaLabel}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function MockResumeCard() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between border-b border-slate-100 pb-2">
        <div className="space-y-1">
          <div className="h-2 w-20 rounded-full bg-slate-900" />
          <div className="h-1 w-12 rounded-full bg-slate-300" />
        </div>
        <div
          className="h-4 w-4 rounded-full"
          style={{ backgroundColor: ACCENT }}
        />
      </div>
      <div className="mt-2.5 space-y-1">
        <div className="h-1 w-full rounded-full bg-slate-200" />
        <div className="h-1 w-5/6 rounded-full bg-slate-200" />
      </div>
      <div className="mt-3 h-1.5 w-14 rounded-full bg-slate-800" />
      <div className="mt-1 space-y-1">
        <div className="h-1 w-full rounded-full bg-slate-200" />
        <div className="h-1 w-4/5 rounded-full bg-slate-200" />
        <div className="h-1 w-2/3 rounded-full bg-slate-200" />
      </div>
      <div className="mt-3 h-1.5 w-10 rounded-full bg-slate-800" />
      <div className="mt-1 flex gap-1">
        <div className="h-3 w-9 rounded bg-slate-100" />
        <div className="h-3 w-7 rounded bg-slate-100" />
        <div className="h-3 w-10 rounded bg-slate-100" />
      </div>
    </div>
  );
}

function MockCoverCard() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        <div
          className="h-5 w-5 rounded-md"
          style={{ backgroundColor: ACCENT }}
        />
        <div className="space-y-1">
          <div className="h-1.5 w-16 rounded-full bg-slate-900" />
          <div className="h-1 w-10 rounded-full bg-slate-300" />
        </div>
      </div>
      <div className="mt-2.5 h-1 w-1/3 rounded-full bg-slate-300" />
      <div className="mt-2 space-y-1">
        <div className="h-1 w-full rounded-full bg-slate-200" />
        <div className="h-1 w-full rounded-full bg-slate-200" />
        <div className="h-1 w-5/6 rounded-full bg-slate-200" />
        <div className="h-1 w-4/6 rounded-full bg-slate-200" />
      </div>
      <div className="mt-2.5 space-y-1">
        <div className="h-1 w-full rounded-full bg-slate-200" />
        <div className="h-1 w-3/4 rounded-full bg-slate-200" />
      </div>
      <div className="mt-3 h-1.5 w-14 rounded-full bg-slate-800" />
    </div>
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
