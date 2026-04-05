const CreativeTemplate = ({ resumeInfo }) => {
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = resumeInfo?.themeColor || "#9333ea";
  const themeColorTransparent10 = `${themeColor}22`;

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
    <div className="shadow-xl bg-white h-full rounded-md overflow-hidden">
      {/* Header design */}
      <div className="relative">
        <div className="relative mx-6 mt-4 flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg px-6 py-4">
          <div className="flex items-baseline gap-2 justify-center md:justify-start flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">
              {resumeInfo?.firstName} {resumeInfo?.lastName}
            </h1>
            <h2 className="text-lg font-light" style={{ color: themeColor }}>
              {resumeInfo?.jobTitle}
            </h2>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end gap-1 mt-2 md:mt-0">
            {resumeInfo?.email && (
              <div
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: themeColorTransparent10 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: themeColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{resumeInfo.email}</span>
              </div>
            )}

            {resumeInfo?.phone && (
              <div
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: themeColorTransparent10 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: themeColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{resumeInfo.phone}</span>
              </div>
            )}

            {resumeInfo?.address && (
              <div
                className="text-xs px-3 py-1 rounded-full flex items-center"
                style={{ backgroundColor: themeColorTransparent10 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  style={{ color: themeColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{resumeInfo.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 px-6 pb-4">
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
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
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
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12z" />
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

        {resumeInfo?.summary && (
          <div className="mb-4 pl-4 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: themeColor }}></div>
            <ul className="list-disc pl-4 space-y-1 text-sm leading-relaxed text-gray-700 italic">
              {normalizeBullets(resumeInfo.summary).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-3">
            {resumeInfo?.experience && resumeInfo.experience.length > 0 && (
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  EXPERIENCE
                </h3>

                <div>
                  {resumeInfo.experience.map((exp, index) => (
                    <div key={index} className="p-1 rounded-md mb-1">
                      <div className="flex justify-between flex-wrap">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>
                          {exp.title}
                        </h4>
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

                      {exp.workSummary ? (
                        <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                          {normalizeBullets(exp.workSummary).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resumeInfo?.projects && resumeInfo.projects.length > 0 && (
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  PROJECTS
                </h3>

                <div>
                  {resumeInfo.projects.map((project, index) => (
                    <div key={index} className="p-1 rounded-md mb-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>
                          {project.projectName}
                        </h4>
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
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
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

                      {project.projectSummary ? (
                        <ul className="list-disc pl-4 space-y-1 text-sm text-gray-700">
                          {normalizeBullets(project.projectSummary).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            {resumeInfo?.education && resumeInfo.education.length > 0 && (
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  EDUCATION
                </h3>

                <div>
                  {resumeInfo.education.map((edu, index) => (
                    <div key={index} className="p-1 rounded-md mb-1">
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

            {resumeInfo?.skills && resumeInfo.skills.length > 0 && (
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  SKILLS
                </h3>

                <div className="flex flex-wrap gap-1">
                  {resumeInfo.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs mb-1 bg-white"
                      style={{
                        color: themeColor,
                        border: `1px solid ${themeColor}30`,
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {resumeInfo?.certifications && resumeInfo.certifications.length > 0 && (
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  CERTIFICATIONS
                </h3>

                <div>
                  {resumeInfo.certifications.map((cert, index) => (
                    <div key={index} className="p-1 rounded-md mb-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-base font-bold" style={{ color: themeColor }}>{cert.name}</h4>
                        {cert.date && (
                          <span className="text-xs px-2 py-0.5 rounded-md" style={{ backgroundColor: themeColorTransparent10, color: themeColor }}>
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

            {resumeInfo?.additionalSections && resumeInfo.additionalSections.map((section, index) => (
              <div key={index} className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  {section.title.toUpperCase()}
                </h3>
                <div className="text-sm text-gray-700 p-1 rounded-md">
                  <div dangerouslySetInnerHTML={{ __html: section.content }}></div>
                </div>
              </div>
            ))}

            {resumeInfo?.hobbies && (
              <div className="mb-4">
                <h3
                  className="text-lg font-bold mb-2 pb-1 inline-block"
                  style={{
                    color: themeColor,
                    borderBottom: `2px solid ${themeColor}`,
                  }}
                >
                  HOBBIES
                </h3>
                <div className="text-sm text-gray-700 p-1 rounded-md">
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

export default CreativeTemplate;
