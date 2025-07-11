// // Updated ProjectPreview Component
// import React from "react";

// function ProjectPreview({ resumeInfo }) {
//   // Helper function to format URLs
//   const formatUrl = (url) => {
//     if (!url) return null;
    
//     // If it doesn't start with http:// or https://, add https://
//     if (!/^https?:\/\//i.test(url)) {
//       return `https://${url}`;
//     }
//     return url;
//   };

//   return (
//     <div className="my-3">
//       {resumeInfo?.projects?.length > 0 && (
//         <div>
//           <h2
//             className="text-center font-bold text-sm mb-1"
//             style={{
//               color: resumeInfo?.themeColor,
//             }}
//           >
//             PROJECTS
//           </h2>
//           <hr
//             style={{
//               borderColor: resumeInfo?.themeColor,
//             }}
//           />
//         </div>
//       )}

//       {resumeInfo?.projects?.map((project, index) => (
//         <div key={index} className={index === 0 ? "mt-1 mb-2" : "mb-2"}>
//           <div className="flex justify-between items-start">
//             <h2
//               className="text-sm font-bold"
//               style={{
//                 color: resumeInfo?.themeColor,
//               }}
//             >
//               {project?.projectName}
//             </h2>
            
//             {/* Project links - Code and Demo */}
//             <div className="flex gap-2">
//               {project?.githubLink && (
//                 <a 
//                   href={formatUrl(project.githubLink)} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-xs"
//                   style={{ color: resumeInfo?.themeColor }}
//                 >
//                   Code
//                 </a>
//               )}
              
//               {project?.deployedLink && (
//                 <a 
//                   href={formatUrl(project.deployedLink)} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="text-xs"
//                   style={{ color: resumeInfo?.themeColor }}
//                 >
//                   Demo
//                 </a>
//               )}
//             </div>
//           </div>
          
//           <h2 className="text-xs flex justify-between">
//             {project?.techStack?.length > 0 && (
//               <span>Tech: {project?.techStack?.split(",").join(" | ")}</span>
//             )}
//           </h2>
          
//           <div
//             className="text-xs mt-1"
//             dangerouslySetInnerHTML={{ __html: project?.projectSummary }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ProjectPreview;

// Updated ProjectPreview Component
import React from "react";

function ProjectPreview({ resumeInfo }) {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    
    // If it doesn't start with http:// or https://, add https://
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  return (
    <div className="my-3">
      {resumeInfo?.projects?.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            PROJECTS
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}

      {resumeInfo?.projects?.map((project, index) => (
        <div key={index} className={index === 0 ? "mt-1 mb-2" : "mb-2"}>
          <div className="flex justify-between items-start">
            <h2
              className="text-sm font-bold"
              style={{
                color: resumeInfo?.themeColor,
              }}
            >
              {project?.projectName}
            </h2>
            
            {/* Project links - Code and Demo */}
            <div className="flex gap-2">
              {project?.githubLink && (
                <a 
                  href={formatUrl(project.githubLink)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  Code
                </a>
              )}
              
              {project?.deployedLink && (
                <a 
                  href={formatUrl(project.deployedLink)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs"
                  style={{ color: resumeInfo?.themeColor }}
                >
                  Demo
                </a>
              )}
            </div>
          </div>
          
          <h2 className="text-xs flex justify-between">
            {project?.techStack?.length > 0 && (
              <span>Tech: {project?.techStack?.split(",").join(" | ")}</span>
            )}
          </h2>
          
          <div
            className="text-xs mt-1 rsw-ce"
            dangerouslySetInnerHTML={{ __html: project?.projectSummary }}
          />
        </div>
      ))}
    </div>
  );
}

export default ProjectPreview;
