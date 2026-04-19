import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Check,
} from "lucide-react";
import { toast } from "sonner";
import AddResume from "@/pages/dashboard/components/AddResume";
import ResumeCard from "@/pages/dashboard/components/ResumeCard";
import { useResumeListQuery } from "@/hooks/useAppQueryData";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 140, damping: 16 },
  },
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "az", label: "A to Z" },
];

export default function ResumesPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.editUser.userData);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [showSort, setShowSort] = useState(false);
  const sortRef = useRef(null);
  const addBtnRef = useRef(null);

  const resumeListQuery = useResumeListQuery({ enabled: Boolean(user) });
  const resumeList = resumeListQuery.data || [];
  const isLoading = resumeListQuery.isPending && !resumeListQuery.data;
  const fetchResumes = () => resumeListQuery.refetch();

  const filteredList = useMemo(() => {
    let list = [...resumeList];

    if (searchQuery.trim()) {
      list = list.filter((resume) =>
        resume.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortOption === "newest") {
      list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } else if (sortOption === "oldest") {
      list.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else if (sortOption === "az") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [resumeList, searchQuery, sortOption]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSort(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (resumeListQuery.isError) {
      toast.error("Failed to load resumes", {
        action: { label: "Retry", onClick: fetchResumes },
      });
    }
  }, [resumeListQuery.isError]);

  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sortOption)?.label || "";

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
      {/* Header band */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-6 lg:px-10">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>
        </div>

        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 pb-10 pt-5 lg:flex-row lg:items-end lg:px-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-slate-600">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              Workspace
            </span>
            <h1
              style={DISPLAY}
              className="mt-4 text-[40px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[48px]"
            >
              My Resumes
            </h1>
            <p className="mt-2 text-[14px] text-slate-500">
              {isLoading
                ? "Loading…"
                : `${resumeList.length} resume${resumeList.length !== 1 ? "s" : ""} in your workspace`}
            </p>
          </div>

          <div className="flex-shrink-0">
            <div className="hidden">
              <div ref={addBtnRef}>
                <AddResume viewMode="grid" />
              </div>
            </div>
            <button
              onClick={() =>
                addBtnRef.current
                  ?.querySelector(".add-resume-trigger")
                  ?.click()
              }
              className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#FF4800]"
            >
              <Plus className="h-4 w-4" />
              New Resume
            </button>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-6 py-3 lg:px-10">
          <div className="relative w-full max-w-sm flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search resumes…"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-full rounded-full border border-slate-200 bg-white pl-9 pr-9 text-[13px] text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {!isLoading && (
            <span className="hidden text-[12px] text-slate-500 sm:block">
              {searchQuery
                ? `${filteredList.length} of ${resumeList.length}`
                : resumeList.length}{" "}
              resume{resumeList.length !== 1 ? "s" : ""}
            </span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex h-10 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-[12.5px] font-medium text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
                {sortLabel}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-slate-400 transition-transform ${
                    showSort ? "rotate-180" : ""
                  }`}
                />
              </button>
              {showSort && (
                <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  {SORT_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => {
                        setSortOption(value);
                        setShowSort(false);
                      }}
                      className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-[13px] transition-colors ${
                        sortOption === value
                          ? "font-semibold text-slate-900"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {sortOption === value ? (
                        <Check
                          className="h-3.5 w-3.5 flex-shrink-0"
                          style={{ color: ACCENT }}
                        />
                      ) : (
                        <span className="w-3.5" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center rounded-full border border-slate-200 bg-white p-1">
              {[
                { mode: "grid", Icon: Grid },
                { mode: "list", Icon: List },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`rounded-full p-1.5 transition-colors ${
                    viewMode === mode
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#FAFAF9]">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <LoaderCircle
                className="mb-3 h-8 w-8 animate-spin"
                style={{ color: ACCENT }}
              />
              <p className="text-[13px] text-slate-500">
                Loading your resumes…
              </p>
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
                      refreshData={fetchResumes}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}

                {filteredList.length === 0 && searchQuery && (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white">
                      <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <h3
                      style={DISPLAY}
                      className="text-[22px] font-semibold tracking-tight text-slate-900"
                    >
                      No results for "{searchQuery}"
                    </h3>
                    <p className="mt-1 text-[13px] text-slate-500">
                      Try a different keyword
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-900 px-4 text-[12.5px] font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                    >
                      Clear search
                    </button>
                  </motion.div>
                )}

                {resumeList.length === 0 && !searchQuery && (
                  <motion.div
                    variants={itemVariants}
                    className="col-span-full flex flex-col items-center justify-center py-24 text-center"
                  >
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                      <FileText
                        className="h-6 w-6"
                        style={{ color: ACCENT }}
                      />
                    </div>
                    <h3
                      style={DISPLAY}
                      className="text-[26px] font-semibold tracking-tight text-slate-900"
                    >
                      No resumes yet
                    </h3>
                    <p className="mt-2 max-w-sm text-[13.5px] leading-relaxed text-slate-500">
                      Create your first resume and start building your career
                      story.
                    </p>
                    <button
                      onClick={() =>
                        addBtnRef.current
                          ?.querySelector(".add-resume-trigger")
                          ?.click()
                      }
                      className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#FF4800]"
                    >
                      <Plus className="h-4 w-4" />
                      Create your first resume
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
