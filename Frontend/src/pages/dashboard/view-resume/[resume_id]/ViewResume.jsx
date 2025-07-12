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
  Maximize,
  Trophy,
  ChevronRight,
  Layout,
  Share2 // New icon import
} from "lucide-react";
import { Button } from "@/components/ui/button";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState("download");
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
      
      // Ensure template info is included
      const resumeData = {
        ...response.data,
        template: response.data.template || "modern" // Default to modern if no template specified
      };
      
      console.log("Resume loaded with template:", resumeData.template);
      dispatch(addResumeData(resumeData));
      setResumeInfo(resumeData);
    } catch (error) {
      toast("Error loading resume", {
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareLink = () => {
    const publicLink = `${window.location.origin}/public/resume/${resume_id}`;
    navigator.clipboard.writeText(publicLink).then(() => {
      toast.success("link copied to clipboard!", {
        description: "Anyone with this link can view your resume."
      });
    }).catch(err => {
      toast.error("Failed to copy link", {
        description: "Please try again manually."
      });
    });
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingState(true);
      setDownloadProgress(20);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Call the API to download the PDF
      await downloadResumePDF(resume_id);
      
      // Clear interval and set progress to 100%
      clearInterval(progressInterval);
      setDownloadProgress(100);
      
      toast("Resume Downloaded", { 
        description: "Your resume has been saved as a PDF file",
        icon: <CheckCircle className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast("Download failed", { 
        description: "Please try again",
        variant: "destructive"
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
      {/* Normal view mode */}
      <AnimatePresence>
        {!fullscreenPreview && (
          <motion.div 
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 pb-10 pt-20"
          >
            <div className="container mx-auto px-4 py-6">
              {/* Main content with split layout */}
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Resume preview - left side */}
                <motion.div 
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                  className="lg:w-2/3 relative"
                >
                  {isLoading ? (
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 flex justify-center items-center min-h-[600px]">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-6 text-indigo-200 text-lg">Preparing your professional resume...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <div className="absolute -left-12 top-20 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute right-10 top-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-10 left-20 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-blue-500/30 to-indigo-500/30 rounded-2xl blur-xl transform -translate-y-4 scale-105 opacity-80"></div>
                      
                      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 rounded-xl opacity-30"></div>
                        <div className="relative">
                          <div className="absolute -right-2 -top-2 z-10">
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 1, duration: 0.5 }}
                              className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white text-xs px-3 py-1 rounded-full flex items-center shadow-lg"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" /> Ready to Apply
                            </motion.div>
                          </div>
                          
                          <div 
                            ref={resumeRef} 
                            id="resume-container"
                            className="mx-auto bg-white rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:shadow-2xl"
                            style={{ 
                              width: "290mm", 
                              maxWidth: "100%", 
                              height: "auto", 
                              minHeight: "500px",
                              padding: "0",
                              boxSizing: "border-box"
                            }}
                          >
                            <ResumePreview />
                          </div>
                          
                          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button 
                              size="sm" 
                              className="rounded-full w-12 h-12 p-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => setFullscreenPreview(true)}
                            >
                              <Maximize className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
                
                {/* Control panel - right side */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="lg:w-1/3"
                >
                  <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                    
                    {/* Tab content with glass morphism */}
                    <div className="p-6 space-y-6">
                      {/* Download tab */}
                      {activeSidebarTab === 'download' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/20">
                              <Download className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Download Your Resume</h3>
                            <p className="text-indigo-200 text-sm mb-6">Get your professional resume as a PDF file</p>
                          </div>
                          
                          <div className="space-y-4">
                            {downloadingState ? (
                              <div className="space-y-3 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                                <div className="w-full h-2 bg-indigo-900/50 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${downloadProgress}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full"
                                  ></motion.div>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-center text-sm text-indigo-200">Processing your resume...</p>
                                  <span className="text-sm text-white font-medium">{downloadProgress}%</span>
                                </div>
                              </div>
                            ) : (
                              <Button 
                                className="w-full py-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base rounded-xl relative overflow-hidden group"
                                onClick={handleDownloadPDF}
                              >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                                
                                <span className="flex items-center relative z-10">
                                  <Download className="mr-2 h-5 w-5" />
                                  Download as PDF
                                </span>
                              </Button>
                            )}

                            {/* Share Link Button */}
                            <Button 
                              variant="outline" 
                              className="w-full py-4 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 text-white rounded-xl transition-all duration-300"
                              onClick={handleShareLink}
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="font-medium">Share Public Link</span>
                            </Button>

                            
                            <div className="mt-4 space-y-3">
                              <Button 
                                className="w-full py-4 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm hover:bg-white/15 border border-white/20 text-white rounded-xl transition-all duration-300"
                                onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                              >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="font-medium">Return to Editor</span>
                              </Button>
                              
                              <Button 
                                className="w-full py-4 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                                onClick={() => navigate('/dashboard')}
                              >
                                <ArrowLeft className="h-4 w-4" />
                                <span className="font-medium">Back to Dashboard</span>
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-6 bg-emerald-900/20 backdrop-blur-sm p-4 rounded-xl border border-emerald-500/30">
                            <h4 className="text-sm font-medium text-emerald-300 mb-3 flex items-center">
                              <Trophy className="h-4 w-4 mr-2" />
                              Career Expert Tips
                            </h4>
                            <ul className="text-xs text-emerald-200 space-y-3">
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                PDF format is best for ATS systems and online job applications
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                Keep your resume sections concise and focused on relevant achievements
                              </li>
                              <li className="flex items-start">
                                <ChevronRight className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0 text-emerald-400" />
                                Tailor your resume to each job description for best results
                              </li>
                            </ul>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Settings tab */}
                      {activeSidebarTab === 'settings' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-6"
                        >
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-600/20">
                              <Layout className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Resume Options</h3>
                            <p className="text-indigo-200 text-sm mb-6">Manage and edit your professional resume</p>
                          </div>
                          
                          <div className="space-y-4">
                            <Button 
                              className="w-full py-6 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                              onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                            >
                              <ArrowLeft className="h-5 w-5" />
                              <span className="font-medium">Return to Editor</span>
                            </Button>
                            
                            <Button 
                              className="w-full py-6 flex items-center justify-center gap-3 bg-white/5 backdrop-blur-sm hover:bg-white/10 border border-white/20 text-white rounded-xl transition-all duration-300"
                              onClick={() => navigate('/dashboard')}
                            >
                              <ArrowLeft className="h-5 w-5" />
                              <span className="font-medium">Back to Dashboard</span>
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Full-screen preview mode with enhanced design */}
      <AnimatePresence>
        {fullscreenPreview && (
          <motion.div 
            id="noPrint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 sm:p-10"
          >
            {/* Floating elements for visual interest */}
            <div className="absolute left-10 top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute right-10 top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
            {/* Top bar with controls */}
            <div className="w-full max-w-5xl flex justify-between items-center py-4 px-6 bg-white/5 backdrop-blur-xl rounded-t-xl border border-white/10 relative z-10">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-white font-bold flex items-center"
              >
                <CheckCircle className="h-4 w-4 mr-2 text-emerald-400" /> Full Resume Preview
              </motion.h2>
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex gap-3"
              >
                <Button
                  className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white border-none shadow-lg"
                  onClick={handleDownloadPDF}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  className="text-white border-white/30 bg-white/5 hover:bg-white/10"
                  onClick={() => setFullscreenPreview(false)}
                >
                  Close
                </Button>
              </motion.div>
            </div>
            
            {/* Resume preview with subtle glow */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative w-full max-w-5xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-indigo-500/20 rounded-b-xl blur-xl transform scale-105 opacity-50"></div>
              <div className="bg-white overflow-auto max-h-[80vh] w-full rounded-b-xl shadow-2xl relative z-10">
                <div 
                  id="fullscreen-resume" 
                  className="print-area mx-auto"
                  style={{
                    width: "250mm",
                    padding: "0",
                    margin: "0 auto",
                    boxSizing: "border-box"
                  }}
                >
                  <ResumePreview />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Add style for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
}

export default ViewResume;
