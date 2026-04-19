import React from "react";

const ElegantSerif = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#a47148";
  const formattedDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const generated = coverLetterInfo?.generatedContent || {};
  const bodyParagraphs = Array.isArray(generated.bodyParagraphs)
    ? generated.bodyParagraphs
    : [];

  const initial = (coverLetterInfo?.senderName || "?").trim().charAt(0).toUpperCase();

  const contactItems = [
    coverLetterInfo?.senderEmail,
    coverLetterInfo?.senderPhone,
    coverLetterInfo?.senderAddress,
  ].filter(Boolean);

  const paragraphStyle = {
    marginBottom: "12px",
    textAlign: "justify",
    fontSize: "11px",
    lineHeight: 1.55,
    color: "#2c2c2c",
    fontFamily: "Georgia, 'Times New Roman', serif",
  };

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        color: "#2c2c2c",
      }}
    >
      <div className="px-14 py-12">
        {/* Top thin rule */}
        <div style={{ height: "1px", backgroundColor: themeColor, marginBottom: "20px" }} />

        {/* Monogram */}
        <div className="flex justify-center">
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: themeColor,
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              fontWeight: 700,
              fontFamily: "Georgia, serif",
            }}
          >
            {initial}
          </div>
        </div>

        {/* Name */}
        {coverLetterInfo?.senderName && (
          <h1
            className="text-center"
            style={{
              fontSize: "26px",
              fontStyle: "italic",
              fontWeight: 400,
              margin: "12px 0 4px 0",
              color: "#2c2c2c",
            }}
          >
            {coverLetterInfo.senderName}
          </h1>
        )}

        {coverLetterInfo?.jobTitle && (
          <p
            className="text-center"
            style={{
              fontSize: "10.5px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: themeColor,
              margin: "0 0 10px 0",
            }}
          >
            {coverLetterInfo.jobTitle}
          </p>
        )}

        {contactItems.length > 0 && (
          <p className="text-center" style={{ fontSize: "10.5px", color: "#5b5b5b", margin: 0 }}>
            {contactItems.join("  ·  ")}
          </p>
        )}

        {/* Bottom thin rule */}
        <div style={{ height: "1px", backgroundColor: themeColor, marginTop: "20px", marginBottom: "24px" }} />

        {/* Date */}
        <p
          style={{
            fontSize: "11px",
            fontStyle: "italic",
            color: "#5b5b5b",
            textAlign: "right",
            marginBottom: "18px",
          }}
        >
          {formattedDate}
        </p>

        {/* Recipient */}
        <div style={{ marginBottom: "18px", fontSize: "11px", lineHeight: 1.5 }}>
          <p style={{ margin: 0, fontWeight: 700 }}>
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && <p style={{ margin: 0 }}>{coverLetterInfo.companyName}</p>}
        </div>

        {generated.greeting && (
          <p style={{ fontSize: "12px", fontStyle: "italic", marginBottom: "14px", color: themeColor }}>
            ~ {generated.greeting} ~
          </p>
        )}

        {generated.openingParagraph && <p style={paragraphStyle}>{generated.openingParagraph}</p>}
        {bodyParagraphs.map((para, idx) => (
          <p key={idx} style={paragraphStyle}>
            {para}
          </p>
        ))}
        {generated.closingParagraph && <p style={paragraphStyle}>{generated.closingParagraph}</p>}

        <div style={{ marginTop: "26px" }}>
          {generated.signature && (
            <p style={{ fontSize: "11px", fontStyle: "italic", margin: "0 0 22px 0" }}>
              {generated.signature}
            </p>
          )}
          {coverLetterInfo?.senderName && (
            <p
              style={{
                fontSize: "16px",
                fontStyle: "italic",
                margin: 0,
                color: themeColor,
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

export default ElegantSerif;
