import React from "react";

const MinimalistTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
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

  const themeColor = resumeInfo?.themeColor || "#2c3e50"; // Default darker blue color
  
  return (
    <div className="bg-white h-full rounded-md overflow-hidden p-5">
      {/* Header Section - Name and Contact Info */}
      <div className="text-center mb-3">
        <h1 className="text-2xl font-bold mb-1" style={{ color: themeColor }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        
        {/* Location and Contact Row */}
        <div className="flex justify-center flex-wrap text-sm text-gray-600 gap-2 mb-1">
          {resumeInfo?.address && (
            <span className="flex items-center">
              {resumeInfo.address}
            </span>
          )}
          
          {resumeInfo?.email && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {resumeInfo.email}
            </span>
          )}
          
          {resumeInfo?.phone && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {resumeInfo.phone}
            </span>
          )}
        </div>
        
        {/* Social Links */}
        <div className="flex justify-center gap-3 text-sm">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
          )}
          
          {resumeInfo?.githubUrl && (
            <a 
              href={formatUrl(resumeInfo.githubUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </a>
          )}
        </div>
      </div>
      
      {/* Horizontal Line */}
      <div className="border-b border-gray-300 mb-3"></div>
      
      {/* Professional Summary - ATS-friendly section */}
      <div className="mb-3">
        <h2 className="text-base font-bold uppercase mb-1" style={{ color: themeColor }}>
          Summary
        </h2>
        {resumeInfo?.summary && (
          <p className="text-sm leading-relaxed text-gray-700">{resumeInfo.summary}</p>
        )}
      </div>
      
      {/* Technical Skills Section - ATS-friendly */}
      {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold uppercase mb-1 border-b border-gray-300 pb-1" style={{ color: themeColor }}>
            Technical Skills
          </h2>
          
          <div className="flex flex-wrap gap-1 mt-1">
            {resumeInfo.skills.map((skill, index) => (
              <div key={index} className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {skill.name}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Experience Section - ATS keyword rich */}
      {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold uppercase mb-1 border-b border-gray-300 pb-1" style={{ color: themeColor }}>
            Experience
          </h2>
          
          <div>
            {resumeInfo.experience.map((exp, index) => (
              <div key={index} className="mb-2 mt-1">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="text-base font-bold text-gray-800">
                    {exp.title} | {exp.companyName}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {exp.city}{exp.city && exp.state ? ", " : ""}{exp.state} | {exp.startDate} - {exp.currentlyWorking ? "Present" : exp.endDate}
                  </div>
                </div>
                
                {exp.workSummary ? (
                  <ul className="mt-1 pl-5 list-disc space-y-1 text-sm text-gray-700">
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
      
      {/* Projects Section - Highlighting technical achievements */}
      {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold uppercase mb-1 border-b border-gray-300 pb-1" style={{ color: themeColor }}>
            Projects
          </h2>
          
          <div>
            {resumeInfo.projects.map((project, index) => (
              <div key={index} className="mb-2 mt-1">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="text-base font-bold text-gray-800">{project.projectName}</h3>
                  <div className="flex gap-2">
                    {project?.githubLink && (
                      <a 
                        href={formatUrl(project.githubLink)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        GitHub
                      </a>
                    )}
                    {project?.deployedLink && (
                      <a 
                        href={formatUrl(project.deployedLink)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-sm text-gray-600 hover:text-gray-800"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                </div>
                
                {project.techStack && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-bold">Tech:</span> {project.techStack}
                  </p>
                )}
                
                {project.projectSummary ? (
                  <ul className="mt-1 pl-5 list-disc space-y-1 text-sm text-gray-700">
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
      
      {/* Education Section */}
      {resumeInfo?.education && resumeInfo.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold uppercase mb-1 border-b border-gray-300 pb-1" style={{ color: themeColor }}>
            Education
          </h2>
          
          <div>
            {resumeInfo.education.map((edu, index) => (
              <div key={index} className="mb-2 mt-1">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="text-base font-bold text-gray-800">
                    {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                  </h3>
                  <div className="text-sm text-gray-600">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700" style={{ margin: "0.1rem 0" }}>{edu.universityName}</p>
                
                {edu.grade && (
                  <p className="text-sm text-gray-600" style={{ margin: "0.1rem 0" }}>
                    {edu.gradeType}: {edu.grade}
                  </p>
                )}
                
                {edu.description && (
                  <p className="text-sm text-gray-600" style={{ margin: "0.1rem 0" }}>{edu.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Certifications Section */}
      {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-base font-bold uppercase mb-1 border-b border-gray-300 pb-1" style={{ color: themeColor }}>
            Certifications
          </h2>
          
          <div>
            {resumeInfo.certifications.map((cert, index) => (
              <div key={index} className="mb-2 mt-1">
                <div className="flex flex-wrap justify-between items-center">
                  <h3 className="text-base font-medium text-gray-800">{cert.name}</h3>
                  {cert.date && <span className="text-sm text-gray-600">{cert.date}</span>}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-700">{cert.issuer}</p>
                  
                  {cert.credentialLink && (
                    <a 
                      href={formatUrl(cert.credentialLink)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      View
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional Sections */}
      {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
        <>
          {resumeInfo.additionalSections.map((section, index) => (
            <div className="section mb-3" key={index}>
              <h2 className="text-base font-bold uppercase mb-1 border-b border-gray-300 pb-1" style={{ color: themeColor }}>
                {section.title}
              </h2>
              <div className="section-content mt-1">
                <div
                  className="text-sm leading-relaxed text-gray-700 rsw-ce"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MinimalistTemplate;
