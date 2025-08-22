// // C:\Users\NxtWave\Downloads\code\Frontend\src\pages\dashboard\edit-resume\[resume_id]\EditResume.jsx (Modified)

// import React, { useEffect, useState, useRef } from "react";
// import ResumeForm from "../components/ResumeForm";
// import PreviewPage from "../components/PreviewPage";
// import { useParams } from "react-router-dom";
// import { getResumeData, saveResumeVersion, updateThisResume } from "@/Services/resumeAPI";
// import { getProfile } from "@/Services/login";
// import { useDispatch, useSelector } from "react-redux";
// import { addResumeData } from "@/features/resume/resumeFeatures";
// import { Button } from "@/components/ui/button";
// import { Save, History, LoaderCircle, Download, ChevronLeft, ChevronRight, User } from "lucide-react";
// import { toast } from "sonner";
// import VersionHistoryModal from "../components/VersionHistoryModal";
// import ImportConfirmationDialog from "@/components/custom/ImportConfirmationDialog";

// export function EditResume() {
//   const { resume_id } = useParams();
//   const dispatch = useDispatch();
//   const resumeInfo = useSelector((state) => state.editResume.resumeData);
//   const [isResizing, setIsResizing] = useState(false);
//   const [sidebarWidth, setSidebarWidth] = useState(50);
//   const containerRef = useRef(null);
//   const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
//   const [isSavingVersion, setIsSavingVersion] = useState(false);
//   const [isImportModalOpen, setIsImportModalOpen] = useState(false);
//   const [isImporting, setIsImporting] = useState(false);


//   useEffect(() => {
//     window.scrollTo(0, 0);
//     getResumeData(resume_id)
//       .then((data) => {
//         dispatch(addResumeData(data.data));
//       })
//       .catch((error) => {
//         console.error("Error fetching resume data:", error);
//       });
//   }, [resume_id, dispatch]);

//   const handleMouseDown = (e) => {
//     e.preventDefault();
//     setIsResizing(true);
//   };

//   const handleMouseMove = (e) => {
//     if (!isResizing || !containerRef.current) return;
//     const containerRect = containerRef.current.getBoundingClientRect();
//     let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
//     if (newWidth < 30) newWidth = 30;
//     if (newWidth > 70) newWidth = 70;
    
//     setSidebarWidth(newWidth);
//   };

//   const handleMouseUp = () => {
//     setIsResizing(false);
//   };

//   useEffect(() => {
//     if (isResizing) {
//       window.addEventListener("mousemove", handleMouseMove);
//       window.addEventListener("mouseup", handleMouseUp);
//     }
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isResizing, handleMouseMove, handleMouseUp]);

//   const handleSaveVersion = async () => {
//     setIsSavingVersion(true);
//     try {
//       const response = await saveResumeVersion(resume_id);
//       if (response.success) {
//         dispatch(addResumeData(response.data)); 
//         toast.success("Version Saved!", {
//           description: "A snapshot of your resume has been saved."
//         });
//       } else {
//         throw new Error(response.message);
//       }
//     } catch (error) {
//       toast.error("Failed to save version", { description: error.message });
//     } finally {
//       setIsSavingVersion(false);
//     }
//   };
  
//   const handleImportFromProfile = async () => {
//     setIsImportModalOpen(false);
//     setIsImporting(true);
//     toast.loading("Importing profile data...");
  
//     try {
//       const profileResponse = await getProfile();
//       const profileData = profileResponse.data;
      
//       const { _id, password, niatId, createdAt, updatedAt, __v, ...importableData } = profileData;
  
//       // Clean up data to prevent backend errors
//       if (Array.isArray(importableData.experience)) {
//         importableData.experience = importableData.experience.map(({ _id, ...exp }) => ({
//           ...exp,
//           currentlyWorking: exp.currentlyWorking === true || exp.currentlyWorking === 'true',
//         }));
//       }
//       if (Array.isArray(importableData.skills)) {
//           importableData.skills = importableData.skills.map(({ _id, ...skill }) => skill);
//       }
//       if (Array.isArray(importableData.projects)) {
//         importableData.projects = importableData.projects.map(({ _id, ...proj }) => proj);
//       }
//       if (Array.isArray(importableData.education)) {
//         importableData.education = importableData.education.map(({ _id, ...edu }) => edu);
//       }
//       if (Array.isArray(importableData.certifications)) {
//         importableData.certifications = importableData.certifications
//           .filter(cert => cert.name && cert.issuer)
//           .map(({ _id, ...cert }) => cert);
//       }
//       if (Array.isArray(importableData.additionalSections)) {
//         importableData.additionalSections = importableData.additionalSections
//           .filter(section => section.title)
//           .map(({ _id, ...section }) => section);
//       }
      
//       // Optimistic UI update
//       dispatch(addResumeData({ ...resumeInfo, ...importableData }));
  
//       const updatePayload = { data: importableData };
//       const updateResponse = await updateThisResume(resume_id, updatePayload);
  
//       // --- START OF FIX ---
//       // The dispatch action was incorrect here. It should update the resume data, not the user data.
//       dispatch(addResumeData(updateResponse.data));
//       // --- END OF FIX ---
  
//       toast.success("Profile imported successfully!", {
//         description: "Your resume has been populated with your profile data and saved."
//       });
  
//     } catch(error) {
//       toast.error("Failed to import profile", { description: error.message });
//       getResumeData(resume_id).then(data => dispatch(addResumeData(data.data)));
//     } finally {
//       setIsImporting(false);
//       toast.dismiss();
//     }
//   };


//   return (
//     <div
//       ref={containerRef}
//       className="flex h-screen"
//       style={{ cursor: isResizing ? 'ew-resize' : 'default' }}
//     >
//       <div
//         className="form-container overflow-y-auto"
//         style={{ width: `${sidebarWidth}%` }}
//       >
//         <div className="p-1 bg-indigo-50 border-b border-indigo-100 flex items-center justify-center gap-4">
//             <User className="h-5 w-5 text-indigo-500" />
//             <p className="text-sm text-indigo-700">Quick start by importing data from your master profile.</p>
//             <Button
//                 variant="outline"
//                 size="sm"
//                 className="bg-white hover:bg-indigo-100 text-indigo-600 border-indigo-200"
//                 onClick={() => setIsImportModalOpen(true)}
//                 disabled={isImporting}
//             >
//               {isImporting ? <LoaderCircle className="animate-spin h-4 w-4" /> : "Import from Profile"}
//             </Button>
//         </div>
//         <ImportConfirmationDialog
//           open={isImportModalOpen}
//           onOpenChange={setIsImportModalOpen}
//           onConfirm={handleImportFromProfile}
//           loading={isImporting}
//         />
        
//         <ResumeForm />
//       </div>

//       <div
//         className="divider cursor-ew-resize w-2 bg-gray-200 hover:bg-primary transition-colors flex items-center justify-center relative"
//         onMouseDown={handleMouseDown}
//       >
//         <div className="absolute top-1/2 -translate-y-1/2 left-0 flex flex-col gap-2 -translate-x-[110%] z-10">
// {/*             <Button
//               variant="outline"
//               size="sm"
//               className="h-10 w-10 p-0 flex flex-col items-center justify-center bg-white shadow-md hover:bg-gray-50"
//               onClick={handleSaveVersion}
//               disabled={isSavingVersion}
//               title="Save Version"
//             >
//               {isSavingVersion ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4"/>}
//               <span className="text-[10px] -mt-0.5">Save</span>
//             </Button>

//             <Button
//               variant="outline"
//               size="sm"
//               className="h-10 w-10 p-0 flex flex-col items-center justify-center bg-white shadow-md hover:bg-gray-50"
//               onClick={() => setHistoryModalOpen(true)}
//               title="View History"
//             >
//               <History className="h-4 w-4"/>
//               <span className="text-[10px] -mt-0.5">History</span>
//             </Button> */}
//         </div>
//         <div className="h-12 w-1 bg-gray-400 rounded-full"></div>
//       </div>
      
//       <VersionHistoryModal 
//         isOpen={isHistoryModalOpen} 
//         onClose={() => setHistoryModalOpen(false)}
//         resumeInfo={resumeInfo}
//       />
      
//       <div
//         className="preview-container overflow-y-auto"
//         style={{ width: `${100 - sidebarWidth}%` }}
//       >
//         <div className="md:w-full lg:w-[100%] xl:w-[100%]">
//           <PreviewPage />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditResume;



// C:\Users\NxtWave\Downloads\AiResumeBuilder-3\Frontend\src\pages\dashboard\edit-resume\[resume_id]\EditResume.jsx

import React, { useEffect, useState, useRef } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData, saveResumeVersion, updateThisResume } from "@/Services/resumeAPI";
import { getProfile } from "@/Services/login";
import { useDispatch, useSelector } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { Button } from "@/components/ui/button";
import { Save, History, LoaderCircle, Download, ChevronLeft, ChevronRight, User } from "lucide-react";
import { toast } from "sonner";
import VersionHistoryModal from "../components/VersionHistoryModal";
import ImportConfirmationDialog from "@/components/custom/ImportConfirmationDialog";
import LoadingSpinner from "@/components/custom/LoadingSpinner"; // NEW: Import the loading component

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const resumeInfo = useSelector((state) => state.editResume.resumeData);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(50);
  const containerRef = useRef(null);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState(false);
  const [isSavingVersion, setIsSavingVersion] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // NEW: Add a loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // NEW: Define an async function inside useEffect for cleaner async/await
    const fetchAndSetResumeData = async () => {
      try {
        window.scrollTo(0, 0);
        const response = await getResumeData(resume_id);
        dispatch(addResumeData(response.data));
      } catch (error) {
        console.error("Error fetching resume data:", error);
        toast.error("Failed to load resume", { description: "Please check the URL or try again later." });
      } finally {
        // NEW: Set loading to false after the fetch is complete (success or fail)
        setIsLoading(false);
      }
    };
    
    // NEW: Set loading to true before fetching
    setIsLoading(true);
    fetchAndSetResumeData();

  }, [resume_id, dispatch]);
  
  // ... (keep all the other functions: handleMouseDown, handleMouseMove, handleMouseUp, handleSaveVersion, handleImportFromProfile)
  
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    if (newWidth < 30) newWidth = 30;
    if (newWidth > 70) newWidth = 70;
    
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };
  
    useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleSaveVersion = async () => {
    setIsSavingVersion(true);
    try {
      const response = await saveResumeVersion(resume_id);
      if (response.success) {
        dispatch(addResumeData(response.data)); 
        toast.success("Version Saved!", {
          description: "A snapshot of your resume has been saved."
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast.error("Failed to save version", { description: error.message });
    } finally {
      setIsSavingVersion(false);
    }
  };
  
  const handleImportFromProfile = async () => {
    setIsImportModalOpen(false);
    setIsImporting(true);
    toast.loading("Importing profile data...");
  
    try {
      const profileResponse = await getProfile();
      const profileData = profileResponse.data;
      
      const { _id, password, niatId, createdAt, updatedAt, __v, ...importableData } = profileData;
  
      // Clean up data to prevent backend errors
      if (Array.isArray(importableData.experience)) {
        importableData.experience = importableData.experience.map(({ _id, ...exp }) => ({
          ...exp,
          currentlyWorking: exp.currentlyWorking === true || exp.currentlyWorking === 'true',
        }));
      }
      if (Array.isArray(importableData.skills)) {
          importableData.skills = importableData.skills.map(({ _id, ...skill }) => skill);
      }
      if (Array.isArray(importableData.projects)) {
        importableData.projects = importableData.projects.map(({ _id, ...proj }) => proj);
      }
      if (Array.isArray(importableData.education)) {
        importableData.education = importableData.education.map(({ _id, ...edu }) => edu);
      }
      if (Array.isArray(importableData.certifications)) {
        importableData.certifications = importableData.certifications
          .filter(cert => cert.name && cert.issuer)
          .map(({ _id, ...cert }) => cert);
      }
      if (Array.isArray(importableData.additionalSections)) {
        importableData.additionalSections = importableData.additionalSections
          .filter(section => section.title)
          .map(({ _id, ...section }) => section);
      }
      
      // Optimistic UI update
      dispatch(addResumeData({ ...resumeInfo, ...importableData }));
  
      const updatePayload = { data: importableData };
      const updateResponse = await updateThisResume(resume_id, updatePayload);
  
      dispatch(addResumeData(updateResponse.data));
  
      toast.success("Profile imported successfully!", {
        description: "Your resume has been populated with your profile data and saved."
      });
  
    } catch(error) {
      toast.error("Failed to import profile", { description: error.message });
      getResumeData(resume_id).then(data => dispatch(addResumeData(data.data)));
    } finally {
      setIsImporting(false);
      toast.dismiss();
    }
  };


  // NEW: Add the conditional rendering logic here
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Your original return statement for when loading is false
  return (
    <div
      ref={containerRef}
      className="flex h-screen"
      style={{ cursor: isResizing ? 'ew-resize' : 'default' }}
    >
      <div
        className="form-container overflow-y-auto"
        style={{ width: `${sidebarWidth}%` }}
      >
        <div className="p-1 bg-indigo-50 border-b border-indigo-100 flex items-center justify-center gap-4">
            <User className="h-5 w-5 text-indigo-500" />
            <p className="text-sm text-indigo-700">Quick start by importing data from your master profile.</p>
            <Button
                variant="outline"
                size="sm"
                className="bg-white hover:bg-indigo-100 text-indigo-600 border-indigo-200"
                onClick={() => setIsImportModalOpen(true)}
                disabled={isImporting}
            >
              {isImporting ? <LoaderCircle className="animate-spin h-4 w-4" /> : "Import from Profile"}
            </Button>
        </div>
        <ImportConfirmationDialog
          open={isImportModalOpen}
          onOpenChange={setIsImportModalOpen}
          onConfirm={handleImportFromProfile}
          loading={isImporting}
        />
        
        <ResumeForm />
      </div>

      <div
        className="divider cursor-ew-resize w-2 bg-gray-200 hover:bg-primary transition-colors flex items-center justify-center relative"
        onMouseDown={handleMouseDown}
      >
        {/* ... (keep your save/history buttons) ... */}
        <div className="h-12 w-1 bg-gray-400 rounded-full"></div>
      </div>
      
      <VersionHistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setHistoryModalOpen(false)}
        resumeInfo={resumeInfo}
      />
      
      <div
        className="preview-container overflow-y-auto"
        style={{ width: `${100 - sidebarWidth}%` }}
      >
        <div className="md:w-full lg:w-[100%] xl:w-[100%]">
          <PreviewPage />
        </div>
      </div>
    </div>
  );
}

export default EditResume;
