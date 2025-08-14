import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PersonalDeatailPreview from "./preview-components/PersonalDeatailPreview";
import SummeryPreview from "./preview-components/SummaryPreview";
import ExperiencePreview from "./preview-components/ExperiencePreview";
import EducationalPreview from "./preview-components/EducationalPreview";
import SkillsPreview from "./preview-components/SkillsPreview";
import ProjectPreview from "./preview-components/ProjectPreview";
import CertificationsPreview from "./preview-components/CertificationsPreview";
import AdditionalSectionsPreview from "./preview-components/AdditionalSectionsPreview"; // New import

const ModernTemplate = ({ resumeInfo }) => {
  return (
    <div
      className="shadow-xl bg-white h-full p-5 pt-6 border-t-[0.5px] rounded-md"
      style={{
        borderColor: resumeInfo?.themeColor ? resumeInfo.themeColor : "#059669",
      }}
    >
      {/* Personal Details and Summary - Unchanged */}
      <PersonalDeatailPreview resumeInfo={resumeInfo} />
      <SummeryPreview resumeInfo={resumeInfo} />
      
      {/* Rearranged Sections in the requested order */}
      
      {/* 1. Skills Section */}
      {resumeInfo?.skills && resumeInfo.skills.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
      
      {/* 2. Experience Section */}
      {resumeInfo?.experience && resumeInfo.experience.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
      
      {/* 3. Education Section */}
      {resumeInfo?.education && resumeInfo.education.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
      
      {/* 4. Projects Section */}
      {resumeInfo?.projects && resumeInfo.projects.length > 0 && <ProjectPreview resumeInfo={resumeInfo} />}
      
      {/* 5. Certifications Section */}
      {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && <CertificationsPreview resumeInfo={resumeInfo} />}
      
      {/* 6. Additional Sections */}
      <AdditionalSectionsPreview resumeInfo={resumeInfo} />
    </div>
  );
};

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

const CreativeTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#9333ea"; // Default to purple
  const themeColorTransparent80 = `${themeColor}99`;
  const themeColorTransparent50 = `${themeColor}55`;
  const themeColorTransparent20 = `${themeColor}33`;
  const themeColorTransparent10 = `${themeColor}22`;
  const themeColorTransparent05 = `${themeColor}10`;
  
  // Get first character of a string safely
  const getFirstChar = (str) => {
    return str ? str.charAt(0) : "";
  };
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Artistic header design */}
      <div className="relative">
        {/* Background gradient band */}
        <div 
          className="h-20 w-full relative"
          style={{ 
            background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColorTransparent80} 60%, ${themeColorTransparent50} 100%)` 
          }}
        >
          {/* Decorative elements */}
          <div className="absolute top-6 right-8 w-16 h-16 rounded-full" style={{ background: themeColorTransparent20 }}></div>
          <div className="absolute top-10 right-20 w-8 h-8 rounded-full" style={{ background: themeColorTransparent10 }}></div>
          <div className="absolute bottom-2 left-10 w-20 h-3 rounded-full" style={{ background: themeColorTransparent10 }}></div>
        </div>
        
        {/* Profile content - overlapping design */}
        <div className="absolute -bottom-16 left-6 right-6 flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4">
          
          {/* Name and title */}
          <div className="flex items-baseline gap-2 justify-center md:justify-start flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg font-light" style={{ color: themeColor }}>
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact info badges */}
          <div className="flex flex-wrap justify-center md:justify-end gap-1 mt-2 md:mt-0">
            {resumeInfo?.email && (
              <div 
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: themeColorTransparent10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div 
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: themeColorTransparent10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div 
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: themeColorTransparent10 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content with margin to account for overlapping header */}
      <div className="mt-20 px-6 pb-4">
        {/* Social links row */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-xs hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
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
              className="flex items-center text-xs hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          )}
          
          {resumeInfo?.portfolioUrl && (
            <a 
              href={formatUrl(resumeInfo.portfolioUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center text-xs hover:underline"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
        
        {/* Summary statement with artistic border */}
        {resumeInfo?.summary && (
          <div className="mb-4 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: themeColor }}></div>
            <p className="text-sm leading-relaxed text-gray-700 italic">"{resumeInfo.summary}"</p>
          </div>
        )}
        
        {/* Main two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Left column - Experience and Projects */}
          <div className="md:col-span-3">
            {/* Experience Section */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  EXPERIENCE
                </h3>
                
                <div>
                  {resumeInfo.experience.map((exp, index) => (
                    <div key={index} className="p-1 rounded-md mb-1" style={{ backgroundColor: `${themeColor}05` }}>
                      <div className="flex justify-between flex-wrap">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{exp.title}</h4>
                        <span className="text-xs bg-white px-2 py-0.5 rounded-full" style={{ color: themeColor, border: `1px solid ${themeColor}20` }}>
                          {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                          {exp.currentlyWorking ? "Present" : exp.endDate}
                        </span>
                      </div>
                      
                      <h5 className="text-sm font-medium mb-1">
                        {exp.companyName}
                        {(exp.city || exp.state) && exp.companyName ? " | " : ""}
                        {exp.city}
                        {exp.city && exp.state ? ", " : ""}
                        {exp.state}
                      </h5>
                      
                      {/* Work summary as bullet points */}
                      {exp.workSummary ? (
                        <div className="text-sm text-gray-700">
                          {exp.workSummary.includes('<ul>') ? (
                            <div dangerouslySetInnerHTML={{ __html: exp.workSummary }} />
                          ) : (
                            <ul className="list-disc pl-4 space-y-1">
                              {exp.workSummary.split(/\r?\n/).filter(item => item.trim()).map((item, i) => (
                                <li key={i}>{item.replace(/^[-•*]\s*/, '')}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Projects Section */}
            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  PROJECTS
                </h3>
                
                <div>
                  {resumeInfo.projects.map((project, index) => (
                    <div key={index} className="p-1 rounded-md mb-1" style={{ backgroundColor: `${themeColor}05` }}>
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{project.projectName}</h4>
                        <div className="flex gap-1">
                          {project?.githubLink && (
                            <a 
                              href={formatUrl(project.githubLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs px-2 py-0.5 rounded-full flex items-center bg-white"
                              style={{ color: themeColor, border: `1px solid ${themeColor}20` }}
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
                              className="text-xs px-2 py-0.5 rounded-full flex items-center bg-white"
                              style={{ color: themeColor, border: `1px solid ${themeColor}20` }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Demo
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {project.techStack && (
                        <p className="text-xs my-1">
                          <span className="font-semibold" style={{ color: themeColor }}>Technologies:</span> {project.techStack}
                        </p>
                      )}
                      
                      {/* Project summary as bullet points */}
                      {project.projectSummary ? (
                        <div className="text-sm text-gray-700">
                          {project.projectSummary.includes('<ul>') ? (
                            <div dangerouslySetInnerHTML={{ __html: project.projectSummary }} />
                          ) : (
                            <ul className="list-disc pl-4 space-y-1">
                              {project.projectSummary.split(/\r?\n/).filter(item => item.trim()).map((item, i) => (
                                <li key={i}>{item.replace(/^[-•*]\s*/, '')}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right column - Education, Skills, Certifications, and Additional Sections */}
          <div className="md:col-span-2">
            {/* Education Section */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  EDUCATION
                </h3>
                
                <div>
                  {resumeInfo.education.map((edu, index) => (
                    <div key={index} className="p-1 rounded-md mb-1" style={{ backgroundColor: `${themeColor}05` }}>
                      <h4 className="text-base font-bold" style={{ color: themeColor }}>
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>
                      <h5 className="text-sm text-gray-700" style={{ color: themeColor }}>
                        {edu.universityName}
                      </h5>
                      
                      <div className="flex flex-wrap justify-between mt-1 mb-1 text-xs">
                        <span className="text-gray-600">
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </span>
                        {edu.grade && (
                          <span className="px-2 py-0.5 rounded-full bg-white" style={{ color: themeColor, border: `1px solid ${themeColor}20` }}>
                            {edu.gradeType}: {edu.grade}
                          </span>
                        )}
                      </div>
                      
                      {edu.description && (
                        <p className="text-xs text-gray-700">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Skills Section with alternating styling */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
              <div className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  SKILLS
                </h3>
                
                <div className="flex flex-wrap gap-1">
                  {resumeInfo.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3 py-1 rounded-full text-xs mb-1"
                      style={{ 
                        backgroundColor: index % 2 === 0 ? themeColor : 'white',
                        color: index % 2 === 0 ? 'white' : themeColor,
                        border: index % 2 === 0 ? 'none' : `1px solid ${themeColor}`
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications Section - MOVED TO RIGHT COLUMN */}
            {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
              <div className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  CERTIFICATIONS
                </h3>
                
                <div>
                  {resumeInfo.certifications.map((cert, index) => (
                    <div key={index} className="p-1 rounded-md mb-1" style={{ backgroundColor: `${themeColor}05` }}>
                      <div className="flex justify-between items-center">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{cert.name}</h4>
                        {cert.date && (
                          <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
                            {cert.date}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium text-gray-700">{cert.issuer}</h5>
                        {cert.credentialLink && (
                          <a 
                            href={formatUrl(cert.credentialLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs inline-flex items-center hover:underline"
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
            
            {/* Additional Sections - MOVED TO RIGHT COLUMN */}
            {resumeInfo?.additionalSections && resumeInfo.additionalSections.map((section, index) => (
              <div key={index} className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  {section.title.toUpperCase()}
                </h3>
                <div className="text-sm text-gray-700 p-1 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                  <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
                </div>
              </div>
            ))}
            
            {/* Hobbies Section - If included */}
            {resumeInfo?.hobbies && (
              <div className="mb-4">
                <h3 
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{ 
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`
                  }}
                >
                  HOBBIES
                </h3>
                <div className="text-sm text-gray-700 p-1 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                  {resumeInfo.hobbies}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const MinimalistTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
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
                
                <div className="mt-1 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
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
                
                <div className="mt-1 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
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

function PreviewPage() {
  const resumeData = useSelector((state) => state.editResume.resumeData);
  
  useEffect(() => {
    console.log("PreviewPage rendered with template:", resumeData?.template);
  }, [resumeData]);
  
  // If no data yet, show placeholder
  if (!resumeData) {
    return (
      <div className="shadow-xl bg-white h-full min-h-[800px] p-5 rounded-md flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-pulse">Loading resume data...</div>
        </div>
      </div>
    );
  }
  

  const ExecutiveTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
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
                  <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
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
                  <div className="text-xs text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// Creative Modern Template - More balanced, moderately creative design
const CreativeModernTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#4b5563"; // Default to a more neutral gray
  
  // Create a lighter version of the theme color for styling
  const createLighterColor = (color, percent) => {
    return `${color}${Math.round(percent * 255).toString(16).padStart(2, '0')}`;
  };
  
  const lighterColor = createLighterColor(themeColor, 0.1); // 10% opacity for more subtle effect
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* More balanced header */}
      <div style={{ backgroundColor: lighterColor }} className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: themeColor, marginBottom: "0" }}>
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg text-gray-700 font-medium" style={{ marginTop: "0", marginBottom: "0" }}>
              {resumeInfo?.jobTitle}
            </h2>
            
            {/* Summary - smaller font size */}
            {resumeInfo?.summary && (
              <div className="max-w-lg" style={{ marginTop: "4px" }}>
                <p className="text-xs text-gray-600">{resumeInfo.summary}</p>
              </div>
            )}
          </div>
          
          {/* Contact info in a simple box */}
          <div 
            className="px-4 py-2 rounded-md shadow-sm"
            style={{ backgroundColor: "white", borderLeft: `2px solid ${themeColor}` }}
          >
            <div className="flex flex-col space-y-1">
              {resumeInfo?.email && (
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{resumeInfo.email}</span>
                </div>
              )}
              
              {resumeInfo?.phone && (
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-700">{resumeInfo.phone}</span>
                </div>
              )}
              
              {resumeInfo?.address && (
                <div className="flex items-center text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{resumeInfo.address}</span>
                </div>
              )}
              
              {/* Social Links */}
              <div className="flex items-center mt-1 gap-3">
                {resumeInfo?.linkedinUrl && (
                  <a 
                    href={formatUrl(resumeInfo.linkedinUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.githubUrl && (
                  <a 
                    href={formatUrl(resumeInfo.githubUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
                
                {resumeInfo?.portfolioUrl && (
                  <a 
                    href={formatUrl(resumeInfo.portfolioUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: themeColor }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with clean layout */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left column - Experience and Projects */}
        <div className="md:col-span-2 space-y-4">
          {/* Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-2 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Experience
              </h3>
              
              <div className="space-y-0">
                {resumeInfo.experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
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
                        
                        <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-2 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Projects
              </h3>
              
              <div className="space-y-0">
                {resumeInfo.projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                      <h4 className="text-base font-bold text-gray-800">{project.projectName}</h4>
                      <div className="flex gap-3 mt-1 md:mt-0">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex items-center hover:underline"
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
                            className="text-xs flex items-center hover:underline"
                            style={{ color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <div className="text-xs mb-1 text-gray-600">
                        <span className="font-medium">Tech Stack:</span> {project.techStack}
                      </div>
                    )}
                    
                    <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Certifications Section */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold mb-2 pb-1 border-b"
                  style={{ borderColor: `${themeColor}50`, color: themeColor }}>
                Certifications
              </h3>
              <div className="space-y-0">
                {resumeInfo.certifications.map((cert, index) => (
                  <div key={index} className="relative">
                    <div className="flex">
                      <div className="flex-shrink-0 mt-1 mr-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: themeColor }}></div>
                      </div>
                      <div className="flex-grow">
                        {/* First row: name on left, date on right */}
                        <div className="flex justify-between items-center">
                          <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                          {cert.date && (
                            <span className="text-xs text-gray-500">{cert.date}</span>
                          )}
                        </div>
                        
                        {/* Second row: issuer on left, credential link on right */}
                        <div className="flex justify-between items-center">
                          <h5 className="text-sm font-medium text-gray-600">{cert.issuer}</h5>
                          {cert.credentialLink && (
                            <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer" 
                              className="text-xs hover:underline" style={{ color: themeColor }}>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
                              </svg>
                              View
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Right column - Education, Skills, and Additional Sections */}
        <div className="space-y-4">
          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-2 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Education
              </h3>
              
              <div className="space-y-0">
                {resumeInfo.education.map((edu, index) => (
                  <div key={index}>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-xs font-medium text-gray-600">{edu.universityName}</h5>
                    
                    <div className="flex justify-between items-center mt-1 mb-1">
                      <span className="text-xs text-gray-500">
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span className="text-xs text-gray-600">
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-700 mt-1">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Skills Section with more toned down styling */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <div>
              <h3 
                className="text-lg font-bold mb-2 pb-1 border-b"
                style={{ borderColor: `${themeColor}50`, color: themeColor }}
              >
                Skills
              </h3>
              
              <div className="flex flex-wrap gap-1">
                {resumeInfo.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className="px-2 py-1 text-xs rounded-md"
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional Sections - Moved to right column */}
          {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
            <>
              {resumeInfo.additionalSections.map((section, index) => (
                <section key={index}>
                  <h3 
                    className="text-lg font-bold mb-2 pb-1 border-b"
                    style={{ borderColor: `${themeColor}50`, color: themeColor }}
                  >
                    {section.title}
                  </h3>
                  <div className="space-y-0">
                    <div 
                      className="text-sm text-gray-700" 
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    ></div>
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

// Tech Startup Template - Updated with single column layouts and reordered sections
const TechStartupTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#10b981"; // Default to emerald-500
  
  return (
    <div className="shadow-lg bg-white h-full rounded-md overflow-hidden">
      {/* Header with clean design */}
      <div className="p-4 border-b" style={{ borderColor: `${themeColor}30` }}>
        <div className="flex flex-col md:flex-row justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: themeColor }}>
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-sm font-medium text-gray-700 mb-2">
              {resumeInfo?.jobTitle}
            </h2>
            
            {/* Simple summary box */}
            {resumeInfo?.summary && (
              <div className="max-w-xl mt-1 text-sm text-gray-700">
                {resumeInfo.summary}
              </div>
            )}
          </div>
          
          {/* Contact info in a clean box */}
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-sm space-y-1">
              {resumeInfo?.email && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{resumeInfo.email}</span>
                </div>
              )}
              
              {resumeInfo?.phone && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{resumeInfo.phone}</span>
                </div>
              )}
              
              {resumeInfo?.address && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{resumeInfo.address}</span>
                </div>
              )}
              
              {/* Social profiles with icons and full URLs */}
              {resumeInfo?.githubUrl && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}>
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <a 
                    href={formatUrl(resumeInfo.githubUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm hover:underline break-all"
                    style={{ color: themeColor }}
                  >
                    {formatUrl(resumeInfo.githubUrl)}
                  </a>
                </div>
              )}
              
              {resumeInfo?.linkedinUrl && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}>
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  <a 
                    href={formatUrl(resumeInfo.linkedinUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm hover:underline break-all"
                    style={{ color: themeColor }}
                  >
                    {formatUrl(resumeInfo.linkedinUrl)}
                  </a>
                </div>
              )}
              
              {resumeInfo?.portfolioUrl && (
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a 
                    href={formatUrl(resumeInfo.portfolioUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm hover:underline break-all"
                    style={{ color: themeColor }}
                  >
                    {formatUrl(resumeInfo.portfolioUrl)}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-4 space-y-3">
        {/* Skills as simple tags */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <div className="mb-3">
            <h3 
              className="text-lg font-medium mb-2 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}30` }}
            >
              Skills
            </h3>
            
            <div className="flex flex-wrap gap-1">
              {resumeInfo.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="px-2 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: `${themeColor}15`,
                    color: themeColor
                  }}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience with cleaner timeline - Single Column */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <div className="mb-3">
            <h3 
              className="text-lg font-medium mb-2 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}30` }}
            >
              Experience
            </h3>
            
            <div className="space-y-2">
              {resumeInfo.experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-3 pb-1" style={{ borderColor: themeColor }}>
                  <div className="flex justify-between items-start flex-wrap mb-1">
                    <h4 className="text-base font-medium">{exp.title}</h4>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} {exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}
                      {exp.currentlyWorking ? "Present" : exp.endDate}
                    </span>
                  </div>
                  
                  <h5 className="text-sm text-gray-700 mb-1">
                    {exp.companyName}
                    {exp.city && exp.companyName ? ", " : ""}
                    {exp.city}
                    {exp.city && exp.state ? ", " : ""}
                    {exp.state}
                  </h5>
                  
                  <div 
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects Section with Single Column Layout */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <div className="mb-3">
            <h3 
              className="text-lg font-medium mb-2 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}30` }}
            >
              Projects
            </h3>
            
            <div className="space-y-2">
              {resumeInfo.projects.map((project, index) => (
                <div 
                  key={index} 
                  className="border-l-2 pl-3 pb-1"
                  style={{ borderColor: themeColor }}
                >
                  <div className="flex justify-between items-start flex-wrap mb-1">
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
          </div>
        )}
        
        {/* Education Section with Single Column Layout */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <div className="mb-3">
            <h3 
              className="text-lg font-medium mb-2 pb-1 border-b"
              style={{ color: themeColor, borderColor: `${themeColor}30` }}
            >
              Education
            </h3>
            
            <div className="space-y-2">
              {resumeInfo.education.map((edu, index) => (
                <div key={index} className="border-l-2 pl-3" style={{ borderColor: themeColor }}>
                  <div className="flex justify-between items-start flex-wrap mb-1">
                    <h4 className="text-base font-medium">
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                      {edu.endDate}
                    </span>
                  </div>
                  
                  {/* University name on left, CGPA on right */}
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-sm font-medium text-gray-700">
                      {edu.universityName}
                    </h5>
                    
                    {edu.grade && (
                      <div className="text-xs text-gray-600">
                        {edu.gradeType}: {edu.grade}
                      </div>
                    )}
                  </div>
                  
                  {edu.description && (
                    <p className="text-xs text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Certifications Section */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <div className="mb-3">
            <h3 className="text-lg font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: `${themeColor}30` }}>
              Certifications
            </h3>
            <div className="space-y-2">
              {resumeInfo.certifications.map((cert, index) => (
                <div key={index} className="border-l-2 pl-3" style={{ borderColor: themeColor }}>
                  {/* First row: name on left, date on right */}
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-medium" style={{ color: themeColor }}>{cert.name}</h4>
                    {cert.date && (
                      <span className="text-xs text-gray-500">{cert.date}</span>
                    )}
                  </div>
                  
                  {/* Second row: issuer on left, credential link on right */}
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm text-gray-700">{cert.issuer}</h5>
                    {cert.credentialLink && (
                      <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer" 
                         className="text-xs inline-flex items-center" style={{ color: themeColor }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

        {/* Additional Sections - Now at the end */}
        {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
          <>
            {resumeInfo.additionalSections.map((section, index) => (
              <div key={index} className="mb-3">
                <h3 
                  className="text-lg font-medium mb-2 pb-1 border-b"
                  style={{ color: themeColor, borderColor: `${themeColor}30` }}
                >
                  {section.title}
                </h3>
                
                <div className="text-sm text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

// This is the updated JSX component for the Elegant Portfolio Template
const ElegantPortfolioTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#6d28d9"; // Default to violet-700
  
  return (
    <div className="bg-white h-full rounded-md overflow-hidden shadow-md">
      {/* Simplified header */}
      <div className="p-6 border-b" style={{ borderColor: "#e5e7eb" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center md:items-end">
            {/* Name and title */}
            <div className="text-center md:text-left flex-grow">
              <h1
                className="text-4xl font-medium tracking-wide mb-1"
                style={{ color: themeColor }}
              >
                {resumeInfo?.firstName} {resumeInfo?.lastName}
              </h1>
              <h2 className="text-lg text-gray-700 uppercase tracking-wide font-medium">
                {resumeInfo?.jobTitle}
              </h2>
            </div>

            {/* Contact details */}
            <div className="flex flex-col items-center md:items-end text-sm space-y-1 text-gray-600">
              {resumeInfo?.email && (
                <div className="flex items-center gap-2">
                  <span>{resumeInfo.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {resumeInfo?.phone && (
                <div className="flex items-center gap-2">
                  <span>{resumeInfo.phone}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              )}

              {resumeInfo?.address && (
                <div className="flex items-center gap-2">
                  <span>{resumeInfo.address}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}

              {/* Social links */}
              <div className="flex items-center gap-3 mt-1">
                {resumeInfo?.linkedinUrl && (
                  <a href={formatUrl(resumeInfo.linkedinUrl)} target="_blank" rel="noopener noreferrer" style={{ color: themeColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                    </svg>
                  </a>
                )}

                {resumeInfo?.githubUrl && (
                  <a href={formatUrl(resumeInfo.githubUrl)} target="_blank" rel="noopener noreferrer" style={{ color: themeColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                )}

                {resumeInfo?.portfolioUrl && (
                  <a href={formatUrl(resumeInfo.portfolioUrl)} target="_blank" rel="noopener noreferrer" style={{ color: themeColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content in a simplified magazine layout */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        {/* Summary section */}
        {resumeInfo?.summary && (
          <div className="mb-4">
            <p className="text-base text-gray-600 text-center">{resumeInfo.summary}</p>
          </div>
        )}

        {/* Two-column layout for content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main column - experience and projects */}
          <div className="md:col-span-8 space-y-4">
            {/* Experience section */}
            {resumeInfo?.experience?.length > 0 && (
              <div>
                <h3 className="text-lg uppercase tracking-wide font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: "#e5e7eb" }}>
                  Experience
                </h3>
                <div className="space-y-3">
                  {resumeInfo.experience.map((exp, index) => (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                        <h4 className="text-base font-medium" style={{ color: themeColor }}>{exp.title}</h4>
                        <span className="text-sm text-gray-500">{exp.startDate}{exp.startDate && (exp.endDate || exp.currentlyWorking) ? " - " : ""}{exp.currentlyWorking ? "Present" : exp.endDate}</span>
                      </div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">{exp.companyName}{exp.city && exp.companyName ? ", " : ""}{exp.city}{exp.city && exp.state ? ", " : ""}{exp.state}</h5>
                      <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects section */}
            {resumeInfo?.projects?.length > 0 && (
              <div>
                <h3 className="text-lg uppercase tracking-wide font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: "#e5e7eb" }}>
                  Projects
                </h3>
                <div className="space-y-3">
                  {resumeInfo.projects.map((project, index) => (
                    <div key={index}>
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-1">
                        <h4 className="text-base font-medium" style={{ color: themeColor }}>{project.projectName}</h4>
                        <div className="flex gap-3 text-xs">
                          {project?.githubLink && <a href={formatUrl(project.githubLink)} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: themeColor }}>View Code</a>}
                          {project?.deployedLink && <a href={formatUrl(project.deployedLink)} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: themeColor }}>Live Demo</a>}
                        </div>
                      </div>
                      {project.techStack && <p className="text-xs text-gray-500 mb-1">{project.techStack}</p>}
                      <div className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications Section - MOVED TO LEFT COLUMN */}
            {resumeInfo?.certifications?.length > 0 && (
              <div>
                <h3 className="text-lg uppercase tracking-wide font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: "#e5e7eb" }}>
                  Certifications
                </h3>
                <div className="space-y-2">
                  {resumeInfo.certifications.map((cert, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-base font-medium" style={{ color: themeColor }}>{cert.name}</h4>
                        {cert.date && <span className="text-sm text-gray-500">{cert.date}</span>}
                      </div>
                      <div className="flex justify-between items-center">
                        <h5 className="text-sm font-medium text-gray-700">{cert.issuer}</h5>
                        {cert.credentialLink && (
                          <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer" className="text-xs underline inline-flex items-center" style={{ color: themeColor }}>
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
          </div>

          {/* Sidebar - education and skills */}
          <div className="md:col-span-4 space-y-4">
            {/* Education section */}
            {resumeInfo?.education?.length > 0 && (
              <div>
                <h3 className="text-lg uppercase tracking-wide font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: "#e5e7eb" }}>
                  Education
                </h3>
                <div className="space-y-2">
                  {resumeInfo.education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="text-base font-medium" style={{ color: themeColor }}>{edu.degree}{edu.major && edu.degree ? " in " : ""}{edu.major}</h4>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">{edu.universityName}</h5>
                      <p className="text-sm text-gray-500 mb-1">{edu.startDate}{edu.startDate && edu.endDate ? " - " : ""}{edu.endDate}</p>
                      {edu.grade && <p className="text-xs text-gray-600">{edu.gradeType}: {edu.grade}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills section */}
            {resumeInfo?.skills?.length > 0 && (
              <div>
                <h3 className="text-lg uppercase tracking-wide font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: "#e5e7eb" }}>
                  Skills
                </h3>
                <div className="space-y-0.5">
                  {resumeInfo.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-700">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Sections */}
            {resumeInfo?.additionalSections?.length > 0 && resumeInfo.additionalSections.map((section, index) => (
              <div className="section" key={`additional-${index}`}>
                <h3 className="text-lg uppercase tracking-wide font-medium mb-2 pb-1 border-b" style={{ color: themeColor, borderColor: "#e5e7eb" }}>
                  {section.title}
                </h3>
                <div 
                  className="text-sm text-gray-600 leading-relaxed [&>ul]:ml-4 [&>ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-2 px-6">
        <div className="max-w-xs mx-auto h-px" style={{ backgroundColor: "#e5e7eb" }}></div>
      </div>
    </div>
  );
};


// Modern Timeline Template - Clean design with emphasis on visual timeline
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


const ModernGridTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#8b5cf6"; // Default to violet-500
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Header with updated layout - Contact info moved to right side */}
      <div 
        className="pt-6 pb-2 px-4"
        style={{ backgroundColor: `${themeColor}05` }}
      >
        {/* Decorative element */}
        <div 
          className="absolute top-0 right-0 w-60 h-4"
          style={{ backgroundColor: themeColor }}
        ></div>
        
        <div className="flex justify-between">
          {/* Left side - Name and title */}
          <div className="truncate pr-4 max-w-xl">
            <h1 className="text-3xl font-bold tracking-tight mb-0.5 truncate">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 
              className="text-lg font-medium truncate"
              style={{ color: themeColor }}
            >
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Right side - Social links and contact info */}
          <div className="flex flex-col items-end space-y-2">
            {/* Social links on top */}
            <div className="flex items-center gap-3">
              {resumeInfo?.linkedinUrl && (
                <a 
                  href={formatUrl(resumeInfo.linkedinUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-white px-2 py-1 rounded"
                  style={{ backgroundColor: "#0077B5" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                  </svg>
                  <span className="ml-1 text-xs">LinkedIn</span>
                </a>
              )}
              
              {resumeInfo?.githubUrl && (
                <a 
                  href={formatUrl(resumeInfo.githubUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-white px-2 py-1 rounded"
                  style={{ backgroundColor: "#333" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="ml-1 text-xs">GitHub</span>
                </a>
              )}
              
              {resumeInfo?.portfolioUrl && (
                <a 
                  href={formatUrl(resumeInfo.portfolioUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center text-white px-2 py-1 rounded"
                  style={{ backgroundColor: themeColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="ml-1 text-xs">Portfolio</span>
                </a>
              )}
            </div>
            
            {/* Contact info below social links */}
            <div className="flex flex-col items-end space-y-1 text-sm">
              {resumeInfo?.email && (
                <div className="flex items-center">
                  <span>{resumeInfo.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {resumeInfo?.phone && (
                <div className="flex items-center">
                  <span>{resumeInfo.phone}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              )}
              
              {resumeInfo?.address && (
                <div className="flex items-center">
                  <span>{resumeInfo.address}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary section with background */}
      {resumeInfo?.summary && (
        <div 
          className="py-2 px-4"
          style={{ backgroundColor: `${themeColor}10` }}
        >
          <p className="text-sm text-gray-700 leading-relaxed">{resumeInfo.summary}</p>
        </div>
      )}
      
      {/* Main content in a SINGLE column layout */}
      <div className="p-4 space-y-4">
        {/* Skills section - FIRST */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-2 inline-block relative"
              style={{ color: themeColor }}
            >
              <span>SKILLS</span>
              <span 
                className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                style={{ backgroundColor: themeColor }}
              ></span>
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {resumeInfo.skills.map((skill, index) => (
                <div 
                  key={index} 
                  className="p-1.5 rounded-lg flex items-center"
                  style={{ 
                    backgroundColor: index % 2 === 0 ? `${themeColor}10` : `${themeColor}05`,
                  }}
                >
                  <div 
                    className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: themeColor }}
                  ></div>
                  <span className="text-sm">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Experience section - SECOND */}
        {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-2 inline-block relative"
              style={{ color: themeColor }}
            >
              <span>EXPERIENCE</span>
              <span 
                className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                style={{ backgroundColor: themeColor }}
              ></span>
            </h3>
            
            <div className="space-y-2">
              {resumeInfo.experience.map((exp, index) => (
                <div key={index} className="pb-1.5 relative">
                  {/* Add horizontal line between entries */}
                  {index < resumeInfo.experience.length - 1 && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-px"
                      style={{ backgroundColor: `${themeColor}30` }}
                    ></div>
                  )}
                  
                  <div className="flex flex-wrap justify-between mb-1">
                    <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
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
        
        {/* Projects section - THIRD */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-2 inline-block relative"
              style={{ color: themeColor }}
            >
              <span>PROJECTS</span>
              <span 
                className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                style={{ backgroundColor: themeColor }}
              ></span>
            </h3>
            
            <div className="space-y-1">
              {resumeInfo.projects.map((project, index) => (
                <div 
                  key={index} 
                  className="border-l-2 pl-2 py-1"
                  style={{ borderColor: themeColor }}
                >
                  <h4 className="text-base font-medium mb-1" style={{ color: themeColor }}>
                    {project.projectName}
                  </h4>
                  
                  {project.techStack && (
                    <div className="inline-block text-xs py-0.5 px-1.5 mb-1 rounded-md" style={{ backgroundColor: `${themeColor}10` }}>
                      {project.techStack}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600 mb-1" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                  
                  <div className="flex gap-2 text-xs">
                    {project?.githubLink && (
                      <a 
                        href={formatUrl(project.githubLink)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center hover:underline"
                        style={{ color: themeColor }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub Repository
                      </a>
                    )}
                    
                    {project?.deployedLink && (
                      <a 
                        href={formatUrl(project.deployedLink)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center hover:underline"
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
              ))}
            </div>
          </section>
        )}
        
        {/* Education section - FOURTH */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <section>
            <h3 
              className="text-lg font-bold mb-2 inline-block relative"
              style={{ color: themeColor }}
            >
              <span>EDUCATION</span>
              <span 
                className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                style={{ backgroundColor: themeColor }}
              ></span>
            </h3>
            
            <div className="space-y-1">
              {resumeInfo.education.map((edu, index) => (
                <div key={index} className="rounded-lg p-2" style={{ backgroundColor: `${themeColor}05` }}>
                  <h4 className="text-base font-medium mb-0.5">
                    {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                  </h4>
                  
                  <h5 className="text-sm text-gray-700 mb-0.5" style={{ color: themeColor }}>
                    {edu.universityName}
                  </h5>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                    <span>
                      {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                      {edu.endDate}
                    </span>
                    
                    {edu.grade && (
                      <span className="font-medium">
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
        
        {/* Certifications Section - FIFTH */}
        {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-bold mb-2 inline-block relative" style={{ color: themeColor }}>
              <span>CERTIFICATIONS</span>
              <span className="absolute bottom-0 left-0 right-0 h-1 mt-1" style={{ backgroundColor: themeColor }}></span>
            </h3>
            <div className="space-y-1">
              {resumeInfo.certifications.map((cert, index) => (
                <div key={index} className="rounded-lg p-2" style={{ backgroundColor: `${themeColor}05` }}>
                  {/* First row: name on left, date on right */}
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-medium">{cert.name}</h4>
                    {cert.date && (
                      <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: `${themeColor}10`, color: themeColor }}>
                        {cert.date}
                      </span>
                    )}
                  </div>
                  
                  {/* Second row: issuer on left, credential link on right */}
                  <div className="flex justify-between items-center">
                    <h5 className="text-sm text-gray-700" style={{ color: themeColor }}>{cert.issuer}</h5>
                    {cert.credentialLink && (
                      <a href={formatUrl(cert.credentialLink)} target="_blank" rel="noopener noreferrer" 
                         className="text-xs flex items-center hover:underline transition-colors" style={{ color: themeColor }}>
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
          </section>
        )}
        
        {/* Additional Sections - LAST */}
        {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
          <>
            {resumeInfo.additionalSections.map((section, index) => (
              <section key={index}>
                <h3 
                  className="text-lg font-bold mb-2 inline-block relative"
                  style={{ color: themeColor }}
                >
                  <span>{section.title.toUpperCase()}</span>
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-1 mt-1"
                    style={{ backgroundColor: themeColor }}
                  ></span>
                </h3>
                <div className="text-sm text-gray-700 p-1 rounded-md" style={{ backgroundColor: `${themeColor}05` }}>
                  <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
                </div>
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

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
                  
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
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
                  
                  <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
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
const GradientAccentTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#8b5cf6"; // Default to violet-500
  
  // Function to create a gradient of the theme color
  const createGradient = (color) => {
    return `linear-gradient(135deg, ${color} 0%, ${color}85 100%)`;
  };
  
  return (
    <div className="shadow-md bg-white h-full rounded overflow-hidden">
      {/* Header with Gradient */}
      <div 
        className="p-4 text-white relative"
        style={{ background: createGradient(themeColor) }}
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-2">
          {/* Name and Title */}
          <div>
            <h1 className="text-2xl font-bold">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg mt-0.5 text-white/90">
              {resumeInfo?.jobTitle}
            </h2>
          </div>
          
          {/* Contact Details */}
          <div className="space-y-1 text-sm">
            {resumeInfo?.email && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{resumeInfo.email}</span>
              </div>
            )}
            
            {resumeInfo?.phone && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}
            
            {resumeInfo?.address && (
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Social Links Bar */}
      {(resumeInfo?.linkedinUrl || resumeInfo?.githubUrl || resumeInfo?.portfolioUrl) && (
        <div className="bg-gray-100 py-1 px-4 flex flex-wrap justify-center md:justify-end gap-3">
          {resumeInfo?.linkedinUrl && (
            <a 
              href={formatUrl(resumeInfo.linkedinUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 text-sm"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
              className="flex items-center gap-1 text-sm"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
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
              className="flex items-center gap-1 text-sm"
              style={{ color: themeColor }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              Portfolio
            </a>
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-3">
        {/* Professional Summary - Reduced spacing by 70% */}
        {resumeInfo?.summary && (
          <div 
            className="mb-2 p-2 rounded relative"
            style={{ 
              backgroundColor: `${themeColor}05`,
              borderLeft: `3px solid ${themeColor}`
            }}
          >
            <h3 
              className="text-base font-bold mb-1"
              style={{ color: themeColor }}
            >
              SUMMARY
            </h3>
            <p className="text-sm text-gray-700">{resumeInfo.summary}</p>
          </div>
        )}
        
        {/* Main Two-Column Layout - Reduced gap */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {/* Left column - Experience, Projects, Additional Sections */}
          <div className="md:col-span-2">
            {/* Experience Section - First */}
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div className="mb-2">
                <h3 
                  className="text-base font-bold mb-1 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  EXPERIENCE
                </h3>
                
                <div className="space-y-1">
                  {resumeInfo.experience.map((exp, index) => (
                    <div 
                      key={index} 
                      className="relative pl-2 pb-1"
                      style={{ borderLeft: `2px solid ${themeColor}30` }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-0.5 gap-1">
                        <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                        <span 
                          className="text-xs inline-flex items-center px-2 py-0.5 rounded"
                          style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                        >
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
                      
                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: exp.workSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Projects Section - Second with removed card format */}
            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div className="mb-2">
                <h3 
                  className="text-base font-bold mb-1 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  PROJECTS
                </h3>
                
                <div className="space-y-1">
                  {resumeInfo.projects.map((project, index) => (
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-base font-bold text-gray-800">
                          {project.projectName}
                        </h4>
                        
                        <div className="flex gap-2">
                          {project?.githubLink && (
                            <a 
                              href={formatUrl(project.githubLink)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs flex items-center"
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
                              className="text-xs flex items-center"
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
                        <div className="mb-1">
                          <span 
                            className="text-xs px-2 py-0.5 rounded inline-block"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                          >
                            {project.techStack}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: project.projectSummary }}></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Additional Sections - Now in left column */}
            {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
              <>
                {resumeInfo.additionalSections.map((section, index) => (
                  <div key={index} className="mb-2">
                    <h3 
                      className="text-base font-bold mb-1 pb-1 border-b"
                      style={{ borderColor: `${themeColor}40`, color: themeColor }}
                    >
                      {section.title.toUpperCase()}
                    </h3>
                    <div>
                      <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {/* Right column - Education, Skills, Certifications */}
          <div className="md:col-span-1 space-y-3">
            {/* Education Section */}
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div>
                <h3 
                  className="text-lg font-bold mb-2 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  EDUCATION
                </h3>
                
                <div className="space-y-2">
                  {resumeInfo.education.map((edu, index) => (
                    <div 
                      key={index} 
                      className="p-2 rounded mb-1"
                      style={{ backgroundColor: `${themeColor}05` }}
                    >
                      <h4 
                        className="text-base font-medium tracking-wide"
                        style={{ color: themeColor }}
                      >
                        {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                      </h4>
                      
                      <h5 className="text-base font-medium text-gray-700 mb-1 mt-1">
                        {edu.universityName}
                      </h5>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500 mt-1">
                        <span>
                          {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                          {edu.endDate}
                        </span>
                        
                        {edu.grade && (
                          <span className="font-medium">
                            {edu.gradeType}: {edu.grade}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Skills Section */}
            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
              <div>
                <h3 
                  className="text-lg font-bold mb-2 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  SKILLS
                </h3>
                
                <div className="flex flex-wrap gap-2">
                  {resumeInfo.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className="px-3 py-1.5 text-base rounded tracking-wide"
                      style={{ 
                        backgroundColor: `${themeColor}15`,
                        color: themeColor
                      }}
                    >
                      {skill.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Certifications Section - Moved to Right Column */}
            {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
              <div>
                <h3 
                  className="text-lg font-bold mb-2 pb-1 border-b"
                  style={{ borderColor: `${themeColor}40`, color: themeColor }}
                >
                  CERTIFICATIONS
                </h3>
                
                <div className="space-y-2">
                  {resumeInfo.certifications.map((cert, index) => (
                    <div 
                      key={index} 
                      className="p-2 rounded mb-1"
                      style={{ backgroundColor: `${themeColor}05` }}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                        {cert.date && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-md"
                            style={{ backgroundColor: `${themeColor}10`, color: themeColor }}
                          >
                            {cert.date}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <h5 className="text-sm font-medium text-gray-700">{cert.issuer}</h5>
                        {cert.credentialLink && (
                          <a 
                            href={formatUrl(cert.credentialLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs inline-flex items-center hover:underline"
                            style={{ color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

const BoldImpactTemplate = ({ resumeInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#000000"; // Default to black
  
  return (
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Header section - removed accent bars */}
      <div className="pt-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 px-6">
          {/* Name and title with extra large sizing */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-1 text-gray-900">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-xl font-medium text-gray-600 mb-3">
              {resumeInfo?.jobTitle}
            </h2>
            
            {/* Summary statement */}
            {resumeInfo?.summary && (
              <div className="max-w-2xl pr-4 mb-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {resumeInfo.summary}
                </p>
              </div>
            )}
          </div>
          
          {/* Contact information in a container */}
          <div 
            className="px-5 py-4 mb-4 rounded text-right"
            style={{ 
              backgroundColor: `${themeColor}08`
            }}
          >
            <div className="space-y-2">
              {resumeInfo?.email && (
                <div className="flex items-center justify-end text-sm gap-2">
                  <span className="text-gray-700">{resumeInfo.email}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {resumeInfo?.phone && (
                <div className="flex items-center justify-end text-sm gap-2">
                  <span className="text-gray-700">{resumeInfo.phone}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              )}
              
              {resumeInfo?.address && (
                <div className="flex items-center justify-end text-sm gap-2">
                  <span className="text-gray-700">{resumeInfo.address}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: themeColor }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>
            
            {/* Social icons in a row */}
            <div className="flex justify-end gap-3 mt-3">
              {resumeInfo?.linkedinUrl && (
                <a 
                  href={formatUrl(resumeInfo.linkedinUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-110"
                  style={{ color: themeColor }}
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
                  className="transition-transform hover:scale-110"
                  style={{ color: themeColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              )}
              
              {resumeInfo?.portfolioUrl && (
                <a 
                  href={formatUrl(resumeInfo.portfolioUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="transition-transform hover:scale-110"
                  style={{ color: themeColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content with grid layout */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Left column - 8 cols */}
        <div className="md:col-span-8 space-y-2">
          {/* Experience Section */}
          {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: themeColor }}
              >
                EXPERIENCE
              </h3>
              
              <div className="space-y-1.5">
                {resumeInfo.experience.map((exp, index) => (
                  <div 
                    key={index} 
                    className="p-2 rounded-md"
                    style={{ backgroundColor: `${themeColor}05` }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-bold text-gray-800">{exp.title}</h4>
                      <span 
                        className="text-xs px-3 py-1 rounded font-medium"
                        style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                      >
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
                    
                    <div 
                      className="text-sm text-gray-600 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Projects Section - Removed card format */}
          {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: themeColor }}
              >
                PROJECTS
              </h3>
              
              <div className="space-y-4">
                {resumeInfo.projects.map((project, index) => (
                  <div key={index} className="mb-2 border-b" style={{ borderColor: `${themeColor}10` }}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-base font-bold text-gray-800">{project.projectName}</h4>
                      
                      <div className="flex gap-2">
                        {project?.githubLink && (
                          <a 
                            href={formatUrl(project.githubLink)} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex items-center gap-1 px-2 py-0.5 rounded transition-transform hover:scale-105"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
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
                            className="text-xs flex items-center gap-1 px-2 py-0.5 rounded transition-transform hover:scale-105"
                            style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {project.techStack && (
                      <div 
                        className="inline-block text-xs mb-1 font-mono"
                        style={{ color: themeColor }}
                      >
                        {project.techStack}
                      </div>
                    )}
                    
                    <div 
                      className="text-sm text-gray-600 leading-relaxed" 
                      dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                    ></div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications Section - Moved to left column */}
          {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: themeColor }}
              >
                CERTIFICATIONS
              </h3>
              
              <div className="space-y-1.5">
                {resumeInfo.certifications.map((cert, index) => (
                  <div 
                    key={index} 
                    className="p-2 rounded-md"
                    style={{ backgroundColor: `${themeColor}05` }}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-base font-bold text-gray-800">{cert.name}</h4>
                      {cert.date && (
                        <span 
                          className="text-xs px-3 py-1 rounded font-medium"
                          style={{ backgroundColor: `${themeColor}20`, color: themeColor }}
                        >
                          {cert.date}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-700">{cert.issuer}</h5>
                      {cert.credentialLink && (
                        <a 
                          href={formatUrl(cert.credentialLink)} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs flex items-center gap-1.5 hover:underline"
                          style={{ color: themeColor }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        
        {/* Right column - 4 cols */}
        <div className="md:col-span-4 space-y-2">
          {/* Skills Section */}
          {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: themeColor }}
              >
                SKILLS
              </h3>
              
              <div className="space-y-1">
                {resumeInfo.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 rounded-md"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? `${themeColor}05` : `${themeColor}10`
                    }}
                  >
                    <div 
                      className="w-2 h-2 rounded-sm mr-2"
                      style={{ backgroundColor: themeColor }}
                    ></div>
                    <span className="text-sm text-gray-700">{skill.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Education Section */}
          {resumeInfo?.education && resumeInfo.education.length > 0 && (
            <section>
              <h3 
                className="text-xl font-bold mb-1"
                style={{ color: themeColor }}
              >
                EDUCATION
              </h3>
              
              <div className="space-y-1.5">
                {resumeInfo.education.map((edu, index) => (
                  <div 
                    key={index} 
                    className="p-2 relative rounded-md"
                    style={{ backgroundColor: `${themeColor}05` }}
                  >
                    <h4 className="text-sm font-bold mb-0.5" style={{ color: themeColor }}>
                      {edu.degree} {edu.major && edu.degree ? "in " : ""}{edu.major}
                    </h4>
                    
                    <h5 className="text-sm font-medium text-gray-700 mb-0.5">
                      {edu.universityName}
                    </h5>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-0.5">
                      <span>
                        {edu.startDate} {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate}
                      </span>
                      
                      {edu.grade && (
                        <span 
                          className="px-2 py-0.5 rounded-md text-xs"
                          style={{ backgroundColor: `${themeColor}15`, color: themeColor }}
                        >
                          {edu.gradeType}: {edu.grade}
                        </span>
                      )}
                    </div>
                    
                    {edu.description && (
                      <p className="text-xs text-gray-600 mt-0.5">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Additional Sections - Moved to right column */}
          {resumeInfo?.additionalSections && resumeInfo.additionalSections.length > 0 && (
            <>
              {resumeInfo.additionalSections.map((section, index) => (
                <section key={index}>
                  <h3 
                    className="text-xl font-bold mb-1"
                    style={{ color: themeColor }}
                  >
                    {section.title.toUpperCase()}
                  </h3>
                  
                  <div 
                    className="p-2 rounded-md space-y-1"
                    style={{ backgroundColor: `${themeColor}05` }}
                  >
                    <div 
                      className="text-sm text-gray-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    ></div>
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
            <p className="text-sm text-gray-600 leading-relaxed">
              {resumeInfo.summary}
            </p>
          </div>
        )}
      </div>
      
      {/* Main content */}
      <div className="px-6">
        {/* Technical Skills - Now FIRST with single column layout */}
        {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
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
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
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
                    index < resumeInfo.experience.length - 1 ? "mb-3 pb-3 border-b" : ""
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
                  
                  <div 
                    className="text-sm text-gray-600 mt-2" 
                    dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Projects - Now THIRD */}
        {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
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
                    index < resumeInfo.projects.length - 1 ? "mb-3 pb-3 border-b" : ""
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
                  
                  <div 
                    className="text-sm text-gray-600 mt-1" 
                    dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                  ></div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Education - Now FOURTH */}
        {resumeInfo?.education && resumeInfo.education.length > 0 && (
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
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
                    index < resumeInfo.education.length - 1 ? "mb-3 pb-3 border-b" : ""
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
          <section className="py-4 border-b" style={{ borderColor: `${themeColor}20` }}>
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
                    index < resumeInfo.certifications.length - 1 ? "mb-3 pb-3 border-b" : ""
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
                className={`py-4 ${index < resumeInfo.additionalSections.length - 1 ? "border-b" : ""}`}
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
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                        ></div>
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
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                        ></div>
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
          
          {/* Horizontal divider with accent color */}
          <div className="h-px w-16 mx-auto my-3" style={{ backgroundColor: themeColor }}></div>
          
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
            <div className="mb-2">
              <p className="text-sm leading-relaxed text-gray-600 text-center max-w-3xl mx-auto">
                {resumeInfo.summary}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Skills & Education */}
            <div className="space-y-6">
              {/* Skills */}
              {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4 pb-1 border-b"
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
                    className="text-sm uppercase tracking-widest font-medium mb-4 pb-1 border-b"
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
                    className="text-sm uppercase tracking-widest font-medium mb-4 pb-1 border-b"
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
                        className="text-sm uppercase tracking-widest font-medium mb-4 pb-1 border-b"
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
                    className="text-sm uppercase tracking-widest font-medium mb-4 pb-1 border-b"
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
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: exp.workSummary }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Projects */}
              {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
                <section>
                  <h3 
                    className="text-sm uppercase tracking-widest font-medium mb-4 pb-1 border-b"
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
                        
                        <div 
                          className="text-sm text-gray-700" 
                          dangerouslySetInnerHTML={{ __html: project.projectSummary }}
                        ></div>
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


  // Render the appropriate template based on the template property
  const renderTemplate = () => {
    switch(resumeData?.template) {
      case "professional":
        return <ProfessionalTemplate resumeInfo={resumeData} />;
      case "creative":
        return <CreativeTemplate resumeInfo={resumeData} />;
      case "minimalist":
        return <MinimalistTemplate resumeInfo={resumeData} />;
      case "executive":
        return <ExecutiveTemplate resumeInfo={resumeData} />;
      case "creative-modern":
        return <CreativeModernTemplate resumeInfo={resumeData} />;
      case "tech-startup":
        return <TechStartupTemplate resumeInfo={resumeData} />;
      case "elegant-portfolio":
        return <ElegantPortfolioTemplate resumeInfo={resumeData} />;
      case "modern-timeline":
        return <ModernTimelineTemplate resumeInfo={resumeData} />;
      case "modern-grid":
        return <ModernGridTemplate resumeInfo={resumeData} />;
      case "modern-sidebar":
        return <ModernSidebarTemplate resumeInfo={resumeData} />;
      case "gradient-accent":
        return <GradientAccentTemplate resumeInfo={resumeData} />;
      case "bold-impact":
        return <BoldImpactTemplate resumeInfo={resumeData} />;
      case "split-frame":
        return <SplitFrameTemplate resumeInfo={resumeData} />;
      case "minimalist-pro":
        return <MinimalistProTemplate resumeInfo={resumeData} />;
      case "digital-card":
        return <DigitalCardTemplate resumeInfo={resumeData} />;
      case "modern":
      default:
        return <ModernTemplate resumeInfo={resumeData} />;
    }
  };
  
  return renderTemplate();
}

export default PreviewPage;
