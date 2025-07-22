// import React, { useEffect } from "react";
// import ResumeForm from "../components/ResumeForm";
// import PreviewPage from "../components/PreviewPage";
// import { useParams } from "react-router-dom";
// import { getResumeData } from "@/Services/resumeAPI";
// import { useDispatch } from "react-redux";
// import { addResumeData } from "@/features/resume/resumeFeatures";

// export function EditResume() {
//   const { resume_id } = useParams();
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     // Reset scroll position to top when component mounts
//     window.scrollTo(0, 0);
    
//     // Fetch resume data including template information
//     getResumeData(resume_id).then((data) => {
//       console.log("Fetched resume data with template:", data.data.template);
//       dispatch(addResumeData(data.data));
//     }).catch(error => {
//       console.error("Error fetching resume data:", error);
//     });
//   }, [resume_id, dispatch]);
  
//   return (
//     <div className="flex flex-col md:flex-row p-0 md:py-6 md:gap-1">
//       {/* Keep the ResumeForm width unchanged but remove left padding */}
//       <div className="md:w-1/2 md:pr-0 md:pl-2">
//         <ResumeForm />
//       </div>
      
//       {/* Increase PreviewPage width to cover the gap and remove right gap */}
//       <div className="md:w-1/2 md:grow lg:pr-0 mt-6 md:mt-0">
//         <div className="md:w-full lg:w-[100%] xl:w-[100%]">
//           <PreviewPage />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EditResume;


import React, { useEffect, useState, useRef } from "react";
import ResumeForm from "../components/ResumeForm";
import PreviewPage from "../components/PreviewPage";
import { useParams } from "react-router-dom";
import { getResumeData } from "@/Services/resumeAPI";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";

export function EditResume() {
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(50);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset scroll position to top when component mounts
    window.scrollTo(0, 0);

    // Fetch resume data including template information
    getResumeData(resume_id)
      .then((data) => {
        dispatch(addResumeData(data.data));
      })
      .catch((error) => {
        console.error("Error fetching resume data:", error);
      });
  }, [resume_id, dispatch]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    
    // Set constraints for resizing (e.g., 30% to 70%)
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
        <ResumeForm />
      </div>

      <div
        className="divider cursor-ew-resize w-2 bg-gray-200 hover:bg-primary transition-colors"
        onMouseDown={handleMouseDown}
      ></div>

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
