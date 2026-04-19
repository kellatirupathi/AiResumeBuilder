import React from "react";

// Classic Cover Letter - Traditional formal business letter
// Mirrors Backend/src/templates/cover-letter-classic.handlebars
const ClassicCoverLetter = ({ coverLetterInfo }) => {
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
    lineHeight: "1.5",
    color: "#000000",
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#000000",
      }}
    >
      <div className="px-10 py-10">
        {/* Sender block - right aligned */}
        <div className="text-right mb-6">
          {coverLetterInfo?.senderName && (
            <p
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: themeColor,
                margin: "0 0 6px 0",
                letterSpacing: "-0.01em",
              }}
            >
              {coverLetterInfo.senderName}
            </p>
          )}
          {coverLetterInfo?.senderEmail && (
            <p
              className="text-gray-600"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.4 }}
            >
              {coverLetterInfo.senderEmail}
            </p>
          )}
          {coverLetterInfo?.senderPhone && (
            <p
              className="text-gray-600"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.4 }}
            >
              {coverLetterInfo.senderPhone}
            </p>
          )}
          {coverLetterInfo?.senderAddress && (
            <p
              className="text-gray-600"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.4 }}
            >
              {coverLetterInfo.senderAddress}
            </p>
          )}
          {coverLetterInfo?.senderLinkedin && (
            <p
              className="text-gray-600"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.4 }}
            >
              <a
                href={formatUrl(coverLetterInfo.senderLinkedin)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                {coverLetterInfo.senderLinkedin}
              </a>
            </p>
          )}
          {coverLetterInfo?.senderPortfolio && (
            <p
              className="text-gray-600"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.4 }}
            >
              <a
                href={formatUrl(coverLetterInfo.senderPortfolio)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:underline"
              >
                {coverLetterInfo.senderPortfolio}
              </a>
            </p>
          )}
        </div>

        {/* Date - right aligned */}
        <div
          className="text-right text-gray-500"
          style={{ fontSize: "11px", marginBottom: "24px" }}
        >
          {formattedDate}
        </div>

        {/* Recipient block - left aligned */}
        <div className="mb-4">
          <p
            className="text-gray-700"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              margin: 0,
              lineHeight: 1.45,
            }}
          >
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && (
            <p
              className="text-gray-700"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.45 }}
            >
              {coverLetterInfo.companyName}
            </p>
          )}
          {coverLetterInfo?.jobTitle && (
            <p
              className="text-gray-700"
              style={{ fontSize: "11px", margin: 0, lineHeight: 1.45 }}
            >
              Re: {coverLetterInfo.jobTitle}
            </p>
          )}
        </div>

        {/* Greeting */}
        {generated.greeting && (
          <p style={{ fontSize: "11px", marginBottom: "12px", color: "#000000" }}>
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
          <div style={{ marginTop: "24px" }}>
            <p
              style={{
                fontSize: "11px",
                color: "#000000",
                margin: "0 0 28px 0",
              }}
            >
              {generated.signature}
            </p>
            {coverLetterInfo?.senderName && (
              <p
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#000000",
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
  );
};

export default ClassicCoverLetter;
