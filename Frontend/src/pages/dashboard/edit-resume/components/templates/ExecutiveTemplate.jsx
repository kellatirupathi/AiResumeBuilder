import React from "react";

const ExecutiveTemplate = ({ resumeInfo }) => {
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

const themeColor = resumeInfo?.themeColor || "#1c2434"; // Default to a deep navy

return (
  <div className="shadow-xl bg-white h-full rounded-md overflow-hidden flex">
    {/* Sidebar - Left side (25% width) */}
    <div className="w-1/4 bg-gray-50 min-h-screen py-8 px-6">
      {/* Initials */}
      <div 
        className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold mb-6 mx-auto"
        style={{ backgroundColor: themeColor }}
      >
        <span>
          {resumeInfo?.firstName?.charAt(0) || ""}
          {resumeInfo?.lastName?.charAt(0) || ""}
        </span>
      </div>
      
      <div className="space-y-6">
        {/* Contact Section */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
            Contact
          </h3>
          
          {resumeInfo?.phone && (
            <div className="flex gap-2 items-start text-xs">
              <svg className="w-3 h-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-gray-700">{resumeInfo.phone}</span>
            </div>
          )}
          
          {resumeInfo?.email && (
            <div className="flex gap-2 items-start text-xs">
              <svg className="w-3 h-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700">{resumeInfo.email}</span>
            </div>
          )}
          
          {resumeInfo?.address && (
            <div className="flex gap-2 items-start text-xs">
              <svg className="w-3 h-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">{resumeInfo.address}</span>
            </div>
          )}
        </div>
        
        {/* Social Links Section */}
        {(resumeInfo?.githubUrl || resumeInfo?.linkedinUrl || resumeInfo?.portfolioUrl) && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
              Online Profiles
            </h3>
            
            {resumeInfo?.linkedinUrl && (
              <div className="flex gap-2 items-start text-xs">
                <svg className="w-3 h-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}>
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
                <a href={formatUrl(resumeInfo.linkedinUrl)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                  LinkedIn Profile
                </a>
              </div>
            )}
            
            {resumeInfo?.githubUrl && (
              <div className="flex gap-2 items-start text-xs">
                <svg className="w-3 h-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <a href={formatUrl(resumeInfo.githubUrl)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                  GitHub Profile
                </a>
              </div>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <div className="flex gap-2 items-start text-xs">
                <svg className="w-3 h-3 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <a href={formatUrl(resumeInfo.portfolioUrl)} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">
                  Portfolio Website
                </a>
              </div>
            )}
          </div>
        )}

        {/* Skills Section */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
              Key Skills
            </h3>
            <div>
              {resumeInfo.skills.map((skill, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                  <span className="text-xs text-gray-700">{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications Section */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
              Certifications
            </h3>
            <div>
              {resumeInfo.certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: themeColor }}></div>
                  <div>
                    <div className="text-xs font-medium text-gray-700">{cert.name}</div>
                    <div className="text-xs text-gray-600">{cert.issuer}</div>
                    {cert.date && <div className="text-xs text-gray-500">{cert.date}</div>}
                    {cert.credentialLink && (
                      <div className="flex items-start gap-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
                        </svg>
                        <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-600 hover:underline">View</a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections Preview in Sidebar */}
        {resumeInfo?.additionalSections?.length > 0 && resumeInfo.additionalSections.map((section, index) => (
          <div className="space-y-3" key={index}>
            <h3 className="text-xs uppercase tracking-wider font-semibold pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}40` }}>
              {section.title}
            </h3>
            <div 
              className="text-xs text-gray-700 leading-relaxed [&>ul]:ml-2 [&>ul]:list-disc [&>ul]:pl-1" 
              dangerouslySetInnerHTML={{ __html: section.content }} 
            />
          </div>
        ))}

      </div>
    </div>
    
    {/* Main content - 75% width */}
    <div className="w-3/4 p-8">
      <div className="pb-6 mb-6 border-b" style={{ borderColor: `${themeColor}30` }}>
        <h1 className="text-2xl font-bold tracking-wide mb-1" style={{ color: themeColor }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>
        <h2 className="text-lg font-medium uppercase tracking-wide text-gray-600">
          {resumeInfo?.jobTitle}
        </h2>
      </div>
      
      {resumeInfo?.summary && (
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-3" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.25rem' }}>Summary</h3>
          <p className="text-sm leading-relaxed text-gray-700">{resumeInfo.summary}</p>
        </div>
      )}
      
      {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.25rem' }}>Experience</h3>
          <div className="space-y-5">
            {resumeInfo.experience.map((exp, index) => (
              <div key={index} className="relative pl-5">
                <div className="absolute top-1.5 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-800">{exp.title}</h4>
                  <span className="text-xs text-gray-500">{exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}{exp.currentlyWorking ? "Present" : exp.endDate}</span>
                </div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">{exp.companyName}{exp.city && exp.companyName ? ", " : ""}{exp.city}{exp.city && exp.state ? ", " : ""}{exp.state}</h5>
                {exp.workSummary ? (
                  <ul className="pl-5 list-disc space-y-1 text-xs text-gray-700">
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
      
      {resumeInfo?.education && resumeInfo.education.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.25rem' }}>Education</h3>
          <div className="space-y-4">
            {resumeInfo.education.map((edu, index) => (
              <div key={index} className="relative pl-5">
                <div className="absolute top-1.5 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-800">{edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}</h4>
                  <span className="text-xs text-gray-500">{edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}</span>
                </div>
                <h5 className="text-xs font-medium text-gray-600 mb-1">{edu.universityName}</h5>
                {edu.grade && <div className="text-xs text-gray-600 mb-1">{edu.gradeType}: {edu.grade}</div>}
                {edu.description && <div className="text-xs text-gray-700">{edu.description}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
        <div>
          <h3 className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: themeColor, borderBottom: `1px solid ${themeColor}40`, paddingBottom: '0.25rem' }}>Projects</h3>
          <div className="space-y-4">
            {resumeInfo.projects.map((project, index) => (
              <div key={index} className="relative pl-5">
                <div className="absolute top-1.5 left-0 w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-bold text-gray-800">{project.projectName}</h4>
                  <div className="flex gap-3">
                    {project?.githubLink && (
                      <a href={formatUrl(project.githubLink)} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center" style={{ color: themeColor }}>
                        <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Code
                      </a>
                    )}
                    {project?.deployedLink && (
                      <a href={formatUrl(project.deployedLink)} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center" style={{ color: themeColor }}>
                        <svg className="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Demo
                      </a>
                    )}
                  </div>
                </div>
                {project.techStack && <div className="text-xs text-gray-600 mb-1"><span className="font-medium">Technologies:</span> {project.techStack}</div>}
                {project.projectSummary ? (
                  <ul className="pl-5 list-disc space-y-1 text-xs text-gray-700">
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

    </div>
  </div>
);
};

export default ExecutiveTemplate;
