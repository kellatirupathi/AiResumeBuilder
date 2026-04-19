import { AIChatSession } from "./AiModel";

const buildResumeSummary = (resume) => {
  if (!resume) return "";
  const lines = [];
  const fullName = `${resume.firstName || ""} ${resume.lastName || ""}`.trim();
  if (fullName) lines.push(`Name: ${fullName}`);
  if (resume.jobTitle) lines.push(`Current Title: ${resume.jobTitle}`);
  if (resume.email) lines.push(`Email: ${resume.email}`);
  if (resume.phone) lines.push(`Phone: ${resume.phone}`);
  if (resume.address) lines.push(`Location: ${resume.address}`);
  if (resume.summary) lines.push(`Professional Summary: ${resume.summary}`);

  if (Array.isArray(resume.experience) && resume.experience.length) {
    lines.push("\nExperience:");
    resume.experience.forEach((exp) => {
      const header = `- ${exp.title || ""} at ${exp.companyName || ""} (${
        exp.startDate || ""
      } - ${exp.currentlyWorking ? "Present" : exp.endDate || ""})`;
      lines.push(header);
      if (exp.workSummary) {
        const cleaned = String(exp.workSummary)
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (cleaned) lines.push(`  ${cleaned}`);
      }
    });
  }

  if (Array.isArray(resume.skills) && resume.skills.length) {
    const skillNames = resume.skills
      .map((s) => s.name)
      .filter(Boolean)
      .join(", ");
    if (skillNames) lines.push(`\nSkills: ${skillNames}`);
  }

  if (Array.isArray(resume.projects) && resume.projects.length) {
    lines.push("\nProjects:");
    resume.projects.forEach((p) => {
      const header = `- ${p.projectName || ""}${
        p.techStack ? ` (${p.techStack})` : ""
      }`;
      lines.push(header);
      if (p.projectSummary) {
        const cleaned = String(p.projectSummary)
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        if (cleaned) lines.push(`  ${cleaned}`);
      }
    });
  }

  if (Array.isArray(resume.education) && resume.education.length) {
    lines.push("\nEducation:");
    resume.education.forEach((edu) => {
      lines.push(
        `- ${edu.degree || ""}${edu.major ? ` in ${edu.major}` : ""} - ${
          edu.universityName || ""
        }`
      );
    });
  }

  return lines.join("\n");
};

const buildPrompt = ({
  resumeData,
  uploadedResumeText,
  jobDescription,
  jobTitle,
  companyName,
  hiringManagerName,
  tone,
  previousContent,
}) => {
  const resumeContext = resumeData
    ? buildResumeSummary(resumeData)
    : uploadedResumeText || "";

  const toneInstruction =
    tone === "friendly"
      ? "warm and friendly, professional but conversational"
      : tone === "enthusiastic"
      ? "enthusiastic and energetic, conveys passion and excitement"
      : "formal, respectful, and professional";

  const recipient = hiringManagerName
    ? `Dear ${hiringManagerName},`
    : "Dear Hiring Manager,";

  return `You are an expert career coach and professional copywriter. Generate a tailored cover letter in JSON format.

CANDIDATE RESUME / PROFILE:
${resumeContext}

JOB POSITION: ${jobTitle || "the role"}
COMPANY: ${companyName || "the company"}
HIRING MANAGER: ${hiringManagerName || "Hiring Manager"}

JOB DESCRIPTION:
${jobDescription || "(no job description provided)"}

TONE: ${toneInstruction}

${
  previousContent
    ? `Previous version (regenerate with improvements, keep same tone but vary wording):
${JSON.stringify(previousContent)}`
    : ""
}

Return ONLY a JSON object with this exact structure (no markdown fences, no commentary):
{
  "greeting": "${recipient}",
  "openingParagraph": "First paragraph (2-3 sentences) that opens the letter, mentions the role and company, and immediately conveys interest and a strong opening hook based on the candidate's most relevant experience.",
  "bodyParagraphs": [
    "Paragraph 2: highlight 2-3 relevant achievements/skills from the resume that directly match the JD requirements. Use specific examples and quantifiable impact when possible.",
    "Paragraph 3: explain WHY the candidate is interested in this specific company and how their values/skills align with the role's needs."
  ],
  "closingParagraph": "Closing paragraph (2-3 sentences) that expresses thanks, indicates desire for an interview, and includes a confident call to action.",
  "signature": "Sincerely,"
}

Constraints:
- Total length: ~250-350 words
- No clichés like "I am writing to apply for"
- Reference SPECIFIC details from the resume that match the JD
- Avoid generic phrases — every sentence should feel personalized
- Use the candidate's actual experience, not invented credentials
- Output must be valid JSON, parseable by JSON.parse()`;
};

export const generateCoverLetterContent = async ({
  resumeData,
  uploadedResumeText,
  jobDescription,
  jobTitle,
  companyName,
  hiringManagerName,
  tone = "formal",
  previousContent = null,
}) => {
  const prompt = buildPrompt({
    resumeData,
    uploadedResumeText,
    jobDescription,
    jobTitle,
    companyName,
    hiringManagerName,
    tone,
    previousContent,
  });

  const result = await AIChatSession.sendMessage(prompt);
  const text = result.response.text();
  const parsed = JSON.parse(text);

  return {
    greeting: parsed.greeting || "Dear Hiring Manager,",
    openingParagraph: parsed.openingParagraph || "",
    bodyParagraphs: Array.isArray(parsed.bodyParagraphs)
      ? parsed.bodyParagraphs
      : [],
    closingParagraph: parsed.closingParagraph || "",
    signature: parsed.signature || "Sincerely,",
  };
};
