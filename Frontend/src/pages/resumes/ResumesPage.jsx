import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  FileText,
  Search,
  Grid,
  List,
  ChevronDown,
  Plus,
  LoaderCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { getAllResumeData } from "@/Services/resumeAPI";
import { toast } from "sonner";
import AddResume from "@/pages/dashboard/components/AddResume";
import ResumeCard from "@/pages/dashboard/components/ResumeCard";

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants = {
  hidden:  { y: 16, opacity: 0 },
  visible: { y: 0,  opacity: 1, transition: { type: "spring", stiffness: 120, damping: 14 } },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az",     label: "A → Z"        },
];

export default function ResumesPage() {
  const navigate = useNavigate();
  const user     = useSelector((s) => s.editUser.userData);

  const [resumeList,   setResumeList]   = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading,    setIsLoading]    = useState(true);
  const [viewMode,     setViewMode]     = useState("list");
  const [searchQuery,  setSearchQuery]  = useState("");
  const [sortOption,   setSortOption]   = useState("newest");
  const [showSort,     setShowSort]     = useState(false);

  const sortRef    = useRef(null);
  const addBtnRef  = useRef(null);

  // ── fetch ────────────────────────────────────────────────────────────────
  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const res = await getAllResumeData();
      setResumeList(res.data || []);
    } catch {
      toast.error("Failed to load resumes", {
        action: { label: "Retry", onClick: fetchResumes },
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchResumes(); }, [user]);

  // ── outside click closes sort ────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── filter + sort ────────────────────────────────────────────────────────
  useEffect(() => {
    let list = [...resumeList];
    if (searchQuery.trim())
      list = list.filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
    if (sortOption === "newest")      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    else if (sortOption === "oldest") list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    else if (sortOption === "az")     list.sort((a, b) => a.title.localeCompare(b.title));
    setFilteredList(list);
  }, [searchQuery, resumeList, sortOption]);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortOption)?.label || "";

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">

      {/* ════════ HERO HEADER ════════ */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* back nav */}
        <div className="relative z-10 px-8 pt-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </button>
        </div>

        {/* hero content */}
        <div className="relative z-10 px-8 pt-5 pb-8 flex items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div>
                <h1 className="text-2xl font-extrabold text-white leading-tight">My Resumes</h1>
                <p className="text-indigo-300 text-xs mt-0.5">
                  {isLoading ? "Loading…" : `${resumeList.length} resume${resumeList.length !== 1 ? "s" : ""} in your workspace`}
                </p>
              </div>
            </div>
          </div>

          {/* New Resume trigger — wraps AddResume in a hidden container,
              the visible button programmatically clicks the add-resume-trigger */}
          <div className="flex-shrink-0">
            <div className="hidden">
              <div ref={addBtnRef}>
                <AddResume viewMode="grid" />
              </div>
            </div>
            <button
              onClick={() => addBtnRef.current?.querySelector(".add-resume-trigger")?.click()}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-4 py-2.5 rounded-xl backdrop-blur-sm transition-all duration-200 shadow-lg"
            >
              <Plus className="h-4 w-4" /> New Resume
            </button>
          </div>
        </div>
      </div>

      {/* ════════ CONTROLS BAR ════════ */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-3 flex items-center gap-3 shadow-sm flex-shrink-0">

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search resumes…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 h-9 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 transition-colors"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* result count */}
        {!isLoading && (
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
            {searchQuery ? `${filteredList.length} of ${resumeList.length}` : resumeList.length} resume{resumeList.length !== 1 ? "s" : ""}
          </span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {/* Sort */}
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="h-9 px-3 flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm text-gray-700 dark:text-gray-200 hover:border-indigo-400 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
              {sortLabel}
              <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${showSort ? "rotate-180" : ""}`} />
            </button>
            {showSort && (
              <div className="absolute z-50 mt-1 right-0 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl py-1 overflow-hidden">
                {SORT_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => { setSortOption(value); setShowSort(false); }}
                    className={`w-full text-left px-3.5 py-2 text-sm flex items-center gap-2 transition-colors ${
                      sortOption === value
                        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {sortOption === value
                      ? <svg className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      : <span className="w-3.5" />
                    }
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            {[
              { mode: "grid", Icon: Grid },
              { mode: "list", Icon: List },
            ].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === mode
                    ? "bg-white dark:bg-gray-600 text-indigo-500 shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ════════ CONTENT ════════ */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-6">

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <LoaderCircle className="h-10 w-10 animate-spin text-indigo-500 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading your resumes…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={viewMode}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "flex flex-col gap-3"
              }
            >
              {/* Add Resume card — only when not searching */}
              {!searchQuery && (
                <motion.div variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                  <AddResume viewMode={viewMode} />
                </motion.div>
              )}

              {/* Resume cards */}
              {filteredList.map((resume) => (
                <motion.div key={resume._id} variants={itemVariants} className={viewMode === "list" ? "w-full" : ""}>
                  <ResumeCard resume={resume} refreshData={fetchResumes} viewMode={viewMode} />
                </motion.div>
              ))}

              {/* No search match */}
              {filteredList.length === 0 && searchQuery && (
                <motion.div variants={itemVariants} className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 shadow-inner">
                    <Search className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-700 dark:text-gray-300 mb-1">No results for "{searchQuery}"</h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">Try a different keyword</p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    Clear search
                  </button>
                </motion.div>
              )}

              {/* Empty state — zero resumes */}
              {resumeList.length === 0 && !searchQuery && (
                <motion.div variants={itemVariants} className="col-span-full flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 dark:from-indigo-500/20 dark:to-emerald-500/20 flex items-center justify-center mb-5 shadow-inner">
                    <FileText className="h-9 w-9 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">No resumes yet</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[260px] leading-relaxed">
                    Create your first resume and start building your career story.
                  </p>
                  <button
                    onClick={() => addBtnRef.current?.querySelector(".add-resume-trigger")?.click()}
                    className="mt-6 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-900/20 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> Create Your First Resume
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
