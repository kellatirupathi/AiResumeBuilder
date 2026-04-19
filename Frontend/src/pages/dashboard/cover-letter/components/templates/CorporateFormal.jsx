import React from "react";

const CorporateFormal = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#0b3d91";
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generated = coverLetterInfo?.generatedContent || {};
  const bodyParagraphs = Array.isArray(generated.bodyParagraphs)
    ? generated.bodyParagraphs
    : [];

  const contactBits = [
    coverLetterInfo?.senderEmail,
    coverLetterInfo?.senderPhone,
    coverLetterInfo?.senderAddress,
    coverLetterInfo?.senderLinkedin,
  ].filter(Boolean);

  const paragraphStyle = {
    marginBottom: "12px",
    textAlign: "justify",
    fontSize: "11px",
    lineHeight: 1.55,
    color: "#1f2937",
    textIndent: "1.5em",
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden flex flex-col"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
      }}
    >
      <div className="px-12 py-12 flex-1">
        {/* Header */}
        <div className="text-center">
          {coverLetterInfo?.senderName && (
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                margin: 0,
                color: themeColor,
                letterSpacing: "0.02em",
              }}
            >
              {coverLetterInfo.senderName}
            </h1>
          )}
          {coverLetterInfo?.jobTitle && (
            <p
              style={{
                fontSize: "12px",
                marginTop: "4px",
                color: "#4b5563",
                fontWeight: 500,
              }}
            >
              {coverLetterInfo.jobTitle}
            </p>
          )}
          {contactBits.length > 0 && (
            <p style={{ fontSize: "10.5px", marginTop: "8px", color: "#374151" }}>
              {contactBits.join(" | ")}
            </p>
          )}
        </div>

        {/* Double rule */}
        <div style={{ marginTop: "16px", marginBottom: "20px" }}>
          <div style={{ height: "2px", backgroundColor: themeColor }} />
          <div style={{ height: "1px", backgroundColor: themeColor, opacity: 0.4, marginTop: "2px" }} />
        </div>

        {/* Date */}
        <div className="text-right" style={{ fontSize: "11px", color: "#374151", marginBottom: "18px" }}>
          {formattedDate}
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: "18px", fontSize: "11px", lineHeight: 1.55 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && <p style={{ margin: 0 }}>{coverLetterInfo.companyName}</p>}
        </div>

        {/* Greeting */}
        {generated.greeting && (
          <p style={{ fontSize: "11px", marginBottom: "14px" }}>{generated.greeting}</p>
        )}

        {generated.openingParagraph && <p style={paragraphStyle}>{generated.openingParagraph}</p>}
        {bodyParagraphs.map((para, idx) => (
          <p key={idx} style={paragraphStyle}>
            {para}
          </p>
        ))}
        {generated.closingParagraph && <p style={paragraphStyle}>{generated.closingParagraph}</p>}

        {/* Signature */}
        <div style={{ marginTop: "28px" }}>
          <p style={{ fontSize: "11px", margin: "0 0 28px 0" }}>Respectfully yours,</p>
          {coverLetterInfo?.senderName && (
            <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: themeColor }}>
              {coverLetterInfo.senderName}
            </p>
          )}
          {coverLetterInfo?.jobTitle && (
            <p style={{ fontSize: "10.5px", margin: "2px 0 0 0", color: "#6b7280" }}>
              {coverLetterInfo.jobTitle}
            </p>
          )}
        </div>
      </div>

      {/* Footer rule */}
      <div className="px-12 pb-6">
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "8px" }}>
          <p style={{ fontSize: "9px", color: "#9ca3af", textAlign: "center", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {coverLetterInfo?.senderName || "Confidential"} · Cover Letter
          </p>
        </div>
      </div>
    </div>
  );
};

export default CorporateFormal;
