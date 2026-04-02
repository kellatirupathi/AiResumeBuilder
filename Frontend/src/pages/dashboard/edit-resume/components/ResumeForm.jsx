/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import PersonalDetails from "./form-components/PersonalDetails";
import Summary from "./form-components/Summary";
import Experience from "./form-components/Experience";
import Education from "./form-components/Education";
import Skills from "./form-components/Skills";
import Project from "./form-components/Project";
import FloatingResumeScore from "./FloatingResumeScore";
import {
  ArrowLeft,
  ArrowRight,
  User,
  FileText,
  Briefcase,
  FolderGit,
  GraduationCap,
  BadgePlus,
  CheckCircle2,
  Eye,
  Award,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ThemeColor from "./ThemeColor";
import CertificationsForm from "./form-components/CertificationsForm";
import ManageAdditionalSections from "./form-components/ManageAdditionalSections";

function ResumeForm({ onOpenAIReview, isAIReviewOpen = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enanbledNext, setEnabledNext] = useState(true);
  const [enanbledPrev, setEnabledPrev] = useState(true);
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const { resume_id } = useParams();
  const navigate = useNavigate();

  const sections = [
    { name: "Details", icon: <User className="h-4 w-4" /> },
    { name: "Summary", icon: <FileText className="h-4 w-4" /> },
    { name: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { name: "Projects", icon: <FolderGit className="h-4 w-4" /> },
    { name: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { name: "Skills", icon: <BadgePlus className="h-4 w-4" /> },
    { name: "Certifications", icon: <Award className="h-4 w-4" /> },
    { name: "Add Section", icon: <PlusCircle className="h-4 w-4" /> },
  ];

  useEffect(() => {
    setEnabledPrev(currentIndex > 0);
    setEnabledNext(currentIndex < sections.length - 1);
  }, [currentIndex, sections.length]);

  const calculateProgress = () => {
    if (!resumeInfo) return 0;
    const totalPossibleSections = 7 + (resumeInfo?.additionalSections?.length || 0);
    if (totalPossibleSections === 0) return 0;

    let completed = 0;
    if (resumeInfo.firstName && resumeInfo.lastName) completed++;
    if (resumeInfo.summary) completed++;
    if (resumeInfo.experience && resumeInfo.experience.length > 0) completed++;
    if (resumeInfo.projects && resumeInfo.projects.length > 0) completed++;
    if (resumeInfo.education && resumeInfo.education.length > 0) completed++;
    if (resumeInfo.skills && resumeInfo.skills.length > 0) completed++;
    if (resumeInfo.certifications && resumeInfo.certifications.length > 0) completed++;
    if (resumeInfo.additionalSections) {
      completed += resumeInfo.additionalSections.filter(s => s.content?.trim()).length;
    }
    return Math.round((completed / totalPossibleSections) * 100);
  };

  const isSectionComplete = (name) => {
    if (!resumeInfo) return false;
    switch (name) {
      case "Details": return !!(resumeInfo.firstName && resumeInfo.lastName);
      case "Summary": return !!resumeInfo.summary;
      case "Experience": return (resumeInfo.experience?.length || 0) > 0;
      case "Projects": return (resumeInfo.projects?.length || 0) > 0;
      case "Education": return (resumeInfo.education?.length || 0) > 0;
      case "Skills": return (resumeInfo.skills?.length || 0) > 0;
      case "Certifications": return (resumeInfo.certifications?.length || 0) > 0;
      default: return false;
    }
  };

  const progressPercent = calculateProgress();

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Compact Toolbar ── */}
      <div className="flex-shrink-0 flex items-center justify-between gap-2 border-b border-gray-100 bg-white px-3 py-2">
        <div className="flex items-center gap-2">
          <ThemeColor resumeInfo={resumeInfo} />

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenAIReview}
            className={`flex items-center gap-1.5 px-2.5 transition-colors duration-200 ${
              isAIReviewOpen
                ? "bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600"
                : "border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold hidden sm:inline">AI Review</span>
          </Button>

          <div className="hidden md:flex items-center gap-1 rounded-full bg-gray-50 border border-gray-200 px-2.5 py-1">
            <CheckCircle2 className={`h-3.5 w-3.5 flex-shrink-0 ${progressPercent === 100 ? "text-green-500" : "text-gray-400"}`} />
            <span className="text-xs font-medium text-gray-600">{progressPercent}%</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-colors px-2.5"
            onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="text-xs hidden sm:inline">Preview</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 px-2.5"
            disabled={!enanbledPrev}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="text-xs hidden sm:inline">Prev</span>
          </Button>

          <Button
            size="sm"
            className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-white shadow-sm disabled:opacity-40 px-2.5"
            disabled={!enanbledNext}
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            <span className="text-xs hidden sm:inline">Next</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div className="h-0.5 w-full bg-gray-100 flex-shrink-0">
        <div
          className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-700 ease-in-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ── Main Content: Section Nav + Form ── */}
      <div className="flex flex-1 min-h-0">

        {/* Vertical Section Sidebar — desktop */}
        <nav className="hidden sm:flex flex-col w-44 flex-shrink-0 border-r border-gray-100 bg-gray-50 py-2 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">Sections</p>
          {sections.map((section, idx) => {
            const complete = isSectionComplete(section.name);
            const active = currentIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`group relative flex items-center gap-2.5 w-full px-3 py-2.5 text-left transition-colors duration-150 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-gray-500 hover:bg-white hover:text-gray-800"
                }`}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute left-0 top-0 h-full w-0.5 rounded-r bg-primary" />
                )}

                <span className={`flex-shrink-0 transition-colors ${active ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`}>
                  {section.icon}
                </span>

                <span className={`flex-1 text-xs font-medium truncate ${active ? "text-primary" : ""}`}>
                  {section.name}
                </span>

                {/* Completion dot */}
                {complete && (
                  <CheckCircle2 className="h-3 w-3 flex-shrink-0 text-emerald-500" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Section Dots */}
        <div className="sm:hidden fixed bottom-16 left-0 right-0 z-20 flex items-center justify-center gap-1 px-4 py-1 bg-white/80 backdrop-blur-sm">
          {sections.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "bg-primary w-4" : idx < currentIndex ? "bg-primary/40 w-1.5" : "bg-gray-300 w-1.5"
              }`}
            />
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div>

            <FloatingResumeScore resumeInfo={resumeInfo} />

            <div className={currentIndex === 0 ? "block" : "hidden"}>
              <PersonalDetails resumeInfo={resumeInfo} enanbledNext={setEnabledNext} />
            </div>
            <div className={currentIndex === 1 ? "block" : "hidden"}>
              <Summary resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </div>
            <div className={currentIndex === 2 ? "block" : "hidden"}>
              <Experience resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </div>
            <div className={currentIndex === 3 ? "block" : "hidden"}>
              <Project resumeInfo={resumeInfo} setEnabledNext={setEnabledNext} setEnabledPrev={setEnabledPrev} />
            </div>
            <div className={currentIndex === 4 ? "block" : "hidden"}>
              <Education resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </div>
            <div className={currentIndex === 5 ? "block" : "hidden"}>
              <Skills resumeInfo={resumeInfo} enanbledNext={setEnabledNext} />
            </div>
            <div className={currentIndex === 6 ? "block" : "hidden"}>
              <CertificationsForm resumeInfo={resumeInfo} enanbledNext={setEnabledNext} enanbledPrev={setEnabledPrev} />
            </div>
            <div className={currentIndex === 7 ? "block" : "hidden"}>
              <ManageAdditionalSections resumeInfo={resumeInfo} />
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <div className="flex sm:hidden items-center justify-between border-t border-gray-100 bg-white px-4 py-2.5">
        <Button
          size="sm"
          variant="outline"
          className="flex items-center gap-1 border-gray-200 text-gray-600 px-3 disabled:opacity-40"
          disabled={!enanbledPrev}
          onClick={() => setCurrentIndex(currentIndex - 1)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-xs">Prev</span>
        </Button>

        <span className="text-xs text-gray-400 font-medium">
          {sections[currentIndex]?.name} &mdash; {currentIndex + 1}/{sections.length}
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-1 border-emerald-300 text-emerald-600 px-3"
            onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className="flex items-center gap-1 bg-primary text-white px-3 disabled:opacity-40"
            disabled={!enanbledNext}
            onClick={() => setCurrentIndex(currentIndex + 1)}
          >
            <span className="text-xs">Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
}

export default ResumeForm;
