import React from "react";

const ModernSidebarTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#0ea5e9"; // Default to sky-500

  const normalizeBullets = (text) => {
    if (!text) return [];

    return String(text)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>|<\/div>|<\/li>|<\/h[1-6]>/gi, "\n")
      .replace(/<li[^>]*>/gi, "")
      .replace(/<\/ul>|<\/ol>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/gi, " ")
      .split(/\r?\n|•|â€¢/)
      .map((item) => item.replace(/^[-*]\s*/, "").trim())
      .filter(Boolean);
  };

  return (
    <div className="shadow-md bg-white h-full rounded overflow-hidden flex flex-col md:flex-row">
      {/* Left Sidebar - Modified to fill full height */}
      <div className="md:w-1/3 p-5 md:min-h-full" style={{ backgroundColor: themeColor }}>
        {/* Profile Section */}
        <div className="text-center mb-6">
          {/* Avatar Circle with Initials */}
          <div className="w-24 h-24 rounded-full bg-white mx-auto flex items-center justify-center mb-3">
            <span className="text-xl font-bold" style={{ color: themeColor }}>
              {resumeInfo?.firstName?.charAt(0) || ""}
              {resumeInfo?.lastName?.charAt(0) || ""}
            </span>
          </div>
          
          <h1 className="text-lg font-bold text-white mb-1">
            {resumeInfo?.firstName} {resumeInfo?.lastName}
          </h1>
          <h2 className="text-base text-white/90 mb-3">
            {resumeInfo?.jobTitle}
          </h2>
        </div>
        
        {/* Contact Information */}
        <div className="mb-6 text-white/90">
          <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
            Contact
          </h3>
          
          <div className="space-y-2">
            {resumeInfo?.email && (
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="break-all">{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-start text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Social Links */}
        {(resumeInfo?.linkedinUrl || resumeInfo?.githubUrl || resumeInfo?.portfolioUrl) && (
          <div className="mb-6">
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Connect
            </h3>
            
            <div className="space-y-2">
              {resumeInfo?.linkedinUrl && (
                <a 
                  href={formatUrl(resumeInfo.linkedinUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-white/90 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  <span>LinkedIn</span>
                </a>
              )}
              
              {resumeInfo?.githubUrl && (
                <a 
                  href={formatUrl(resumeInfo.githubUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-white/90 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
              )}
              
              {resumeInfo?.portfolioUrl && (
                <a 
                  href={formatUrl(resumeInfo.portfolioUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-sm text-white/90 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        )}
        
        {/* Skills Section */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <div className="mb-6">
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Skills
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {resumeInfo.skills.map((skill, index) => (
                <span 
                key={index} 
                className="inline-block text-sm px-2 py-1 rounded bg-white/10 text-white/90"
              >
                {skill.name}
              </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Education Section */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <div className="mb-6">
            <h3 className="uppercase text-xs font-bold mb-2 text-white/80 border-b border-white/20 pb-1">
              Education
            </h3>
            
            <div className="space-y-3">
              {resumeInfo.education.map((edu, index) => (
                <div key={index} className="mb-3">
                  <h4 className="text-base font-medium text-white">
                    {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                  </h4>
                  <h5 className="text-xs text-white/80 mb-1">{edu.universityName}</h5>
                  <div className="text-xs text-white/70">
                    {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                    {edu.endDate}
                  </div>
                  
                  {edu.grade && (
                    <div className="text-xs text-white/70 mt-1">
                      {edu.gradeType}: {edu.grade}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        
      </div>
      
      {/* Main Content - Removed padding/margin between columns */}
      <div className="md:w-2/3 p-5 bg-white md:ml-0">
        {/* Summary Section */}
        {resumeInfo?.summary && (
          <div className="mb-6">
            <h3 
              className="text-base font-bold mb-2 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              SUMMARY
            </h3>
            <p className="text-sm text-gray-700">{resumeInfo.summary}</p>
          </div>
        )}
        
        {/* Experience Section */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-base font-bold mb-3 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              WORK EXPERIENCE
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.experience.map((exp, index) => (
                <div 
                  key={index} 
                  className="pl-4 mb-3"
                  style={{ borderLeft: `2px solid ${themeColor}40` }}
                >
                  <div className="flex justify-between items-start flex-wrap mb-1">
                    <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm font-medium text-gray-600 mb-1">
                    {exp.companyName}
                    {exp.city && exp.companyName ? ", " : ""}
                    {exp.city}
                    {exp.city && exp.state ? ", " : ""}
                    {exp.state}
                  </h5>
                  
                  {exp.workSummary ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {normalizeBullets(exp.workSummary).map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects Section - Updated to remove card styling */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-base font-bold mb-3 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              PROJECTS
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.projects.map((project, index) => (
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-base font-bold text-gray-800">{project.projectName}</h4>
                    
                    <div className="flex gap-2">
                      {project?.githubLink && (
                        <a 
                          href={formatUrl(project.githubLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs inline-flex items-center"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Code
                        </a>
                      )}
                      
                      {project?.deployedLink && (
                        <a 
                          href={formatUrl(project.deployedLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs inline-flex items-center"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {project.techStack && (
                    <div className="text-xs text-gray-500 mb-1">
                      <span className="font-medium">Tech Stack:</span> {project.techStack}
                    </div>
                  )}
                  
                  {project.projectSummary ? (
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                      {normalizeBullets(project.projectSummary).map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications Section - Updated to remove card styling */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <div className="mb-6">
            <h3 
              className="text-base font-bold mb-3 pb-1 border-b"
              style={{ borderColor: `${themeColor}40`, color: themeColor }}
            >
              CERTIFICATIONS
            </h3>
            
            <div className="space-y-4">
              {resumeInfo.certifications.map((cert, index) => (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                    {cert.date && (
                      <span className="text-xs text-gray-500">{cert.date}</span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm font-medium text-gray-600">{cert.issuer}</h5>
                    {cert.credentialLink && (
                      <a 
                        href={formatUrl(cert.credentialLink)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs inline-flex items-center"
                        style={{ color: themeColor }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
                        </svg>
                        View
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Additional Sections in Main Content - if they exist */}
        {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
          <>
            {resumeInfo.additionalSections.map((section, index) => (
              <div className="mb-6" key={index}>
                <h3 
                  className="text-base font-bold mb-3 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  {section.title.toUpperCase()}
                </h3>
                <div>
                  <div 
                    dangerouslySetInnerHTML={{ __html: section.content }}
                    className="[&>ul]:ml-4 [&>ul]:list-disc [&>ul]:pl-1 [&>ul>li]:mb-1 [&>p]:mb-2 [&>h4]:font-bold [&>h4]:text-base [&>h4]:mb-1"
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// Gradient Accent Template with Modified Projects Section

export default ModernSidebarTemplate;
