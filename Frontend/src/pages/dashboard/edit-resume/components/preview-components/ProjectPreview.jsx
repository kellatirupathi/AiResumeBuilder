// Updated ProjectPreview Component
import React from "react";
import DOMPurify from "dompurify";

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
          
          <div className="mt-1 rsw-ce" style={{ fontSize: "13px", lineHeight: "1.4" }}>
            <div
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(project?.projectSummary || "") }}
              style={{ fontSize: "13px", lineHeight: "1.4" }}
              className="[&>ul]:ml-4 [&>ul]:pl-1 [&>ul>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:marker:text-gray-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectPreview;
