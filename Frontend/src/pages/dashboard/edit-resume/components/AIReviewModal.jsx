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
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-600">
              AI review in progress
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900">
              Checking each section of your resume
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              The review runs section by section, then compiles strengths, gaps, and practical fixes.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600">Analysis progress</span>
            <span className="font-semibold text-slate-900">{progressPercent}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {ANALYSIS_STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isComplete = index < completedStageCount;
          const isActive = index === activeStageIndex;

          return (
            <div
              key={stage.key}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-300 ${
                isComplete
                  ? "border-emerald-200 bg-emerald-50"
                  : isActive
                    ? "border-indigo-200 bg-indigo-50 shadow-sm"
                    : "border-slate-200 bg-white"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  isComplete
                    ? "bg-emerald-100 text-emerald-700"
                    : isActive
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "animate-pulse" : ""}`} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-slate-900">{stage.title}</p>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      isComplete
                        ? "border-emerald-200 bg-white text-emerald-700"
                        : isActive
                          ? "border-indigo-200 bg-white text-indigo-700"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                    }`}
                  >
                    {isComplete ? "Done" : isActive ? "Analyzing" : "Waiting"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">{stage.description}</p>
              </div>

              <div className="shrink-0">
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : isActive ? (
                  <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
                ) : (
                  <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
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
      <div className="space-y-6">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-indigo-200">
                AI review complete
              </p>
              <h3 className="mt-2 text-3xl font-semibold">Your resume scorecard</h3>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                The review combines content quality, completeness, and impact signals across the
                main resume sections.
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 px-6 py-5 backdrop-blur">
              <p className="text-sm text-slate-300">Overall score</p>
              <p className={`mt-2 text-5xl font-bold ${overallScoreStyles.text}`}>{overallScore}</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${overallScoreStyles.bar}`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SCORE_SECTIONS.map((section) => {
            const Icon = section.icon;
            const score = result?.scores?.[section.key] ?? 0;
            const scoreStyles = getScoreColorClasses(score);

            return (
              <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{section.label}</p>
                      <p className={`text-2xl font-bold ${scoreStyles.text}`}>{score}%</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${scoreStyles.badge}`}>
                    {score >= 85 ? "Strong" : score >= 70 ? "Good" : score >= 50 ? "Average" : "Needs work"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-emerald-700" />
              <h4 className="text-lg font-semibold text-emerald-900">Strengths</h4>
            </div>
            <ul className="mt-4 space-y-3">
              {strengths.length > 0 ? (
                strengths.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-white/70 px-4 py-3 text-sm text-emerald-900">
                    {item}
                  </li>
                ))
              ) : (
                <li className="rounded-xl bg-white/70 px-4 py-3 text-sm text-emerald-900">
                  The AI review did not return specific strengths for this resume yet.
                </li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-700" />
              <h4 className="text-lg font-semibold text-amber-900">Weaknesses</h4>
            </div>
            <ul className="mt-4 space-y-3">
              {weaknesses.length > 0 ? (
                weaknesses.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl bg-white/70 px-4 py-3 text-sm text-amber-900">
                    {item}
                  </li>
                ))
              ) : (
                <li className="rounded-xl bg-white/70 px-4 py-3 text-sm text-amber-900">
                  The AI review did not return specific weaknesses for this resume yet.
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-700" />
            <h4 className="text-lg font-semibold text-blue-900">Suggestions</h4>
          </div>
          <ul className="mt-4 space-y-3">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-xl bg-white/80 px-4 py-3 text-sm text-blue-900">
                  {item}
                </li>
              ))
            ) : (
              <li className="rounded-xl bg-white/80 px-4 py-3 text-sm text-blue-900">
                The AI review completed without improvement suggestions.
              </li>
            )}
          </ul>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 p-6 text-white shadow-lg">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="h-7 w-7 text-cyan-200" />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-200">
              Split-view AI review
            </p>
            <h3 className="mt-2 text-3xl font-semibold">Analyze your resume without leaving the editor</h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Start the analysis to review every major section on the right side while your resume
              editor stays visible on the left.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {ANALYSIS_STAGES.slice(0, 6).map((stage) => {
          const Icon = stage.icon;

          return (
            <div key={stage.key} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{stage.title}</p>
                  <p className="text-sm text-slate-600">{stage.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 flex-col bg-slate-50">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-white px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-indigo-600">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">AI Resume Review</span>
          </div>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Right-side review panel</h2>
          <p className="mt-1 text-sm text-slate-600">
            Run the analysis here while keeping the resume editor visible on the left.
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
        {loading ? renderLoader() : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-rose-900">Analysis failed</h3>
                <p className="mt-2 text-sm text-rose-800">{error}</p>
              </div>
            </div>
          </div>
        ) : result ? renderResults() : renderEmptyState()}
      </div>

      <div className="border-t border-slate-200 bg-white px-6 py-4">
        {result ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={resetReviewState}>
              Analyze Again
            </Button>
            <Button onClick={onClose}>Back to Preview</Button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" onClick={handleAnalysis} disabled={loading}>
              {loading ? "Analyzing Resume..." : "Start AI Analysis"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIReviewPanel;
