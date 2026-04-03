import React from "react";
import PersonalDeatailPreview from "../preview-components/PersonalDeatailPreview";
import SummeryPreview from "../preview-components/SummaryPreview";
import ExperiencePreview from "../preview-components/ExperiencePreview";
import EducationalPreview from "../preview-components/EducationalPreview";
import SkillsPreview from "../preview-components/SkillsPreview";
import ProjectPreview from "../preview-components/ProjectPreview";
import CertificationsPreview from "../preview-components/CertificationsPreview";
import AdditionalSectionsPreview from "../preview-components/AdditionalSectionsPreview";

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

export default ModernTemplate;
