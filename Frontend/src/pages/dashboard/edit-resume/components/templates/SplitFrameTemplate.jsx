import React from "react";

const SplitFrameTemplate = ({ resumeInfo }) => {
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
    <div className="shadow-sm bg-white h-full rounded-md overflow-hidden">
      {/* Header with accent color */}
      <div className="p-6 border-b-2" style={{ borderColor: themeColor }}>
        <div className="flex flex-col md:flex-row justify-between">
          {/* Name and title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 
              className="text-lg font-medium"
              style={{ color: themeColor }}
            >
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact information */}
          <div className="mt-3 md:mt-0 text-right space-y-1 text-sm">
            {resumeInfo?.email && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-700">{resumeInfo.email}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-700">{resumeInfo.phone}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-center justify-end gap-2">
                <span className="text-gray-700">{resumeInfo.address}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Social links - Show full URLs instead of icons */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-3 text-xs">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline"
              style={{ color: themeColor }}
            >
              {formatUrl(resumeInfo.linkedinUrl)}
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline"
              style={{ color: themeColor }}
            >
              {formatUrl(resumeInfo.githubUrl)}
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:underline"
              style={{ color: themeColor }}
            >
              {formatUrl(resumeInfo.portfolioUrl)}
            </a>
          )}
        </div>
        
        {/* Summary */}
        {resumeInfo?.summary && (
          <div className="mt-3">
            <p className="text-sm text-gray-600 leading-snug">
              {resumeInfo.summary}
            </p>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="px-6">
        {/* Technical Skills - Now FIRST with single column layout */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <section className="py-1 border-b" style={{ borderColor: `${themeColor}20` }}>
            <h3 
              className="text-base font-bold mb-3"
              style={{ color: themeColor }}
            >
              Technical Skills
            </h3>
            
            <div className="flex flex-col">
              {resumeInfo.skills.map((skill, index) => (
                <span>
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}
        
        {/* Professional Experience - Now SECOND */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <section className="py-1 border-b" style={{ borderColor: `${themeColor}20` }}>
            <h3 
              className="text-base font-bold mb-3"
              style={{ color: themeColor }}
            >
              Experience
            </h3>
            
            <div>
              {resumeInfo.experience.map((exp, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.experience.length - 1 ? "mb-3" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <h4 className="text-base font-bold text-gray-800">
                      {exp.title}
                    </h4>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                    >
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm font-medium text-gray-700 mt-1">
                    {exp.companyName}
                    {exp.city && exp.companyName ? ", " : ""}
                    {exp.city}
                    {exp.city && exp.state ? ", " : ""}
                    {exp.state}
                  </h5>
                  
                  {exp.workSummary ? (
                    <ul className="list-disc ml-4 pl-1 text-gray-600 mt-1 text-[13px] leading-[1.4]" style={{ marginTop: 4, marginBottom: 0 }}>
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
        
        {/* Projects - Now THIRD */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <section className="py-1 border-b" style={{ borderColor: `${themeColor}20` }}>
            <h3 
              className="text-base font-bold mb-3"
              style={{ color: themeColor }}
            >
              Projects
            </h3>
            
            <div>
              {resumeInfo.projects.map((project, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.projects.length - 1 ? "mb-3" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <h4 className="text-base font-bold text-gray-800">
                      {project.projectName}
                    </h4>
                    <div className="flex gap-2">
                      {project?.githubLink && (
                        <a 
                          href={formatUrl(project.githubLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs border rounded px-2 py-0.5 flex items-center gap-1"
                          style={{ color: themeColor, borderColor: `${themeColor}30` }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
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
                          className="text-xs rounded px-2 py-0.5 flex items-center gap-1 text-white"
                          style={{ backgroundColor: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Demo
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {project.techStack && (
                    <div className="text-xs mt-1">
                      <span className="font-medium" style={{ color: themeColor }}>Tech:</span> {project.techStack}
                    </div>
                  )}
                  
                  {project.projectSummary ? (
                    <ul className="list-disc ml-4 pl-1 text-gray-600 mt-1 text-[13px] leading-[1.4]" style={{ marginTop: 4, marginBottom: 0 }}>
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
        
        {/* Education - Now FOURTH */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <section className="py-1 border-b" style={{ borderColor: `${themeColor}20` }}>
            <h3 
              className="text-base font-bold mb-3"
              style={{ color: themeColor }}
            >
              Education
            </h3>
            
            <div>
              {resumeInfo.education.map((edu, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.education.length - 1 ? "mb-3" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex flex-wrap justify-between">
                    <div>
                      <h4 className="text-base font-bold text-gray-800">
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>
                      <h5 className="text-sm font-medium text-gray-700 mt-1">
                        {edu.universityName}
                      </h5>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <span className="text-xs text-gray-500">
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span 
                          className="text-xs px-2 py-0.5 rounded-full mt-1"
                          style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                        >
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {edu.description && (
                    <p className="text-xs text-gray-600 mt-1">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Certifications - Now FIFTH */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <section className="py-1 border-b" style={{ borderColor: `${themeColor}20` }}>
            <h3 
              className="text-base font-bold mb-3"
              style={{ color: themeColor }}
            >
              Certifications
            </h3>
            
            <div>
              {resumeInfo.certifications.map((cert, index) => (
                <div 
                  key={index} 
                  className={`${
                    index < resumeInfo.certifications.length - 1 ? "mb-3" : ""
                  }`}
                  style={{ borderColor: `${themeColor}10` }}
                >
                  <div className="flex justify-between items-start flex-wrap">
                    <h4 className="text-base font-bold text-gray-800">
                      {cert.name}
                    </h4>
                    {cert.date && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                      >
                        {cert.date}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <h5 className="text-sm font-medium text-gray-700">
                      {cert.issuer}
                    </h5>
                    
                    {cert.credentialLink && (
                      <a 
                        href={formatUrl(cert.credentialLink)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs px-2 py-0.5 flex items-center gap-1"
                        style={{ color: themeColor }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          </section>
        )}
        
        {/* Additional Sections - LAST */}
        {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
          <>
            {resumeInfo.additionalSections.map((section, index) => (
              <section 
                key={index} 
                className={`py-1 ${index < resumeInfo.additionalSections.length - 1 ? "border-b" : ""}`}
                style={{ borderColor: `${themeColor}20` }}
              >
                <h3 
                  className="text-base font-bold mb-3"
                  style={{ color: themeColor }}
                >
                  {section.title}
                </h3>
                
                <div 
                  className="text-sm text-gray-600"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                ></div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SplitFrameTemplate;
