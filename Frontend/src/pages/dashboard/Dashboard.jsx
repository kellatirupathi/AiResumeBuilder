import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "react-router-dom";
import {
  Search,
  Grid,
  List,
  FileText,
  PieChart,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  User,
  SlidersHorizontal,
  Moon,
  Sun,
  LayoutDashboard,
  HelpCircle,
  LogOut,
  CircleAlert,
  Sparkles,
  Mail,
  Edit,
  Bell,
  Key,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import { getAllCoverLetters } from "@/Services/coverLetterAPI";
import { resolveApiData } from "@/lib/queryCacheUtils";
import {
  useProfileQuery,
  useResumeListQuery,
} from "@/hooks/useAppQueryData";
import { getProfileCompletionDetails } from "@/lib/profileCompletion";

import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import AddCoverLetter from "./components/AddCoverLetter";
import CoverLetterCard from "./components/CoverLetterCard";
import ATSScoreChecker from "./components/ATSScoreChecker";

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const PROFILE_COACHMARK_DISMISSED_KEY = "dashboard-profile-coachmark-dismissed";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "alphabetical", label: "A to Z" },
];

function Dashboard() {
  const { darkMode, toggleDarkMode } = useOutletContext();
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── UI state ──
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [showATSModal, setShowATSModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");

  // ── Tab state (URL-synced) ──
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTabState] = useState(
    searchParams.get("tab") === "cover-letters" ? "cover-letters" : "resumes"
  );
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    setSearchParams({ tab }, { replace: true });
  };
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "cover-letters") setActiveTabState("cover-letters");
    else if (tab === "resumes") setActiveTabState("resumes");
  }, [searchParams]);

  // ── Cover letters (local list) ──
  const [coverLetterList, setCoverLetterList] = useState([]);
  const [isCoverLettersLoading, setIsCoverLettersLoading] = useState(false);

  // ── Coachmark ──
  const [showProfileCoachmark, setShowProfileCoachmark] = useState(false);
  const [coachmarkPosition, setCoachmarkPosition] = useState({
    top: 24,
    left: 280,
  });

  // ── Refs ──
  const sortDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const profileNavRef = useRef(null);

  // ── Data ──
  const resumeListQuery = useResumeListQuery({ enabled: Boolean(user) });
  const profileQuery = useProfileQuery({
    enabled: Boolean(user),
    initialData:
      user && typeof user === "object" && "_id" in user ? user : undefined,
  });
  const resumeList = resumeListQuery.data || [];
  const isLoading = resumeListQuery.isPending && !resumeListQuery.data;

  const filteredList = useMemo(() => {
    let list = [...resumeList];
    if (searchQuery.trim()) {
      list = list.filter((r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOption === "newest")
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    else if (sortOption === "oldest")
      list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (sortOption === "alphabetical")
      list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [resumeList, searchQuery, sortOption]);

  const filteredCoverLetters = useMemo(() => {
    let list = [...coverLetterList];
    if (searchQuery.trim()) {
      list = list.filter((cl) =>
        (cl.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOption === "newest")
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    else if (sortOption === "oldest")
      list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (sortOption === "alphabetical")
      list.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    return list;
  }, [coverLetterList, searchQuery, sortOption]);

  const completionDetails = useMemo(
    () => getProfileCompletionDetails(profileQuery.data || user || {}),
    [profileQuery.data, user]
  );
  const profileCompletion = completionDetails.percentage;

  const refreshResumeData = () => resumeListQuery.refetch();

  const refreshCoverLetters = async () => {
    setIsCoverLettersLoading(true);
    try {
      const res = await getAllCoverLetters();
      const data = resolveApiData(res);
      setCoverLetterList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load cover letters", error);
    } finally {
      setIsCoverLettersLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    refreshCoverLetters();
  }, [user?._id]);

  useEffect(() => {
    if (resumeListQuery.isError) {
      toast.error("Failed to load resumes", {
        description: "Please try refreshing the page",
        action: { label: "Retry", onClick: () => refreshResumeData() },
      });
    }
  }, [resumeListQuery.isError]);

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.statusCode === 200) {
        dispatch(addUserData(""));
        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const dismissProfileCoachmark = () => {
    setShowProfileCoachmark(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(PROFILE_COACHMARK_DISMISSED_KEY, "true");
    }
  };

  // ── Click-outside handlers ──
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setShowSortOptions(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Coachmark visibility ──
  useEffect(() => {
    if (!user || profileQuery.isFetching) return;
    const dismissed =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(PROFILE_COACHMARK_DISMISSED_KEY) === "true";
    setShowProfileCoachmark(profileCompletion < 50 && !dismissed);
  }, [profileCompletion, profileQuery.isFetching, user]);

  // ── Coachmark positioning ──
  useEffect(() => {
    if (!showProfileCoachmark || !profileNavRef.current) return;

    if (
      typeof document !== "undefined" &&
      document.activeElement instanceof HTMLElement &&
      !profileNavRef.current.contains(document.activeElement)
    ) {
      document.activeElement.blur();
    }
    setShowSortOptions(false);

    const update = () => {
      if (!profileNavRef.current) return;
      const rect = profileNavRef.current.getBoundingClientRect();
      setCoachmarkPosition({
        top: Math.max(rect.top + rect.height / 2 - 110, 24),
        left: rect.right + 18,
      });
    };

    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [showProfileCoachmark]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { y: 12, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 14 },
    },
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.fullName ? user.fullName.split(" ")[0] : "User";
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 18) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const sortLabel =
    SORT_OPTIONS.find((o) => o.value === sortOption)?.label || "Sort";

  const navItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    { key: "resumes", label: "Resumes", icon: FileText },
    { key: "cover-letters", label: "Cover Letters", icon: Mail },
    { key: "profile", label: "Profile", icon: User },
    { key: "ats", label: "ATS Checker", icon: PieChart },
    { key: "help", label: "Help", icon: HelpCircle },
  ];

  const handleNav = (key) => {
    if (key === "ats") return navigate("/app/ats-checker");
    if (key === "resumes") return navigate("/app/resumes");
    if (key === "cover-letters") return navigate("/app/cover-letters");
    if (key === "profile") return navigate("/profile");
    if (key === "help") return navigate("/app/documentation");
    setActiveNav(key);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white text-slate-900 antialiased">
      {/* ═══════════════ SIDEBAR ═══════════════ */}
      <aside className="z-20 flex h-screen w-60 flex-shrink-0 flex-col border-r border-slate-200 bg-white">
        {/* Brand */}
        <div className="flex-shrink-0 px-5 py-5">
          <NxtResumeWordmark size="20px" color="#0F172A" />
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          {navItems.map(({ key, label, icon: Icon }) => {
            const active = activeNav === key;
            const isCoachTarget = showProfileCoachmark && key === "profile";
            return (
              <button
                key={key}
                ref={key === "profile" ? profileNavRef : null}
                onClick={() => handleNav(key)}
                className={`group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-slate-50 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                } ${
                  isCoachTarget
                    ? "z-40 ring-2 ring-amber-300 ring-offset-2 ring-offset-white"
                    : ""
                }`}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                    style={{ backgroundColor: ACCENT }}
                  />
                )}
                <Icon
                  className={`h-4 w-4 ${
                    active ? "text-slate-900" : "text-slate-500"
                  }`}
                />
                <span>{label}</span>

                {key === "resumes" && (
                  <span
                    className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {resumeList.length}
                  </span>
                )}

                {key === "cover-letters" && (
                  <span
                    className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === "cover-letters"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {coverLetterList.length}
                  </span>
                )}

                {key === "profile" &&
                  (() => {
                    const size = 24;
                    const stroke = 2.5;
                    const r = (size - stroke) / 2;
                    const circ = 2 * Math.PI * r;
                    const offset = circ - (profileCompletion / 100) * circ;
                    const color =
                      profileCompletion >= 80
                        ? "#10B981"
                        : profileCompletion >= 50
                        ? "#F59E0B"
                        : ACCENT;
                    return (
                      <div
                        className="relative ml-auto flex-shrink-0"
                        style={{ width: size, height: size }}
                      >
                        <svg
                          width={size}
                          height={size}
                          className="-rotate-90"
                        >
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke="rgba(15,23,42,0.08)"
                            strokeWidth={stroke}
                          />
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={color}
                            strokeWidth={stroke}
                            strokeDasharray={circ}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                        </svg>
                        <span
                          className="absolute inset-0 flex items-center justify-center text-[7px] font-bold"
                          style={{ color }}
                        >
                          {profileCompletion}
                        </span>
                      </div>
                    );
                  })()}
              </button>
            );
          })}
        </nav>

        {/* Profile at bottom */}
        <div
          className="relative flex-shrink-0 border-t border-slate-200 px-3 py-3"
          ref={profileDropdownRef}
        >
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-slate-900">
                {user?.fullName || "User"}
              </p>
              <p className="truncate text-[10.5px] text-slate-500">
                {user?.email || ""}
              </p>
            </div>
            <ChevronUp
              className={`h-3.5 w-3.5 flex-shrink-0 text-slate-400 transition-transform ${
                userDropdownOpen ? "" : "rotate-180"
              }`}
            />
          </button>

          {userDropdownOpen && (
            <div className="fixed bottom-16 left-60 ml-2 z-[9999] w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {user?.fullName || "User"}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user?.email || ""}
                </p>
              </div>
              <div className="px-4 py-2">
                <div className="flex items-center justify-between py-1 text-[11.5px]">
                  <span className="text-slate-500">Student ID</span>
                  <span className="font-mono text-slate-700">
                    {user?.niatId || "—"}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 py-1">
                <DropdownItem
                  icon={<Edit className="h-3.5 w-3.5" />}
                  label="Edit profile"
                  onClick={() => {
                    navigate("/profile");
                    setUserDropdownOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<Bell className="h-3.5 w-3.5" />}
                  label="Notifications"
                  onClick={() => {
                    navigate("/notifications");
                    setUserDropdownOpen(false);
                  }}
                />
                <DropdownItem
                  icon={<Key className="h-3.5 w-3.5" />}
                  label="Change password"
                  onClick={() => {
                    navigate("/change-password");
                    setUserDropdownOpen(false);
                  }}
                />
              </div>
              <div className="border-t border-slate-100 py-1">
                <DropdownItem
                  icon={<LogOut className="h-3.5 w-3.5" />}
                  label="Sign out"
                  onClick={handleLogout}
                  danger
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ═══════════════ COACHMARK OVERLAY ═══════════════ */}
      {showProfileCoachmark && (
        <>
          <div className="pointer-events-none fixed inset-0 z-30 bg-slate-950/45" />
          <div
            className="fixed z-40 hidden w-[340px] rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl lg:block"
            style={{
              top: `${coachmarkPosition.top}px`,
              left: `${coachmarkPosition.left}px`,
            }}
          >
            <div className="absolute left-[-10px] top-24 h-5 w-5 rotate-45 border-b border-l border-slate-200 bg-white" />
            <div className="mb-3 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${ACCENT}18`,
                  color: ACCENT,
                }}
              >
                <CircleAlert className="h-5 w-5" />
              </div>
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: ACCENT }}
                >
                  Quick start
                </p>
                <h3
                  className="text-[20px] font-semibold tracking-tight text-slate-900"
                  style={DISPLAY}
                >
                  Complete your profile
                </h3>
              </div>
            </div>

            <p className="text-[13px] leading-relaxed text-slate-600">
              Your profile is {profileCompletion}% complete. Finish at least
              50% so your details stay ready across the app.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <span>Progress</span>
                <span>{profileCompletion}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max(profileCompletion, 8)}%`,
                    backgroundColor: ACCENT,
                  }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {completionDetails.missingSections.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                className="rounded-full border-slate-200"
                onClick={dismissProfileCoachmark}
              >
                Maybe later
              </Button>
              <Button
                className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => {
                  dismissProfileCoachmark();
                  navigate("/profile");
                }}
              >
                <Sparkles className="mr-1.5 h-4 w-4" />
                Complete profile
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════ MAIN ═══════════════ */}
      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex flex-shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h1
              className="text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
              style={DISPLAY}
            >
              {getGreeting()}
            </h1>
            <p className="mt-0.5 text-[11.5px] text-slate-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={`Search ${activeTab === "resumes" ? "resumes" : "cover letters"}…`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-60 rounded-lg border-slate-200 bg-white pl-9 text-[13px] focus-visible:ring-slate-900/10"
              />
            </div>

            {/* Sort */}
            <div
              ref={sortDropdownRef}
              className={`relative ${showProfileCoachmark ? "z-0" : "z-50"}`}
            >
              <Button
                variant="outline"
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="h-9 gap-1.5 rounded-lg border-slate-200 bg-white text-[13px] font-medium text-slate-700"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500" />
                {sortLabel}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                    showSortOptions ? "rotate-180" : ""
                  }`}
                />
              </Button>
              {showSortOptions && (
                <div
                  className={`absolute right-0 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg ${
                    showProfileCoachmark ? "z-20" : "z-[9999]"
                  }`}
                >
                  <div className="py-1">
                    {SORT_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => {
                          setSortOption(value);
                          setShowSortOptions(false);
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-[13px] ${
                          sortOption === value
                            ? "bg-slate-50 font-medium text-slate-900"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {sortOption === value ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <span className="w-3.5" />
                        )}
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-0 rounded-lg border border-slate-200 bg-white p-0.5">
              {[
                { mode: "grid", Icon: Grid },
                { mode: "list", Icon: List },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === mode
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>

            {/* Dark mode */}
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-slate-200 bg-white"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-amber-500" />
              ) : (
                <Moon className="h-4 w-4 text-slate-700" />
              )}
            </Button>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex-shrink-0 border-b border-slate-200 bg-white px-6">
          <div className="flex gap-0">
            <TabButton
              active={activeTab === "resumes"}
              onClick={() => setActiveTab("resumes")}
              icon={<FileText className="h-3.5 w-3.5" />}
              label="Resumes"
              count={resumeList.length}
            />
            <TabButton
              active={activeTab === "cover-letters"}
              onClick={() => setActiveTab("cover-letters")}
              icon={<Mail className="h-3.5 w-3.5" />}
              label="Cover Letters"
              count={coverLetterList.length}
            />
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAF9] px-6 py-6">
          {activeTab === "resumes" ? (
            isLoading ? (
              <LoadingBlock label="Loading your resumes…" />
            ) : (
              <AnimatePresence>
                <motion.div
                  key={`resumes-${viewMode}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                      : "flex flex-col gap-3"
                  }
                >
                  {!searchQuery && (
                    <motion.div
                      variants={itemVariants}
                      className={viewMode === "list" ? "w-full" : ""}
                    >
                      <AddResume viewMode={viewMode} />
                    </motion.div>
                  )}
                  {filteredList.map((resume) => (
                    <motion.div
                      key={resume._id}
                      variants={itemVariants}
                      className={viewMode === "list" ? "w-full" : ""}
                    >
                      <ResumeCard
                        resume={resume}
                        refreshData={refreshResumeData}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                  {filteredList.length === 0 && searchQuery && (
                    <EmptySearch query={searchQuery} />
                  )}
                </motion.div>
              </AnimatePresence>
            )
          ) : isCoverLettersLoading ? (
            <LoadingBlock label="Loading your cover letters…" />
          ) : (
            <AnimatePresence>
              <motion.div
                key={`cover-letters-${viewMode}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                    : "flex flex-col gap-3"
                }
              >
                {!searchQuery && (
                  <motion.div
                    variants={itemVariants}
                    className={viewMode === "list" ? "w-full" : ""}
                  >
                    <AddCoverLetter
                      viewMode={viewMode}
                      onCreated={refreshCoverLetters}
                    />
                  </motion.div>
                )}
                {filteredCoverLetters.map((cl) => (
                  <motion.div
                    key={cl._id}
                    variants={itemVariants}
                    className={viewMode === "list" ? "w-full" : ""}
                  >
                    <CoverLetterCard
                      coverLetter={cl}
                      refreshData={refreshCoverLetters}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
                {filteredCoverLetters.length === 0 && searchQuery && (
                  <EmptySearch query={searchQuery} />
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <ATSScoreChecker
        isOpen={showATSModal}
        onClose={() => setShowATSModal(false)}
        resumes={resumeList}
      />
    </div>
  );
}

// ── Small components ─────────────────────────────────────────────────
function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`group relative -mb-px flex items-center gap-1.5 border-b-2 px-3 py-3 text-[13px] font-medium transition-colors ${
        active
          ? "border-slate-900 text-slate-900"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      {active && (
        <span
          className="absolute bottom-[-2px] left-0 right-0 h-[2px]"
          style={{ backgroundColor: ACCENT }}
        />
      )}
      {icon}
      {label}
      <span
        className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
          active
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function DropdownItem({ icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 px-4 py-2 text-left text-[12.5px] transition-colors ${
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

function LoadingBlock({ label }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <LoaderCircle className="mx-auto mb-3 h-8 w-8 animate-spin text-slate-400" />
        <p className="text-[13px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function EmptySearch({ query }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <Search className="h-6 w-6 text-slate-400" />
      </div>
      <h3
        className="text-[18px] font-semibold tracking-tight text-slate-900"
        style={{ fontFamily: "Fraunces, Georgia, serif" }}
      >
        No results for "{query}"
      </h3>
      <p className="mt-1 text-[13px] text-slate-500">
        Try a different keyword
      </p>
    </div>
  );
}

export default Dashboard;
