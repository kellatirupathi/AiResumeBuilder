import React from "react";

// Professional template - Enhanced executive layout matching HTML design
const ProfessionalTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#333333"; // Matching HTML default color

  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden" style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      lineHeight: "1.5",
      color: "#333"
    }}>
      {/* Header Section - Centered like HTML */}
      <div className="p-5 pt-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-1" style={{
          fontSize: "24px",
          color: "#333",
          margin: "0 0 5px 0"
        }}>
          {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h1>

        {resumeInfo?.jobTitle && (
          <h2 className="text-base font-normal mb-2" style={{
            fontSize: "16px",
            fontWeight: "normal",
            margin: "5px 0 10px 0",
            color: "#555"
          }}>
            {resumeInfo.jobTitle}
          </h2>
        )}

        {/* Contact Information Row - Centered like HTML */}
        <div className="flex justify-center flex-wrap gap-4 mb-3 text-sm" style={{ fontSize: "13px" }}>
          {resumeInfo?.email && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>{resumeInfo.email}</span>
            </div>
          )}

          {resumeInfo?.phone && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>{resumeInfo.phone}</span>
            </div>
          )}

          {resumeInfo?.address && (
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{resumeInfo.address}</span>
            </div>
          )}
        </div>

        {/* Social Links Row - Centered like HTML */}
        <div className="flex justify-center gap-4 mb-3 text-sm" style={{ fontSize: "13px" }}>
          {resumeInfo?.linkedinUrl && (
            <a href={formatUrl(resumeInfo.linkedinUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-gray-900 no-underline" style={{ color: "#333" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
          )}

          {resumeInfo?.githubUrl && (
            <a href={formatUrl(resumeInfo.githubUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-gray-900 no-underline" style={{ color: "#333" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              <span>GitHub</span>
            </a>
          )}

          {resumeInfo?.portfolioUrl && (
            <a href={formatUrl(resumeInfo.portfolioUrl)} target="_blank" rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-gray-900 no-underline" style={{ color: "#333" }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              <span>Portfolio</span>
            </a>
          )}
        </div>
      </div>

      {/* Two Column Layout - Matching HTML structure */}
      <div className="flex">
        {/* Main Column - Left side (65% width like HTML) */}
        <div className="w-3/5 px-5 pb-5" style={{ width: "65%" }}>
          {/* Summary Section */}
          {resumeInfo?.summary && (
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0 0 10px 0",
                paddingBottom: "5px",
                borderBottom: "1px solid #ddd",
                color: "#333"
              }}>
                Summary
              </h3>
              <p className="text-sm leading-relaxed" style={{
                fontSize: "13px",
                lineHeight: "1.4",
                marginBottom: "15px"
              }}>{resumeInfo.summary}</p>
            </div>
          )}

          {/* Work Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0 0 10px 0",
                paddingBottom: "5px",
                borderBottom: "1px solid #ddd",
                color: "#333"
              }}>
                Work Experience
              </h3>

              <div>
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="mb-3 relative" style={{
                    marginBottom: "12px",
                    position: "relative",
                    paddingLeft: "2px"
                  }}>

                    <div className="flex justify-between items-start mb-1" style={{ marginBottom: "5px" }}>
                      <h4 className="text-base font-bold" style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0"
                      }}>{exp.title}</h4>
                      <span className="text-xs text-gray-600" style={{
                        fontSize: "12px",
                        color: "#666"
                      }}>
                        {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                        {exp.currentlyWorking ? "Present" : exp.endDate}
                      </span>
                    </div>

                    <p className="text-sm mb-1" style={{
                      fontSize: "13px",
                      margin: "2px 0"
                    }}>
                      {exp.companyName}
                      {exp.city && exp.companyName ? ", " : ""}
                      {exp.city}
                      {exp.city && exp.state ? ", " : ""}
                      {exp.state}
                    </p>

                    {/* Work Summary with proper bullet points styling */}
                    <div className="text-sm" style={{
                      fontSize: "13px",
                      lineHeight: "1.4"
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: exp.workSummary }} style={{
                        fontSize: "13px",
                        lineHeight: "1.4"
                      }} className="[&>ul]:ml-4 [&>ul]:pl-1 [&>ul>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:marker:text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0 0 10px 0",
                paddingBottom: "5px",
                borderBottom: "1px solid #ddd",
                color: "#333"
              }}>
                Projects
              </h3>

              <div>
                {resumeInfo.projects.map((project, index) => (
                  <div key={index} className="mb-3" style={{ marginBottom: "12px" }}>
                    <div className="flex justify-between items-start mb-1" style={{ marginBottom: "5px" }}>
                      <h4 className="text-base font-bold" style={{
                        fontSize: "15px",
                        fontWeight: "bold",
                        margin: "0"
                      }}>{project.projectName}</h4>

                      <div className="flex gap-2">
                        {project?.githubLink && (
                          <a href={formatUrl(project.githubLink)} target="_blank" rel="noopener noreferrer"
                            className="text-xs flex items-center text-gray-600 hover:text-gray-900 no-underline" style={{
                              fontSize: "12px",
                              color: "#555",
                              textDecoration: "none"
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                            Code
                          </a>
                        )}

                        {project?.deployedLink && (
                          <a href={formatUrl(project.deployedLink)} target="_blank" rel="noopener noreferrer"
                            className="text-xs flex items-center text-gray-600 hover:text-gray-900 no-underline" style={{
                              fontSize: "12px",
                              color: "#555",
                              textDecoration: "none"
                            }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                              <polyline points="15 3 21 3 21 9"/>
                              <line x1="10" y1="14" x2="21" y2="3"/>
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>

                    {project.techStack && (
                      <p className="text-xs text-gray-600 mb-1" style={{
                        fontSize: "12px",
                        color: "#666",
                        margin: "2px 0 4px 0"
                      }}>
                        <strong>Technologies:</strong> {project.techStack}
                      </p>
                    )}

                    {/* Project Summary with proper bullet points styling */}
                    <div className="text-sm" style={{
                      fontSize: "13px",
                      lineHeight: "1.4"
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: project.projectSummary }} style={{
                        fontSize: "13px",
                        lineHeight: "1.4"
                      }} className="[&>ul]:ml-4 [&>ul]:pl-1 [&>ul>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:marker:text-gray-600" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Side Column - Right side (35% width like HTML with background) */}
        <div className="w-2/5 px-5 pb-5 bg-gray-50" style={{
          width: "35%",
          backgroundColor: "#f9f9f9",
          paddingLeft: "10px",
          paddingRight: "20px",
          paddingBottom: "20px"
        }}>
          {/* Skills Section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0 0 10px 0",
                paddingBottom: "5px",
                borderBottom: "1px solid #ddd",
                color: "#333"
              }}>
                Skills
              </h3>

              <div className="flex flex-wrap gap-2">
                {resumeInfo.skills.map((skill, index) => (
                  <span key={index} className="inline-block text-xs px-2 py-1 bg-gray-100 rounded-xl border border-gray-300" style={{
                    fontSize: "12px",
                    padding: "5px 10px",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "15px",
                    border: "1px solid #ddd"
                  }}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0 0 10px 0",
                paddingBottom: "5px",
                borderBottom: "1px solid #ddd",
                color: "#333"
              }}>
                Education
              </h3>

              <div>
                {resumeInfo.education.map((edu, index) => (
                  <div key={index} className="mb-2" style={{ marginBottom: "10px" }}>
                    <h4 className="text-sm font-bold mb-1" style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 2px 0"
                    }}>
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>

                    <p className="text-xs mb-1" style={{
                      fontSize: "13px",
                      margin: "0 0 2px 0"
                    }}>{edu.universityName}</p>

                    <div>
                      <span className="text-xs text-gray-600 inline-block mr-2" style={{
                        fontSize: "12px",
                        color: "#666",
                        display: "inline-block",
                        marginRight: "10px"
                      }}>
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>

                      {edu.grade && (
                        <span className="text-xs text-gray-600 inline-block" style={{
                          fontSize: "12px",
                          color: "#666",
                          display: "inline-block"
                        }}>
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Section */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <div className="mb-4">
              <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                fontSize: "16px",
                fontWeight: "bold",
                textTransform: "uppercase",
                margin: "0 0 10px 0",
                paddingBottom: "5px",
                borderBottom: "1px solid #ddd",
                color: "#333"
              }}>
                Certifications
              </h3>

              <div>
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="mb-2 relative" style={{
                    marginBottom: "10px",
                    position: "relative",
                    paddingLeft: "2px"
                  }}>

                    <h4 className="text-sm font-bold mb-1" style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      margin: "0 0 2px 0"
                    }}>{cert.name}</h4>

                    <p className="text-xs mb-1" style={{
                      fontSize: "13px",
                      margin: "0 0 2px 0"
                    }}>{cert.issuer}</p>

                    <div>
                      {cert.date && (
                        <span className="text-xs text-gray-600 inline-block mr-2" style={{
                          fontSize: "12px",
                          color: "#666"
                        }}>{cert.date}</span>
                      )}

                      {cert.credentialLink && (
                        <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-gray-600 hover:text-gray-900 no-underline" style={{
                            fontSize: "12px",
                            color: "#555",
                            textDecoration: "none"
                          }}>
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Sections - Styled to match template */}
          {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
            <>
              {resumeInfo.additionalSections.map((section, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-base font-bold uppercase mb-2 pb-1 border-b border-gray-300" style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    margin: "0 0 10px 0",
                    paddingBottom: "5px",
                    borderBottom: "1px solid #ddd",
                    color: "#333"
                  }}>
                    {section.title}
                  </h3>

                  <div className="text-sm" style={{
                    fontSize: "13px",
                    lineHeight: "1.4"
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} style={{
                      fontSize: "13px",
                      lineHeight: "1.4"
                    }} className="[&>ul]:ml-4 [&>ul]:pl-1 [&>ul>li]:mb-1 [&>ul>li]:list-disc [&>ul>li]:marker:text-gray-600 [&>p]:mb-2 [&>h4]:font-bold [&>h4]:text-sm [&>h4]:mb-1 [&>h5]:font-medium [&>h5]:text-xs [&>h5]:mb-1 [&>strong]:font-bold" />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
