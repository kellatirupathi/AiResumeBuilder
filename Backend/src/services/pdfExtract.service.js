import pdfParse from "pdf-parse/lib/pdf-parse.js";

const MAX_PAGES = 30;

const collapseWhitespace = (text) =>
  String(text || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const extractTextFromPdfBuffer = async (buffer) => {
  if (!buffer || !buffer.length) {
    throw new Error("Empty PDF buffer");
  }

  const data = await pdfParse(buffer, { max: MAX_PAGES });
  const text = collapseWhitespace(data?.text);

  if (!text) {
    throw new Error(
      "Could not extract any text from this PDF. The file may be scanned/image-based."
    );
  }

  return text;
};
