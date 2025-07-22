import React from "react";

function ExperiencePreview({ resumeInfo }) {
  // Helper function to properly check if currentlyWorking is true
  const isCurrentlyWorking = (experience) => {
    // Check different possible values that might indicate "currently working"
    return (
      experience?.currentlyWorking === true || 
      experience?.currentlyWorking === "true" ||
      experience?.currentlyWorking === "Present" ||
      experience?.currentlyWorking === "yes"
    );
  };

  // Helper function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      // Extract just the date part if it's a full ISO string
      const parts = dateString.split('T')[0].split('-');
      if (parts.length !== 3) return dateString;
      
      const [year, month, day] = parts;
      
      // Return in MMM YYYY format
      const date = new Date(year, month - 1, day);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="my-3">
      {resumeInfo?.experience?.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            EXPERIENCE
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}

      {resumeInfo?.experience?.map((experience, index) => (
        <div key={index} className={index === 0 ? "mt-1 mb-2" : "mb-2"}>
          <h2
            className="text-sm font-bold"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            {experience?.title}
          </h2>
          <h2 className="text-xs flex justify-between">
            {experience?.companyName}
            {experience?.companyName && experience?.city ? ", " : null}
            {experience?.city}
            {experience?.city && experience?.state ? ", " : null}
            {experience?.state}
            <span>
              {formatDate(experience?.startDate)}{" "}
              {experience?.startDate && (
                <>
                  {isCurrentlyWorking(experience) 
                    ? "- Present" 
                    : experience?.endDate 
                      ? `- ${formatDate(experience.endDate)}` 
                      : ""
                  }
                </>
              )}
            </span>
          </h2>
          <div
            className="text-xs mt-1 rsw-ce"
            dangerouslySetInnerHTML={{ __html: experience?.workSummary || "" }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;
