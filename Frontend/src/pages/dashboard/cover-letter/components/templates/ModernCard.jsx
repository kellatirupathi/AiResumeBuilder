import React from "react";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";

const ModernCard = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#6366f1";
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

  const ContactItem = ({ icon: Icon, text }) =>
    text ? (
      <div className="flex items-center gap-1.5" style={{ fontSize: "10.5px", color: "#374151" }}>
        <Icon size={11} style={{ color: themeColor }} />
        <span>{text}</span>
      </div>
    ) : null;

  return (
    <div
      className="bg-gray-50 h-full min-h-[800px] rounded-md overflow-hidden"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
        padding: "28px",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
          padding: "36px",
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start gap-6 mb-2">
          <div>
            {coverLetterInfo?.senderName && (
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  margin: 0,
                  color: "#111827",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.15,
                }}
              >
                {coverLetterInfo.senderName}
              </h1>
            )}
            {coverLetterInfo?.jobTitle && (
              <p style={{ fontSize: "12px", marginTop: "4px", color: themeColor, fontWeight: 600 }}>
                {coverLetterInfo.jobTitle}
              </p>
            )}
          </div>
        </div>

        {/* Accent dot + contact row */}
        <div className="flex items-center gap-3 flex-wrap" style={{ marginTop: "14px", marginBottom: "20px" }}>
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: themeColor,
              display: "inline-block",
            }}
          />
          <ContactItem icon={Mail} text={coverLetterInfo?.senderEmail} />
          <ContactItem icon={Phone} text={coverLetterInfo?.senderPhone} />
          <ContactItem icon={MapPin} text={coverLetterInfo?.senderAddress} />
          <ContactItem icon={Linkedin} text={coverLetterInfo?.senderLinkedin} />
        </div>

        <div style={{ height: "1px", backgroundColor: "#e5e7eb", marginBottom: "20px" }} />

        {/* Date + recipient */}
        <div className="flex justify-between items-start mb-5">
          <div style={{ fontSize: "11px", lineHeight: 1.5 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>
              {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
            </p>
            {coverLetterInfo?.companyName && (
              <p style={{ margin: 0, color: "#4b5563" }}>{coverLetterInfo.companyName}</p>
            )}
          </div>
          <div style={{ fontSize: "10.5px", color: "#6b7280" }}>{formattedDate}</div>
        </div>

        {generated.greeting && (
          <p style={{ fontSize: "11px", marginBottom: "12px", fontWeight: 500 }}>{generated.greeting}</p>
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

export default ModernCard;
