import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  LoaderCircle,
  Mail,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { resolveApiData } from "@/lib/queryCacheUtils";
import { getAllResumeData } from "@/Services/resumeAPI";
import { generateCoverLetterContent } from "@/Services/coverLetterAi";
import { createCoverLetter, uploadSourceResumePdf } from "@/Services/coverLetterAPI";
import { coverLetterTemplates } from "../components/coverLetterDesignOptions";
import PreviewCoverLetter from "../components/PreviewCoverLetter";

const TONES = [
  { id: "formal", label: "Formal", desc: "Respectful and traditional" },
  { id: "friendly", label: "Friendly", desc: "Warm and conversational" },
  { id: "enthusiastic", label: "Enthusiastic", desc: "Energetic and passionate" },
];

const FieldLabel = ({ children, required = false, className = "" }) => (
  <label className={`text-sm font-medium text-gray-700 dark:text-gray-200 ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

export default function CreateCoverLetterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState(1);

  const [resumes, setResumes] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [uploadedPdf, setUploadedPdf] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManagerName, setHiringManagerName] = useState("");
  const [selectedTone, setSelectedTone] = useState("formal");

  const [selectedTemplate, setSelectedTemplate] = useState(
    coverLetterTemplates?.[0]?.id || "executive-classic"
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const selectedResume = useMemo(
    () => resumes.find((r) => r._id === selectedResumeId) || null,
    [resumes, selectedResumeId]
  );

  useEffect(() => {
    let cancelled = false;
    setResumesLoading(true);
    getAllResumeData()
      .then((res) => {
        if (cancelled) return;
        const list = resolveApiData(res) || [];
        setResumes(Array.isArray(list) ? list : []);
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error("Failed to load your resumes", { description: error.message });
        setResumes([]);
      })
      .finally(() => {
        if (!cancelled) setResumesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF must be smaller than 10MB");
      return;
    }
    setIsUploading(true);
    try {
      const response = await uploadSourceResumePdf(file);
      const data = resolveApiData(response) || response;
      setUploadedPdf({
        fileName: data.fileName || file.name,
        extractedText: data.extractedText || "",
      });
      setSelectedResumeId(null);
      toast.success("PDF uploaded", {
        description: `${data.fileName || file.name} ready to use`,
      });
    } catch (error) {
      toast.error("Failed to extract text from PDF", {
        description: error?.message || "Try a different PDF",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const goNextFromStep1 = () => {
    if (!selectedResumeId && !uploadedPdf) {
      toast.error("Please select a resume or upload a PDF");
      return;
    }
    setStep(2);
  };

  const goNextFromStep2 = () => {
    if (!jobTitle.trim()) return toast.error("Job title is required");
    if (!companyName.trim()) return toast.error("Company name is required");
    if (!jdText.trim()) return toast.error("Job description is required");
    setStep(3);
  };

  const handleGenerate = async () => {
    if (!selectedResume && !uploadedPdf?.extractedText) {
      toast.error("Source resume missing — please go back to step 1");
      setStep(1);
      return;
    }
    setIsGenerating(true);
    try {
      const generatedContent = await generateCoverLetterContent({
        resumeData: selectedResume,
        uploadedResumeText: uploadedPdf?.extractedText || "",
        jobDescription: jdText,
        jobTitle,
        companyName,
        hiringManagerName,
        tone: selectedTone,
      });

      const tpl = coverLetterTemplates.find((t) => t.id === selectedTemplate);

      const payload = {
        title: `${jobTitle} at ${companyName}`,
        template: selectedTemplate,
        themeColor: tpl?.accentColor || "#1c2434",
        sourceResumeId: selectedResumeId || null,
        uploadedResumeFileName: uploadedPdf?.fileName || null,
        uploadedResumeText: uploadedPdf?.extractedText || "",
        jobTitle,
        companyName,
        hiringManagerName,
        jobDescription: jdText,
        tone: selectedTone,
        generatedContent,
      };

      const response = await createCoverLetter(payload);
      const created = resolveApiData(response) || response;
      const newId =
        created?.coverLetter?._id ||
        created?._id ||
        response?.data?.coverLetter?._id;

      toast.success("Cover letter created!", {
        description: `${jobTitle} at ${companyName} is ready to edit.`,
      });

      if (newId) {
        navigate(`/dashboard/cover-letter/${newId}`);
      } else {
        navigate("/dashboard?tab=cover-letters");
      }
    } catch (error) {
      console.error("Cover letter generation failed:", error);
      toast.error("Failed to generate cover letter", {
        description: error?.message || "Please try again",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sourcePreview = useMemo(() => {
    return {
      template: selectedTemplate,
      themeColor:
        coverLetterTemplates.find((t) => t.id === selectedTemplate)?.accentColor || "#1c2434",
      senderName: selectedResume
        ? `${selectedResume.firstName || ""} ${selectedResume.lastName || ""}`.trim() ||
          "Your Name"
        : "Your Name",
      senderEmail: selectedResume?.email || "you@example.com",
      senderPhone: selectedResume?.phone || "+1 (555) 123-4567",
      senderAddress: selectedResume?.address || "City, State",
      senderLinkedin: selectedResume?.linkedinUrl || "",
      senderPortfolio: selectedResume?.portfolioUrl || "",
      jobTitle: jobTitle || "Job Title",
      companyName: companyName || "Company Name",
      hiringManagerName,
      generatedContent: {
        greeting: hiringManagerName
          ? `Dear ${hiringManagerName},`
          : "Dear Hiring Manager,",
        openingParagraph:
          "I am excited to apply for the position. With my background and skills, I believe I would be a strong match for your team. This is a sample of how your generated cover letter will look in this template.",
        bodyParagraphs: [
          "Body paragraph 1 will appear here once you generate the cover letter — highlighting your most relevant experience and quantifiable achievements.",
          "Body paragraph 2 will explain why you're interested in the company and how your skills align with the role.",
        ],
        closingParagraph:
          "Thank you for your time and consideration. I would welcome the opportunity to discuss how I can contribute to your team's continued success.",
        signature: "Sincerely,",
      },
    };
  }, [selectedTemplate, selectedResume, jobTitle, companyName, hiringManagerName]);

  const stepIndicator = (
    <div className="flex items-center gap-3">
      {[
        { n: 1, label: "Source" },
        { n: 2, label: "Job Details" },
        { n: 3, label: "Template" },
      ].map(({ n, label }, idx, arr) => (
        <React.Fragment key={n}>
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                step === n
                  ? "bg-white text-indigo-700 shadow-md ring-2 ring-white/40"
                  : step > n
                  ? "bg-emerald-400 text-white"
                  : "bg-white/20 text-white/70"
              }`}
            >
              {step > n ? <Check className="h-3.5 w-3.5" /> : n}
            </div>
            <span
              className={`text-xs font-medium ${
                step >= n ? "text-white" : "text-white/60"
              }`}
            >
              {label}
            </span>
          </div>
          {idx < arr.length - 1 && (
            <div
              className={`h-px w-8 transition-all ${
                step > n ? "bg-emerald-400" : "bg-white/20"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Create Cover Letter — NxtResume</title>
      </Helmet>
      <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Top header bar with step indicator */}
        <header className="z-20 flex-shrink-0 bg-gradient-to-r from-emerald-500 to-indigo-600 px-6 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => navigate("/dashboard?tab=cover-letters")}
              className="inline-flex flex-shrink-0 items-center gap-1.5 text-sm font-medium text-white/90 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {stepIndicator}
            <p className="hidden flex-shrink-0 text-xs text-white/80 sm:block">
              Step {step} of 3
            </p>
          </div>
        </header>

        {/* Main content - 2-column on lg+ */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* LEFT: Form area (scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-8 lg:max-w-2xl lg:flex-shrink-0">
            {step === 1 && (
              <div className="mx-auto w-full max-w-xl space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Choose your source
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    The AI will read your resume to tailor the cover letter to the job.
                  </p>
                </div>

                {/* Upload PDF */}
                <div>
                  <FieldLabel>Upload an external PDF resume</FieldLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`mt-2 flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 text-left transition-all ${
                      uploadedPdf
                        ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                        : "border-indigo-300 bg-white hover:border-indigo-500 hover:bg-indigo-50 dark:bg-gray-800 dark:hover:bg-gray-700"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <LoaderCircle className="h-5 w-5 animate-spin text-indigo-600" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          Extracting text from PDF...
                        </span>
                      </>
                    ) : uploadedPdf ? (
                      <>
                        <Check className="h-5 w-5 text-emerald-600" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {uploadedPdf.fileName}
                          </div>
                          <div className="text-xs text-emerald-700 dark:text-emerald-400">
                            {uploadedPdf.extractedText.length.toLocaleString()} characters extracted
                          </div>
                        </div>
                        <span className="text-xs text-indigo-600 underline">Replace</span>
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 text-indigo-600" />
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            Drop or click to upload PDF
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            We'll extract text and use it for AI generation (max 10MB)
                          </div>
                        </div>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs font-semibold uppercase text-gray-400 tracking-wider">
                    OR
                  </span>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Pick existing resume */}
                <div>
                  <FieldLabel>Pick from your existing resumes</FieldLabel>
                  {resumesLoading ? (
                    <div className="mt-2 flex items-center justify-center rounded-lg border border-gray-200 px-4 py-6 text-gray-500 dark:border-gray-700">
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Loading resumes...
                    </div>
                  ) : resumes.length === 0 ? (
                    <div className="mt-2 rounded-lg border border-gray-200 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700">
                      You have no resumes yet. Upload a PDF above instead.
                    </div>
                  ) : (
                    <div className="relative mt-2">
                      <select
                        value={selectedResumeId || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedResumeId(id || null);
                          if (id) setUploadedPdf(null);
                        }}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="">-- Select a resume --</option>
                        {resumes.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.title || "Untitled Resume"}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mx-auto w-full max-w-xl space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Job details
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Paste the job description so we can tailor every paragraph.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <FieldLabel required>Job title</FieldLabel>
                    <Input
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <FieldLabel required>Company name</FieldLabel>
                    <Input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <FieldLabel>Hiring manager name (optional)</FieldLabel>
                  <Input
                    value={hiringManagerName}
                    onChange={(e) => setHiringManagerName(e.target.value)}
                    placeholder='e.g. "Jane Doe" — leave blank for "Hiring Manager"'
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel required>Job description</FieldLabel>
                  <Textarea
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    placeholder="Paste the full job description here..."
                    rows={10}
                    className="resize-none"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {jdText.length.toLocaleString()} characters
                  </p>
                </div>

                <div className="space-y-2">
                  <FieldLabel>Tone</FieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {TONES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTone(t.id)}
                        className={`rounded-lg border-2 p-3 text-left transition-all ${
                          selectedTone === t.id
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                        }`}
                      >
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {t.label}
                        </div>
                        <div className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                          {t.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mx-auto w-full max-w-3xl space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Pick a template
                  </h1>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Choose a design — content stays the same, only the layout changes. You can switch later.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {coverLetterTemplates.map((tpl) => {
                    const active = selectedTemplate === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`group relative overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm transition-all hover:shadow-md dark:bg-gray-800 ${
                          active
                            ? "border-indigo-500 shadow-md ring-2 ring-indigo-500/30"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                        }`}
                      >
                        {/* Selected check badge */}
                        {active && (
                          <div
                            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-md"
                            style={{ backgroundColor: tpl.accentColor }}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                        )}

                        {/* Preview image (with fallback) */}
                        <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
                          <img
                            src={tpl.previewUrl}
                            alt={tpl.name}
                            className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = "flex";
                            }}
                          />
                          {/* Fallback placeholder when image is missing */}
                          <div
                            className="absolute inset-0 hidden flex-col items-center justify-center gap-2 p-4 text-center"
                            style={{
                              backgroundColor: `${tpl.accentColor}10`,
                            }}
                          >
                            <div
                              className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                              style={{ backgroundColor: tpl.accentColor }}
                            >
                              <Mail className="h-5 w-5" />
                            </div>
                            <div
                              className="text-xs font-semibold"
                              style={{ color: tpl.accentColor }}
                            >
                              Preview coming soon
                            </div>
                          </div>
                        </div>

                        {/* Footer info */}
                        <div
                          className="border-t px-3 py-2.5 transition-colors"
                          style={{
                            backgroundColor: active
                              ? `${tpl.accentColor}10`
                              : undefined,
                            borderColor: active ? tpl.accentColor : undefined,
                          }}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                              {tpl.name}
                            </div>
                            <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                              {tpl.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-800 dark:bg-indigo-900/20">
                  <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
                    Ready to generate
                  </h4>
                  <div className="mt-2 space-y-1 text-xs text-indigo-800 dark:text-indigo-300">
                    <div>
                      <span className="font-semibold">Role:</span> {jobTitle} at {companyName}
                    </div>
                    <div>
                      <span className="font-semibold">Tone:</span>{" "}
                      <span className="capitalize">{selectedTone}</span>
                    </div>
                    <div>
                      <span className="font-semibold">Template:</span>{" "}
                      {coverLetterTemplates.find((t) => t.id === selectedTemplate)?.name}
                    </div>
                    <div>
                      <span className="font-semibold">Source:</span>{" "}
                      {uploadedPdf
                        ? `Uploaded PDF (${uploadedPdf.fileName})`
                        : selectedResume?.title || "—"}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Live template preview — sticky full-height (lg+ only) */}
          <aside className="hidden flex-1 flex-col overflow-hidden border-l border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-950 lg:flex">
            <div className="flex-shrink-0 border-b border-gray-200 px-6 py-3 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Live preview
                </p>
                <p className="text-xs text-gray-400">
                  {coverLetterTemplates.find((t) => t.id === selectedTemplate)?.name}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto max-w-2xl">
                <div
                  className="origin-top overflow-hidden rounded-md bg-white shadow-lg"
                  style={{ transform: "scale(0.85)", transformOrigin: "top center" }}
                >
                  <PreviewCoverLetter coverLetterInfo={sourcePreview} />
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer / nav buttons */}
        <footer className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-3 shadow-[0_-1px_3px_rgba(0,0,0,0.04)] dark:border-gray-700 dark:bg-gray-900">
          <div className="flex items-center justify-between gap-3">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={isGenerating}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard?tab=cover-letters")}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            )}

            <div className="flex items-center gap-2">
              {step === 1 && (
                <Button
                  onClick={goNextFromStep1}
                  disabled={!selectedResumeId && !uploadedPdf}
                  className="gap-1.5 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {step === 2 && (
                <Button
                  onClick={goNextFromStep2}
                  className="gap-1.5 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {step === 3 && (
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="gap-1.5 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700"
                >
                  {isGenerating ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Cover Letter
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
