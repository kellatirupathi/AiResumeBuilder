import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const SplitHeader = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#dc2626";
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
    lineHeight: 1.55,
    color: "#1f2937",
  };

  const ContactRow = ({ icon: Icon, text }) =>
    text ? (
      <div className="flex items-center gap-1.5" style={{ fontSize: "10.5px", color: "#374151", lineHeight: 1.5 }}>
        <Icon size={11} style={{ color: themeColor }} />
        <span>{text}</span>
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
        {/* Header row */}
        <div className="flex justify-between items-start gap-6">
          <div>
            {coverLetterInfo?.senderName && (
              <h1
                style={{
                  fontSize: "28px",
                  fontWeight: 800,
                  margin: 0,
                  color: themeColor,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.1,
                }}
              >
                {coverLetterInfo.senderName}
              </h1>
            )}
            {coverLetterInfo?.jobTitle && (
              <p style={{ fontSize: "12px", marginTop: "4px", color: "#4b5563", fontWeight: 500 }}>
                {coverLetterInfo.jobTitle}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 items-end text-right">
            <ContactRow icon={Mail} text={coverLetterInfo?.senderEmail} />
            <ContactRow icon={Phone} text={coverLetterInfo?.senderPhone} />
            <ContactRow icon={MapPin} text={coverLetterInfo?.senderAddress} />
            <ContactRow icon={Linkedin} text={coverLetterInfo?.senderLinkedin} />
            <ContactRow icon={Globe} text={coverLetterInfo?.senderPortfolio} />
          </div>
        </div>

        {/* Accent bar */}
        <div style={{ height: "4px", backgroundColor: themeColor, marginTop: "18px", marginBottom: "10px" }} />

        {/* Date */}
        <div className="text-right" style={{ fontSize: "10.5px", color: "#6b7280", marginBottom: "18px" }}>
          {formattedDate}
        </div>

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

export default SplitHeader;
