import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { downloadResumePDF } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import PaginatedA4Preview from "../../edit-resume/components/PaginatedA4Preview";
import ResumePublicLinkButton from "../../edit-resume/components/ResumePublicLinkButton";
import ResumeDesignPanel from "../../edit-resume/components/ResumeDesignPanel";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowLeft,
  CheckCircle,
  Edit,
  X,
  Maximize2,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeQuery } from "@/hooks/useAppQueryData";

function ViewResume() {
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingState, setDownloadingState] = useState(false);

  const { resume_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxResumeInfo = useSelector((state) => state.editResume.resumeData);
  const cachedResumeInfo =
    reduxResumeInfo &&
    typeof reduxResumeInfo === "object" &&
    reduxResumeInfo?._id === resume_id
      ? reduxResumeInfo
      : null;
  const [resumeInfo, setResumeInfo] = useState(cachedResumeInfo || {});
  const resumeQuery = useResumeQuery(resume_id, {
    initialData: cachedResumeInfo || undefined,
  });
  const isLoading =
    resumeQuery.isPending && !cachedResumeInfo && !resumeQuery.data;
  const activeResumeInfo =
    resumeInfo?._id === resume_id
      ? resumeInfo
      : cachedResumeInfo || resumeQuery.data || {};

  useEffect(() => {
    setResumeInfo(cachedResumeInfo || {});
  }, [cachedResumeInfo, resume_id]);

  useEffect(() => {
    if (!resumeQuery.data) {
      return;
    }

    const nextResumeInfo = {
      ...resumeQuery.data,
      template: resumeQuery.data.template || "modern",
    };

    dispatch(addResumeData(nextResumeInfo));
    setResumeInfo((current) =>
      current?._id === resume_id ? { ...current, ...nextResumeInfo } : nextResumeInfo
    );
  }, [dispatch, resumeQuery.data, resume_id]);

  useEffect(() => {
    if (!resumeQuery.isError) {
      return;
    }

    toast.error("Error loading resume", {
      description: resumeQuery.error?.message || "Please try again later",
    });
  }, [resumeQuery.error?.message, resumeQuery.isError]);

  const handleDownloadPDF = async () => {
    try {
      setDownloadingState(true);
      setDownloadProgress(20);

      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }

          return prev + 10;
        });
      }, 300);

      await downloadResumePDF(resume_id);

      clearInterval(progressInterval);
      setDownloadProgress(100);

      toast("Resume Downloaded", {
        description: "Your resume has been saved as a PDF file",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      });
    } catch (error) {
      toast("Download failed", {
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setDownloadingState(false);
        setDownloadProgress(0);
      }, 1000);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!fullscreenPreview && (
          <motion.div
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-screen overflow-hidden flex-col bg-gray-50"
          >
            <div className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
              <div className="mx-auto flex h-14 w-full max-w-[1800px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="gap-1.5 text-gray-600 hover:text-gray-900"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <span className="text-gray-300">/</span>
                  <span className="flex min-w-0 items-center gap-1.5 truncate text-sm text-gray-500">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {activeResumeInfo?.title || "Resume Preview"}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                    className="gap-1.5 text-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>

                  <ResumePublicLinkButton
                    resumeId={resume_id}
                    resumeInfo={activeResumeInfo}
                    onResumeInfoChange={setResumeInfo}
                    shareClassName="gap-1.5 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    generateClassName={`gap-1.5 ${
                      activeResumeInfo?.driveOutOfSync
                        ? "border-amber-300 text-amber-700 hover:bg-amber-50"
                        : "text-gray-700"
                    }`}
                  />

                  <Button
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={downloadingState}
                    className="gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {downloadingState ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    {downloadingState ? `${downloadProgress}%` : "Download PDF"}
                  </Button>
                </div>
              </div>
            </div>

            <div className="mx-auto flex-1 w-full max-w-[1800px] overflow-hidden">
              <div className="grid h-full items-stretch gap-0 lg:grid-cols-[minmax(0,40%),minmax(0,60%)]">
                <motion.aside
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full overflow-hidden"
                >
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center border-r border-gray-200 bg-white p-6">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                        Loading design controls...
                      </div>
                    </div>
                  ) : (
                    <ResumeDesignPanel
                      resumeId={resume_id}
                      resumeInfo={activeResumeInfo}
                      onResumeInfoChange={setResumeInfo}
                      defaultTab="template"
                    />
                  )}
                </motion.aside>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                  className="h-full min-w-0 overflow-y-auto bg-gray-50 p-2 sm:p-3"
                >
                  {isLoading ? (
                    <div className="flex min-h-full items-center justify-center rounded-2xl bg-white">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-12 w-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                        <p className="text-sm text-gray-500">Loading resume preview...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group min-h-full overflow-hidden rounded-2xl bg-white">
                      <div className="absolute right-3 top-3 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          <CheckCircle className="h-3 w-3" />
                          Ready to Apply
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <Button
                          size="sm"
                          onClick={() => setFullscreenPreview(true)}
                          className="h-9 w-9 rounded-full border border-gray-200 bg-white p-0 text-gray-600 shadow-md hover:bg-gray-50"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div
                        id="resume-container"
                        className="mx-auto"
                        style={{
                          maxWidth: "100%",
                          minHeight: "500px",
                        }}
                      >
                        <PaginatedA4Preview>
                          <ResumePreview />
                        </PaginatedA4Preview>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fullscreenPreview && (
          <motion.div
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-gray-900/95"
          >
            <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 bg-gray-900 px-6 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Full Preview
              </span>

              <div className="flex items-center gap-2">
                <ResumePublicLinkButton
                  resumeId={resume_id}
                  resumeInfo={activeResumeInfo}
                  onResumeInfoChange={setResumeInfo}
                  shareClassName="gap-1.5 border-emerald-400/50 bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
                  generateClassName={`gap-1.5 ${
                    activeResumeInfo?.driveOutOfSync
                      ? "border-amber-400/50 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/20"
                  }`}
                />

                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  disabled={downloadingState}
                  className="gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {downloadingState ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloadingState ? `${downloadProgress}%` : "Download PDF"}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreenPreview(false)}
                  className="gap-1.5 text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                  Close
                </Button>
              </div>
            </div>

            <div className="flex flex-1 items-start justify-center overflow-auto p-8">
              <div
                id="fullscreen-resume"
                className="print-area mx-auto"
                style={{ maxWidth: "100%", boxSizing: "border-box" }}
              >
                <PaginatedA4Preview>
                  <ResumePreview />
                </PaginatedA4Preview>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ViewResume;
