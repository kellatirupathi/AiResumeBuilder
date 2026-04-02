/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AIChatSession } from "@/Services/AiModel";
import { toast } from "sonner";
import {
  AlertTriangle,
  Award,
  BadgePlus,
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderGit,
  GraduationCap,
  Lightbulb,
  LoaderCircle,
  Sparkles,
  ThumbsUp,
  User,
  X,
} from "lucide-react";

const MASTER_PROMPT = `
I need you to act as a professional career coach and resume expert. Analyze this resume data and provide a detailed evaluation with specific, accurate percentage scores.

The resume belongs to a job seeker and contains the following data:
{resumeData}

Please analyze each section carefully and provide scores based on completeness, quality, and impact:

IMPORTANT: For any section that is completely empty (not filled in at all), assign a score of exactly 0%. Do not give any default minimum score.

For Personal Details:
- Score 0% if completely empty
- Score 40-60% if only basic fields are filled
- Score 70-80% if most fields are complete
- Score 90-100% if all fields are complete with professional contact information

For Professional Summary:
- Score 0% if completely empty
- Otherwise, score based on length, specificity, relevance, and impact
- Evaluate whether it effectively communicates career goals and value proposition

For Work Experience:
- Score 0% if completely empty
- Otherwise evaluate based on number of entries, detail level, use of action verbs, and quantifiable achievements
- Higher scores for comprehensive descriptions with metrics and results

For Education:
- Score 0% if completely empty
- Otherwise score based on completeness of degree information, dates, and relevant details

For Skills:
- Score 0% if completely empty
- Otherwise evaluate based on number of skills, relevance, organization, and rating consistency

For Projects:
- Score 0% if completely empty
- Otherwise score based on detail level, technology descriptions, and connection to skills

For Certifications:
- Score 0% if completely empty
- Otherwise score based on completeness of certification information, including name, issuer, dates, and credential ID
- Higher scores for recent, relevant certifications with complete details

Format your response exactly as a valid JSON object with the following structure:
{
  "scores": {
    "personal": [0-100 number],
    "summary": [0-100 number],
    "experience": [0-100 number],
    "education": [0-100 number],
    "skills": [0-100 number],
    "projects": [0-100 number],
    "certifications": [0-100 number],
    "totalScore": [0-100 number]
  },
  "analysis": {
    "strengths": [array of specific strengths found in this resume],
    "weaknesses": [array of specific areas for improvement]
  },
  "suggestions": [array of specific, actionable improvement suggestions]
}

Ensure your scores are fair but realistic reflections of the resume quality. Remember to give a score of 0% to any completely empty sections. The overall totalScore should be a weighted average (personal 15%, summary 15%, experience 20%, education 15%, skills 15%, projects 10%, certifications 10%).
`;

const ANALYSIS_STAGES = [
  {
    key: "personal",
    title: "Checking personal details",
    description: "Reviewing name, role, and contact information for completeness.",
    icon: User,
  },
  {
    key: "summary",
    title: "Evaluating summary",
    description: "Looking for clarity, positioning, and a strong career pitch.",
    icon: FileText,
  },
  {
    key: "experience",
    title: "Inspecting experience",
    description: "Checking impact statements, action verbs, and measurable outcomes.",
    icon: Briefcase,
  },
  {
    key: "projects",
    title: "Reviewing projects",
    description: "Assessing relevance, scope, and how clearly technologies are described.",
    icon: FolderGit,
  },
  {
    key: "education",
    title: "Validating education",
    description: "Looking for complete degree, institution, and timeline details.",
    icon: GraduationCap,
  },
  {
    key: "skills",
    title: "Scanning skills",
    description: "Checking whether the skills list is relevant and well-structured.",
    icon: BadgePlus,
  },
  {
    key: "certifications",
    title: "Checking certifications",
    description: "Reviewing issuer, date, and relevance of each certification.",
    icon: Award,
  },
  {
    key: "final",
    title: "Building final recommendations",
    description: "Calculating scores and assembling strengths, weaknesses, and next steps.",
    icon: BarChart3,
  },
];

const SCORE_SECTIONS = [
  { key: "personal", label: "Personal Details", icon: User },
  { key: "summary", label: "Summary", icon: FileText },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "projects", label: "Projects", icon: FolderGit },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "skills", label: "Skills", icon: BadgePlus },
  { key: "certifications", label: "Certifications", icon: Award },
];

const MINIMUM_ANALYSIS_TIME_MS = 2500;
const STAGE_STEP_MS = 800;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const safeArray = (value) => (Array.isArray(value) ? value.filter(Boolean) : []);

const getScoreColorClasses = (score) => {
  if (score >= 85) {
    return {
      text: "text-emerald-600",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      bar: "from-emerald-500 to-green-500",
    };
  }

  if (score >= 70) {
    return {
      text: "text-blue-600",
      badge: "border-blue-200 bg-blue-50 text-blue-700",
      bar: "from-blue-500 to-cyan-500",
    };
  }

  if (score >= 50) {
    return {
      text: "text-amber-600",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
      bar: "from-amber-500 to-yellow-500",
    };
  }

  return {
    text: "text-rose-600",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    bar: "from-rose-500 to-red-500",
  };
};

const formatResumeData = (resume) => {
  if (!resume) return "No resume data available.";

  let content = "";

  content += `Name: ${resume.firstName || ""} ${resume.lastName || ""}\n`;
  if (resume.jobTitle) content += `Job Title: ${resume.jobTitle}\n`;
  if (resume.email) content += `Email: ${resume.email}\n`;
  if (resume.phone) content += `Phone: ${resume.phone}\n`;
  if (resume.address) content += `Location: ${resume.address}\n\n`;

  if (resume.summary) {
    content += `SUMMARY\n${resume.summary.replace(/<[^>]*>?/gm, "")}\n\n`;
  }

  if (resume.skills && resume.skills.length > 0) {
    content += "SKILLS\n";
    resume.skills.forEach((skill) => {
      if (skill.name) content += `${skill.name}\n`;
    });
    content += "\n";
  }

  if (resume.experience && resume.experience.length > 0) {
    content += "EXPERIENCE\n";
    resume.experience.forEach((exp) => {
      if (exp.title) content += `${exp.title}`;
      if (exp.companyName) content += ` at ${exp.companyName}`;
      if (exp.city || exp.state) {
        content += ` (${exp.city || ""}${exp.city && exp.state ? ", " : ""}${exp.state || ""})`;
      }
      if (exp.startDate || exp.endDate || exp.currentlyWorking) {
        content += ` | ${exp.startDate || ""} - ${exp.currentlyWorking ? "Present" : exp.endDate || ""}`;
      }
      content += "\n";

      if (exp.workSummary) {
        content += `${exp.workSummary.replace(/<[^>]*>?/gm, " ")}\n`;
      }

      content += "\n";
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    content += "PROJECTS\n";
    resume.projects.forEach((project) => {
      if (project.projectName) content += `${project.projectName}\n`;
      if (project.techStack) content += `Technologies: ${project.techStack}\n`;
      if (project.githubLink) content += `GitHub: ${project.githubLink}\n`;
      if (project.deployedLink) content += `Deployed: ${project.deployedLink}\n`;
      if (project.projectSummary) {
        content += `${project.projectSummary.replace(/<[^>]*>?/gm, " ")}\n`;
      }
      content += "\n";
    });
  }

  if (resume.education && resume.education.length > 0) {
    content += "EDUCATION\n";
    resume.education.forEach((edu) => {
      if (edu.degree) content += `${edu.degree}`;
      if (edu.major) content += ` in ${edu.major}`;
      content += "\n";
      if (edu.universityName) content += `${edu.universityName}`;
      if (edu.startDate || edu.endDate) {
        content += ` | ${edu.startDate || ""} - ${edu.endDate || ""}`;
      }
      content += "\n";
      if (edu.grade && edu.gradeType) {
        content += `${edu.gradeType}: ${edu.grade}\n`;
      }
      if (edu.description) {
        content += `${edu.description}\n`;
      }
      content += "\n";
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    content += "CERTIFICATIONS\n";
    resume.certifications.forEach((cert) => {
      if (cert.name) content += `${cert.name}\n`;
      if (cert.issuer) content += `Issuer: ${cert.issuer}\n`;
      if (cert.date) content += `Date: ${cert.date}\n`;
      if (cert.description) content += `${cert.description}\n`;
      content += "\n";
    });
  }

  if (resume.additionalSections && resume.additionalSections.length > 0) {
    resume.additionalSections.forEach((section) => {
      if (section.title && section.content) {
        content += `${section.title.toUpperCase()}\n`;
        content += `${section.content.replace(/<[^>]*>?/gm, " ")}\n\n`;
      }
    });
  }

  return content;
};

const normalizeAIResult = (rawResult) => ({
  scores: {
    personal: Number(rawResult?.scores?.personal ?? 0),
    summary: Number(rawResult?.scores?.summary ?? 0),
    experience: Number(rawResult?.scores?.experience ?? 0),
    education: Number(rawResult?.scores?.education ?? 0),
    skills: Number(rawResult?.scores?.skills ?? 0),
    projects: Number(rawResult?.scores?.projects ?? 0),
    certifications: Number(rawResult?.scores?.certifications ?? 0),
    totalScore: Number(rawResult?.scores?.totalScore ?? 0),
  },
  analysis: {
    strengths: safeArray(rawResult?.analysis?.strengths),
    weaknesses: safeArray(rawResult?.analysis?.weaknesses),
  },
  suggestions: safeArray(rawResult?.suggestions),
});

function AIReviewPanel({ resumeInfo, onClose }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [completedStageCount, setCompletedStageCount] = useState(0);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);
  const simulationIntervalRef = useRef(null);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      loadingRef.current = false;

      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  const totalStages = ANALYSIS_STAGES.length;
  const progressPercent = useMemo(() => {
    if (!loading) {
      return result ? 100 : 0;
    }

    const activeContribution = activeStageIndex >= 0 ? 0.65 : 0;
    return Math.min(
      Math.round(((completedStageCount + activeContribution) / totalStages) * 100),
      96
    );
  }, [activeStageIndex, completedStageCount, loading, result, totalStages]);

  const clearSimulation = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  };

  const resetReviewState = () => {
    clearSimulation();
    setLoading(false);
    setResult(null);
    setError(null);
    setActiveStageIndex(-1);
    setCompletedStageCount(0);
  };

  const startSimulation = () => {
    clearSimulation();
    setActiveStageIndex(0);
    setCompletedStageCount(0);

    const startTime = Date.now();

    simulationIntervalRef.current = setInterval(() => {
      if (!loadingRef.current) {
        return;
      }

      const stageIndex = Math.min(
        Math.floor((Date.now() - startTime) / STAGE_STEP_MS),
        totalStages - 1
      );

      setActiveStageIndex(stageIndex);
      setCompletedStageCount(stageIndex);
    }, 140);
  };

  const handleAnalysis = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveStageIndex(0);
    setCompletedStageCount(0);
    startSimulation();

    try {
      const formattedData = formatResumeData(resumeInfo);
      const prompt = MASTER_PROMPT.replace("{resumeData}", formattedData);

      const [aiResponse] = await Promise.all([
        AIChatSession.sendMessage(prompt),
        wait(MINIMUM_ANALYSIS_TIME_MS),
      ]);

      if (!mountedRef.current) {
        return;
      }

      const parsedResult = normalizeAIResult(JSON.parse(aiResponse.response.text()));

      clearSimulation();
      setCompletedStageCount(totalStages);
      setActiveStageIndex(totalStages - 1);
      setResult(parsedResult);
    } catch (err) {
      if (!mountedRef.current) {
        return;
      }

      clearSimulation();
      setError("Failed to get AI analysis. The model may be busy, please try again in a moment.");
      toast.error("AI Analysis Failed", { description: err.message });
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  const renderLoader = () => (
    <div className="space-y-4">
      {/* Progress card */}
      <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Analyzing</p>
            <p className="text-sm font-semibold text-slate-800">Checking each section…</p>
          </div>
          <span className="ml-auto text-sm font-bold text-indigo-600">{progressPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-indigo-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-1.5">
        {ANALYSIS_STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isComplete = index < completedStageCount;
          const isActive = index === activeStageIndex;

          return (
            <div
              key={stage.key}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-300 ${
                isComplete
                  ? "border-emerald-100 bg-emerald-50"
                  : isActive
                  ? "border-indigo-100 bg-indigo-50 shadow-sm"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                  isComplete
                    ? "bg-emerald-100 text-emerald-600"
                    : isActive
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "animate-pulse" : ""}`} />
              </div>

              <p className={`flex-1 text-xs font-medium truncate ${
                isComplete ? "text-emerald-800" : isActive ? "text-indigo-800" : "text-gray-500"
              }`}>
                {stage.title}
              </p>

              <div className="shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : isActive ? (
                  <LoaderCircle className="h-4 w-4 animate-spin text-indigo-500" />
                ) : (
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderResults = () => {
    const overallScore = result?.scores?.totalScore ?? 0;
    const overallScoreStyles = getScoreColorClasses(overallScore);
    const strengths = safeArray(result?.analysis?.strengths);
    const weaknesses = safeArray(result?.analysis?.weaknesses);
    const suggestions = safeArray(result?.suggestions);

    return (
      <div className="space-y-4">

        {/* ── Overall score card ── */}
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300">AI Review Complete</p>
              <h3 className="mt-1 text-base font-bold">Resume Scorecard</h3>
              <p className="mt-0.5 text-xs text-slate-400 leading-relaxed">Completeness · Quality · Impact</p>
            </div>
            <div className="flex-shrink-0 rounded-lg bg-white/10 px-5 py-3 text-center backdrop-blur-sm">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Score</p>
              <p className={`text-4xl font-extrabold leading-none mt-1 ${overallScoreStyles.text}`}>{overallScore}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">/ 100</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${overallScoreStyles.bar} transition-all duration-700`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
        </div>

        {/* ── Section scores ── */}
        <div className="rounded-xl border border-gray-100 bg-white p-4 space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Section Breakdown</p>
          {SCORE_SECTIONS.map((section) => {
            const Icon = section.icon;
            const score = result?.scores?.[section.key] ?? 0;
            const scoreStyles = getScoreColorClasses(score);

            return (
              <div key={section.key} className="flex items-center gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="w-24 shrink-0 text-xs font-medium text-gray-600 truncate">{section.label}</span>
                <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${scoreStyles.bar} transition-all duration-500`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                <span className={`w-9 shrink-0 text-right text-xs font-bold ${scoreStyles.text}`}>{score}%</span>
              </div>
            );
          })}
        </div>

        {/* ── Strengths ── */}
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100">
              <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Strengths</h4>
          </div>
          <ul className="space-y-2">
            {strengths.length > 0 ? (
              strengths.map((item, index) => (
                <li key={`s-${index}`} className="flex items-start gap-2.5 rounded-lg bg-white/70 px-3 py-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5 text-emerald-500" />
                  <span className="text-xs text-emerald-900 leading-relaxed">{item}</span>
                </li>
              ))
            ) : (
              <li className="rounded-lg bg-white/70 px-3 py-2.5 text-xs text-emerald-800">No specific strengths returned.</li>
            )}
          </ul>
        </div>

        {/* ── Weaknesses ── */}
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-100">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-700">Weaknesses</h4>
          </div>
          <ul className="space-y-2">
            {weaknesses.length > 0 ? (
              weaknesses.map((item, index) => (
                <li key={`w-${index}`} className="flex items-start gap-2.5 rounded-lg bg-white/70 px-3 py-2.5">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <span className="text-xs text-amber-900 leading-relaxed">{item}</span>
                </li>
              ))
            ) : (
              <li className="rounded-lg bg-white/70 px-3 py-2.5 text-xs text-amber-800">No weaknesses identified.</li>
            )}
          </ul>
        </div>

        {/* ── Suggestions ── */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
              <Lightbulb className="h-3.5 w-3.5 text-blue-600" />
            </div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-blue-700">Suggestions</h4>
          </div>
          <ul className="space-y-2">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <li key={`sg-${index}`} className="flex items-start gap-2.5 rounded-lg bg-white/80 px-3 py-2.5">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600 mt-0.5">{index + 1}</span>
                  <span className="text-xs text-blue-900 leading-relaxed">{item}</span>
                </li>
              ))
            ) : (
              <li className="rounded-lg bg-white/80 px-3 py-2.5 text-xs text-blue-800">No suggestions returned.</li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="space-y-4">
      {/* Hero banner */}
      <div className="rounded-xl bg-gradient-to-br from-slate-900 to-indigo-950 p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
            <Sparkles className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-indigo-300">Split-view AI Review</p>
            <h3 className="text-sm font-bold text-white">Instant resume feedback</h3>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Analyze every section — scores, strengths, weaknesses, and actionable suggestions — while keeping your editor open on the left.
        </p>
      </div>

      {/* What we check */}
      <div className="rounded-xl border border-gray-100 bg-white p-4">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">What we review</p>
        <div className="space-y-1.5">
          {ANALYSIS_STAGES.slice(0, 7).map((stage) => {
            const Icon = stage.icon;
            return (
              <div key={stage.key} className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-medium text-gray-700">{stage.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-gray-50">

      {/* ── Header ── */}
      <div className="flex-shrink-0 flex items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500">AI Review</p>
            <p className="text-sm font-semibold text-gray-800 leading-tight">Resume Analysis</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {loading ? renderLoader() : error ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-rose-800">Analysis failed</p>
                <p className="mt-1 text-xs text-rose-700 leading-relaxed">{error}</p>
              </div>
            </div>
          </div>
        ) : result ? renderResults() : renderEmptyState()}
      </div>

      {/* ── Footer ── */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
        {result ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetReviewState}
              className="flex-1 h-9 text-xs border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              Analyze Again
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              className="flex-1 h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Back to Preview
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleAnalysis}
              disabled={loading}
              className="flex-1 h-9 text-xs bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
            >
              {loading ? (
                <><LoaderCircle className="h-3.5 w-3.5 animate-spin mr-1.5" />Analyzing…</>
              ) : (
                <><Sparkles className="h-3.5 w-3.5 mr-1.5" />Start AI Analysis</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-9 text-xs border-gray-200 text-gray-600 hover:bg-gray-50 px-3"
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIReviewPanel;
