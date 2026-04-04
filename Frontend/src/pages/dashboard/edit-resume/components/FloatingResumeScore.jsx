import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Award,
  BarChart3,
  Bot,
  Briefcase,
  BrainCircuit,
  CheckCircle2,
  FileCheck,
  FolderGit2,
  GraduationCap,
  Info,
  RefreshCw,
  Sparkles,
  ThumbsUp,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIChatSession } from "@/Services/AiModel";
import { toast } from "sonner";

const DEFAULT_POSITION = {
  x: 16,
  y:
    typeof window !== "undefined"
      ? Math.max(window.innerHeight - 88, 16)
      : 16,
};
const DRAG_THRESHOLD = 8;

const SECTION_META = [
  { key: "personal", label: "Personal", icon: Info },
  { key: "summary", label: "Summary", icon: FileCheck },
  { key: "experience", label: "Experience", icon: Briefcase },
  { key: "education", label: "Education", icon: GraduationCap },
  { key: "skills", label: "Skills", icon: CheckCircle2 },
  { key: "projects", label: "Projects", icon: FolderGit2 },
  { key: "certifications", label: "Certifications", icon: Award },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getScoreColor = (score) => {
  if (score >= 80) return "text-emerald-600 bg-emerald-500";
  if (score >= 60) return "text-amber-600 bg-amber-500";
  return "text-rose-600 bg-rose-500";
};

const getScoreSurface = (score) => {
  if (score >= 80) return "border-emerald-200 bg-emerald-50";
  if (score >= 60) return "border-amber-200 bg-amber-50";
  return "border-rose-200 bg-rose-50";
};

const getScoreDescription = (score) => {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs work";
  return "Low";
};

const calculateInitialScore = (resumeInfo) => {
  const scores = {
    personal: 0,
    summary: 0,
    experience: 0,
    education: 0,
    skills: 0,
    projects: 0,
    certifications: 0,
    totalScore: 0,
    feedback: [],
  };

  if (!resumeInfo) {
    return scores;
  }

  const personalFields = [
    resumeInfo.firstName,
    resumeInfo.lastName,
    resumeInfo.jobTitle,
    resumeInfo.email,
    resumeInfo.phone,
    resumeInfo.address,
  ];
  const filledPersonalFields = personalFields.filter(
    (field) => typeof field === "string" && field.trim().length > 0
  ).length;
  scores.personal = Math.round((filledPersonalFields / personalFields.length) * 100) || 0;

  if (resumeInfo.summary?.trim()) {
    const summaryLength = resumeInfo.summary.trim().length;
    if (summaryLength > 300) scores.summary = 95;
    else if (summaryLength > 200) scores.summary = 85;
    else if (summaryLength > 100) scores.summary = 75;
    else scores.summary = 60;
  }

  if (resumeInfo.experience?.length) {
    let expQuality = 0;
    resumeInfo.experience.forEach((exp) => {
      let entryScore = 0;
      if (exp.title?.trim()) entryScore += 20;
      if (exp.companyName?.trim()) entryScore += 20;
      if (exp.startDate?.trim()) entryScore += 10;
      if (exp.endDate?.trim()) entryScore += 10;
      if (exp.workSummary?.trim()) {
        const summaryLength = exp.workSummary.trim().length;
        entryScore += summaryLength > 200 ? 40 : summaryLength > 100 ? 30 : 20;
      }
      expQuality += entryScore / 100;
    });
    scores.experience = Math.min(
      Math.round((expQuality / resumeInfo.experience.length) * 100),
      100
    );
  }

  if (resumeInfo.education?.length) {
    let eduQuality = 0;
    resumeInfo.education.forEach((edu) => {
      let entryScore = 0;
      if (edu.universityName?.trim()) entryScore += 30;
      if (edu.degree?.trim()) entryScore += 25;
      if (edu.major?.trim()) entryScore += 15;
      if (edu.startDate?.trim()) entryScore += 10;
      if (edu.endDate?.trim()) entryScore += 10;
      if (edu.description?.trim()) entryScore += 10;
      eduQuality += entryScore / 100;
    });
    scores.education = Math.min(
      Math.round((eduQuality / resumeInfo.education.length) * 100),
      100
    );
  }

  if (resumeInfo.skills?.length) {
    const skillsCount = resumeInfo.skills.length;
    const hasRatings = resumeInfo.skills.some((skill) => skill.rating > 0);
    if (skillsCount >= 10) scores.skills = 90;
    else if (skillsCount >= 7) scores.skills = 80;
    else if (skillsCount >= 5) scores.skills = 70;
    else if (skillsCount >= 3) scores.skills = 60;
    else scores.skills = 50;
    if (hasRatings) scores.skills = Math.min(scores.skills + 10, 100);
  }

  if (resumeInfo.projects?.length) {
    let projQuality = 0;
    resumeInfo.projects.forEach((proj) => {
      let entryScore = 0;
      if (proj.projectName?.trim()) entryScore += 30;
      if (proj.techStack?.trim()) entryScore += 30;
      if (proj.projectSummary?.trim()) {
        const summaryLength = proj.projectSummary.trim().length;
        entryScore += summaryLength > 200 ? 40 : summaryLength > 100 ? 30 : 20;
      }
      projQuality += entryScore / 100;
    });
    scores.projects = Math.min(
      Math.round((projQuality / resumeInfo.projects.length) * 100),
      100
    );
  }

  if (resumeInfo.certifications?.length) {
    let certQuality = 0;
    resumeInfo.certifications.forEach((cert) => {
      let entryScore = 0;
      if (cert.name?.trim()) entryScore += 35;
      if (cert.issuer?.trim()) entryScore += 25;
      if ((cert.issueDate || cert.date)?.trim?.()) entryScore += 15;
      if (cert.expiryDate?.trim()) entryScore += 10;
      if ((cert.credentialId || cert.credentialLink)?.trim?.()) entryScore += 15;
      certQuality += entryScore / 100;
    });
    scores.certifications = Math.min(
      Math.round((certQuality / resumeInfo.certifications.length) * 100),
      100
    );
  }

  const weights = {
    personal: 0.15,
    summary: 0.15,
    experience: 0.2,
    education: 0.15,
    skills: 0.15,
    projects: 0.1,
    certifications: 0.1,
  };

  let totalWeightedScore = 0;
  let appliedWeights = 0;
  Object.entries(weights).forEach(([key, weight]) => {
    if (scores[key] > 0) {
      totalWeightedScore += scores[key] * weight;
      appliedWeights += weight;
    }
  });
  scores.totalScore = appliedWeights
    ? Math.round(totalWeightedScore / appliedWeights)
    : 0;

  if (scores.personal < 70) {
    scores.feedback.push("Complete your personal details section more fully.");
  }
  if (scores.summary === 0) {
    scores.feedback.push("Add a professional summary to frame your resume.");
  } else if (scores.summary < 70) {
    scores.feedback.push("Strengthen your summary with clearer impact and focus.");
  }
  if (!resumeInfo.experience?.length) {
    scores.feedback.push("Add work experience to show practical history.");
  } else if (scores.experience < 70) {
    scores.feedback.push("Add stronger experience bullets with outcomes and specifics.");
  }
  if (!resumeInfo.education?.length) {
    scores.feedback.push("Include your education details.");
  }
  if (!resumeInfo.skills?.length) {
    scores.feedback.push("Add job-relevant skills to improve matching.");
  } else if (resumeInfo.skills.length < 5) {
    scores.feedback.push("Add more relevant skills to strengthen your profile.");
  }
  if (!resumeInfo.projects?.length) {
    scores.feedback.push("Include projects to prove hands-on experience.");
  } else if (scores.projects < 70) {
    scores.feedback.push("Describe projects with clearer scope, stack, and results.");
  }
  if (!resumeInfo.certifications?.length) {
    scores.feedback.push("Add certifications if they support your target role.");
  } else if (scores.certifications < 70) {
    scores.feedback.push("Complete certification details with issuer and credential info.");
  }

  return scores;
};

function FloatingResumeScore({ resumeInfo }) {
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [scoreData, setScoreData] = useState(() => calculateInitialScore(resumeInfo));
  const [position, setPosition] = useState(DEFAULT_POSITION);
  const [panelStyle, setPanelStyle] = useState({});
  const [showHint, setShowHint] = useState(true);

  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const dragStateRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    dragging: false,
  });

  useEffect(() => {
    setScoreData(calculateInitialScore(resumeInfo));
    setAnalyzed(false);
  }, [resumeInfo]);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        expanded &&
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) {
      return;
    }

    const updatePanelPosition = () => {
      if (!buttonRef.current) {
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const width = window.innerWidth;
      const height = window.innerHeight;
      const panelWidth = Math.min(640, width - 24);
      const panelHeight = Math.min(720, height - 24);

      const nextLeft = rect.right + 12 + panelWidth > width
        ? clamp(rect.left - panelWidth - 12, 12, width - panelWidth - 12)
        : clamp(rect.right + 12, 12, width - panelWidth - 12);

      const nextTop = clamp(rect.top - 20, 12, height - panelHeight - 12);

      setPanelStyle({
        left: `${nextLeft}px`,
        top: `${nextTop}px`,
        width: `${panelWidth}px`,
        height: `${panelHeight}px`,
        maxHeight: `${panelHeight}px`,
      });
    };

    updatePanelPosition();
    window.addEventListener("resize", updatePanelPosition);
    return () => window.removeEventListener("resize", updatePanelPosition);
  }, [expanded, position]);

  const handlePointerDown = (event) => {
    const target = event.currentTarget;
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
      dragging: false,
    };
    target.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.dragging && Math.hypot(deltaX, deltaY) > DRAG_THRESHOLD) {
      dragState.dragging = true;
      setShowHint(false);
    }

    if (!dragState.dragging) {
      return;
    }

    const buttonSize = 64;
    const nextX = clamp(
      dragState.originX + deltaX,
      12,
      window.innerWidth - buttonSize - 12
    );
    const nextY = clamp(
      dragState.originY + deltaY,
      12,
      window.innerHeight - buttonSize - 12
    );

    setPosition({ x: nextX, y: nextY });
  };

  const handlePointerUp = (event) => {
    const dragState = dragStateRef.current;
    if (dragState.pointerId !== event.pointerId) {
      return;
    }

    if (buttonRef.current?.hasPointerCapture(event.pointerId)) {
      buttonRef.current.releasePointerCapture(event.pointerId);
    }

    const wasDragging = dragState.dragging;
    dragStateRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      originX: 0,
      originY: 0,
      dragging: false,
    };

    if (!wasDragging) {
      setExpanded((current) => !current);
    }
  };

  const getAIAnalysis = async () => {
    setLoading(true);
    try {
      const initialScores = calculateInitialScore(resumeInfo);
      setScoreData(initialScores);

      const prompt = `
      I need you to analyze this resume data and provide a detailed evaluation with specific, accurate percentage scores.

      The resume belongs to a job seeker and contains the following data:
      ${JSON.stringify(resumeInfo, null, 2)}

      IMPORTANT: For any section that is completely empty, assign exactly 0%.
      Evaluate personal details, summary, experience, education, skills, projects, and certifications.

      Format your response exactly as valid JSON:
      {
        "scores": {
          "personal": 0,
          "summary": 0,
          "experience": 0,
          "education": 0,
          "skills": 0,
          "projects": 0,
          "certifications": 0,
          "totalScore": 0
        },
        "analysis": {
          "strengths": [],
          "weaknesses": []
        },
        "suggestions": []
      }
      `;

      const result = await AIChatSession.sendMessage(prompt);
      const aiAnalysis = JSON.parse(result.response.text());

      setScoreData({
        ...aiAnalysis.scores,
        analysis: aiAnalysis.analysis,
        suggestions: aiAnalysis.suggestions,
      });
      setAnalyzed(true);

      toast("Resume analysis completed", {
        description: "AI feedback is ready.",
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setScoreData(calculateInitialScore(resumeInfo));
      toast("Could not complete AI analysis", {
        description: "Showing the basic resume score instead.",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalScore = scoreData?.totalScore || 0;
  const feedbackItems = analyzed
    ? scoreData?.suggestions?.length
      ? scoreData.suggestions
      : scoreData?.analysis?.weaknesses || []
    : scoreData?.feedback || [];

  const strengths = analyzed ? scoreData?.analysis?.strengths || [] : [];

  return (
    <>
      <div
        ref={buttonRef}
        role="button"
        tabIndex={0}
        aria-label="Open resume score assistant"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded((current) => !current);
          }
        }}
        className="fixed z-50 touch-none select-none"
        style={{ left: position.x, top: position.y }}
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg transition-shadow hover:shadow-xl">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 via-orange-100 to-red-100 text-slate-900">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div className="absolute -right-1 -top-1 flex h-8 min-w-8 items-center justify-center rounded-full bg-slate-900 px-2 text-xs font-bold text-white">
            {totalScore}
          </div>
          {showHint && !expanded ? (
            <div className="absolute left-0 top-[-48px] whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm">
              Check your resume score
            </div>
          ) : null}
        </div>
      </div>

      {expanded ? (
        <div
          ref={panelRef}
          className="fixed z-50 flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          style={panelStyle}
        >
          <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50 via-amber-50 to-white px-5 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">Resume Score</h3>
                  <p className="text-xs text-slate-500">
                    {analyzed ? "AI-reviewed feedback" : "Instant local evaluation"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm ring-1 ring-slate-200">
                  <div className="text-lg font-bold text-slate-900">{totalScore}/100</div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    {getScoreDescription(totalScore)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0 text-slate-500 hover:bg-white"
                  onClick={() => setExpanded(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 pr-3">
            <Button
              size="sm"
              variant="outline"
              className="mb-5 h-11 w-full justify-center gap-2 rounded-2xl border-slate-300 text-slate-800 hover:bg-slate-50 sticky top-0 z-10 bg-white"
              onClick={getAIAnalysis}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  {analyzed ? "Run AI Analysis Again" : "Analyze with AI"}
                </>
              )}
            </Button>

            {loading ? (
              <div className="rounded-[28px] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-orange-50 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-slate-900 text-white">
                    <BrainCircuit className="h-8 w-8" />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900">Analyzing your resume</h4>
                  <p className="mt-2 max-w-md text-sm text-slate-600">
                    Reviewing structure, content quality, and section strength. Your updated score and suggestions will appear here when analysis completes.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {["Scanning summary", "Checking experience impact", "Reviewing skills", "Evaluating projects"].map((label, index) => (
                    <div
                      key={label}
                      className="rounded-2xl border border-white bg-white/80 p-4 shadow-sm"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                        <RefreshCw
                          className="h-4 w-4 animate-spin text-indigo-500"
                          style={{ animationDuration: `${0.9 + index * 0.25}s` }}
                        />
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 animate-pulse"
                          style={{ width: `${72 + index * 6}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <div className="mb-3 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-600" />
                    <h4 className="text-sm font-semibold text-slate-900">Section Breakdown</h4>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {SECTION_META.map(({ key, label, icon: Icon }) => {
                      const score = scoreData?.[key] || 0;
                      const colorClass = getScoreColor(score);
                      return (
                        <div
                          key={key}
                          className={`rounded-2xl border p-4 ${getScoreSurface(score)}`}
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="rounded-xl bg-white/80 p-2 text-slate-700 flex-shrink-0">
                                <Icon className="h-4 w-4" />
                              </div>
                              <span className="truncate text-sm font-medium text-slate-800">{label}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900">{score}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-white/80">
                            <div
                              className={`h-full ${colorClass.split(" ")[1]} transition-all duration-200`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {strengths.length ? (
                  <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-emerald-700" />
                      <h4 className="text-sm font-semibold text-slate-900">What’s Working</h4>
                    </div>
                    <div className="space-y-2">
                      {strengths.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="rounded-2xl bg-white/80 px-3 py-2 text-sm leading-6 text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {feedbackItems.length ? (
                  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-700" />
                      <h4 className="text-sm font-semibold text-slate-900">How To Improve</h4>
                    </div>
                    <div className="space-y-2">
                      {feedbackItems.map((item, index) => (
                        <div
                          key={`${item}-${index}`}
                          className="rounded-2xl bg-white/85 px-3 py-2 text-sm leading-6 text-slate-700"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                    No major issues found right now. Run AI analysis for deeper feedback.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default FloatingResumeScore;
