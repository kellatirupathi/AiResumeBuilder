import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

// Modern Cover Letter - Sidebar layout with accent header bar
// Mirrors Backend/src/templates/cover-letter-modern.handlebars
const ModernCoverLetter = ({ coverLetterInfo }) => {
  // Helper function to format URLs
  const formatUrl = (url) => {
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const themeColor = coverLetterInfo?.themeColor || "#1c2434";

  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generated = coverLetterInfo?.generatedContent || {};
  const bodyParagraphs = Array.isArray(generated.bodyParagraphs)
    ? generated.bodyParagraphs
    : [];

  const paragraphStyle = {
    marginBottom: "12px",
    textAlign: "justify",
    fontSize: "11px",
    lineHeight: "1.55",
    color: "#2a2a2a",
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden relative"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#222222",
      }}
    >
      {/* Header bar - full width, themeColor background */}
      <div
        className="flex items-center justify-between px-7 py-5"
        style={{ backgroundColor: themeColor }}
      >
        <div>
          <h1
            className="text-white"
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {coverLetterInfo?.senderName || ""}
          </h1>
        </div>
        {coverLetterInfo?.jobTitle && (
          <div className="text-right">
            <p
              className="text-white"
              style={{
                fontSize: "12px",
                fontWeight: 400,
                margin: 0,
                opacity: 0.92,
                lineHeight: 1.3,
              }}
            >
              Applying for: {coverLetterInfo.jobTitle}
            </p>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Sidebar - absolute positioned (mirrors Executive template pattern) */}
        <div
          className="absolute left-0 top-0 bottom-0 bg-gray-50 p-5"
          style={{ width: "28%" }}
        >
          <h3
            className="uppercase font-semibold mb-3 pb-1.5"
            style={{
              color: themeColor,
              fontSize: "12px",
              letterSpacing: "0.08em",
              borderBottom: `2px solid ${themeColor}`,
              margin: "0 0 12px 0",
            }}
          >
            Contact
          </h3>

          {coverLetterInfo?.senderEmail && (
            <div
              className="flex items-start gap-2 mb-2.5"
              style={{ fontSize: "11px" }}
            >
              <Mail
                size={14}
                style={{ color: themeColor, flexShrink: 0, marginTop: "2px" }}
              />
              <span
                className="text-gray-700"
                style={{ wordBreak: "break-word", lineHeight: 1.35 }}
              >
                {coverLetterInfo.senderEmail}
              </span>
            </div>
          )}

          {coverLetterInfo?.senderPhone && (
            <div
              className="flex items-start gap-2 mb-2.5"
              style={{ fontSize: "11px" }}
            >
              <Phone
                size={14}
                style={{ color: themeColor, flexShrink: 0, marginTop: "2px" }}
              />
              <span
                className="text-gray-700"
                style={{ wordBreak: "break-word", lineHeight: 1.35 }}
              >
                {coverLetterInfo.senderPhone}
              </span>
            </div>
          )}

          {coverLetterInfo?.senderAddress && (
            <div
              className="flex items-start gap-2 mb-2.5"
              style={{ fontSize: "11px" }}
            >
              <MapPin
                size={14}
                style={{ color: themeColor, flexShrink: 0, marginTop: "2px" }}
              />
              <span
                className="text-gray-700"
                style={{ wordBreak: "break-word", lineHeight: 1.35 }}
              >
                {coverLetterInfo.senderAddress}
              </span>
            </div>
          )}

          {coverLetterInfo?.senderLinkedin && (
            <div
              className="flex items-start gap-2 mb-2.5"
              style={{ fontSize: "11px" }}
            >
              <Linkedin
                size={14}
                style={{ color: themeColor, flexShrink: 0, marginTop: "2px" }}
              />
              <a
                href={formatUrl(coverLetterInfo.senderLinkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:underline"
                style={{ wordBreak: "break-word", lineHeight: 1.35 }}
              >
                {coverLetterInfo.senderLinkedin}
              </a>
            </div>
          )}

          {coverLetterInfo?.senderPortfolio && (
            <div
              className="flex items-start gap-2 mb-2.5"
              style={{ fontSize: "11px" }}
            >
              <Globe
                size={14}
                style={{ color: themeColor, flexShrink: 0, marginTop: "2px" }}
              />
              <a
                href={formatUrl(coverLetterInfo.senderPortfolio)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:underline"
                style={{ wordBreak: "break-word", lineHeight: 1.35 }}
              >
                {coverLetterInfo.senderPortfolio}
              </a>
            </div>
          )}
        </div>

        {/* Main column - margin-left so background continues */}
        <div className="p-6" style={{ marginLeft: "28%" }}>
          {/* Date */}
          <p
            className="text-gray-500"
            style={{ fontSize: "11px", margin: "0 0 16px 0" }}
          >
            {formattedDate}
          </p>

          {/* Recipient */}
          <div
            style={{
              marginBottom: "18px",
              paddingBottom: "12px",
              borderBottom: `1px solid ${themeColor}33`,
            }}
          >
            <p
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "#1a1a1a",
                margin: "0 0 2px 0",
              }}
            >
              {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
            </p>
            {coverLetterInfo?.companyName && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#555555",
                  margin: 0,
                }}
              >
                {coverLetterInfo.companyName}
              </p>
            )}
          </div>

          {/* Greeting */}
          {generated.greeting && (
            <p
              style={{
                fontSize: "11px",
                fontWeight: 500,
                color: "#1a1a1a",
                margin: "0 0 12px 0",
              }}
            >
              {generated.greeting}
            </p>
          )}

          {/* Opening paragraph */}
          {generated.openingParagraph && (
            <p style={paragraphStyle}>{generated.openingParagraph}</p>
          )}

          {/* Body paragraphs */}
          {bodyParagraphs.map((para, idx) => (
            <p key={idx} style={paragraphStyle}>
              {para}
            </p>
          ))}

          {/* Closing paragraph */}
          {generated.closingParagraph && (
            <p style={paragraphStyle}>{generated.closingParagraph}</p>
          )}

          {/* Signature block */}
          {generated.signature && (
            <div
              style={{
                marginTop: "24px",
                paddingTop: "14px",
                borderTop: `2px solid ${themeColor}`,
              }}
            >
              <p
                style={{
                  fontSize: "11px",
                  color: "#2a2a2a",
                  margin: "0 0 22px 0",
                }}
              >
                {generated.signature}
              </p>
              {coverLetterInfo?.senderName && (
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: themeColor,
                    margin: 0,
                  }}
                >
                  {coverLetterInfo.senderName}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernCoverLetter;
