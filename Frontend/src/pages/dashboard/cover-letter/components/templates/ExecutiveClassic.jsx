import React from "react";

const ExecutiveClassic = ({ coverLetterInfo }) => {
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
    lineHeight: 1.5,
    color: "#1f2937",
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: "#1f2937",
      }}
    >
      <div className="px-12 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div />
          <div className="text-right">
            {coverLetterInfo?.senderName && (
              <h1
                style={{
                  fontSize: "26px",
                  fontWeight: 800,
                  color: themeColor,
                  margin: 0,
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
                  color: "#4b5563",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {coverLetterInfo.jobTitle}
              </p>
            )}
          </div>
        </div>

        <div className="text-right" style={{ fontSize: "10.5px", color: "#374151", lineHeight: 1.6 }}>
          {coverLetterInfo?.senderAddress && (
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600 }}>Address:</span> {coverLetterInfo.senderAddress}
            </p>
          )}
          {coverLetterInfo?.senderEmail && (
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600 }}>Email:</span> {coverLetterInfo.senderEmail}
            </p>
          )}
          {coverLetterInfo?.senderPhone && (
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600 }}>Cell:</span> {coverLetterInfo.senderPhone}
            </p>
          )}
          {coverLetterInfo?.senderLinkedin && (
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600 }}>LinkedIn:</span> {coverLetterInfo.senderLinkedin}
            </p>
          )}
        </div>

        <hr style={{ border: 0, borderTop: `1.5px solid ${themeColor}`, marginTop: "16px", marginBottom: "20px" }} />

        {/* Recipient + date */}
        <div className="flex justify-between items-start mb-5">
          <div style={{ fontSize: "11px", color: "#1f2937", lineHeight: 1.5 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>
              {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
            </p>
            {coverLetterInfo?.companyName && (
              <p style={{ margin: 0 }}>{coverLetterInfo.companyName}</p>
            )}
          </div>
          <div style={{ fontSize: "11px", color: "#4b5563" }}>{formattedDate}</div>
        </div>

        {/* Greeting */}
        {generated.greeting && (
          <p style={{ fontSize: "11px", marginBottom: "10px", color: "#1f2937" }}>
            {generated.greeting}
          </p>
        )}

        {/* Re: line */}
        {coverLetterInfo?.jobTitle && (
          <p
            style={{
              fontSize: "11.5px",
              fontWeight: 700,
              color: themeColor,
              marginBottom: "14px",
            }}
          >
            Re: {coverLetterInfo.jobTitle} Position
          </p>
        )}

        {/* Opening */}
        {generated.openingParagraph && (
          <p style={paragraphStyle}>{generated.openingParagraph}</p>
        )}

        {/* Intro line */}
        {bodyParagraphs.length > 0 && (
          <p
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            Here&apos;s how I can add value to your organization:
          </p>
        )}

        {/* Bulleted body paragraphs */}
        {bodyParagraphs.length > 0 && (
          <ul style={{ paddingLeft: "20px", marginBottom: "14px", listStyleType: "disc" }}>
            {bodyParagraphs.map((para, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: "11px",
                  lineHeight: 1.5,
                  color: "#1f2937",
                  marginBottom: "8px",
                  textAlign: "justify",
                }}
              >
                {para}
              </li>
            ))}
          </ul>
        )}

        {/* Closing */}
        {generated.closingParagraph && (
          <p style={paragraphStyle}>{generated.closingParagraph}</p>
        )}

        {/* Signature */}
        <div style={{ marginTop: "22px" }}>
          <p style={{ fontSize: "11px", color: "#1f2937", margin: "0 0 24px 0" }}>
            Yours sincerely,
          </p>
          {coverLetterInfo?.senderName && (
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: themeColor,
                margin: 0,
              }}
            >
              {coverLetterInfo.senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveClassic;
