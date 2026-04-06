import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, LoaderCircle, User, HomeIcon } from "lucide-react";
import { toast } from "sonner";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import AIReviewPanel from "../components/AIReviewModal";
import ResumePublicLinkButton from "../components/ResumePublicLinkButton";
import { updateThisResume } from "@/Services/resumeAPI";
import { getProfile } from "@/Services/login";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Button } from "@/components/ui/button";
import ImportConfirmationDialog from "@/components/custom/ImportConfirmationDialog";
import LoadingSpinner from "@/components/custom/LoadingSpinner";
import { useResumeQuery } from "@/hooks/useAppQueryData";

const stripResumeMeta = (value = {}) => {
  const cleanedValue = { ...value };
  delete cleanedValue._id;
  delete cleanedValue.password;
  delete cleanedValue.niatId;
  delete cleanedValue.createdAt;
  delete cleanedValue.updatedAt;
  delete cleanedValue.__v;
  return cleanedValue;
};

const stripItemId = (value = {}) => {
  const cleanedValue = { ...value };
  delete cleanedValue._id;
  return cleanedValue;
};

export function EditResume() {
  const { resume_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(50);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isAIReviewOpen, setIsAIReviewOpen] = useState(false);
  const cachedResumeInfo =
    resumeInfo && typeof resumeInfo === "object" && resumeInfo?._id === resume_id
      ? resumeInfo
      : null;
  const resumeQuery = useResumeQuery(resume_id, {
    initialData: cachedResumeInfo || undefined,
  });
  // Show loading until Redux holds the correct resume for this URL.
  // cachedResumeInfo is non-null only when resumeInfo._id === resume_id.
  // Without this, sections like Skills render empty on navigation because the
  // useEffect that dispatches resumeQuery.data to Redux runs after the first render.
  const isLoading = !cachedResumeInfo && !resumeQuery.isError;

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAIReviewOpen(false);
  }, [cachedResumeInfo?._id, resume_id]);

  useEffect(() => {
    if (!resumeQuery.data) {
      return;
    }

    dispatch(addResumeData(resumeQuery.data));
  }, [dispatch, resumeQuery.data]);

  useEffect(() => {
    if (!resumeQuery.isError) {
      return;
    }

    toast.error("Failed to load resume", {
      description:
        resumeQuery.error?.message || "Please check the URL or try again later.",
    });
  }, [resumeQuery.error?.message, resumeQuery.isError]);

  useEffect(() => {
    if (!isResizing) {
      return undefined;
    }

    const handleMouseMove = (event) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      let newWidth = ((event.clientX - containerRect.left) / containerRect.width) * 100;

      if (newWidth < 30) newWidth = 30;
      if (newWidth > 70) newWidth = 70;

      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleImportFromProfile = async () => {
    setIsImportModalOpen(false);
    setIsImporting(true);
    toast.loading("Importing profile data...");

    try {
      const profileResponse = await getProfile();
      const profileData = profileResponse.data;
      const importableData = stripResumeMeta(profileData);

      if (Array.isArray(importableData.experience)) {
        importableData.experience = importableData.experience.map((experience) => {
          const cleanedExperience = stripItemId(experience);
          return {
            ...cleanedExperience,
            currentlyWorking:
              cleanedExperience.currentlyWorking === true ||
              cleanedExperience.currentlyWorking === "true",
          };
        });
      }

      if (Array.isArray(importableData.skills)) {
        importableData.skills = importableData.skills.map(stripItemId);
      }

      if (Array.isArray(importableData.projects)) {
        importableData.projects = importableData.projects.map(stripItemId);
      }

      if (Array.isArray(importableData.education)) {
        importableData.education = importableData.education.map(stripItemId);
      }

      if (Array.isArray(importableData.certifications)) {
        importableData.certifications = importableData.certifications
          .filter((certification) => certification.name && certification.issuer)
          .map(stripItemId);
      }

      if (Array.isArray(importableData.additionalSections)) {
        importableData.additionalSections = importableData.additionalSections
          .filter((section) => section.title)
          .map(stripItemId);
      }

      dispatch(addResumeData({ ...resumeInfo, ...importableData }));

      const updateResponse = await updateThisResume(resume_id, { data: importableData });
      dispatch(addResumeData(updateResponse.data));

      toast.success("Profile imported successfully!", {
        description: "Your resume has been populated with your profile data and saved.",
      });
    } catch (error) {
      toast.error("Failed to import profile", { description: error.message });
      const refreshedResume = await resumeQuery.refetch();
      if (refreshedResume.data) {
        dispatch(addResumeData(refreshedResume.data));
      }
    } finally {
      setIsImporting(false);
      toast.dismiss();
    }
  };

  const handleOpenAIReview = () => {
    setSidebarWidth(50);
    setIsAIReviewOpen(true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50" style={{ cursor: isResizing ? "ew-resize" : "default" }}>

      {/* ── Top Header Bar ── */}
      <header className="flex-shrink-0 flex items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm z-10">
        <div className="flex items-center gap-2.5">
          <Link to="/dashboard">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              <HomeIcon className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Dashboard</span>
            </Button>
          </Link>

          <div className="h-5 w-px bg-gray-200" />

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
            onClick={() => setIsImportModalOpen(true)}
            disabled={isImporting}
          >
            {isImporting ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">Import from Profile</span>
              </>
            )}
          </Button>
        </div>

        {/* Resume title — center */}
        {resumeInfo?.title && (
          <p className="hidden md:block text-sm font-semibold text-gray-700 truncate max-w-xs select-none">
            {resumeInfo.title}
          </p>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-orange-300 text-orange-700 hover:bg-orange-50"
            onClick={() => navigate(`/dashboard/view-resume/${resume_id}`)}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>

          <ResumePublicLinkButton
            resumeId={resume_id}
            resumeInfo={resumeInfo}
            shareClassName="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            generateClassName={`gap-1.5 ${
              resumeInfo?.driveOutOfSync
                ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          />
        </div>
      </header>

      {/* ── Main Split Area ── */}
      <div ref={containerRef} className="flex flex-1 min-h-0">

        {/* Form Panel */}
        <div
          className="min-w-0 overflow-hidden flex flex-col"
          style={{ width: `${sidebarWidth}%` }}
        >
          <ResumeForm onOpenAIReview={handleOpenAIReview} isAIReviewOpen={isAIReviewOpen} />
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

        {/* Preview / AI Review Panel */}
        <div
          className="min-w-0 overflow-hidden flex-1 border-l border-slate-200 bg-slate-50"
        >
          {isAIReviewOpen ? (
            <AIReviewPanel resumeInfo={resumeInfo} onClose={() => setIsAIReviewOpen(false)} />
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="md:w-full lg:w-full xl:w-full">
                <PreviewPage />
              </div>
            </div>
          )}
        </div>
      </div>

      <ImportConfirmationDialog
        open={isImportModalOpen}
        onOpenChange={setIsImportModalOpen}
        onConfirm={handleImportFromProfile}
        loading={isImporting}
      />
    </div>
  );
}

export default EditResume;
