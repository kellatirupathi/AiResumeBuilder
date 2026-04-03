import React from "react";

const ModernTimelineTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
   if (!url) return null;
   if (!/^https?:\/\//i.test(url)) {
     return `https://${url}`;
   }
   return url;
 };

 const themeColor = resumeInfo?.themeColor || "#333333"; // Default to dark gray
 
 return (
   <div className="bg-white h-full rounded-md overflow-hidden border border-gray-200">
     {/* Header section with clean design */}
     <div className="p-3">
       {/* Name and title */}
       <div className="text-center mb-2">
         <h1 className="text-2xl font-bold mb-0.5">
           {resumeInfo?.firstName} {resumeInfo?.lastName}
         </h1>
         <h2 className="text-lg text-gray-600 mb-1">
           {resumeInfo?.jobTitle}
         </h2>
         
         {/* Contact information in a row */}
         <div className="flex flex-wrap justify-center gap-2 mb-2 text-sm">
           {resumeInfo?.email && (
             <div className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
               </svg>
               <span>{resumeInfo.email}</span>
             </div>
           )}
           
           {resumeInfo?.phone && (
             <div className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
               </svg>
               <span>{resumeInfo.phone}</span>
             </div>
           )}
           
           {resumeInfo?.address && (
             <div className="flex items-center">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
          
          {/* Social links */}
          <div className="flex justify-center gap-2 text-sm">
            {resumeInfo?.linkedinUrl && (
              <a 
                href={formatUrl(resumeInfo.linkedinUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-blue-600 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
                LinkedIn
              </a>
            )}
            
            {resumeInfo?.githubUrl && (
              <a 
                href={formatUrl(resumeInfo.githubUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-gray-800 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            
            {resumeInfo?.portfolioUrl && (
              <a 
                href={formatUrl(resumeInfo.portfolioUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center text-green-600 hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Portfolio
              </a>
            )}
          </div>
        </div>
        
        {/* Summary */}
        {resumeInfo?.summary && (
          <div className="mt-2 text-sm text-gray-700 border-t border-gray-200 pt-2">
            <p>{resumeInfo.summary}</p>
          </div>
        )}
      </div>
      
      {/* Main content area with two columns on larger screens */}
      <div className="p-3 grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Left column - Experience and Education */}
        <div className="md:col-span-7 space-y-2">
          {/* Experience section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">
                Experience
              </h3>
              
              <div className="space-y-2">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="mb-1.5">
                    <div className="flex flex-wrap justify-between mb-0.5">
                      <h4 className="text-base font-bold">{exp.title}</h4>
                      <span className="text-sm text-gray-600">
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-1">
                      {exp.companyName}
                      {exp.city && exp.companyName ? ", " : ""}
                      {exp.city}
                      {exp.city && exp.state ? ", " : ""}
                      {exp.state}
                    </h5>
                    
                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">
                Projects
              </h3>
              
              <div className="space-y-1.5">
                {resumeInfo.projects.map((project, index) => (
                  <div key={index} className="mb-1.5">
                    <div className="flex flex-wrap justify-between mb-1">
                      <h4 className="text-base font-medium">{project.projectName}</h4>
                      
                      <div className="flex items-center space-x-2">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs inline-flex items-center text-gray-600 hover:text-gray-900"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="currentColor" viewBox="0 0 24 24">
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
                            className="text-xs inline-flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <div className="text-xs text-gray-500 mb-1">
                        <span className="font-medium">Tech Stack: </span>{project.techStack}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications Section for ModernTimelineTemplate */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">
                Certifications
              </h3>
              <div className="space-y-1.5">
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="mb-1.5">
                    {/* First row: name on left, date on right */}
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-medium">{cert.name}</h4>
                      {cert.date && (
                        <span className="text-sm text-gray-600">{cert.date}</span>
                      )}
                    </div>
                    
                    {/* Second row: issuer on left, credential link on right */}
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-700">{cert.issuer}</h5>
                      {cert.credentialLink && (
                        <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer" 
                          className="text-xs inline-flex items-center text-blue-600 hover:underline">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        </div>
        
        {/* Right column - Skills, Education */}
        <div className="md:col-span-5 space-y-2">
          {/* Skills section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">
                Skills
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {resumeInfo.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
          
          {/* Education section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">
                Education
              </h3>
              
              <div className="space-y-1.5">
                {resumeInfo.education.map((edu, index) => (
                  <div key={index} className="mb-1.5">
                    <h4 className="text-base font-medium mb-0.5">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-sm text-gray-700 mb-0.5">
                      {edu.universityName}
                    </h5>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-0.5">
                      <span>
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span>
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Additional Sections - Now styled to match template */}
          {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
            <>
              {resumeInfo.additionalSections.map((section, index) => (
                <section key={index}>
                  <h3 className="text-lg font-bold mb-2 pb-1 border-b border-gray-200">
                    {section.title}
                  </h3>
                  <div className="text-sm text-gray-600">
                    <div dangerouslySetInnerHTML={{ __html: section.content }} 
                         className="mb-1.5 [&>ul]:ml-4 [&>ul]:list-disc [&>ul]:pl-1 [&>ul>li]:mb-0.5 [&>p]:mb-1.5 [&>h4]:text-base [&>h4]:font-medium [&>h4]:mb-0.5 [&>h5]:text-sm [&>h5]:text-gray-700 [&>h5]:mb-0.5" />
                  </div>
                </section>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTimelineTemplate;
