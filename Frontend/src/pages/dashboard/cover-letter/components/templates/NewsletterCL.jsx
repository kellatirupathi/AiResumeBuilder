import React from "react";

const NewsletterCL = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#111827";
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
    lineHeight: 1.6,
    color: "#1f2937",
  };

  const StatCell = ({ label, value }) =>
    value ? (
      <div style={{ flex: 1, padding: "0 12px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "9px",
            margin: 0,
            color: themeColor,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: "10.5px", margin: "3px 0 0 0", color: "#374151", wordBreak: "break-word" }}>
          {value}
        </p>
      </div>
    ) : null;

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
      }}
    >
      <div className="px-12 py-12">
        {/* Editorial header */}
        {coverLetterInfo?.senderName && (
          <h1
            style={{
              fontSize: "40px",
              fontWeight: 900,
              margin: 0,
              color: themeColor,
              letterSpacing: "-0.025em",
              lineHeight: 1,
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
              color: "#4b5563",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {coverLetterInfo.jobTitle}
          </p>
        )}

        {/* Stat row */}
        <div
          className="flex items-stretch"
          style={{
            marginTop: "20px",
            paddingTop: "12px",
            paddingBottom: "12px",
            borderTop: `1px solid ${themeColor}`,
            borderBottom: `1px solid ${themeColor}`,
          }}
        >
          <StatCell label="Email" value={coverLetterInfo?.senderEmail} />
          <div style={{ width: "1px", backgroundColor: themeColor }} />
          <StatCell label="Phone" value={coverLetterInfo?.senderPhone} />
          <div style={{ width: "1px", backgroundColor: themeColor }} />
          <StatCell label="Location" value={coverLetterInfo?.senderAddress} />
        </div>

        {/* Bold rule */}
        <div style={{ height: "4px", backgroundColor: themeColor, marginTop: "10px", marginBottom: "20px" }} />

        {/* Date */}
        <p
          className="text-right"
          style={{
            fontSize: "10px",
            color: themeColor,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "16px",
          }}
        >
          {formattedDate}
        </p>

        {/* Recipient */}
        <div style={{ marginBottom: "16px", fontSize: "11px", lineHeight: 1.5 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && (
            <p style={{ margin: 0, color: "#4b5563" }}>{coverLetterInfo.companyName}</p>
          )}
        </div>

        {generated.greeting && (
          <p style={{ fontSize: "12px", fontWeight: 600, marginBottom: "14px" }}>
            {generated.greeting}
          </p>
        )}

        {generated.openingParagraph && <p style={paragraphStyle}>{generated.openingParagraph}</p>}

        {bodyParagraphs.map((para, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: themeColor,
                  fontSize: "16px",
                  margin: "0 0 8px 0",
                  lineHeight: 1,
                  fontWeight: 700,
                }}
              >
                •
              </p>
            )}
            <p style={paragraphStyle}>{para}</p>
          </React.Fragment>
        ))}

        {generated.closingParagraph && <p style={paragraphStyle}>{generated.closingParagraph}</p>}

        <div style={{ marginTop: "24px" }}>
          {generated.signature && (
            <p style={{ fontSize: "11px", margin: "0 0 18px 0" }}>{generated.signature}</p>
          )}
          {coverLetterInfo?.senderName && (
            <p style={{ fontSize: "14px", fontWeight: 800, margin: 0, color: themeColor, letterSpacing: "-0.01em" }}>
              {coverLetterInfo.senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterCL;
