import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  FileText,
  Upload,
  ChevronDown,
  ArrowLeft,
  Search,
  Cpu,
  Code,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  Clipboard,
  ClipboardCheck,
  Target,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { useResumeListQuery, useResumeQuery } from "@/hooks/useAppQueryData";

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

// ── ATS PROMPT ────────────────────────────────────────────────────────
const ATS_PROMPT = `
You are an expert ATS (Applicant Tracking System) analyzer. Evaluate the match between a resume and job description precisely.

**Job Description:**
"{jobDescription}"

**Resume Content:**
"{resumeContent}"

Calculate a numeric ATS score (0-100) using:
- 60% Weight: Required hard skills, qualifications, technical terms, certifications
- 20% Weight: Experience and job title compatibility
- 10% Weight: Soft skills and culture fit
- 10% Weight: Resume formatting and structure

**Output Format — return ONLY a clean JSON object, no markdown, no extra text:**
{
  "score": 85,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "missingKeywords": ["AWS", "Agile", "CI/CD"],
  "recommendations": ["...", "..."]
}
`;

// ── HELPERS ───────────────────────────────────────────────────────────
const generateResumeContent = (resume) => {
  if (!resume) return "";
  let c = "";
  if (resume.firstName || resume.lastName)
    c += `Name: ${resume.firstName || ""} ${resume.lastName || ""}\n`;
  if (resume.jobTitle) c += `Job Title: ${resume.jobTitle}\n`;
  if (resume.email) c += `Email: ${resume.email}\n`;
  if (resume.phone) c += `Phone: ${resume.phone}\n`;
  if (resume.address) c += `Location: ${resume.address}\n\n`;
  if (resume.summary) c += `SUMMARY\n${resume.summary}\n\n`;
  if (resume.skills?.length) {
    c += "SKILLS\n";
    resume.skills.forEach((s) => {
      if (s.name) c += `${s.name}\n`;
    });
    c += "\n";
  }
  if (resume.experience?.length) {
    c += "EXPERIENCE\n";
    resume.experience.forEach((e) => {
      if (e.title) c += `${e.title}`;
      if (e.companyName) c += ` at ${e.companyName}`;
      if (e.startDate || e.endDate)
        c += ` | ${e.startDate || ""} - ${
          e.currentlyWorking ? "Present" : e.endDate || ""
        }`;
      c += "\n";
      if (e.workSummary) c += `${e.workSummary.replace(/<[^>]*>?/gm, "")}\n`;
      c += "\n";
    });
  }
  if (resume.projects?.length) {
    c += "PROJECTS\n";
    resume.projects.forEach((p) => {
      if (p.projectName) c += `${p.projectName}\n`;
      if (p.techStack) c += `Technologies: ${p.techStack}\n`;
      if (p.projectSummary)
        c += `${p.projectSummary.replace(/<[^>]*>?/gm, "")}\n`;
      c += "\n";
    });
  }
  if (resume.education?.length) {
    c += "EDUCATION\n";
    resume.education.forEach((e) => {
      if (e.degree) c += `${e.degree}`;
      if (e.major) c += ` in ${e.major}`;
      c += "\n";
      if (e.universityName) c += `${e.universityName}\n`;
      c += "\n";
    });
  }
  if (resume.certifications?.length) {
    c += "CERTIFICATIONS\n";
    resume.certifications.forEach((cert) => {
      if (cert.name) c += `${cert.name}\n`;
      if (cert.issuer) c += `Issuer: ${cert.issuer}\n`;
      c += "\n";
    });
  }
  return c;
};

let pdfJsLibPromise = null;
const getPdfJsLib = async () => {
  if (!pdfJsLibPromise) {
    pdfJsLibPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then(
      (pdfjsLib) => {
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
          import.meta.url
        ).toString();
        return pdfjsLib;
      }
    );
  }
  return pdfJsLibPromise;
};

const extractTextFromPdf = async (file) => {
  const pdfjsLib = await getPdfJsLib();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() })
    .promise;
  const pageTexts = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str || "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    if (pageText) pageTexts.push(pageText);
  }
  const combinedText = pageTexts.join("\n\n").trim();
  if (!combinedText) {
    throw new Error(
      "No readable text was found in the uploaded PDF. Only text-based PDFs are supported."
    );
  }
  return combinedText;
};

const analyzeStages = [
  { label: "Extracting keywords…", icon: Search },
  { label: "Matching skills…", icon: Cpu },
  { label: "Analyzing experience…", icon: FileText },
  { label: "Evaluating format…", icon: Code },
  { label: "Calculating score…", icon: BarChart3 },
];

// ── Score palette (monochrome + accent) ───────────────────────────────
const scoreColor = (s) =>
  s >= 75 ? "#10B981" : s >= 50 ? "#F59E0B" : "#EF4444";
const scoreLabel = (s) =>
  s >= 75 ? "Great match" : s >= 50 ? "Moderate match" : "Low match";

const URL_ONLY_PATTERN = /^(https?:\/\/|www\.)\S+$/i;
const JOB_DESCRIPTION_HINT_PATTERN =
  /\b(requirements?|responsibilit(?:y|ies)|qualifications?|skills?|experience|role|job|candidate|preferred|must have|nice to have)\b/i;
const SENTENCE_LIKE_PATTERN = /[A-Z][^.?!\n]{20,}[.?!]/;
const RESPONSIBILITY_SENTENCE_PATTERN =
  /\b(responsibilities?|requirements?|qualifications?|you will|we are looking for|the ideal candidate|must have|preferred)\b[^.?!\n]{15,}[.?!]/i;

const getJobDescriptionValidationError = (value) => {
  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.replace(/\s+/g, " ").trim();
  const uniqueWords = new Set(
    normalizedValue.toLowerCase().match(/[a-z]{3,}/g) || []
  );
  const lines = trimmedValue
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  const repetitiveKeywordOnly =
    /^[a-z\s,\/-]+$/i.test(trimmedValue) && !/[.?!]/.test(trimmedValue);

  if (trimmedValue.length < 50) return "Job description is too short";
  if (URL_ONLY_PATTERN.test(trimmedValue))
    return "Invalid JD input. Paste the actual job description text, not only a link.";
  if (!JOB_DESCRIPTION_HINT_PATTERN.test(trimmedValue))
    return "Invalid JD input. Paste a real job description with requirements and responsibilities.";
  if (uniqueWords.size < 15)
    return "Invalid JD input. Add a real job description with enough unique requirement details.";
  if (repetitiveKeywordOnly)
    return "Invalid JD input. Keyword-only text is not accepted. Paste full job description sentences.";
  if (lines.length < 2 && !SENTENCE_LIKE_PATTERN.test(trimmedValue))
    return "Invalid JD input. Add multiple lines or clear sentence-based job description text.";
  if (
    !RESPONSIBILITY_SENTENCE_PATTERN.test(trimmedValue) &&
    !SENTENCE_LIKE_PATTERN.test(trimmedValue)
  )
    return "Invalid JD input. Include at least one full requirement or responsibility sentence.";
  return "";
};

// ═══════════════════════════════════════════════════════════════════════
export default function ATSCheckerPage() {
  const navigate = useNavigate();
  const resumeListQuery = useResumeListQuery();

  // left panel state
  const [sourceType, setSourceType] = useState("saved");
  const [selectedId, setSelectedId] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedResumeText, setUploadedResumeText] = useState("");
  const [loadingUploadedPdf, setLoadingUploadedPdf] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // right panel state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const resumeList = resumeListQuery.data || [];
  const resumeQuery = useResumeQuery(selectedId, {
    enabled: sourceType === "saved" && Boolean(selectedId),
  });
  const resumeData = resumeQuery.data || null;
  const loadingResume =
    sourceType === "saved" &&
    resumeQuery.isPending &&
    Boolean(selectedId) &&
    !resumeQuery.data;

  useEffect(() => {
    if (!resumeListQuery.isError) return;
    toast.error("Could not load resumes", {
      description: resumeListQuery.error?.message,
    });
  }, [resumeListQuery.error?.message, resumeListQuery.isError]);

  useEffect(() => {
    if (!resumeQuery.isError) return;
    toast.error("Failed to load resume data", {
      description: resumeQuery.error?.message || "Please try again later",
    });
  }, [resumeQuery.error?.message, resumeQuery.isError]);

  useEffect(() => {
    if (!isAnalyzing) return;
    const stageTime = 10000 / analyzeStages.length;
    const tickMs = 50;
    const stepsPerStage = stageTime / tickMs;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const s = Math.min(
        Math.floor(step / stepsPerStage),
        analyzeStages.length - 1
      );
      setStage(s);
      setProgress(((step % stepsPerStage) / stepsPerStage) * 100);
    }, tickMs);
    return () => clearInterval(id);
  }, [isAnalyzing]);

  const handleSourceChange = (nextSource) => {
    if (nextSource === sourceType) return;
    setSourceType(nextSource);
    setResult(null);
    setDropdownOpen(false);
    if (nextSource === "saved") {
      setUploadedFileName("");
      setUploadedResumeText("");
      setLoadingUploadedPdf(false);
    } else {
      setSelectedId("");
    }
  };

  const handleSelectResume = (id) => {
    setSourceType("saved");
    setSelectedId(id);
    setDropdownOpen(false);
    setUploadedFileName("");
    setUploadedResumeText("");
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please upload a PDF file only.");
      event.target.value = "";
      return;
    }
    setSourceType("pdf");
    setDropdownOpen(false);
    setSelectedId("");
    setResult(null);
    setUploadedFileName(file.name);
    setUploadedResumeText("");
    setLoadingUploadedPdf(true);
    try {
      const extractedText = await extractTextFromPdf(file);
      setUploadedResumeText(extractedText);
      toast.success("PDF loaded successfully");
    } catch (error) {
      setUploadedFileName("");
      setUploadedResumeText("");
      toast.error("Could not read the uploaded PDF", {
        description:
          error.message || "Only text-based PDFs are supported right now.",
      });
    } finally {
      setLoadingUploadedPdf(false);
      event.target.value = "";
    }
  };

  const handleAnalyze = async () => {
    const jobDescriptionError = getJobDescriptionValidationError(jobDescription);
    if (jobDescriptionError) return toast.error(jobDescriptionError);

    let content = "";
    if (sourceType === "saved") {
      if (!selectedId) return toast.error("Please select a resume");
      if (loadingResume || !resumeData)
        return toast.error("Resume data not loaded yet");
      content = generateResumeContent(resumeData);
    } else {
      if (loadingUploadedPdf)
        return toast.error("PDF is still being processed");
      if (!uploadedResumeText)
        return toast.error("Please upload a text-based PDF resume");
      content = uploadedResumeText;
    }
    if (!content.trim()) return toast.error("Resume content is empty");

    setResult(null);
    setIsAnalyzing(true);
    setStage(0);
    setProgress(0);
    try {
      const prompt = ATS_PROMPT.replace("{jobDescription}", jobDescription).replace(
        "{resumeContent}",
        content
      );
      const aiResult = await AIChatSession.sendMessage(prompt);
      const text = aiResult.response.text().trim();
      const clean = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
      setResult(JSON.parse(clean));
    } catch (err) {
      toast.error("Analysis failed", { description: err.message });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyRecs = () => {
    if (!result?.recommendations) return;
    navigator.clipboard
      .writeText(result.recommendations.join("\n"))
      .then(() => {
        setCopied(true);
        toast.success("Recommendations copied");
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const selectedTitle =
    resumeList.find((r) => r._id === selectedId)?.title || "";
  const jobDescriptionError = getJobDescriptionValidationError(jobDescription);
  const isReadyToAnalyze =
    sourceType === "saved"
      ? Boolean(selectedId && resumeData && !loadingResume)
      : Boolean(uploadedResumeText && !loadingUploadedPdf);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white text-slate-900 antialiased">
      {/* ── Top bar ── */}
      <header className="flex flex-shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-6 py-3">
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-2">
          <span
            className="text-[15px] font-semibold tracking-tight text-slate-900"
            style={DISPLAY}
          >
            ATS Score Analyzer
          </span>
          <span className="hidden text-[11px] text-slate-400 sm:inline">
            · Check how well your resume matches a job description
          </span>
        </div>
      </header>

      {/* ── Body (2-column) ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ══════════════ LEFT PANEL ══════════════ */}
        <aside className="flex w-[42%] min-w-[380px] max-w-[540px] flex-shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
          <div className="flex-1 space-y-7 overflow-y-auto px-7 py-7">
            {/* Step 1 — Source */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <StepNumber n={1} />
                <h3 className="text-[13px] font-semibold text-slate-800">
                  Choose resume source
                </h3>
              </div>

              <div className="mb-3 inline-flex rounded-full border border-slate-200 bg-white p-1 text-[12.5px]">
                {[
                  { id: "saved", label: "Saved resume" },
                  { id: "pdf", label: "Upload PDF" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSourceChange(opt.id)}
                    className={`rounded-full px-4 py-1.5 font-semibold transition-colors ${
                      sourceType === opt.id
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {sourceType === "saved" ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-left text-[13px] transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <FileText className="h-4 w-4 flex-shrink-0 text-slate-400" />
                        <span
                          className={`truncate ${
                            selectedId
                              ? "font-medium text-slate-900"
                              : "text-slate-400"
                          }`}
                        >
                          {selectedId ? selectedTitle : "Choose a resume…"}
                        </span>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {dropdownOpen && (
                      <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                        {resumeList.length === 0 ? (
                          <p className="px-4 py-3 text-center text-[12.5px] text-slate-400">
                            No resumes found
                          </p>
                        ) : (
                          resumeList.map((r) => (
                            <button
                              key={r._id}
                              onClick={() => handleSelectResume(r._id)}
                              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] transition-colors ${
                                r._id === selectedId
                                  ? "bg-slate-50 font-medium text-slate-900"
                                  : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <FileText className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                              <span className="truncate">{r.title}</span>
                              {r._id === selectedId && (
                                <CheckCircle
                                  className="ml-auto h-3.5 w-3.5 flex-shrink-0"
                                  style={{ color: ACCENT }}
                                />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  {loadingResume && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-slate-500">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                      Loading resume data…
                    </p>
                  )}
                  {selectedId && !loadingResume && resumeData && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-emerald-600">
                      <CheckCircle className="h-3 w-3" /> Resume loaded
                      successfully
                    </p>
                  )}
                </>
              ) : (
                <>
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                    />
                    <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-5 transition-colors hover:border-slate-400 hover:bg-white">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                          <Upload
                            className="h-4 w-4"
                            style={{ color: ACCENT }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-slate-900">
                            {uploadedFileName || "Upload resume PDF"}
                          </p>
                          <p className="mt-1 text-[11.5px] leading-relaxed text-slate-500">
                            Choose a text-based PDF resume. Scanned image PDFs
                            are not supported.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {loadingUploadedPdf && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-slate-500">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                      Extracting text from PDF…
                    </p>
                  )}
                  {uploadedFileName && !loadingUploadedPdf && uploadedResumeText && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-emerald-600">
                      <CheckCircle className="h-3 w-3" /> PDF text loaded
                      successfully
                    </p>
                  )}
                </>
              )}
            </section>

            {/* Step 2 — JD */}
            <section>
              <div className="mb-3 flex items-center gap-2">
                <StepNumber n={2} />
                <h3 className="text-[13px] font-semibold text-slate-800">
                  Paste the job description
                </h3>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here…&#10;&#10;Include responsibilities, required skills, qualifications, and any other details from the job posting for the most accurate analysis."
                rows={14}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-[13px] leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              />
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <div className="text-[11.5px] text-red-500">
                  {jobDescription.trim().length > 0 &&
                    jobDescriptionError &&
                    jobDescriptionError}
                </div>
                <p className="text-[11px] text-slate-400">
                  {jobDescription.length} characters
                  {jobDescription.length < 50 && jobDescription.length > 0 && (
                    <span className="text-amber-600"> (min 50)</span>
                  )}
                </p>
              </div>
            </section>
          </div>

          {/* Analyze button pinned */}
          <div className="flex-shrink-0 border-t border-slate-200 bg-white px-7 py-4">
            <button
              onClick={handleAnalyze}
              disabled={
                isAnalyzing ||
                loadingResume ||
                loadingUploadedPdf ||
                Boolean(jobDescriptionError) ||
                !isReadyToAnalyze
              }
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 text-[13.5px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze resume
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </aside>

        {/* ══════════════ RIGHT PANEL ══════════════ */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAF9]">
          {/* ── Idle ── */}
          {!isAnalyzing && !result && (
            <div className="flex h-full flex-col items-center justify-center px-12 py-12 text-center">
              <div
                className="mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: `${ACCENT}18` }}
              >
                <Target className="h-9 w-9" style={{ color: ACCENT }} />
              </div>
              <h2
                className="text-[28px] font-semibold leading-tight tracking-tight text-slate-900"
                style={DISPLAY}
              >
                Ready to analyze.
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-slate-600">
                Pick a saved resume or upload a PDF on the left, paste a job
                description, and hit <strong>Analyze</strong>.
              </p>
              <div className="mt-10 grid w-full max-w-md grid-cols-3 gap-3">
                {[
                  { label: "ATS score", icon: PieChart },
                  { label: "Keyword gaps", icon: Search },
                  { label: "Recommendations", icon: Lightbulb },
                ].map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <Icon className="h-5 w-5 text-slate-700" />
                    <span className="text-[12px] font-medium text-slate-600">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Analyzing ── */}
          {isAnalyzing && (
            <div className="flex h-full flex-col items-center justify-center px-8 py-12">
              {/* Ring */}
              <div className="relative mb-8 h-40 w-40">
                <div
                  className="absolute inset-0 animate-spin"
                  style={{ animationDuration: "8s" }}
                >
                  <svg viewBox="0 0 100 100" className="h-full w-full text-slate-200">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray="4 6"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="h-full w-full">
                    <circle
                      cx="50"
                      cy="50"
                      r="25"
                      stroke={ACCENT}
                      strokeWidth="4"
                      strokeDasharray={`${progress * 1.57} 157`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-slate-900">
                  {React.createElement(analyzeStages[stage].icon, {
                    className: "h-10 w-10 animate-pulse",
                  })}
                </div>
              </div>

              <h3
                className="text-[24px] font-semibold tracking-tight text-slate-900"
                style={DISPLAY}
              >
                Analyzing your resume…
              </h3>
              <p
                className="mt-1 text-[13px] font-medium"
                style={{ color: ACCENT }}
              >
                {analyzeStages[stage].label}
              </p>
              <p className="mt-1 max-w-xs text-center text-[11.5px] text-slate-500">
                Comparing your resume against the job requirements in detail.
              </p>

              {/* Progress bar */}
              <div className="mt-8 w-full max-w-sm">
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (stage / analyzeStages.length) * 100 +
                        progress / analyzeStages.length
                      }%`,
                      backgroundColor: ACCENT,
                    }}
                  />
                </div>
                <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
                  <span>Scanning</span>
                  <span>Matching</span>
                  <span>Scoring</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {analyzeStages.map((s, i) => (
                  <span
                    key={i}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all duration-300 ${
                      i < stage
                        ? "bg-emerald-50 text-emerald-700"
                        : i === stage
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {i < stage && "✓ "}
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {!isAnalyzing && result && (
            <div className="space-y-5 px-8 py-8">
              {/* Score hero */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-6">
                  <div className="relative h-28 w-28 flex-shrink-0">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="9"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke={scoreColor(result.score)}
                        strokeWidth="9"
                        strokeDasharray={`${result.score * 2.64} 264`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        style={{ transition: "stroke-dasharray 1s ease" }}
                      />
                      <text
                        x="50%"
                        y="48%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="22"
                        fontWeight="700"
                        fill="#0F172A"
                        style={DISPLAY}
                      >
                        {result.score}
                      </text>
                      <text
                        x="50%"
                        y="65%"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="9"
                        fill="#9CA3AF"
                      >
                        / 100
                      </text>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span
                      className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold"
                      style={{ color: scoreColor(result.score) }}
                    >
                      {scoreLabel(result.score)}
                    </span>
                    <h2
                      className="mt-2 text-[26px] font-semibold leading-tight tracking-tight text-slate-900"
                      style={DISPLAY}
                    >
                      ATS match score
                    </h2>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-slate-600">
                      {result.score >= 75
                        ? "Your resume is a strong match. Apply with confidence."
                        : result.score >= 50
                        ? "Moderate match. A few keyword tweaks can improve your chances."
                        : "Low match. Add missing keywords and tailor your experience."}
                    </p>
                    {result.missingKeywords?.length > 0 && (
                      <p
                        className="mt-2 text-[12px] font-semibold"
                        style={{ color: ACCENT }}
                      >
                        {result.missingKeywords.length} missing keyword
                        {result.missingKeywords.length > 1 ? "s" : ""} detected
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Two cards: strengths + improvements */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <h3
                      className="text-[15px] font-semibold text-slate-900"
                      style={DISPLAY}
                    >
                      Strengths
                    </h3>
                    <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {result.strengths?.length || 0}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {result.strengths?.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[12.5px] leading-relaxed text-slate-700"
                      >
                        <CheckCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-50">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <h3
                      className="text-[15px] font-semibold text-slate-900"
                      style={DISPLAY}
                    >
                      Improvements
                    </h3>
                    <span className="ml-auto rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                      {result.improvements?.length || 0}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {result.improvements?.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[12.5px] leading-relaxed text-slate-700"
                      >
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-500" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing keywords */}
              {result.missingKeywords?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-md"
                      style={{ backgroundColor: `${ACCENT}15` }}
                    >
                      <XCircle className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                    </div>
                    <h3
                      className="text-[15px] font-semibold text-slate-900"
                      style={DISPLAY}
                    >
                      Missing keywords
                    </h3>
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold text-white"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {result.missingKeywords.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[12px] font-medium"
                        style={{
                          borderColor: `${ACCENT}40`,
                          backgroundColor: `${ACCENT}08`,
                          color: ACCENT,
                        }}
                      >
                        <XCircle className="h-3 w-3" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
                      <Lightbulb className="h-3.5 w-3.5 text-slate-700" />
                    </div>
                    <h3
                      className="text-[15px] font-semibold text-slate-900"
                      style={DISPLAY}
                    >
                      Recommendations
                    </h3>
                    <button
                      onClick={copyRecs}
                      className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-700 transition-colors hover:text-slate-900"
                    >
                      {copied ? (
                        <ClipboardCheck className="h-3.5 w-3.5" />
                      ) : (
                        <Clipboard className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied" : "Copy all"}
                    </button>
                  </div>
                  <ol className="space-y-3">
                    {result.recommendations.map((r, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[12.5px] leading-relaxed text-slate-700"
                      >
                        <span
                          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: ACCENT }}
                        >
                          {i + 1}
                        </span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pb-4">
                <button
                  onClick={() => {
                    setResult(null);
                    setJobDescription("");
                    setSourceType("saved");
                    setSelectedId("");
                    setUploadedFileName("");
                    setUploadedResumeText("");
                    setDropdownOpen(false);
                    setCopied(false);
                  }}
                  className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-semibold text-slate-700 transition-colors hover:border-slate-400"
                >
                  Start over
                </button>
                <button
                  onClick={handleAnalyze}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  <TrendingUp className="h-4 w-4" />
                  Re-analyze
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ── Small local component ────────────────────────────────────────────
function StepNumber({ n }) {
  return (
    <span
      className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
      style={{
        backgroundColor: ACCENT,
        color: "#FFFFFF",
      }}
    >
      {n}
    </span>
  );
}
