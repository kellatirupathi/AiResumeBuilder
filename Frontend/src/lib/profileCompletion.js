export function getProfileCompletionDetails(profile = {}) {
  const normalizedProfile =
    profile && typeof profile === "object" ? profile : {};

  const checks = [
    {
      key: "personal_details",
      label: "Personal Details",
      complete: Boolean(
        (normalizedProfile.firstName || normalizedProfile.fullName) &&
          normalizedProfile.email
      ),
    },
    {
      key: "summary",
      label: "Professional Summary",
      complete: Boolean(normalizedProfile.summary?.trim()),
    },
    {
      key: "experience",
      label: "Work Experience",
      complete: Array.isArray(normalizedProfile.experience) && normalizedProfile.experience.length > 0,
    },
    {
      key: "projects",
      label: "Projects",
      complete: Array.isArray(normalizedProfile.projects) && normalizedProfile.projects.length > 0,
    },
    {
      key: "education",
      label: "Education",
      complete: Array.isArray(normalizedProfile.education) && normalizedProfile.education.length > 0,
    },
    {
      key: "skills",
      label: "Skills",
      complete: Array.isArray(normalizedProfile.skills) && normalizedProfile.skills.length > 0,
    },
    {
      key: "certifications",
      label: "Certifications",
      complete:
        Array.isArray(normalizedProfile.certifications) &&
        normalizedProfile.certifications.length > 0,
    },
    {
      key: "additional_sections",
      label: "Additional Sections",
      complete:
        Array.isArray(normalizedProfile.additionalSections) &&
        normalizedProfile.additionalSections.length > 0,
    },
  ];

  const completedCount = checks.filter((check) => check.complete).length;
  const percentage = Math.round((completedCount / checks.length) * 100);

  return {
    percentage,
    completedCount,
    totalCount: checks.length,
    missingSections: checks.filter((check) => !check.complete).map((check) => check.label),
  };
}
