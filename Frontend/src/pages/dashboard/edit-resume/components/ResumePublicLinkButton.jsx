import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Copy, ExternalLink, Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { addResumeData } from "@/features/resume/resumeFeatures";
import {
  generationError,
  generationSuccess,
  startGeneration,
} from "@/features/driveGeneration/driveGenerationFeatures";
import { generateResumeDriveLink } from "@/Services/resumeAPI";
import { VITE_APP_URL, VITE_PUBLIC_URL } from "@/config/config";

function ResumePublicLinkButton({
  resumeId,
  resumeInfo,
  onResumeInfoChange,
  variant = "outline",
  size = "sm",
  shareClassName = "",
  generateClassName = "",
}) {
  const dispatch = useDispatch();
  const driveGeneration = useSelector((state) => state.driveGeneration);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [shareOptionsOpen, setShareOptionsOpen] = useState(false);
  const generatingLink =
    driveGeneration.status === "generating" && driveGeneration.resumeId === resumeId;

  const hasUsablePublicLink =
    Boolean(resumeInfo?.googleDriveLink) && !resumeInfo?.driveOutOfSync;

  const syncResumeInfo = (updatedResumeInfo) => {
    dispatch(addResumeData(updatedResumeInfo));
    onResumeInfoChange?.(updatedResumeInfo);
  };

  const appBaseUrl =
    VITE_PUBLIC_URL ||
    VITE_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  const publicResumeLink = appBaseUrl
    ? `${appBaseUrl.replace(/\/$/, "")}/public/resume/${resumeId}`
    : `/public/resume/${resumeId}`;

  const handleGenerateLink = () => {
    dispatch(
      startGeneration({
        resumeId,
        resumeTitle: resumeInfo?.title || "Resume",
      })
    );

    generateResumeDriveLink(resumeId)
      .then((response) => {
        const link = response?.data?.googleDriveLink;
        const updatedResumeInfo = {
          ...resumeInfo,
          googleDriveLink: link,
          driveOutOfSync: false,
        };

        syncResumeInfo(updatedResumeInfo);
        dispatch(generationSuccess({ googleDriveLink: link }));
      })
      .catch((error) => {
        dispatch(generationError({ error: error.message }));
      });
  };

  const handleCopyLink = (linkType) => {
    const linkToCopy =
      linkType === "public" ? publicResumeLink : resumeInfo?.googleDriveLink;
    const toastDescription =
      linkType === "public"
        ? "Anyone with the app link can open your public resume."
        : "Anyone with the link can view your resume on Google Drive.";

    if (!linkToCopy) {
      toast.error("Link is not ready yet", {
        description: "Generate the resume link first and try again.",
      });
      return;
    }

    navigator.clipboard
      .writeText(linkToCopy)
      .then(() => {
        setShareOptionsOpen(false);
        toast.success(`${linkType === "public" ? "Public" : "Drive"} link copied!`, {
          description: toastDescription,
        });
      })
      .catch(() => {
        toast.error("Failed to copy link", {
          description: "Please try again manually.",
        });
      });
  };

  if (hasUsablePublicLink) {
    return (
      <Popover open={shareOptionsOpen} onOpenChange={setShareOptionsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={shareClassName}
          >
            <Share2 className="h-4 w-4" />
            Share Resume
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-64 rounded-xl border-slate-200 p-2">
          <div className="px-2 pb-2 pt-1">
            <p className="text-sm font-semibold text-slate-900">Select link to copy</p>
            <p className="mt-1 text-xs text-slate-500">Choose the share destination you want to send.</p>
          </div>

          <button
            type="button"
            onClick={() => handleCopyLink("drive")}
            className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
          >
            <Copy className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-slate-900">Drive Link</span>
              <span className="block truncate text-xs text-slate-500">{resumeInfo?.googleDriveLink}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleCopyLink("public")}
            className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition hover:bg-slate-50"
          >
            <ExternalLink className="mt-0.5 h-4 w-4 flex-shrink-0 text-indigo-600" />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-slate-900">Public Link</span>
              <span className="block truncate text-xs text-slate-500">{publicResumeLink}</span>
            </span>
          </button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setConfirmOpen(true)}
        disabled={generatingLink}
        className={generateClassName}
      >
        {generatingLink ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Share2 className="h-4 w-4" />
        )}
        {generatingLink
          ? "Updating..."
          : resumeInfo?.driveOutOfSync
            ? "Update Public Link"
            : "Generate Public Link"}
      </Button>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {resumeInfo?.driveOutOfSync ? "Update public link?" : "Generate public link?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Make sure you have saved all latest resume changes before continuing. Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={generatingLink}>No</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleGenerateLink}
              disabled={generatingLink}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ResumePublicLinkButton;
