import React from "react";

const MinimalistProTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#374151"; // Default to gray-700

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
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Name and title */}
          <div className="mb-2 text-center">
            <h1 className="text-4xl font-light tracking-wide mb-2 text-gray-900">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <div className="h-px w-16 mx-auto my-3" style={{ backgroundColor: themeColor }}></div>
            <h2 className="text-lg uppercase tracking-widest text-gray-500 font-light">
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact row - removed gap-y-2 */}
          <div className="flex flex-wrap justify-center gap-x-8 text-xs text-gray-500 mb-4">
            {resumeInfo?.email && (
              <a href={`mailto:${resumeInfo.email}`} className="hover:text-gray-800 transition-colors">
                {resumeInfo.email}
              </a>
            )}
            
            {resumeInfo?.phone && (
              <a href={`tel:${resumeInfo.phone}`} className="hover:text-gray-800 transition-colors">
                {resumeInfo.phone}
              </a>
            )}
            
            {resumeInfo?.address && (
              <span>{resumeInfo.address}</span>
            )}
            
            {resumeInfo?.linkedinUrl && (
              <a 
                href={formatUrl(resumeInfo.linkedinUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-800 transition-colors"
              >
                LinkedIn
              </a>
            )}
            
            {resumeInfo?.githubUrl && (
              <a 
                href={formatUrl(resumeInfo.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-800 transition-colors"
              >
                GitHub
              </a>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <a 
                href={formatUrl(resumeInfo.portfolioUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-gray-800 transition-colors"
              >
                Portfolio
              </a>
            )}
          </div>
          
          {/* Summary - reduced mb-10 to mb-4 */}
          {resumeInfo?.summary && (
            <div className="mb-0">
              <p className="text-sm leading-relaxed text-gray-600 text-center max-w-3xl mx-auto">
                {resumeInfo.summary}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Thin divider */}
      <div className="h-px w-full max-w-5xl mx-auto" style={{ backgroundColor: `${themeColor}20` }}></div>
      
      {/* Main content */}
      <div className="p-4 pt-2">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left column - Skills & Education */}
            <div>
              {/* Skills - improved format with categories */}
              {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <section className="mb-6">
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Skills
                  </h3>
                  
                  <div className="flex flex-wrap gap-2">
                    {resumeInfo.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700 inline-block"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Education */}
              {resumeInfo?.education && resumeInfo.education.length > 0 && (
                <section className="mb-6">
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Education
                  </h3>
                  
                  <div>
                    {resumeInfo.education.map((edu, index) => (
                      <div key={index} className="mb-4">
                        <h4 className="text-sm font-medium text-gray-800">
                          {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                        </h4>
                        
                        <h5 className="text-xs text-gray-600 mt-1 mb-1">
                          {edu.universityName}
                        </h5>
                        
                        <div className="text-xs text-gray-500">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </div>
                        
                        {edu.grade && (
                          <div className="text-xs text-gray-700 mt-1 italic">
                            {edu.gradeType}: {edu.grade}
                          </div>
                        )}
                        
                        {edu.description && (
                          <p className="text-xs text-gray-600 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Certifications Section - with credential link on same row as issuer */}
              {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
                <section className="mb-6">
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Certifications
                  </h3>
                  
                  <div>
                    {resumeInfo.certifications.map((cert, index) => (
                      <div key={index} className="mb-4">
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
              
              {/* Additional Sections - Now properly styled to match other sections */}
              {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
                <>
                  {resumeInfo.additionalSections.map((section, index) => (
                    <section className="mb-6" key={index}>
                      <h3 
                        className="text-sm uppercase tracking-widest font-medium mb-4"
                        style={{ color: themeColor }}
                      >
                        {section.title}
                      </h3>
                      <div 
                        className="text-xs text-gray-700"
                        dangerouslySetInnerHTML={{ __html: section.content }}
                      />
                    </section>
                  ))}
                </>
              )}
            </div>
            
            {/* Right column - Experience & Projects */}
            <div className="md:col-span-2">
              {/* Experience */}
              {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
                <section className="mb-6">
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Experience
                  </h3>
                  
                  <div>
                    {resumeInfo.experience.map((exp, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap justify-between items-baseline mb-1">
                          <h4 className="text-base font-medium text-gray-800">
                            {exp.title}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                            {exp.currentlyWorking ? "Present" : exp.endDate}
                          </span>
                        </div>
                        
                        <h5 className="text-sm text-gray-600 mb-3 italic">
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
                    className="text-sm uppercase tracking-widest font-medium mb-4"
                    style={{ color: themeColor }}
                  >
                    Projects
                  </h3>
                  
                  <div>
                    {resumeInfo.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <div className="flex flex-wrap justify-between items-start mb-2">
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
                          <p className="text-xs text-gray-500 mb-2 italic">
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

export default MinimalistProTemplate;
