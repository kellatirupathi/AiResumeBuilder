import handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PDFSPARK_API_URL =
  process.env.PDFSPARK_API_URL || "https://pdfspark.dev/api/v1/pdf/from-html";
const PDFSPARK_TIMEOUT_MS = Number(process.env.PDFSPARK_TIMEOUT_MS || 60000);
const PDFSPARK_MAX_RETRIES = Math.max(
  1,
  Number(process.env.PDFSPARK_MAX_RETRIES || 2)
);
const PDFSPARK_RETRY_DELAY_MS = Math.max(
  0,
  Number(process.env.PDFSPARK_RETRY_DELAY_MS || 1500)
);
const PDFSPARK_MAX_HTML_BYTES = 5 * 1024 * 1024;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

const createPdfsparkHttpError = async (response) => {
  const errorBody = await response.text().catch(() => "");
  const error = new Error(
    `PDFSpark request failed with status ${response.status}${
      errorBody ? `: ${errorBody}` : ""
    }`
  );
  error.status = response.status;
  return error;
};

const shouldRetryPdfsparkError = (error) => {
  if (!error) return false;
  if (error.name === "AbortError") return true;
  if (typeof error.status === "number") {
    return error.status === 429 || error.status >= 500;
  }
  return error instanceof TypeError;
};

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

  let lastError;

  for (let attempt = 1; attempt <= PDFSPARK_MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PDFSPARK_TIMEOUT_MS);
    const requestStartedAt = Date.now();

    try {
      const response = await fetch(PDFSPARK_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html,
          options: { format: "A4", printBackground: true },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw await createPdfsparkHttpError(response);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      const durationMs = Date.now() - requestStartedAt;
      const isTimeout = error?.name === "AbortError";
      const failureReason = isTimeout
        ? `PDFSpark request timed out after ${PDFSPARK_TIMEOUT_MS}ms`
        : error.message;

      lastError = new Error(
        `Failed to generate cover letter PDF ${id} on attempt ${attempt}/${PDFSPARK_MAX_RETRIES}: ${failureReason}`,
        { cause: error }
      );

      if (attempt < PDFSPARK_MAX_RETRIES && shouldRetryPdfsparkError(error)) {
        console.warn(
          `Retrying cover letter PDF for ${id} after attempt ${attempt} (${durationMs}ms): ${failureReason}`
        );
        await wait(PDFSPARK_RETRY_DELAY_MS * attempt);
        continue;
      }

      console.error("Error generating cover letter PDF:", lastError);
      throw lastError;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("Failed to generate cover letter PDF");
};
