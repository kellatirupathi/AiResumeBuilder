import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { requestPdfFromHtml, PDFSPARK_MAX_HTML_BYTES } from "./pdfspark.client.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const LEGACY_TEMPLATE_MAP = {
  classic: "executive-classic",
  modern: "modern-minimal",
};

const normalizeTemplate = (template) => {
  if (!template) return "executive-classic";
  return LEGACY_TEMPLATE_MAP[template] || template;
};

const sanitizeCoverLetterDataForPdf = (data = {}) => ({
  _id: data._id,
  title: data.title || "Cover Letter",
  template: normalizeTemplate(data.template),
  themeColor: data.themeColor || "#1c2434",
  senderName: data.senderName || "",
  senderEmail: data.senderEmail || "",
  senderPhone: data.senderPhone || "",
  senderAddress: data.senderAddress || "",
  senderLinkedin: data.senderLinkedin || "",
  senderPortfolio: data.senderPortfolio || "",
  jobTitle: data.jobTitle || "",
  companyName: data.companyName || "",
  hiringManagerName: data.hiringManagerName || "",
  generatedContent: {
    greeting: data?.generatedContent?.greeting || "",
    openingParagraph: data?.generatedContent?.openingParagraph || "",
    bodyParagraphs: Array.isArray(data?.generatedContent?.bodyParagraphs)
      ? data.generatedContent.bodyParagraphs
      : [],
    closingParagraph: data?.generatedContent?.closingParagraph || "",
    signature: data?.generatedContent?.signature || "",
  },
  formattedDate: new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
});

export const renderCoverLetterHtml = (data) => {
  const template = data.template || "classic";
  const themeColor = data.themeColor || "#1c2434";

  const hexToRgb = (hex) => {
    const cleaned = hex.replace("#", "");
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  };

  const themeColorRGB = hexToRgb(themeColor);

  const templatePath = path.join(
    __dirname,
    "..",
    "templates",
    `cover-letter-${template}.handlebars`
  );

  let templateContent;
  try {
    templateContent = fs.readFileSync(templatePath, "utf8");
  } catch (error) {
    console.warn(
      `Cover letter template ${template} not found, using executive-classic instead`
    );
    templateContent = fs.readFileSync(
      path.join(
        __dirname,
        "..",
        "templates",
        "cover-letter-executive-classic.handlebars"
      ),
      "utf8"
    );
  }

  const compiled = handlebars.compile(templateContent);

  return compiled({
    ...data,
    themeColor,
    themeColorRGB,
    themeColorTransparent80: `${themeColor}99`,
    themeColorTransparent50: `${themeColor}55`,
    themeColorTransparent30: `${themeColor}30`,
    themeColorTransparent20: `${themeColor}33`,
    themeColorTransparent10: `${themeColor}22`,
    themeColorTransparent05: `${themeColor}10`,
  });
};

export const generateCoverLetterPDF = async (data) => {
  const sanitized = sanitizeCoverLetterDataForPdf(data);
  const id = sanitized._id?.toString?.() || sanitized._id || "unknown";
  const html = renderCoverLetterHtml(sanitized);
  const htmlSizeBytes = Buffer.byteLength(html, "utf8");

  if (htmlSizeBytes > PDFSPARK_MAX_HTML_BYTES) {
    throw new Error(
      `Generated cover letter HTML is ${htmlSizeBytes} bytes, exceeds 5MB limit`
    );
  }

  return requestPdfFromHtml(html, { label: `cover letter ${id}` });
};
