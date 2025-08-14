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
  Edit,
  Home,
  Share2,
  Eye,
  BarChart3,
  FileText,
  ChevronRight,
  Sparkles,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { VITE_APP_URL } from "@/config/config.js";

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
        template: response.data.template || "modern"
      };
      
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
    if (resumeInfo && resumeInfo.googleDriveLink) {
        navigator.clipboard.writeText(resumeInfo.googleDriveLink).then(() => {
            toast.success("Resume link copied to clipboard!", {
                description: "Anyone with the link can view your resume on Google Drive."
            });
        }).catch(err => {
            toast.error("Failed to copy link", { description: "Please try again manually." });
        });
    } else {
        toast.info("Link not ready yet", {
            description: "The shareable link for this resume is still being generated. Please wait a moment and try again."
        });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setDownloadingState(true);
      setDownloadProgress(20);
      
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  // Format date to relative time (e.g., "2 days ago")
  const getRelativeTime = () => {
    return "2 days ago";
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
            className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 pb-10 pt-20"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col lg:flex-row gap-8">
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
                
                {/* Enhanced Right Column */}
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="lg:w-1/3"
                >
                  <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900/80 via-indigo-800/80 to-blue-900/80 backdrop-blur-xl border border-indigo-700/50 shadow-2xl">
                    {/* Header with glowing accent */}
                    <div className="relative p-6 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/30 rounded-full blur-3xl"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center mb-1">
                          <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                          <h2 className="text-xl font-bold text-white">Resume Actions</h2>
                        </div>
                        <p className="text-indigo-200 text-sm">Manage your professional resume</p>
                      </div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="px-6 pb-6 space-y-6">
                      {/* Action Buttons - Download & Share */}
                      <div className="space-y-3">
                        {downloadingState ? (
                          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                            <div className="w-full h-2.5 bg-indigo-900/50 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${downloadProgress}%` }}
                                className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
                                style={{
                                  boxShadow: "0 0 15px rgba(52, 211, 153, 0.5)"
                                }}
                              ></motion.div>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center">
                                <div className="animate-pulse mr-2">
                                  <Clock className="h-4 w-4 text-blue-300" />
                                </div>
                                <p className="text-sm text-blue-200">Processing PDF...</p>
                              </div>
                              <span className="text-sm text-white font-medium">{downloadProgress}%</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <Button 
                              onClick={handleDownloadPDF}
                              className="w-full py-6 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white shadow-lg group relative overflow-hidden"
                            >
                              <div className="absolute inset-0 w-full h-full bg-white/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
                              <div className="absolute top-0 left-0 w-20 h-full bg-white/10 skew-x-[-20deg] transform -translate-x-32 group-hover:translate-x-96 transition-transform duration-1000"></div>
                              
                              <span className="relative z-10 flex items-center justify-center font-medium">
                                <Download className="mr-2 h-5 w-5" />
                                Download PDF
                              </span>
                            </Button>
                            
                            <Button 
                              onClick={handleShareLink}
                              className="w-full mt-3 py-4 bg-white/10 hover:bg-white/15 text-white rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all duration-300"
                            >
                              <Share2 className="mr-2 h-4 w-4" />
                              <span className="font-medium">Share Resume</span>
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      
                      
                      {/* Quick Actions */}
                      <div className="space-y-3 pt-1">
                        <h3 className="text-white text-sm font-medium flex items-center">
                          <ArrowLeft className="h-4 w-4 mr-2 text-indigo-300" />
                          Navigation
                        </h3>
                        
                        <Button 
                          onClick={() => navigate(`/dashboard/edit-resume/${resume_id}`)}
                          className="w-full py-3.5 pl-4 pr-3 flex items-center justify-between bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all group"
                        >
                          <div className="flex items-center">
                            <div className="rounded-full p-2 bg-indigo-800/80 mr-3 group-hover:bg-indigo-700 transition-colors">
                              <Edit className="h-4 w-4 text-indigo-200" />
                            </div>
                            <div className="text-left">
                              <span className="font-medium block">Return to Editor</span>
                              <span className="text-xs text-indigo-300">Edit your resume content</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-indigo-400 group-hover:text-white transition-colors" />
                        </Button>
                        
                        <Button 
                          onClick={() => navigate('/dashboard')}
                          className="w-full py-3.5 pl-4 pr-3 flex items-center justify-between bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all group"
                        >
                          <div className="flex items-center">
                            <div className="rounded-full p-2 bg-indigo-800/80 mr-3 group-hover:bg-indigo-700 transition-colors">
                              <Home className="h-4 w-4 text-indigo-200" />
                            </div>
                            <div className="text-left">
                              <span className="font-medium block">Back to Dashboard</span>
                              <span className="text-xs text-indigo-300">View all your resumes</span>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-indigo-400 group-hover:text-white transition-colors" />
                        </Button>
                      </div>
                    </div>
                  </div>
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
            className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 sm:p-10"
          >
            <div className="absolute left-10 top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute right-10 top-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            
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
                    variant="outline"
                    className="text-white border-white/30 bg-white/10 hover:bg-white/20"
                    onClick={handleShareLink}
                >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share PDF Link
                </Button>
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
