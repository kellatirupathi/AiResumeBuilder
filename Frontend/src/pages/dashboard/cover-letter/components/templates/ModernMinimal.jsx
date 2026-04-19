import React from "react";

const ModernMinimal = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#0f172a";
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generated = coverLetterInfo?.generatedContent || {};
  const bodyParagraphs = Array.isArray(generated.bodyParagraphs)
    ? generated.bodyParagraphs
    : [];

  const contactItems = [
    coverLetterInfo?.senderEmail,
    coverLetterInfo?.senderPhone,
    coverLetterInfo?.senderLinkedin,
  ].filter(Boolean);

  const paragraphStyle = {
    marginBottom: "12px",
    textAlign: "justify",
    fontSize: "11px",
    lineHeight: 1.6,
    color: "#1f2937",
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
      }}
    >
      <div className="px-14 py-14">
        {/* Centered name */}
        <div className="text-center">
          {coverLetterInfo?.senderName && (
            <h1
              style={{
                fontSize: "32px",
                fontWeight: 300,
                color: themeColor,
                margin: 0,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
              }}
            >
              {coverLetterInfo.senderName}
            </h1>
          )}
          {coverLetterInfo?.jobTitle && (
            <p
              style={{
                fontSize: "11px",
                marginTop: "8px",
                color: "#6b7280",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              {coverLetterInfo.jobTitle}
            </p>
          )}
        </div>

        <hr
          style={{
            border: 0,
            borderTop: `1px solid ${themeColor}`,
            margin: "20px auto",
            width: "60px",
          }}
        />

        {/* Contact line */}
        {contactItems.length > 0 && (
          <p
            className="text-center"
            style={{
              fontSize: "10.5px",
              color: "#4b5563",
              marginBottom: "32px",
              letterSpacing: "0.02em",
            }}
          >
            {contactItems.join(" · ")}
          </p>
        )}

        {/* Date */}
        <div
          className="text-right"
          style={{ fontSize: "10.5px", color: "#6b7280", marginBottom: "20px" }}
        >
          {formattedDate}
        </div>

        {/* Recipient */}
        <div style={{ marginBottom: "18px", fontSize: "11px", lineHeight: 1.5 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && (
            <p style={{ margin: 0, color: "#4b5563" }}>{coverLetterInfo.companyName}</p>
          )}
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
          {generated.signature && (
            <p style={{ fontSize: "11px", color: "#1f2937", margin: "0 0 24px 0" }}>
              {generated.signature}
            </p>
          )}
          {coverLetterInfo?.senderName && (
            <p style={{ fontSize: "12px", fontWeight: 500, color: themeColor, margin: 0 }}>
              {coverLetterInfo.senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernMinimal;
