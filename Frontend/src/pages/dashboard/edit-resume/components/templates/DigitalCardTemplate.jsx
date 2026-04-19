import React from "react";

const DigitalCardTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#374151"; // Default to gray-700
  
  // Function to create lighter shade of theme color
  const createLighterColor = (color, opacity) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  };

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
    <div className="shadow-sm bg-white h-full rounded-md overflow-hidden">
      {/* Header with simple elegant design */}
      <div className="p-6 border-b" style={{ borderColor: `${themeColor}20` }}>
        <div className="max-w-4xl mx-auto">
          {/* Name and title */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-light tracking-wide mb-1 text-gray-900">
                {resumeInfo?.firstName} {resumeInfo?.lastName}
              </h1>
              <h2 className="text-lg font-light tracking-wide text-gray-500">
                {resumeInfo?.jobTitle}
              </h2>
            </div>
            
            {/* Contact info in right column */}
            <div className="text-right text-sm text-gray-500 space-y-0.5">
              {resumeInfo?.email && (
                <div>{resumeInfo.email}</div>
              )}
              {resumeInfo?.phone && (
                <div>{resumeInfo.phone}</div>
              )}
              {resumeInfo?.address && (
                <div>{resumeInfo.address}</div>
              )}
            </div>
          </div>
          
          {/* Social links centered */}
          <div className="flex justify-center gap-6 mb-3">
            {resumeInfo?.linkedinUrl && (
              <a 
                href={formatUrl(resumeInfo.linkedinUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
              </a>
            )}
            
            {resumeInfo?.githubUrl && (
              <a 
                href={formatUrl(resumeInfo.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <a 
                href={formatUrl(resumeInfo.portfolioUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
            )}
          </div>
          
          {/* Summary */}
          {resumeInfo?.summary && (
            <div>
              <p className="text-sm leading-relaxed text-gray-600 text-center max-w-3xl mx-auto">
                {resumeInfo.summary}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="px-6 pb-6 pt-2">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Skills & Education */}
            <div className="space-y-6">
              {/* Skills */}
              {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-1 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Skills
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {resumeInfo.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 text-xs rounded-md border"
                        style={{ 
                          borderColor: `${themeColor}30`,
                          color: 'gray'
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Education */}
              {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-1 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Education
                  </h3>
                  
                  <div className="space-y-3">
                    {resumeInfo.education.map((edu, index) => (
                      <div key={index} className="mb-2">
                        <h4 className="text-sm font-medium text-gray-800">
                          {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                        </h4>
                        
                        <h5 className="text-xs text-gray-600 mt-0.5 mb-0.5">
                          {edu.universityName}
                        </h5>
                        
                        <div className="text-xs text-gray-500">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </div>
                        
                        {edu.grade && (
                          <div className="text-xs text-gray-700 mt-0.5 italic">
                            {edu.gradeType}: {edu.grade}
                          </div>
                        )}
                        
                        {edu.description && (
                          <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Certifications Section */}
              {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-1 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Certifications
                  </h3>
                  
                  <div className="space-y-3">
                    {resumeInfo.certifications.map((cert, index) => (
                      <div key={index}>
                        <h4 className="text-sm font-medium text-gray-800">
                          {cert.name}
                        </h4>
                        
                        <div className="flex justify-between items-center mt-1 mb-1">
                          <h5 className="text-xs text-gray-600">
                            {cert.issuer}
                          </h5>
                          
                          {cert.credentialLink && (
                            <a 
                              href={formatUrl(cert.credentialLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs underline ml-2"
                              style={{ color: themeColor }}
                            >
                              View
                            </a>
                          )}
                        </div>
                        
                        {cert.date && (
                          <div className="text-xs text-gray-500">
                            {cert.date}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Additional Sections - Flexible and styled to match template */}
              {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
                <>
                  {resumeInfo.additionalSections.map((section, index) => (
                    <section key={index}>
                      <h3 
                        className="text-sm uppercase tracking-widest font-medium mb-1 pb-1 border-b"
                        style={{ color: themeColor, borderColor: `${themeColor}20` }}
                      >
                        {section.title}
                      </h3>
                      
                      <div className="text-sm" style={{
                        fontSize: "13px",
                        lineHeight: "1.4"
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} style={{
                          fontSize: "13px",
                          lineHeight: "1.4"
                        }} className="[&>ul]:ml-4 [&>ul]:pl-1 [&>ul>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:marker:text-gray-600 [&>p]:mb-2 [&>h4]:font-medium [&>h4]:text-sm [&>h4]:mb-1 [&>h5]:font-medium [&>h5]:text-xs [&>h5]:mb-1 [&>strong]:font-medium" />
                      </div>
                    </section>
                  ))}
                </>
              )}
            </div>
            
            {/* Right column - Experience & Projects */}
            <div className="md:col-span-2 space-y-6">
              {/* Experience */}
              {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-1 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Experience
                  </h3>
                  
                  <div className="space-y-5">
                    {resumeInfo.experience.map((exp, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex flex-wrap justify-between items-baseline mb-1">
                          <h4 className="text-base font-medium text-gray-800">
                            {exp.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                            {exp.currentlyWorking ? "Present" : exp.endDate}
                          </span>
                        </div>
                        
                        <h5 className="text-sm text-gray-600 mb-2 italic">
                          {exp.companyName}
                          {exp.city && exp.companyName ? ", " : ""}
                          {exp.city}
                          {exp.city && exp.state ? ", " : ""}
                          {exp.state}
                        </h5>
                        
                        {exp.workSummary ? (
                          <ul className="list-disc ml-4 pl-1 text-gray-700 text-[13px] leading-[1.4]">
                            {normalizeBullets(exp.workSummary).map((item, itemIndex) => (
                              <li key={itemIndex} className="mb-1">{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Projects */}
              {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-1 pb-1 border-b"
                    style={{ color: themeColor, borderColor: `${themeColor}20` }}
                  >
                    Projects
                  </h3>
                  
                  <div className="space-y-4">
                    {resumeInfo.projects.map((project, index) => (
                      <div key={index} className="mb-2">
                        <div className="flex flex-wrap justify-between items-start mb-1">
                          <h4 className="text-base font-medium text-gray-800">
                            {project.projectName}
                          </h4>
                          
                          <div className="flex gap-3 text-xs">
                            {project?.githubLink && (
                              <a 
                                href={formatUrl(project.githubLink)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="underline"
                                style={{ color: themeColor }}
                              >
                                GitHub
                              </a>
                            )}
                            
                            {project?.deployedLink && (
                              <a 
                                href={formatUrl(project.deployedLink)} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="underline"
                                style={{ color: themeColor }}
                              >
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                        
                        {project.techStack && (
                          <p className="text-xs text-gray-500 mb-1 italic">
                            {project.techStack}
                          </p>
                        )}
                        
                        {project.projectSummary ? (
                          <ul className="list-disc ml-4 pl-1 text-gray-700 text-[13px] leading-[1.4]">
                            {normalizeBullets(project.projectSummary).map((item, itemIndex) => (
                              <li key={itemIndex} className="mb-1">{item}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalCardTemplate;
