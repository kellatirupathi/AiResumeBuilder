import React from "react";

const VerticalAccent = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#059669";
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
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden relative"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
      }}
    >
      {/* Vertical bar */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{ width: "8px", backgroundColor: themeColor }}
      />

      <div style={{ marginLeft: "8px", padding: "36px 36px 36px 32px" }}>
        {coverLetterInfo?.senderName && (
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 800,
              margin: 0,
              color: "#111827",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
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
              color: themeColor,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {coverLetterInfo.jobTitle}
          </p>
        )}
        {contactBits.length > 0 && (
          <p style={{ fontSize: "10.5px", color: "#4b5563", marginTop: "8px" }}>
            {contactBits.join("  ·  ")}
          </p>
        )}

        <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "20px 0" }} />

        <div className="text-right" style={{ fontSize: "10.5px", color: "#6b7280", marginBottom: "16px" }}>
          {formattedDate}
        </div>

        <div style={{ marginBottom: "16px", fontSize: "11px", lineHeight: 1.5 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && (
            <p style={{ margin: 0, color: "#4b5563" }}>{coverLetterInfo.companyName}</p>
          )}
        </div>

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

        <div style={{ marginTop: "24px" }}>
          {generated.signature && (
            <p style={{ fontSize: "11px", margin: "0 0 22px 0" }}>{generated.signature}</p>
          )}
          {coverLetterInfo?.senderName && (
            <p style={{ fontSize: "12px", fontWeight: 700, margin: 0, color: themeColor }}>
              {coverLetterInfo.senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerticalAccent;
