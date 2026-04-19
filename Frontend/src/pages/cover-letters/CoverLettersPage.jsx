import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Search,
  Grid,
  List,
  ChevronDown,
  Plus,
  LoaderCircle,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import AddCoverLetter from "@/pages/dashboard/components/AddCoverLetter";
import CoverLetterCard from "@/pages/dashboard/components/CoverLetterCard";
import { getAllCoverLetters } from "@/Services/coverLetterAPI";
import { resolveApiData } from "@/lib/queryCacheUtils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 16, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A to Z" },
];

export default function CoverLettersPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.editUser.userData);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);
  const addBtnRef = useRef(null);

  const [coverLetters, setCoverLetters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchCoverLetters = async () => {
    if (!user) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getAllCoverLetters();
      const list = resolveApiData(res) || [];
      setCoverLetters(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error("Failed to load cover letters", error);
      setIsError(true);
      setCoverLetters([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverLetters();
  }, [user?._id]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load cover letters", {
        action: { label: "Retry", onClick: fetchCoverLetters },
      });
    }
  }, [isError]);

  const filteredList = useMemo(() => {
    let list = [...coverLetters];

    if (searchQuery.trim()) {
      list = list.filter((cl) =>
        (cl.title || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "newest") {
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortOption === "oldest") {
      list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sortOption === "az") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return list;
  }, [coverLetters, searchQuery, sortOption]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOption)?.label || "";

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="relative z-10 px-8 pt-5">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>
        </div>

        <div className="relative z-10 flex items-end justify-between gap-6 px-8 pb-8 pt-5">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-extrabold leading-tight text-white">My Cover Letters</h1>
                <p className="mt-0.5 text-xs text-indigo-300">
                  {isLoading
                    ? "Loading..."
                    : `${coverLetters.length} cover letter${coverLetters.length !== 1 ? "s" : ""} in your workspace`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="hidden">
              <div ref={addBtnRef}>
                <AddCoverLetter viewMode="grid" onCreated={fetchCoverLetters} />
              </div>
            </div>
            <button
              onClick={() => addBtnRef.current?.querySelector(".add-cover-letter-trigger")?.click()}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
            >
              <Plus className="h-4 w-4" />
              New Cover Letter
            </button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-8 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cover letters..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-800 transition-colors placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {!isLoading && (
            <span className="hidden text-xs text-gray-400 dark:text-gray-500 sm:block">
              {searchQuery
                ? `${filteredList.length} of ${coverLetters.length}`
                : coverLetters.length}{" "}
              cover letter{coverLetters.length !== 1 ? "s" : ""}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 transition-colors hover:border-indigo-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
                {sortLabel}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-gray-400 transition-transform ${
                    showSort ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showSort && (
                <div className="absolute right-0 z-50 mt-1 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-600 dark:bg-gray-800">
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortOption(value);
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                        sortOption === value
                          ? "bg-indigo-50 font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                          : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {sortOption === value ? (
                        <svg
                          className="h-3.5 w-3.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <span className="w-3.5" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              {[
                { mode: "grid", Icon: Grid },
                { mode: "list", Icon: List },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-md p-1.5 transition-colors ${
                    viewMode === mode
                      ? "bg-white text-indigo-500 shadow-sm dark:bg-gray-600"
                      : "text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <LoaderCircle className="mb-3 h-10 w-10 animate-spin text-indigo-500" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading your cover letters...</p>
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
                  ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-3"
              }
            >
              {!searchQuery && (
                <motion.div
                  variants={itemVariants}
                  className={viewMode === "list" ? "w-full" : ""}
                >
                  <AddCoverLetter viewMode={viewMode} onCreated={fetchCoverLetters} />
                </motion.div>
              )}

              {filteredList.map((cl) => (
                <motion.div
                  key={cl._id}
                  variants={itemVariants}
                  className={viewMode === "list" ? "w-full" : ""}
                >
                  <CoverLetterCard coverLetter={cl} refreshData={fetchCoverLetters} viewMode={viewMode} />
                </motion.div>
              ))}

              {filteredList.length === 0 && searchQuery && (
                <motion.div
                  variants={itemVariants}
                  className="col-span-full flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 shadow-inner dark:bg-gray-800">
                    <Search className="h-7 w-7 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="mb-1 text-base font-bold text-gray-700 dark:text-gray-300">
                    No results for "{searchQuery}"
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Try a different keyword
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-4 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Clear search
                  </button>
                </motion.div>
              )}

              {coverLetters.length === 0 && !searchQuery && (
                <motion.div
                  variants={itemVariants}
                  className="col-span-full flex flex-col items-center justify-center py-24 text-center"
                >
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 shadow-inner dark:from-indigo-500/20 dark:to-emerald-500/20">
                    <Mail className="h-9 w-9 text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-gray-800 dark:text-white">
                    No cover letters yet
                  </h3>
                  <p className="max-w-[260px] text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                    Generate a tailored cover letter from your resume and a job description.
                  </p>
                  <button
                    onClick={() => addBtnRef.current?.querySelector(".add-cover-letter-trigger")?.click()}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/20 transition-colors hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Create Your First Cover Letter
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
