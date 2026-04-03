import { useDispatch, useSelector } from "react-redux";
import { Loader2, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { addResumeData } from "@/features/resume/resumeFeatures";
import {
  generationError,
  generationSuccess,
  startGeneration,
} from "@/features/driveGeneration/driveGenerationFeatures";
import { generateResumeDriveLink } from "@/Services/resumeAPI";

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
  const generatingLink =
    driveGeneration.status === "generating" && driveGeneration.resumeId === resumeId;

  const hasUsablePublicLink =
    Boolean(resumeInfo?.googleDriveLink) && !resumeInfo?.driveOutOfSync;

  const syncResumeInfo = (updatedResumeInfo) => {
    dispatch(addResumeData(updatedResumeInfo));
    onResumeInfoChange?.(updatedResumeInfo);
  };

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

  const handleShareLink = () => {
    navigator.clipboard
      .writeText(resumeInfo.googleDriveLink)
      .then(() => {
        toast.success("Resume link copied to clipboard!", {
          description: "Anyone with the link can view your resume on Google Drive.",
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
      <Button
        variant={variant}
        size={size}
        onClick={handleShareLink}
        className={shareClassName}
      >
        <Share2 className="h-4 w-4" />
        Share Resume
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleGenerateLink}
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
  );
}

export default ResumePublicLinkButton;
