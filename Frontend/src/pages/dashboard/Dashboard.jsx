// C:\Users\NxtWave\Downloads\AiResumeBuilder-3\Frontend\src\pages\dashboard\Dashboard.jsx

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/Services/login";
import { addUserData } from "@/features/user/userFeatures";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import ATSScoreChecker from "./components/ATSScoreChecker";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaKey, FaSignOutAlt, FaBell } from "react-icons/fa";
import {
  Search,
  Grid,
  List,
  Plus,
  FileText,
  PieChart,
  ChevronDown,
  Clock,
  ArrowUpDown,
  LoaderCircle,
  Briefcase,
  GraduationCap,
  FolderGit,
  Award,
  Edit,
  BadgePlus,
  PlusCircle,
  User,
  Filter,
  SlidersHorizontal,
  Moon,
  Sun,
  LayoutDashboard,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useResumeListQuery } from "@/hooks/useAppQueryData";

// Animated User Icon Component
const AnimatedUserIcon = ({ fullName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayLetter, setDisplayLetter] = useState('');

  // Get all letters from the full name (remove spaces and convert to uppercase)
  const letters = fullName ? fullName.replace(/\s+/g, '').toUpperCase().split('') : ['U'];

  useEffect(() => {
    if (letters.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % letters.length);
    }, 2000); // Change letter every 2 seconds

    return () => clearInterval(interval);
  }, [letters.length]);

  useEffect(() => {
    setDisplayLetter(letters[currentIndex] || 'U');
  }, [currentIndex, letters]);

  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -30, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.4
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {displayLetter}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// More compact, visually appealing stat card component
const StatCard = ({ icon, label, count, className = "" }) => (
  <div className={`flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
    <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 p-1.5 rounded-md">
      {React.cloneElement(icon, { className: "w-4 h-4 text-indigo-600 dark:text-indigo-400" })}
    </div>
    <div>
      <span className="text-base font-bold text-gray-800 dark:text-white leading-none">{count}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">{label}</span>
    </div>
  </div>
);

function Dashboard() {
  const { darkMode, toggleDarkMode } = useOutletContext();
  const user = useSelector((state) => state.editUser.userData);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [showATSModal, setShowATSModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const sortDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const resumeListQuery = useResumeListQuery({ enabled: Boolean(user) });
  const resumeList = resumeListQuery.data || [];
  const isLoading = resumeListQuery.isPending && !resumeListQuery.data;
  const filteredList = useMemo(() => {
    let filtered = [...resumeList];
    if (searchQuery.trim()) {
      filtered = filtered.filter((resume) =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortOption === "newest") filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    else if (sortOption === "oldest") filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (sortOption === "alphabetical") filtered.sort((a, b) => a.title.localeCompare(b.title));
    return filtered;
  }, [resumeList, searchQuery, sortOption]);

  const profileCompletion = useMemo(() => {
    if (!user || typeof user !== 'object') return 0;
    let completed = 0;
    const total = 8;
    if ((user.firstName || user.fullName) && user.email) completed++;
    if (user.summary?.trim()) completed++;
    if (user.experience?.length > 0) completed++;
    if (user.projects?.length > 0) completed++;
    if (user.education?.length > 0) completed++;
    if (user.skills?.length > 0) completed++;
    if (user.certifications?.length > 0) completed++;
    if (user.additionalSections?.length > 0) completed++;
    return Math.round((completed / total) * 100);
  }, [user]);

  const isDarkMode = document.documentElement.classList.contains('dark');
  const refreshResumeData = () => resumeListQuery.refetch();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { y: 15, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 120, damping: 12 } } };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user.fullName ? user.fullName.split(' ')[0] : 'User';
    if (hour < 12) return `Good morning, ${firstName}`;
    if (hour < 18) return `Good afternoon, ${firstName}`;
    return `Good evening, ${firstName}`;
  };

  const getLastUpdatedDate = () => {
    if (resumeList.length > 0) {
      return new Date(Math.max(...resumeList.map(r => new Date(r.updatedAt)))).toLocaleDateString();
    }
    return "-";
  };

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { key: "resumes",   label: "Resumes",   icon: <FileText        className="h-4 w-4" /> },
    { key: "profile",   label: "Profile",   icon: <User            className="h-4 w-4" /> },
    { key: "ats",       label: "ATS Checker", icon: <PieChart      className="h-4 w-4" /> },
    { key: "help",      label: "Help",      icon: <HelpCircle      className="h-4 w-4" /> },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 dark:bg-gray-900">

      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-60 flex-shrink-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex flex-col h-screen shadow-xl z-20">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <NxtResumeLogoMark className="h-9 w-9" />
            <span className="text-white font-bold text-base">NxtResume</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => {
                if (key === "ats")     { navigate("/ats-checker");   return; }
                if (key === "resumes") { navigate("/resumes");       return; }
                if (key === "profile") { navigate("/profile");       return; }
                if (key === "help")    { navigate("/documentation"); return; }
                setActiveNav(key);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeNav === key
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                  : "text-indigo-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              {icon}
              {label}
              {key === "resumes" && (
                <span className={`ml-auto text-xs px-1.5 py-0.5 rounded-full font-bold ${activeNav === key ? "bg-white/20 text-white" : "bg-white/10 text-indigo-300"}`}>
                  {resumeList.length}
                </span>
              )}
              {key === "profile" && (() => {
                const size = 26;
                const strokeWidth = 2.5;
                const radius = (size - strokeWidth) / 2;
                const circumference = 2 * Math.PI * radius;
                const offset = circumference - (profileCompletion / 100) * circumference;
                const color = profileCompletion >= 80 ? '#34d399' : profileCompletion >= 50 ? '#fbbf24' : '#f87171';
                return (
                  <div className="relative ml-auto flex-shrink-0" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="-rotate-90">
                      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
                      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-700" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold" style={{ color }}>
                      {profileCompletion}
                    </span>
                  </div>
                );
              })()}
            </button>
          ))}
        </nav>

        {/* Profile button at bottom — dropdown opens up-right */}
        <div className="px-3 py-4 border-t border-white/10 flex-shrink-0" ref={profileDropdownRef}>
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-indigo-200 hover:bg-white/10 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="truncate text-xs font-semibold text-white leading-tight">{user.fullName || "User"}</p>
              <p className="truncate text-[10px] text-indigo-400 leading-tight">{user.email || ""}</p>
            </div>
            <ChevronUp className={`h-3.5 w-3.5 flex-shrink-0 transition-transform ${userDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Dropdown — pops up and to the RIGHT of sidebar */}
          {userDropdownOpen && (
            <div className="fixed bottom-16 left-60 ml-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-[9999] py-2 text-left">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.fullName || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 break-all mt-0.5">{user.email || ""}</p>
              </div>
              <div className="px-4 py-2 space-y-1">
                <div className="flex justify-between text-xs py-1">
                  <span className="text-gray-500 dark:text-gray-400">Student ID</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">{user.niatId || "—"}</span>
                </div>
              </div>
              <div className="px-4 py-1 border-t border-gray-100 dark:border-gray-700 space-y-0.5">
                <button
                  onClick={() => { navigate('/profile'); setUserDropdownOpen(false); }}
                  className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center gap-2 py-1.5"
                >
                  <FaEdit className="w-3 h-3" /> Edit Profile
                </button>
                <button
                  onClick={() => { navigate('/notifications'); setUserDropdownOpen(false); }}
                  className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center gap-2 py-1.5"
                >
                  <FaBell className="w-3 h-3" /> Notifications
                </button>
                <button
                  onClick={() => { navigate('/change-password'); setUserDropdownOpen(false); }}
                  className="w-full text-left text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 flex items-center gap-2 py-1.5"
                >
                  <FaKey className="w-3 h-3" /> Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm text-red-500 hover:text-red-700 flex items-center gap-2 py-1.5"
                >
                  <FaSignOutAlt className="w-3 h-3" /> Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">{getGreeting()} 👋</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Toolbar: search + sort + view + dark mode toggle */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-56 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg h-9 text-sm"
              />
            </div>

            <div ref={sortDropdownRef} className="relative z-50">
              <Button
                variant="outline"
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="h-9 rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm flex items-center"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
                {sortOption === "newest" && "Newest first"}
                {sortOption === "oldest" && "Oldest first"}
                {sortOption === "alphabetical" && "A to Z"}
                <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
              </Button>
              {showSortOptions && (
                <div className="absolute z-[9999] mt-1 right-0 w-44 rounded-md shadow-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
                  <div className="py-1">
                    {[
                      { value: "newest", label: "Newest first" },
                      { value: "oldest", label: "Oldest first" },
                      { value: "alphabetical", label: "A to Z" },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => { setSortOption(value); setShowSortOptions(false); }}
                        className={`w-full text-left px-3 py-2 text-sm ${sortOption === value ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"}`}
                      >
                        <div className="flex items-center">
                          {sortOption === value && <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                          <span className={sortOption === value ? "" : "ml-6"}>{label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg flex p-1">
              <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white dark:bg-gray-600 text-emerald-500 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                <Grid className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white dark:bg-gray-600 text-emerald-500 shadow-sm" : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button onClick={toggleDarkMode} variant="outline" size="icon" className="h-9 w-9 border-gray-200 dark:border-gray-600">
              {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </Button>
          </div>
        </header>

        {/* Stats row */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex items-center gap-4">
          {[
            { icon: <FileText  className="h-4 w-4 text-indigo-500"  />, label: "Resumes",    value: resumeList.length },
            { icon: <Briefcase className="h-4 w-4 text-blue-500"    />, label: "Experience", value: user.experience?.length    || 0 },
            { icon: <BadgePlus className="h-4 w-4 text-emerald-500" />, label: "Skills",     value: user.skills?.length        || 0 },
            { icon: <Award     className="h-4 w-4 text-amber-500"   />, label: "Certs",      value: user.certifications?.length || 0 },
            { icon: <FolderGit className="h-4 w-4 text-purple-500"  />, label: "Projects",   value: user.projects?.length      || 0 },
            { icon: <Clock     className="h-4 w-4 text-gray-400"    />, label: "Last Updated", value: getLastUpdatedDate() },
          ].map(({ icon, label, value }) => (
            <div key={label} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
              {icon}
              <span className="text-sm font-bold text-gray-800 dark:text-white">{value}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
            </div>
          ))}
        </div>

        {/* Resume cards — only this scrolls */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <LoaderCircle className="h-10 w-10 animate-spin text-indigo-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Loading your resumes...</p>
              </div>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                key={viewMode}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4" : "flex flex-col space-y-3"}
              >
                {!searchQuery && (
                  <motion.div variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                    <AddResume viewMode={viewMode} />
                  </motion.div>
                )}
                {filteredList.map((resume) => (
                  <motion.div key={resume._id} variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                  <ResumeCard resume={resume} refreshData={refreshResumeData} viewMode={viewMode} />
                  </motion.div>
                ))}
                {filteredList.length === 0 && searchQuery && (
                  <div className="col-span-full text-center py-16">
                    <Search className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">No matches found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Try adjusting your search query</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      <ATSScoreChecker isOpen={showATSModal} onClose={() => setShowATSModal(false)} resumes={resumeList} />
    </div>
  );
}

export default Dashboard;
