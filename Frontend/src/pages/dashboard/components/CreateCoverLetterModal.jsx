import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { resolveApiData } from "@/lib/queryCacheUtils";
import { getAllResumeData } from "@/Services/resumeAPI";
import { generateCoverLetterContent } from "@/Services/coverLetterAi";
import { createCoverLetter, uploadSourceResumePdf } from "@/Services/coverLetterAPI";
import { coverLetterTemplates } from "../cover-letter/components/coverLetterDesignOptions";

const TONES = [
  { id: "formal", label: "Formal" },
  { id: "friendly", label: "Friendly" },
  { id: "enthusiastic", label: "Enthusiastic" },
];

const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium text-gray-700 dark:text-gray-200 ${className}`}
  >
    {children}
  </label>
);

function CreateCoverLetterModal({ open, onOpenChange, onCreated }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [resumes, setResumes] = useState([]);
  const [resumesLoading, setResumesLoading] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  const [jdText, setJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hiringManagerName, setHiringManagerName] = useState("");
  const [selectedTone, setSelectedTone] = useState("formal");

  const [selectedTemplate, setSelectedTemplate] = useState(
    coverLetterTemplates?.[0]?.id || "classic"
  );

  const [isGenerating, setIsGenerating] = useState(false);

  // External PDF upload state
  const fileInputRef = useRef(null);
  const [uploadedPdf, setUploadedPdf] = useState(null); // { fileName, extractedText }
  const [isUploading, setIsUploading] = useState(false);

  const resetState = () => {
    setStep(1);
    setSelectedResumeId(null);
    setJdText("");
    setJobTitle("");
    setCompanyName("");
    setHiringManagerName("");
    setSelectedTone("formal");
    setSelectedTemplate(coverLetterTemplates?.[0]?.id || "classic");
    setIsGenerating(false);
    setUploadedPdf(null);
    setIsUploading(false);
  };

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

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const fetchResumes = async () => {
      setResumesLoading(true);
      try {
        const res = await getAllResumeData();
        const list = resolveApiData(res) || [];
        if (!cancelled) setResumes(Array.isArray(list) ? list : []);
      } catch (error) {
        if (!cancelled) {
          toast.error("Failed to load your resumes", {
            description: error.message,
          });
          setResumes([]);
        }
      } finally {
        if (!cancelled) setResumesLoading(false);
      }
    };
    fetchResumes();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleClose = (next) => {
    if (isGenerating) return;
    if (!next) {
      resetState();
    }
    onOpenChange?.(next);
  };

  const handleSelectResume = (id) => {
    setSelectedResumeId(id);
    setStep(2);
  };

  const goToStep3 = () => {
    if (!jobTitle.trim()) {
      toast.error("Job title is required");
      return;
    }
    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }
    if (!jdText.trim()) {
      toast.error("Job description is required");
      return;
    }
    setStep(3);
  };

  const handleGenerate = async () => {
    const selectedResume = selectedResumeId
      ? resumes.find((r) => r._id === selectedResumeId)
      : null;

    if (!selectedResume && !uploadedPdf?.extractedText) {
      toast.error("Please select a resume or upload a PDF");
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

      const payload = {
        title: `${jobTitle} at ${companyName}`,
        template: selectedTemplate,
        themeColor: "#1c2434",
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
        response?.data?.coverLetter?._id ||
        response?.coverLetter?._id;

      toast.success("Cover letter created", {
        description: `${jobTitle} at ${companyName} is ready to edit.`,
      });

      if (typeof onCreated === "function") {
        onCreated(created?.coverLetter || created || response);
      }

      resetState();
      onOpenChange?.(false);

      if (newId) {
        navigate(`/dashboard/cover-letter/${newId}`);
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

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 mt-3">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            step === s
              ? "w-8 bg-white"
              : step > s
              ? "w-4 bg-white/80"
              : "w-4 bg-white/30"
          }`}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white p-5">
          <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
            <Mail className="w-5 h-5" />
            {step === 1
              ? "Select Source Resume"
              : step === 2
              ? "Job Details"
              : "Choose Template & Generate"}
          </DialogTitle>
          <DialogDescription className="text-center pt-1.5 text-indigo-100 text-sm">
            {step === 1
              ? "Pick a resume to use as the basis for your cover letter"
              : step === 2
              ? "Tell us about the role and paste the job description"
              : "Select a template, then let AI craft your cover letter"}
          </DialogDescription>
          {stepIndicator}
        </DialogHeader>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full justify-start gap-2 border-dashed border-2 border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                {isUploading ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Extracting text from PDF...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 text-indigo-600" />
                    {uploadedPdf
                      ? `Uploaded: ${uploadedPdf.fileName}`
                      : "Upload External PDF Resume"}
                  </>
                )}
              </Button>

              {uploadedPdf && (
                <div className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md p-2">
                  ✓ {uploadedPdf.fileName} parsed (
                  {uploadedPdf.extractedText.length} chars). Click Continue
                  below or pick one of your resumes instead.
                </div>
              )}

              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-2">
                Or pick from your Resumes
              </div>

              {resumesLoading ? (
                <div className="flex items-center justify-center py-10 text-gray-500">
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                  Loading resumes...
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                  No resumes found. Create a resume first to generate a cover
                  letter.
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedResumeId || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedResumeId(id || null);
                      if (id) setUploadedPdf(null);
                    }}
                    className="w-full appearance-none rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2.5 text-sm text-gray-800 dark:text-gray-100 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  >
                    <option value="">-- Select a resume --</option>
                    {resumes.map((r) => (
                      <option key={r._id} value={r._id}>
                        {r.title || "Untitled Resume"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="cl-job-title">Job Title *</Label>
                  <Input
                    id="cl-job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cl-company">Company Name *</Label>
                  <Input
                    id="cl-company"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cl-hm">Hiring Manager Name (optional)</Label>
                <Input
                  id="cl-hm"
                  value={hiringManagerName}
                  onChange={(e) => setHiringManagerName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cl-jd">Job Description *</Label>
                <Textarea
                  id="cl-jd"
                  rows={6}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="min-h-[140px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => {
                    const active = selectedTone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTone(t.id)}
                        className={`px-4 py-2 rounded-full text-sm border transition-all ${
                          active
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                            : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-emerald-400"
                        }`}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coverLetterTemplates.map((tpl) => {
                  const active = selectedTemplate === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplate(tpl.id)}
                      className={`text-left rounded-lg border-2 p-4 transition-all ${
                        active
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
                          : "border-gray-200 dark:border-gray-700 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-gray-800 dark:text-gray-100">
                          {tpl.name}
                        </div>
                        {active && (
                          <Check className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tpl.description}
                      </div>
                      <div className="mt-3 inline-block text-[10px] uppercase tracking-wide font-semibold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                        {tpl.category}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Ready to generate
                </div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="font-medium">Role:</span> {jobTitle} at{" "}
                    {companyName}
                  </div>
                  <div>
                    <span className="font-medium">Tone:</span>{" "}
                    <span className="capitalize">{selectedTone}</span>
                  </div>
                  <div>
                    <span className="font-medium">Template:</span>{" "}
                    <span className="capitalize">{selectedTemplate}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="w-full flex justify-between gap-3">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={isGenerating}
                className="gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => handleClose(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            )}

            {step === 1 && (
              <Button
                onClick={() => (selectedResumeId || uploadedPdf) && setStep(2)}
                disabled={!selectedResumeId && !uploadedPdf}
                className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white gap-1"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {step === 2 && (
              <Button
                onClick={goToStep3}
                className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white gap-1"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}

            {step === 3 && (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white gap-2 min-w-[200px]"
              >
                {isGenerating ? (
                  <>
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateCoverLetterModal;
