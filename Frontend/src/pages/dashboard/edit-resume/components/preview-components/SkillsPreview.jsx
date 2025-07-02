// Updated SkillsPreview Component
import React from "react";

function SkillsPreview({ resumeInfo }) {
  return (
    <div className="my-3">
      {resumeInfo?.skills.length > 0 && (
        <div>
          <h2
            className="text-center font-bold text-sm mb-1"
            style={{
              color: resumeInfo?.themeColor,
            }}
          >
            SKILLS
          </h2>
          <hr
            style={{
              borderColor: resumeInfo?.themeColor,
            }}
          />
        </div>
      )}
      {/* Changed to flex-col to stack skills vertically */}
      <div className="flex flex-col mt-1">
        {resumeInfo?.skills.map((skill, index) => (
          <div key={index} className="text-xs mb-0.5">
            {skill.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillsPreview;