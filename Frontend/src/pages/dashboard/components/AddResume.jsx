import React, { useState } from "react";
import { CopyPlus, LoaderCircle, Plus, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createNewResume } from "@/Services/resumeAPI";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";

function AddResume({ viewMode = "grid" }) {
  const [isDialogOpen, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define templates and colors to use for backend
  const templates = [
    { 
      id: "modern", 
      name: "Modern Resume", 
      color: "#059669", // emerald-600 as default color
    },
    { 
      id: "professional", 
      name: "Professional Resume", 
      color: "#333333", // blue-600 as default color
    }
  ];

  // Set default template - using professional
  const defaultTemplate = "professional";
  const templateColors = {
    modern: "#059669",     // emerald-600
    professional: "#333333", // blue-600
  };

  const resetForm = () => {
    setResumeTitle("");
    setOpenDialog(false);
  };

  const createResume = async () => {
    setLoading(true);
    if (resumeTitle.trim() === "") {
      toast("Please add a title to your resume");
      setLoading(false);
      return;
    }
      
    const data = {
      data: {
        title: resumeTitle.trim(),
        themeColor: templateColors[defaultTemplate],
        template: defaultTemplate,
      },
    };
    
    try {
      const res = await createNewResume(data);
      console.log("Response from Create Resume:", res);
      
      toast("Resume created successfully", {
        description: `"${resumeTitle}" is ready to edit`,
      });
      
      navigate(`/dashboard/edit-resume/${res.data.resume._id}`);
    } catch (error) {
      console.error("Error creating resume:", error);
      toast("Failed to create resume", {
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      resetForm();
    }
  };

  const handleCloseDialog = () => {
    resetForm();
  };
  
  if (viewMode === "list") {
    return (
      <>
        <div
          onClick={() => setOpenDialog(true)}
          className="add-resume-trigger flex items-center justify-between rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 group cursor-pointer overflow-hidden"
        >
          <div className="flex items-center flex-1">
            <div className="w-1 h-full self-stretch bg-gradient-to-b from-blue-500 to-purple-500 opacity-40 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-3 pl-4">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Create New Resume
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Design a professional resume with AI assistance
              </p>
            </div>
          </div>
          
          <div className="p-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>

        <CreateResumeDialog
          isOpen={isDialogOpen}
          setIsOpen={setOpenDialog}
          title={resumeTitle}
          setTitle={setResumeTitle}
          onCreate={createResume}
          onClose={handleCloseDialog}
          loading={loading}
        />
      </>
    );
  }
  
  // Grid View - Compact version with fixed height
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDialog(true)}
        className="add-resume-trigger flex flex-col items-center justify-center h-[210px] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 cursor-pointer group transition-all duration-300"
      >
        <div className="w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center group-hover:from-blue-500 group-hover:to-indigo-600 transition-colors duration-300">
          <CopyPlus className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Create New Resume
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2 max-w-[180px]">
          Design a professional resume with AI assistance
        </p>
      </motion.div>

      <CreateResumeDialog
        isOpen={isDialogOpen}
        setIsOpen={setOpenDialog}
        title={resumeTitle}
        setTitle={setResumeTitle}
        onCreate={createResume}
        onClose={handleCloseDialog}
        loading={loading}
      />
    </>
  );
}

// Simplified dialog component without template selection
function CreateResumeDialog({ 
  isOpen, 
  setIsOpen, 
  title, 
  setTitle, 
  onCreate, 
  onClose,
  loading
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl">
        <DialogHeader className="bg-gradient-to-r from-emerald-500 to-indigo-600 text-white p-5 rounded-t-xl">
          <DialogTitle className="text-center text-xl font-bold">
            Create a New Resume
          </DialogTitle>
          <DialogDescription className="text-center pt-1.5 text-indigo-100 text-sm">
            Give your resume a name that reflects the job role you're targeting
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6">
          <div className="space-y-3">
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-indigo-500/30 text-base py-5 rounded-lg"
                type="text"
                placeholder="Ex: Software Engineer Resume"
                value={title}
                onChange={(e) => setTitle(e.target.value.trimStart())}
                autoFocus
              />
            </div>
            <p className="text-xs text-gray-500 text-center mt-1">
              This will help you organize multiple resumes for different
              positions.
            </p>
          </div>
        </div>
        
        <DialogFooter className="bg-gray-50 dark:bg-gray-800/50 p-4 flex justify-between rounded-b-xl">
          <div className="w-full flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 rounded-lg py-4 text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={onCreate}
              disabled={loading || !title.trim()}
              className="w-full bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white rounded-lg py-4 text-sm shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Resume"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddResume;
