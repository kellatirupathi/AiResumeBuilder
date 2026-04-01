import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumeData, downloadResumePDF } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  ArrowLeft,
  CheckCircle,
  Edit,
  Home,
  Share2,
  ChevronRight,
  X,
  Maximize2,
  FileText,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [fullscreenPreview, setFullscreenPreview] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadingState, setDownloadingState] = useState(false);

  const resumeRef = useRef(null);
  const { resume_id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchResumeInfo();
  }, []);

  const fetchResumeInfo = async () => {
    setIsLoading(true);
    try {
      const response = await getResumeData(resume_id);
      const resumeData = {
        ...response.data,
        template: response.data.template || "modern",
      };
      dispatch(addResumeData(resumeData));
      setResumeInfo(resumeData);
    } catch (error) {
      toast("Error loading resume", {
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLink = () => {
    if (resumeInfo && resumeInfo.googleDriveLink) {
      navigator.clipboard
        .writeText(resumeInfo.googleDriveLink)
        .then(() => {
          toast.success("Resume link copied to clipboard!", {
            description: "Anyone with the link can view your resume on Google Drive.",
          });
        })
        .catch(() => {
          toast.error("Failed to copy link", { description: "Please try again manually." });
        });
    } else {
      toast.info("Link not ready yet", {
        description:
          "The shareable link for this resume is still being generated. Please wait a moment and try again.",
      });
    }
  };

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
      {/* ── Main view ── */}
      <AnimatePresence>
        {!fullscreenPreview && (
          <motion.div
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gray-50 flex flex-col"
          >
            {/* Top Bar */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
                {/* Left: nav */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/dashboard")}
                    className="text-gray-600 hover:text-gray-900 gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Dashboard
                  </Button>
                  <span className="text-gray-300">/</span>
                  <span className="text-sm text-gray-500 flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    {resumeInfo?.title || "Resume Preview"}
                  </span>
                </div>

                {/* Right: actions */}
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareLink}
                    className="gap-1.5 text-gray-700"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDownloadPDF}
                    disabled={downloadingState}
                    className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
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

            {/* Body */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Resume preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex-1 min-w-0"
                >
                  {isLoading ? (
                    <div className="bg-white rounded-2xl shadow border border-gray-200 flex items-center justify-center min-h-[600px]">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 text-sm">Loading resume...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                      {/* Ready badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-1 rounded-full">
                          <CheckCircle className="h-3 w-3" /> Ready to Apply
                        </span>
                      </div>

                      {/* Fullscreen button on hover */}
                      <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          size="sm"
                          onClick={() => setFullscreenPreview(true)}
                          className="rounded-full h-9 w-9 p-0 bg-white shadow-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div
                        ref={resumeRef}
                        id="resume-container"
                        className="mx-auto bg-white overflow-hidden"
                        style={{
                          width: "290mm",
                          maxWidth: "100%",
                          minHeight: "500px",
                        }}
                      >
                        <ResumePreview />
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Sidebar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="lg:w-72 w-full flex-shrink-0 space-y-4"
                >
                  {/* Download card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4">Resume Actions</h3>

                    {downloadingState ? (
                      <div className="space-y-2">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${downloadProgress}%` }}
                            className="h-full bg-indigo-500 rounded-full"
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Processing PDF...
                          </span>
                          <span className="font-medium text-indigo-600">{downloadProgress}%</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          onClick={handleDownloadPDF}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                        >
                          <Download className="h-4 w-4" /> Download PDF
                        </Button>
                        <Button
                          onClick={handleShareLink}
                          variant="outline"
                          className="w-full gap-2 text-gray-700"
                        >
                          <Share2 className="h-4 w-4" /> Share Resume
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Navigation card */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Navigation</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                            <Edit className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Return to Editor</p>
                            <p className="text-xs text-gray-400">Edit your resume content</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      </button>

                      <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all group text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                            <Home className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">Back to Dashboard</p>
                            <p className="text-xs text-gray-400">View all your resumes</p>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Fullscreen preview ── */}
      <AnimatePresence>
        {fullscreenPreview && (
          <motion.div
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col"
          >
            {/* Fullscreen top bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-gray-900 border-b border-white/10 flex-shrink-0">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                Full Preview
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareLink}
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20 gap-1.5"
                >
                  <Share2 className="h-4 w-4" /> Share
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadPDF}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFullscreenPreview(false)}
                  className="text-white hover:bg-white/10 gap-1.5"
                >
                  <X className="h-4 w-4" /> Close
                </Button>
              </div>
            </div>

            {/* Fullscreen resume */}
            <div className="flex-1 overflow-auto flex items-start justify-center p-8">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
                <div
                  id="fullscreen-resume"
                  className="print-area mx-auto"
                  style={{ width: "250mm", padding: 0, boxSizing: "border-box" }}
                >
                  <ResumePreview />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ViewResume;
