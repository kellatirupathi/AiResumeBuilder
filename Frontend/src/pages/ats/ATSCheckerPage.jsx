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
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { AIChatSession } from "@/Services/AiModel";
import { getAllResumeData, getResumeData } from "@/Services/resumeAPI";

// ── ATS PROMPT ─────────────────────────────────────────────────────────────
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

// ── HELPERS ─────────────────────────────────────────────────────────────────
const generateResumeContent = (resume) => {
  if (!resume) return "";
  let c = "";
  if (resume.firstName || resume.lastName) c += `Name: ${resume.firstName || ""} ${resume.lastName || ""}\n`;
  if (resume.jobTitle) c += `Job Title: ${resume.jobTitle}\n`;
  if (resume.email) c += `Email: ${resume.email}\n`;
  if (resume.phone) c += `Phone: ${resume.phone}\n`;
  if (resume.address) c += `Location: ${resume.address}\n\n`;
  if (resume.summary) c += `SUMMARY\n${resume.summary}\n\n`;
  if (resume.skills?.length) {
    c += "SKILLS\n";
    resume.skills.forEach((s) => { if (s.name) c += `${s.name}\n`; });
    c += "\n";
  }
  if (resume.experience?.length) {
    c += "EXPERIENCE\n";
    resume.experience.forEach((e) => {
      if (e.title) c += `${e.title}`;
      if (e.companyName) c += ` at ${e.companyName}`;
      if (e.startDate || e.endDate) c += ` | ${e.startDate || ""} - ${e.currentlyWorking ? "Present" : e.endDate || ""}`;
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
      if (p.projectSummary) c += `${p.projectSummary.replace(/<[^>]*>?/gm, "")}\n`;
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
    pdfJsLibPromise = import("pdfjs-dist/legacy/build/pdf.mjs").then((pdfjsLib) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
        import.meta.url
      ).toString();
      return pdfjsLib;
    });
  }

  return pdfJsLibPromise;
};

const extractTextFromPdf = async (file) => {
  const pdfjsLib = await getPdfJsLib();
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item) => item.str || "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText) {
      pageTexts.push(pageText);
    }
  }

  const combinedText = pageTexts.join("\n\n").trim();

  if (!combinedText) {
    throw new Error("No readable text was found in the uploaded PDF. Only text-based PDFs are supported.");
  }

  return combinedText;
};

const analyzeStages = [
  { label: "Extracting keywords…",   icon: Search   },
  { label: "Matching skills…",        icon: Cpu      },
  { label: "Analyzing experience…",   icon: FileText },
  { label: "Evaluating format…",      icon: Code     },
  { label: "Calculating score…",      icon: BarChart3 },
];

// ── SCORE COLOUR ─────────────────────────────────────────────────────────────
const scoreColor = (s) => s >= 75 ? "#10B981" : s >= 50 ? "#F59E0B" : "#EF4444";
const scoreBg    = (s) => s >= 75 ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
                        : s >= 50 ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                        :           "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
const scoreLabel = (s) => s >= 75 ? "Great Match" : s >= 50 ? "Moderate Match" : "Low Match";

// ═══════════════════════════════════════════════════════════════════════════════
export default function ATSCheckerPage() {
  const navigate = useNavigate();

  // left panel state
  const [resumeList, setResumeList]         = useState([]);
  const [sourceType, setSourceType]         = useState("saved");
  const [selectedId, setSelectedId]         = useState("");
  const [resumeData, setResumeData]         = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedResumeText, setUploadedResumeText] = useState("");
  const [loadingResume, setLoadingResume]   = useState(false);
  const [loadingUploadedPdf, setLoadingUploadedPdf] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [dropdownOpen, setDropdownOpen]     = useState(false);

  // right panel state
  const [isAnalyzing, setIsAnalyzing]       = useState(false);
  const [stage, setStage]                   = useState(0);
  const [progress, setProgress]             = useState(0);
  const [result, setResult]                 = useState(null);
  const [copied, setCopied]                 = useState(false);

  // fetch resume list on mount
  useEffect(() => {
    getAllResumeData()
      .then((res) => setResumeList(res.data || []))
      .catch(() => toast.error("Could not load resumes"));
  }, []);

  // animation ticker
  useEffect(() => {
    if (!isAnalyzing) return;
    const stageTime  = 10000 / analyzeStages.length;
    const tickMs     = 50;
    const stepsPerStage = stageTime / tickMs;
    let step = 0;
    const id = setInterval(() => {
      step++;
      const s = Math.min(Math.floor(step / stepsPerStage), analyzeStages.length - 1);
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
      setResumeData(null);
      setLoadingResume(false);
    }
  };

  const handleSelectResume = async (id) => {
    setSourceType("saved");
    setSelectedId(id);
    setDropdownOpen(false);
    setUploadedFileName("");
    setUploadedResumeText("");
    setLoadingResume(true);
    try {
      const res = await getResumeData(id);
      setResumeData(res.data);
    } catch {
      toast.error("Failed to load resume data");
    } finally {
      setLoadingResume(false);
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please upload a PDF file only.");
      event.target.value = "";
      return;
    }

    setSourceType("pdf");
    setDropdownOpen(false);
    setSelectedId("");
    setResumeData(null);
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
        description: error.message || "Only text-based PDFs are supported right now.",
      });
    } finally {
      setLoadingUploadedPdf(false);
      event.target.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (jobDescription.trim().length < 50) return toast.error("Job description is too short");

    let content = "";

    if (sourceType === "saved") {
      if (!selectedId) return toast.error("Please select a resume");
      if (loadingResume || !resumeData) return toast.error("Resume data not loaded yet");
      content = generateResumeContent(resumeData);
    } else {
      if (loadingUploadedPdf) return toast.error("PDF is still being processed");
      if (!uploadedResumeText) return toast.error("Please upload a text-based PDF resume");
      content = uploadedResumeText;
    }

    if (!content.trim()) return toast.error("Resume content is empty");

    setResult(null);
    setIsAnalyzing(true);
    setStage(0);
    setProgress(0);

    try {
      const prompt  = ATS_PROMPT
        .replace("{jobDescription}", jobDescription)
        .replace("{resumeContent}", content);

      const aiResult = await AIChatSession.sendMessage(prompt);
      const text     = aiResult.response.text().trim();

      // strip possible markdown code fences
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
    navigator.clipboard.writeText(result.recommendations.join("\n")).then(() => {
      setCopied(true);
      toast.success("Recommendations copied");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectedTitle = resumeList.find((r) => r._id === selectedId)?.title || "";
  const isReadyToAnalyze = sourceType === "saved"
    ? Boolean(selectedId && resumeData && !loadingResume)
    : Boolean(uploadedResumeText && !loadingUploadedPdf);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">

      {/* ── TOP BAR ── */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3.5 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </button>
        <div className="h-4 w-px bg-gray-200 dark:bg-gray-600" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center">
            <PieChart className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-800 dark:text-white">ATS Score Analyzer</span>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 ml-1">
          Check how well your resume matches a job description
        </p>
      </header>

      {/* ── BODY ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══════════════ LEFT PANEL — 40% ══════════════ */}
        <div className="w-[40%] flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Step 1 — Select resume */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Choose Resume Source</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => handleSourceChange("saved")}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    sourceType === "saved"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
                  }`}
                >
                  Saved Resume
                </button>
                <button
                  onClick={() => handleSourceChange("pdf")}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                    sourceType === "pdf"
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900/30 dark:text-indigo-300"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-300"
                  }`}
                >
                  Upload PDF
                </button>
              </div>

              {sourceType === "saved" ? (
                <>
              {/* Custom dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-left transition-colors hover:border-indigo-400 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                    <span className={`truncate ${selectedId ? "text-gray-800 dark:text-gray-200 font-medium" : "text-gray-400"}`}>
                      {selectedId ? selectedTitle : "Choose a resume…"}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-xl overflow-hidden">
                    {resumeList.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-gray-400 text-center">No resumes found</p>
                    ) : (
                      resumeList.map((r) => (
                        <button
                          key={r._id}
                          onClick={() => handleSelectResume(r._id)}
                          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                            r._id === selectedId
                              ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <FileText className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{r.title}</span>
                          {r._id === selectedId && <CheckCircle className="h-3.5 w-3.5 ml-auto text-indigo-500 flex-shrink-0" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {loadingResume && (
                <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  Loading resume data…
                </p>
              )}
              {selectedId && !loadingResume && resumeData && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                  <CheckCircle className="h-3 w-3" /> Resume loaded successfully
                </p>
              )}
                </>
              ) : (
                <>
                  <label className="block">
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handlePdfUpload}
                    />
                    <div className="rounded-2xl border border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-900/10 px-4 py-5 cursor-pointer transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center flex-shrink-0">
                          <Upload className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {uploadedFileName || "Upload resume PDF"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                            Choose a normal text-based PDF resume. Scanned image PDFs are not supported.
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {loadingUploadedPdf && (
                    <p className="text-xs text-indigo-500 mt-2 flex items-center gap-1.5">
                      <span className="inline-block w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Extracting text from PDF...
                    </p>
                  )}
                  {uploadedFileName && !loadingUploadedPdf && uploadedResumeText && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                      <CheckCircle className="h-3 w-3" /> PDF text loaded successfully
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Step 2 — Job Description */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Paste Job Description</h3>
              </div>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here…&#10;&#10;Include responsibilities, required skills, qualifications, and any other details from the job posting for the most accurate analysis."
                rows={14}
                className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors leading-relaxed"
              />
              <p className="text-xs text-gray-400 mt-1.5 text-right">{jobDescription.length} characters {jobDescription.length < 50 && jobDescription.length > 0 && <span className="text-amber-500">(minimum 50)</span>}</p>
            </div>
          </div>

          {/* Analyze button pinned to bottom */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || loadingResume || loadingUploadedPdf || jobDescription.trim().length < 50 || !isReadyToAnalyze}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm py-3 rounded-xl shadow-md shadow-indigo-900/20 transition-all duration-200"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* ══════════════ RIGHT PANEL — 60% ══════════════ */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">

          {/* ── IDLE STATE ── */}
          {!isAnalyzing && !result && (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-100 to-emerald-100 dark:from-indigo-900/30 dark:to-emerald-900/30 flex items-center justify-center mb-5 shadow-inner">
                <Target className="h-9 w-9 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Ready to Analyze</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                Select a saved resume or upload a PDF on the left, then paste a job description and click <strong>Analyze Resume</strong>.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
                {[
                  { label: "ATS Score",           icon: <PieChart   className="h-5 w-5 text-indigo-400" /> },
                  { label: "Keyword Gaps",         icon: <Search     className="h-5 w-5 text-emerald-400" /> },
                  { label: "Recommendations",      icon: <Lightbulb  className="h-5 w-5 text-amber-400" /> },
                ].map(({ label, icon }) => (
                  <div key={label} className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center gap-2">
                    {icon}
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium text-center">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── LOADING / ANIMATION STATE ── */}
          {isAnalyzing && (
            <div className="h-full flex flex-col items-center justify-center px-8 py-12">
              {/* Animated ring */}
              <div className="relative w-44 h-44 mb-8">
                {/* outer dashed ring */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: "8s" }}>
                  <svg viewBox="0 0 100 100" className="w-full h-full text-indigo-300 dark:text-indigo-700">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 6" fill="none" />
                  </svg>
                </div>
                {/* middle pulsing ring */}
                <div className="absolute inset-0 animate-pulse">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-emerald-400 dark:text-emerald-600">
                    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                  </svg>
                </div>
                {/* progress arc */}
                <div className="absolute inset-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle
                      cx="50" cy="50" r="25"
                      stroke="#6366F1"
                      strokeWidth="4"
                      strokeDasharray={`${progress * 1.57} 157`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      fill="none"
                    />
                  </svg>
                </div>
                {/* center icon */}
                <div className="absolute inset-0 flex items-center justify-center text-indigo-500 dark:text-indigo-400">
                  {React.createElement(analyzeStages[stage].icon, { className: "h-11 w-11 animate-pulse" })}
                </div>
                {/* orbiting dots */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: "4s" }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1.5 -translate-y-1.5 w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: "7s", animationDirection: "reverse" }}>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1.5 translate-y-1.5 w-2.5 h-2.5 rounded-full bg-indigo-400" />
                </div>
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: "11s" }}>
                  <div className="absolute top-1/2 right-0 translate-x-1.5 -translate-y-1.5 w-2 h-2 rounded-full bg-amber-400" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Analyzing your resume…</h3>
              <p className="text-indigo-500 dark:text-indigo-400 font-medium text-sm mb-1">{analyzeStages[stage].label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-xs">
                Comparing your resume against the job requirements in detail.
              </p>

              {/* stage progress bar */}
              <div className="mt-8 w-full max-w-sm">
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${(stage / analyzeStages.length) * 100 + (progress / analyzeStages.length)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
                  <span>Scanning</span><span>Matching</span><span>Scoring</span>
                </div>
              </div>

              {/* stage pills */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {analyzeStages.map((s, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300 ${
                      i < stage
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : i === stage
                        ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                    }`}
                  >
                    {i < stage && "✓ "}{s.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULTS STATE ── */}
          {!isAnalyzing && result && (
            <div className="p-6 space-y-5">

              {/* ── Score hero ── */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-6 shadow-sm">
                {/* Circular gauge */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="9" />
                    <circle
                      cx="50" cy="50" r="42"
                      fill="none"
                      stroke={scoreColor(result.score)}
                      strokeWidth="9"
                      strokeDasharray={`${result.score * 2.64} 264`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      style={{ transition: "stroke-dasharray 1s ease" }}
                    />
                    <text x="50%" y="48%" dominantBaseline="middle" textAnchor="middle" fontSize="22" fontWeight="bold" fill={scoreColor(result.score)}>
                      {result.score}
                    </text>
                    <text x="50%" y="65%" dominantBaseline="middle" textAnchor="middle" fontSize="9" fill="#9CA3AF">
                      / 100
                    </text>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${scoreBg(result.score)}`}>
                      {scoreLabel(result.score)}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-1">ATS Match Score</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {result.score >= 75
                      ? "Your resume is a strong match. Apply with confidence!"
                      : result.score >= 50
                      ? "Moderate match. A few keyword tweaks can improve your chances."
                      : "Low match. Add missing keywords and tailor your experience to the role."}
                  </p>
                  {result.missingKeywords?.length > 0 && (
                    <p className="text-xs text-red-500 dark:text-red-400 mt-2 font-medium">
                      {result.missingKeywords.length} missing keyword{result.missingKeywords.length > 1 ? "s" : ""} detected
                    </p>
                  )}
                </div>
              </div>

              {/* ── Two-col grid: strengths + improvements ── */}
              <div className="grid grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Strengths</h3>
                    <span className="ml-auto text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                      {result.strengths?.length || 0}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {result.strengths?.map((s, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Improvements */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Improvements</h3>
                    <span className="ml-auto text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">
                      {result.improvements?.length || 0}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {result.improvements?.map((s, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ── Missing keywords ── */}
              {result.missingKeywords?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                      <XCircle className="h-3.5 w-3.5 text-red-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Missing Keywords</h3>
                    <span className="ml-auto text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">
                      {result.missingKeywords.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missingKeywords.map((kw, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800 px-2.5 py-1 rounded-full font-medium">
                        <XCircle className="h-3 w-3" /> {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Recommendations ── */}
              {result.recommendations?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Lightbulb className="h-3.5 w-3.5 text-indigo-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Recommendations</h3>
                    <button
                      onClick={copyRecs}
                      className="ml-auto flex items-center gap-1.5 text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                    >
                      {copied ? <ClipboardCheck className="h-3.5 w-3.5" /> : <Clipboard className="h-3.5 w-3.5" />}
                      {copied ? "Copied!" : "Copy all"}
                    </button>
                  </div>
                  <ol className="space-y-2">
                    {result.recommendations.map((r, i) => (
                      <li key={i} className="flex gap-2.5 text-xs text-gray-600 dark:text-gray-400">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{r}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* ── Re-analyze CTA ── */}
              <div className="flex gap-3 pb-2">
                <button
                  onClick={() => {
                    setResult(null);
                    setJobDescription("");
                    setSourceType("saved");
                    setSelectedId("");
                    setResumeData(null);
                    setUploadedFileName("");
                    setUploadedResumeText("");
                    setDropdownOpen(false);
                    setCopied(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Start Over
                </button>
                <button
                  onClick={handleAnalyze}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-700 hover:to-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-900/20 transition-all"
                >
                  <TrendingUp className="h-4 w-4" /> Re-Analyze
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
