import { AIChatSession } from "@/Services/AiModel";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tryParseJson = (value = "") => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const toReadableAssistantText = (value) => {
  if (typeof value === "string") {
    return value.trim();
  }

  if (Array.isArray(value)) {
    return value
      .map((item, index) => `${index + 1}. ${toReadableAssistantText(item)}`)
      .join("\n");
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  const preferredKeys = [
    "professionalSummary",
    "summary",
    "message",
    "response",
    "answer",
    "content",
    "optimizedSummary",
    "reason",
  ];

  for (const key of preferredKeys) {
    const candidate = value[key];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  const sections = Object.entries(value)
    .map(([key, entry]) => {
      if (typeof entry === "string") {
        return entry.trim() ? `${entry.trim()}` : "";
      }

      if (Array.isArray(entry) && entry.length) {
        const label = key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (char) => char.toUpperCase());
        const items = entry
          .map((item, index) => `${index + 1}. ${toReadableAssistantText(item)}`)
          .join("\n");
        return `${label}:\n${items}`;
      }

      return "";
    })
    .filter(Boolean);

  return sections.join("\n\n").trim();
};

const normalizeAssistantResponse = (text = "") => {
  const trimmedText = text.trim();
  const parsed = tryParseJson(trimmedText);

  if (!parsed) {
    return trimmedText;
  }

  return toReadableAssistantText(parsed) || trimmedText;
};

const normalizeSummaryResponse = (text = "") => {
  const trimmedText = text.trim();
  const parsed = tryParseJson(trimmedText);

  if (!parsed) {
    return trimmedText;
  }

  if (typeof parsed.professionalSummary === "string" && parsed.professionalSummary.trim()) {
    return parsed.professionalSummary.trim();
  }

  if (typeof parsed.summary === "string" && parsed.summary.trim()) {
    return parsed.summary.trim();
  }

  return toReadableAssistantText(parsed) || trimmedText;
};

const safeJson = async (prompt) => {
  const result = await AIChatSession.sendMessage(prompt);
  return JSON.parse(result.response.text());
};

export const getProfileContext = (profile = {}) => {
  const skills = Array.isArray(profile.skills)
    ? profile.skills.map((skill) => skill?.name).filter(Boolean)
    : [];

  return {
    name:
      [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
      profile.fullName ||
      "Candidate",
    jobTitle: profile.jobTitle || "",
    summary: stripHtml(profile.summary || ""),
    skills,
    experience: Array.isArray(profile.experience)
      ? profile.experience.map((item) => ({
          title: item?.title || "",
          companyName: item?.companyName || "",
          location: [item?.city, item?.state].filter(Boolean).join(", "),
          startDate: item?.startDate || "",
          endDate: item?.currentlyWorking ? "Present" : item?.endDate || "",
          workSummary: stripHtml(item?.workSummary || ""),
        }))
      : [],
    projects: Array.isArray(profile.projects)
      ? profile.projects.map((item) => ({
          projectName: item?.projectName || "",
          techStack: item?.techStack || "",
          projectSummary: stripHtml(item?.projectSummary || ""),
          githubLink: item?.githubLink || "",
          deployedLink: item?.deployedLink || "",
        }))
      : [],
    educationCount: Array.isArray(profile.education) ? profile.education.length : 0,
    certificationsCount: Array.isArray(profile.certifications)
      ? profile.certifications.length
      : 0,
  };
};

export async function generateAiSummary(profile, targetRole = "") {
  const context = getProfileContext(profile);
  const effectiveTargetRole = targetRole.trim() || context.jobTitle || "General software role";
  const summaryContext = {
    ...context,
    jobTitle: effectiveTargetRole,
  };
  const prompt = `You are writing a polished professional summary for a resume profile.

Target role: ${effectiveTargetRole}

Candidate profile JSON:
${JSON.stringify(summaryContext, null, 2)}

Important:
- Use the target role above as the primary role for this summary.
- If the original profile job title differs, do not write the summary for that old title.
- Align the wording, opening line, and closing line to the target role.

Write a concise 3-5 sentence professional summary in plain text. Keep it ATS-friendly, specific, and credible. Do not use markdown, bullets, quotes, or JSON.`;

  const result = await AIChatSession.sendMessage(prompt);
  return normalizeSummaryResponse(result.response.text());
}

export async function enhanceExperienceWithAi(profile, experienceItem, targetRole = "") {
  const context = getProfileContext(profile);
  const effectiveTargetRole = targetRole.trim() || experienceItem?.title || "General software role";
  const prompt = `Return valid JSON only with this exact shape:
{
  "title": "string",
  "workSummary": "string",
  "impactQuestions": ["string", "string", "string"]
}

Task:
- Rewrite the work summary into strong resume-ready HTML bullet points using <ul><li>...</li></ul>.
- Keep claims realistic and grounded in the provided details.
- Improve the job title only if needed for clarity.
- Ask up to 3 sharp follow-up questions that would help quantify impact.

Target role: ${effectiveTargetRole}

Important:
- Use the experience item's own title as the primary role context.
- Do not fall back to the Personal Details job title unless it was explicitly entered as the target role.

Experience item to enhance:
${JSON.stringify(
    {
      ...experienceItem,
      workSummary: stripHtml(experienceItem?.workSummary || ""),
    },
    null,
    2
  )}`;

  return safeJson(prompt);
}

export async function generateExperienceWithAi(experienceItem) {
  const prompt = `Return valid JSON only with this exact shape:
{
  "title": "string",
  "workSummary": "string"
}

Task:
- Generate a strong resume-ready work summary in HTML bullet points using <ul><li>...</li></ul>.
- Base the output only on the experience item data provided below.
- Use the experience title as the primary role context.
- Do not use or infer a role from Personal Details or any external profile job title.
- Keep claims realistic, specific, and ATS-friendly.
- If details are limited, write concise but credible bullets without inventing fake metrics.

Experience item:
${JSON.stringify(
    {
      ...experienceItem,
      workSummary: stripHtml(experienceItem?.workSummary || ""),
    },
    null,
    2
  )}`;

  return safeJson(prompt);
}

export async function enhanceProjectWithAi(profile, projectItem, targetRole = "") {
  const effectiveTargetRole = targetRole.trim() || projectItem?.projectName || "General software project";
  const prompt = `Return valid JSON only with this exact shape:
{
  "projectSummary": "string",
  "impactQuestions": ["string", "string", "string"]
}

Task:
- Rewrite the project description into strong resume-ready HTML bullet points using <ul><li>...</li></ul>.
- Highlight problem solved, technical decisions, and outcome.
- Keep the content truthful to the provided information.
- Ask up to 3 follow-up questions to uncover missing impact or scale details.

Target role: ${effectiveTargetRole}

Important:
- Use the project item's own name and tech stack as the primary context.
- Do not fall back to the Personal Details job title unless it was explicitly entered as the target role.

Project item to enhance:
${JSON.stringify(
    {
      ...projectItem,
      projectSummary: stripHtml(projectItem?.projectSummary || ""),
    },
    null,
    2
  )}`;

  return safeJson(prompt);
}

export async function generateProjectWithAi(projectItem) {
  const prompt = `Return valid JSON only with this exact shape:
{
  "projectSummary": "string"
}

Task:
- Generate a strong resume-ready project summary in HTML bullet points using <ul><li>...</li></ul>.
- Base the output only on the project item data provided below.
- Use the project name and tech stack as the primary context.
- Do not use or infer a role from Personal Details or any external profile job title.
- Highlight the likely purpose, implementation, and technical value without making unrealistic claims.
- If details are limited, keep the bullets concise and grounded in the provided inputs.

Project item:
${JSON.stringify(
    {
      ...projectItem,
      projectSummary: stripHtml(projectItem?.projectSummary || ""),
    },
    null,
    2
  )}`;

  return safeJson(prompt);
}

export async function getSkillSuggestions(profile, targetRole = "") {
  const context = getProfileContext(profile);
  const prompt = `Return valid JSON only with this exact shape:
{
  "suggestedSkills": ["string", "string", "string", "string", "string", "string"],
  "reason": "string"
}

Suggest up to 8 missing skills that would strengthen this profile for the target role. Avoid duplicates with existing skills.

Target role: ${targetRole || context.jobTitle || "General software role"}

Candidate profile JSON:
${JSON.stringify(context, null, 2)}`;

  return safeJson(prompt);
}

export async function getProfileCompletenessReview(profile, targetRole = "") {
  const context = getProfileContext(profile);
  const prompt = `Return valid JSON only with this exact shape:
{
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string", "string", "string"],
  "nextSteps": ["string", "string", "string", "string"]
}

Analyze this resume profile for readiness and completeness. Focus on summary quality, experience strength, project clarity, skills coverage, and missing evidence.

Target role: ${targetRole || context.jobTitle || "General software role"}

Candidate profile JSON:
${JSON.stringify(context, null, 2)}`;

  return safeJson(prompt);
}

export async function getRoleOptimization(profile, targetRole) {
  const context = getProfileContext(profile);
  const prompt = `Return valid JSON only with this exact shape:
{
  "optimizedSummary": "string",
  "experienceFocus": ["string", "string", "string"],
  "projectFocus": ["string", "string", "string"],
  "priorityKeywords": ["string", "string", "string", "string", "string", "string"]
}

Optimize this profile for the target role. Keep recommendations realistic to the current background.

Target role: ${targetRole}

Candidate profile JSON:
${JSON.stringify(context, null, 2)}`;

  return safeJson(prompt);
}

export async function chatWithProfileAssistant(profile, message, targetRole = "") {
  const context = getProfileContext(profile);
  const prompt = `You are a profile-building assistant inside a resume app.
Answer the user's request using only their profile context. Give practical, profile-editing guidance. If rewriting content, provide directly usable text.

Target role: ${targetRole || context.jobTitle || "General software role"}

Candidate profile JSON:
${JSON.stringify(context, null, 2)}

User message:
${message}

Rules:
- Professional summary responses must be plain paragraph text, not bullet points.
- Project summary responses must be in exactly 5 concise bullet points.
- Experience/work-summary rewrite responses should use bullet points when the user is asking for bullets, points, or summary lines for an experience item.
- If the user asks for a project summary but provides only a project title and there is not enough tech stack or project detail in the request/profile context, do not generate the summary yet. Ask specifically for the missing tech stack or missing implementation details first.
- Do not present a project summary as a paragraph.
- Keep output concise and directly usable in the profile.

Respond in plain text with concise but useful help.`;

  const result = await AIChatSession.sendMessage(prompt);
  return normalizeAssistantResponse(result.response.text());
}
