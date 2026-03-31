import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { LoaderCircle, User } from "lucide-react";
import { toast } from "sonner";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import AIReviewPanel from "../components/AIReviewModal";
import { getResumeData, updateThisResume } from "@/Services/resumeAPI";
import { getProfile } from "@/Services/login";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Button } from "@/components/ui/button";
import ImportConfirmationDialog from "@/components/custom/ImportConfirmationDialog";
import LoadingSpinner from "@/components/custom/LoadingSpinner";

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
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const containerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(50);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIReviewOpen, setIsAIReviewOpen] = useState(false);

  useEffect(() => {
    const fetchAndSetResumeData = async () => {
      try {
        window.scrollTo(0, 0);
        const response = await getResumeData(resume_id);
        dispatch(addResumeData(response.data));
      } catch (error) {
        console.error("Error fetching resume data:", error);
        toast.error("Failed to load resume", {
          description: "Please check the URL or try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    setIsAIReviewOpen(false);
    fetchAndSetResumeData();
  }, [dispatch, resume_id]);

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
      getResumeData(resume_id).then((response) => dispatch(addResumeData(response.data)));
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
    <div
      ref={containerRef}
      className="flex h-screen bg-white"
      style={{ cursor: isResizing ? "ew-resize" : "default" }}
    >
      <div className="form-container min-w-0 overflow-y-auto bg-white" style={{ width: `${sidebarWidth}%` }}>
        <div className="flex items-center justify-center gap-4 border-b border-indigo-100 bg-indigo-50 p-1">
          <User className="h-5 w-5 text-indigo-500" />
          <p className="text-sm text-indigo-700">Quick start by importing data from your master profile.</p>
          <Button
            variant="outline"
            size="sm"
            className="border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-100"
            onClick={() => setIsImportModalOpen(true)}
            disabled={isImporting}
          >
            {isImporting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Import from Profile"}
          </Button>
        </div>

        <ImportConfirmationDialog
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onConfirm={handleImportFromProfile}
          loading={isImporting}
        />

        <ResumeForm onOpenAIReview={handleOpenAIReview} isAIReviewOpen={isAIReviewOpen} />
      </div>

      <div
        className="divider relative flex w-2 cursor-ew-resize items-center justify-center bg-gray-200 transition-colors hover:bg-primary"
        onMouseDown={(event) => {
          event.preventDefault();
          setIsResizing(true);
        }}
      >
        <div className="h-12 w-1 rounded-full bg-gray-400" />
      </div>

      <div
        className="preview-container min-w-0 overflow-hidden border-l border-slate-200 bg-slate-50"
        style={{ width: `${100 - sidebarWidth}%` }}
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
  );
}

export default EditResume;
