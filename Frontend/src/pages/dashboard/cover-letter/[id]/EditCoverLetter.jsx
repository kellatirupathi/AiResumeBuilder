import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  HomeIcon,
  RefreshCw,
  Download,
  Share2,
  Link2,
  Copy,
  Check,
  ChevronDown,
  Plus,
  X,
  Loader2,
  Save,
  ChevronUp,
  Palette,
  FileText,
  User as UserIcon,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LoadingSpinner from "@/components/custom/LoadingSpinner";

import {
  getCoverLetter,
  updateCoverLetter,
  downloadCoverLetterPDF,
  generateCoverLetterDriveLink,
} from "@/Services/coverLetterAPI";
import { generateCoverLetterContent } from "@/Services/coverLetterAi";
import { getResumeData } from "@/Services/resumeAPI";
import { resolveApiData } from "@/lib/queryCacheUtils";

import PreviewCoverLetter from "../components/PreviewCoverLetter";
import PaginatedA4Preview from "../../edit-resume/components/PaginatedA4Preview";
import {
  coverLetterTemplates,
  coverLetterThemeColors,
} from "../components/coverLetterDesignOptions";

const TONE_OPTIONS = [
  { id: "formal", name: "Formal" },
  { id: "friendly", name: "Friendly" },
  { id: "enthusiastic", name: "Enthusiastic" },
];

const FieldLabel = ({ children, htmlFor }) => (
  <label
    htmlFor={htmlFor}
    className="text-xs font-medium text-gray-700 mb-1 block"
  >
    {children}
  </label>
);

const SectionCard = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-indigo-600" />}
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {open && <div className="px-4 py-4 border-t border-gray-100">{children}</div>}
    </div>
  );
};

export function EditCoverLetter() {
  const { id } = useParams();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(45);

  const [coverLetter, setCoverLetter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isGeneratingDriveLink, setIsGeneratingDriveLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Skip the first autosave triggered by setState after fetch
  const skipNextSaveRef = useRef(true);

  // Load cover letter
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const res = await getCoverLetter(id);
        const data = resolveApiData(res);
        if (!cancelled) {
          skipNextSaveRef.current = true;
          setCoverLetter(data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err?.message || "Failed to load cover letter");
          toast.error("Failed to load cover letter", {
            description: err?.message,
          });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Debounced autosave (1000ms)
  useEffect(() => {
    if (!coverLetter) return undefined;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return undefined;
    }
    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        // Strip server-managed metadata before sending
        const { _id, userId, createdAt, updatedAt, __v, ...payload } =
          coverLetter;
        await updateCoverLetter(id, payload);
      } catch (err) {
        toast.error("Autosave failed", { description: err?.message });
      } finally {
        setIsSaving(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverLetter]);

  // Resize handle wiring
  useEffect(() => {
    if (!isResizing) return undefined;

    const handleMouseMove = (event) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      let newWidth = ((event.clientX - rect.left) / rect.width) * 100;
      if (newWidth < 30) newWidth = 30;
      if (newWidth > 70) newWidth = 70;
      setSidebarWidth(newWidth);
    };
    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // ── Helpers to mutate state ──
  // If a Drive link exists, flag driveOutOfSync immediately so the Drive
  // button flips to "Update Drive Link" the moment the user edits anything.
  const withSyncFlag = (prev, updates) => {
    if (!prev) return prev;
    const next = { ...prev, ...updates };
    if (prev.googleDriveLink) next.driveOutOfSync = true;
    return next;
  };

  const updateField = useCallback((field, value) => {
    setCoverLetter((prev) => withSyncFlag(prev, { [field]: value }));
  }, []);

  const updateGenerated = useCallback((field, value) => {
    setCoverLetter((prev) =>
      withSyncFlag(prev, {
        generatedContent: {
          ...(prev?.generatedContent || {}),
          [field]: value,
        },
      })
    );
  }, []);

  const updateBodyParagraph = useCallback((index, value) => {
    setCoverLetter((prev) => {
      if (!prev) return prev;
      const current = Array.isArray(prev.generatedContent?.bodyParagraphs)
        ? [...prev.generatedContent.bodyParagraphs]
        : [];
      current[index] = value;
      return withSyncFlag(prev, {
        generatedContent: {
          ...(prev.generatedContent || {}),
          bodyParagraphs: current,
        },
      });
    });
  }, []);

  const addBodyParagraph = useCallback(() => {
    setCoverLetter((prev) => {
      if (!prev) return prev;
      const current = Array.isArray(prev.generatedContent?.bodyParagraphs)
        ? [...prev.generatedContent.bodyParagraphs]
        : [];
      current.push("");
      return withSyncFlag(prev, {
        generatedContent: {
          ...(prev.generatedContent || {}),
          bodyParagraphs: current,
        },
      });
    });
  }, []);

  const removeBodyParagraph = useCallback((index) => {
    setCoverLetter((prev) => {
      if (!prev) return prev;
      const current = Array.isArray(prev.generatedContent?.bodyParagraphs)
        ? [...prev.generatedContent.bodyParagraphs]
        : [];
      current.splice(index, 1);
      return withSyncFlag(prev, {
        generatedContent: {
          ...(prev.generatedContent || {}),
          bodyParagraphs: current,
        },
      });
    });
  }, []);

  // ── Action handlers ──
  const handleRegenerate = async () => {
    if (!coverLetter) return;
    setIsRegenerating(true);
    try {
      let resumeData = null;
      if (coverLetter.sourceResumeId) {
        try {
          const res = await getResumeData(coverLetter.sourceResumeId);
          resumeData = resolveApiData(res);
        } catch (err) {
          // Non-fatal: continue without resume context
          console.warn("Could not fetch source resume:", err?.message);
        }
      }
      const newContent = await generateCoverLetterContent({
        resumeData,
        uploadedResumeText: coverLetter.uploadedResumeText,
        jobDescription: coverLetter.jobDescription,
        jobTitle: coverLetter.jobTitle,
        companyName: coverLetter.companyName,
        hiringManagerName: coverLetter.hiringManagerName,
        tone: coverLetter.tone,
        previousContent: coverLetter.generatedContent,
      });
      setCoverLetter((prev) =>
        withSyncFlag(prev, { generatedContent: newContent })
      );
      toast.success("Cover letter regenerated!");
    } catch (e) {
      toast.error("Failed to regenerate cover letter", {
        description: e?.message,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadCoverLetterPDF(id);
      toast.success("Cover letter downloaded");
    } catch (err) {
      toast.error("Failed to download PDF", { description: err?.message });
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedKey(null), 1500);
    } catch (err) {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleShareDrive = async () => {
    // Has a Drive link AND not out of sync → just share it
    if (coverLetter?.googleDriveLink && !coverLetter?.driveOutOfSync) {
      copyToClipboard(coverLetter.googleDriveLink, "drive");
      window.open(coverLetter.googleDriveLink, "_blank", "noopener,noreferrer");
      return;
    }
    // Either no Drive link yet, OR out of sync → (re)generate
    setIsGeneratingDriveLink(true);
    try {
      const res = await generateCoverLetterDriveLink(id);
      const data = resolveApiData(res);
      const link =
        data?.googleDriveLink || data?.driveLink || data?.link || coverLetter?.googleDriveLink || null;
      if (link) {
        skipNextSaveRef.current = true;
        setCoverLetter((prev) =>
          prev ? { ...prev, googleDriveLink: link, driveOutOfSync: false } : prev
        );
        copyToClipboard(link, "drive");
        toast.success(
          coverLetter?.googleDriveLink ? "Drive link updated" : "Drive link generated"
        );
      } else {
        toast.error("Drive link missing in response");
      }
    } catch (err) {
      const msg = err?.message || "";
      const isDriveConfigError =
        /file not found|404|drive|permission/i.test(msg) ||
        /failed to upload\/update pdf/i.test(msg);

      toast.error(
        isDriveConfigError
          ? "Google Drive sharing isn't available right now"
          : "Failed to generate drive link",
        {
          description: isDriveConfigError
            ? "Use Download PDF instead — your file will save directly to your computer. Drive sharing requires admin setup."
            : msg,
          duration: 6000,
        }
      );
    } finally {
      setIsGeneratingDriveLink(false);
    }
  };

  const handleCopyPublicLink = () => {
    if (!coverLetter?.publicSlug) {
      toast.error("Public link not available yet", {
        description: "Try regenerating or refreshing the page.",
      });
      return;
    }
    const url = `${window.location.origin}/public/cover-letter/${coverLetter.publicSlug}`;
    copyToClipboard(url, "public");
  };

  // ── Render ──
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (loadError || !coverLetter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-slate-50">
        <p className="text-gray-700 font-medium">
          {loadError || "Cover letter not found"}
        </p>
        <Button onClick={() => navigate("/dashboard?tab=cover-letters")} variant="outline">
          Back to Cover Letters
        </Button>
      </div>
    );
  }

  const generated = coverLetter.generatedContent || {};
  const bodyParagraphs = Array.isArray(generated.bodyParagraphs)
    ? generated.bodyParagraphs
    : [];

  return (
    <div
      className="flex flex-col h-screen bg-slate-50"
      style={{ cursor: isResizing ? "ew-resize" : "default" }}
    >
      {/* ── Sticky Header ── */}
      <header className="flex-shrink-0 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link to="/dashboard?tab=cover-letters">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">
                Dashboard
              </span>
            </Button>
          </Link>

          <div className="h-5 w-px bg-gray-200" />

          <div className="min-w-0 flex items-center gap-2">
            <input
              type="text"
              value={coverLetter.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Untitled cover letter"
              className="text-sm font-semibold text-gray-800 bg-transparent border-0 focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded px-2 py-1 max-w-[260px] truncate"
            />
            {isSaving ? (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-600">
                <Save className="h-3 w-3" />
                Saved
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Regenerate */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="hidden sm:inline text-xs font-medium">
              Regenerate
            </span>
          </Button>

          {/* Switch Template */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">
                  Template:{" "}
                  {coverLetterTemplates.find(
                    (t) => t.id === (coverLetter.template || "classic")
                  )?.name || "Classic"}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="end">
              {coverLetterTemplates.map((tmpl) => {
                const active =
                  (coverLetter.template || "classic") === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => updateField("template", tmpl.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tmpl.name}</span>
                      {active && <Check className="h-4 w-4 text-indigo-600" />}
                    </div>
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* Switch Tone */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <span className="hidden sm:inline text-xs font-medium">
                  Tone:{" "}
                  {TONE_OPTIONS.find(
                    (t) => t.id === (coverLetter.tone || "formal")
                  )?.name || "Formal"}
                </span>
                <ChevronDown className="h-3 w-3 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-1" align="end">
              {TONE_OPTIONS.map((opt) => {
                const active = (coverLetter.tone || "formal") === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => updateField("tone", opt.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                      active
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span>{opt.name}</span>
                    {active && <Check className="h-4 w-4 text-indigo-600" />}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* Download PDF */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="gap-1.5 border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline text-xs font-medium">PDF</span>
          </Button>

          {/* Share Drive Link — 3 states: not generated / up-to-date / out-of-sync */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareDrive}
            disabled={isGeneratingDriveLink}
            className={`gap-1.5 ${
              coverLetter.googleDriveLink && !coverLetter.driveOutOfSync
                ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                : "border-amber-300 text-amber-700 hover:bg-amber-50"
            }`}
            title={
              coverLetter.driveOutOfSync
                ? "Your cover letter has unsaved changes. Click to update the Drive PDF."
                : coverLetter.googleDriveLink
                ? "Click to copy and open the Drive link"
                : "Click to upload the PDF to Drive and generate a shareable link"
            }
          >
            {isGeneratingDriveLink ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : copiedKey === "drive" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Share2 className="h-4 w-4" />
            )}
            <span className="hidden md:inline text-xs font-medium">
              {isGeneratingDriveLink
                ? (coverLetter.googleDriveLink ? "Updating..." : "Generating...")
                : coverLetter.driveOutOfSync
                ? "Update Drive Link"
                : coverLetter.googleDriveLink
                ? "Share Drive"
                : "Generate Drive Link"}
            </span>
          </Button>

          {/* Public Link */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyPublicLink}
            disabled={!coverLetter.publicSlug}
            className="gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            {copiedKey === "public" ? (
              <Check className="h-4 w-4" />
            ) : (
              <Link2 className="h-4 w-4" />
            )}
            <span className="hidden md:inline text-xs font-medium">
              Public Link
            </span>
          </Button>
        </div>
      </header>

      {/* ── Main Split Area ── */}
      <div ref={containerRef} className="flex flex-1 min-h-0">
        {/* Form Panel */}
        <div
          className="min-w-0 overflow-hidden flex flex-col"
          style={{ width: `${sidebarWidth}%` }}
        >
          <div className="h-full overflow-y-auto px-4 py-4 space-y-4">
            {/* Sender info */}
            <SectionCard title="Sender Information" icon={UserIcon} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="senderName">Full Name</FieldLabel>
                  <Input
                    id="senderName"
                    value={coverLetter.senderName || ""}
                    onChange={(e) => updateField("senderName", e.target.value)}
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="senderEmail">Email</FieldLabel>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={coverLetter.senderEmail || ""}
                    onChange={(e) => updateField("senderEmail", e.target.value)}
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="senderPhone">Phone</FieldLabel>
                  <Input
                    id="senderPhone"
                    value={coverLetter.senderPhone || ""}
                    onChange={(e) => updateField("senderPhone", e.target.value)}
                    placeholder="+1 555 555 5555"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="senderAddress">Address</FieldLabel>
                  <Input
                    id="senderAddress"
                    value={coverLetter.senderAddress || ""}
                    onChange={(e) =>
                      updateField("senderAddress", e.target.value)
                    }
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="senderLinkedin">LinkedIn</FieldLabel>
                  <Input
                    id="senderLinkedin"
                    value={coverLetter.senderLinkedin || ""}
                    onChange={(e) =>
                      updateField("senderLinkedin", e.target.value)
                    }
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="senderPortfolio">Portfolio</FieldLabel>
                  <Input
                    id="senderPortfolio"
                    value={coverLetter.senderPortfolio || ""}
                    onChange={(e) =>
                      updateField("senderPortfolio", e.target.value)
                    }
                    placeholder="yourportfolio.com"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Job Info */}
            <SectionCard title="Job Information" icon={Briefcase} defaultOpen>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                  <Input
                    id="jobTitle"
                    value={coverLetter.jobTitle || ""}
                    onChange={(e) => updateField("jobTitle", e.target.value)}
                    placeholder="Senior Frontend Engineer"
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="companyName">Company</FieldLabel>
                  <Input
                    id="companyName"
                    value={coverLetter.companyName || ""}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="hiringManagerName">
                    Hiring Manager (optional)
                  </FieldLabel>
                  <Input
                    id="hiringManagerName"
                    value={coverLetter.hiringManagerName || ""}
                    onChange={(e) =>
                      updateField("hiringManagerName", e.target.value)
                    }
                    placeholder="Mr./Ms./Dr. Last Name"
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="jobDescription">
                    Job Description
                  </FieldLabel>
                  <Textarea
                    id="jobDescription"
                    rows={6}
                    value={coverLetter.jobDescription || ""}
                    onChange={(e) =>
                      updateField("jobDescription", e.target.value)
                    }
                    placeholder="Paste the full job description here..."
                  />
                </div>
              </div>
            </SectionCard>

            {/* Letter content */}
            <SectionCard title="Letter Content" icon={FileText} defaultOpen>
              <div className="space-y-4">
                <div>
                  <FieldLabel htmlFor="greeting">Greeting</FieldLabel>
                  <Input
                    id="greeting"
                    value={generated.greeting || ""}
                    onChange={(e) => updateGenerated("greeting", e.target.value)}
                    placeholder="Dear Hiring Manager,"
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="openingParagraph">
                    Opening Paragraph
                  </FieldLabel>
                  <Textarea
                    id="openingParagraph"
                    rows={3}
                    value={generated.openingParagraph || ""}
                    onChange={(e) =>
                      updateGenerated("openingParagraph", e.target.value)
                    }
                    placeholder="Open with a hook that mentions the role and your top qualification..."
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">
                      Body Paragraphs
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addBodyParagraph}
                      className="h-7 px-2 gap-1 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      <Plus className="h-3 w-3" />
                      Add Paragraph
                    </Button>
                  </div>
                  {bodyParagraphs.length === 0 && (
                    <p className="text-xs text-gray-400 italic mt-1">
                      No body paragraphs yet. Click "Add Paragraph" or
                      "Regenerate".
                    </p>
                  )}
                  <div className="space-y-3 mt-2">
                    {bodyParagraphs.map((para, idx) => (
                      <div key={idx} className="relative">
                        <Textarea
                          rows={4}
                          value={para || ""}
                          onChange={(e) =>
                            updateBodyParagraph(idx, e.target.value)
                          }
                          placeholder={`Body paragraph ${idx + 1}`}
                          className="pr-8"
                        />
                        <button
                          type="button"
                          onClick={() => removeBodyParagraph(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          aria-label="Remove paragraph"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="closingParagraph">
                    Closing Paragraph
                  </FieldLabel>
                  <Textarea
                    id="closingParagraph"
                    rows={3}
                    value={generated.closingParagraph || ""}
                    onChange={(e) =>
                      updateGenerated("closingParagraph", e.target.value)
                    }
                    placeholder="Wrap up with thanks and a call to action..."
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="signature">Signature</FieldLabel>
                  <Input
                    id="signature"
                    value={generated.signature || ""}
                    onChange={(e) =>
                      updateGenerated("signature", e.target.value)
                    }
                    placeholder="Sincerely,"
                  />
                </div>
              </div>
            </SectionCard>

            {/* Theme color */}
            <SectionCard title="Theme Color" icon={Palette} defaultOpen={false}>
              <div className="flex flex-wrap gap-2">
                {coverLetterThemeColors.map((color) => {
                  const active = coverLetter.themeColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateField("themeColor", color)}
                      className={`relative h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                        active
                          ? "border-gray-900 ring-2 ring-offset-2 ring-indigo-300"
                          : "border-white shadow"
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Set theme color ${color}`}
                    >
                      {active && (
                        <Check
                          className="h-4 w-4 text-white absolute inset-0 m-auto drop-shadow"
                          strokeWidth={3}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <div className="h-4" />
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className="relative flex w-2 flex-shrink-0 cursor-ew-resize items-center justify-center bg-gray-200 hover:bg-indigo-400 transition-colors duration-150"
          onMouseDown={(event) => {
            event.preventDefault();
            setIsResizing(true);
          }}
        >
          <div className="h-10 w-1 rounded-full bg-gray-400" />
        </div>

        {/* Preview Panel */}
        <div className="min-w-0 overflow-hidden flex-1 border-l border-slate-200 bg-slate-50">
          <div className="h-full overflow-y-auto">
            <PaginatedA4Preview>
              <PreviewCoverLetter coverLetterInfo={coverLetter} />
            </PaginatedA4Preview>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCoverLetter;
