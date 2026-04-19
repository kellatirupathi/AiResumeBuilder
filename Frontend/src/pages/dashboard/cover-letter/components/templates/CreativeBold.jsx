import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const CreativeBold = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#7c3aed";
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

  const ContactPill = ({ icon: Icon, text }) =>
    text ? (
      <div className="flex items-center gap-1.5" style={{ fontSize: "10.5px", color: "#374151" }}>
        <Icon size={12} style={{ color: themeColor }} />
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
      {/* Banner */}
      <div
        style={{
          backgroundColor: themeColor,
          padding: "30px 40px",
          borderBottomLeftRadius: "24px",
          borderBottomRightRadius: "24px",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        {coverLetterInfo?.senderName && (
          <h1 style={{ fontSize: "32px", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
            {coverLetterInfo.senderName}
          </h1>
        )}
        {coverLetterInfo?.jobTitle && (
          <p style={{ fontSize: "13px", marginTop: "6px", opacity: 0.7, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {coverLetterInfo.jobTitle}
          </p>
        )}
      </div>

      <div className="px-12 pt-6 pb-12">
        {/* Contact row */}
        <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center mb-8">
          <ContactPill icon={Mail} text={coverLetterInfo?.senderEmail} />
          <ContactPill icon={Phone} text={coverLetterInfo?.senderPhone} />
          <ContactPill icon={MapPin} text={coverLetterInfo?.senderAddress} />
          <ContactPill icon={Linkedin} text={coverLetterInfo?.senderLinkedin} />
          <ContactPill icon={Globe} text={coverLetterInfo?.senderPortfolio} />
        </div>

        {/* Date + recipient */}
        <div className="flex justify-between items-start mb-5">
          <div style={{ fontSize: "11px", lineHeight: 1.5 }}>
            <p style={{ margin: 0, fontWeight: 700, color: themeColor }}>
              {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
            </p>
            {coverLetterInfo?.companyName && (
              <p style={{ margin: 0, color: "#4b5563" }}>{coverLetterInfo.companyName}</p>
            )}
          </div>
          <div style={{ fontSize: "11px", color: "#6b7280", fontStyle: "italic" }}>
            {formattedDate}
          </div>
        </div>

        {/* Greeting */}
        {generated.greeting && (
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#1f2937", marginBottom: "14px" }}>
            {generated.greeting}
          </p>
        )}

        {/* Opening with drop cap */}
        {generated.openingParagraph && (
          <p style={paragraphStyle}>
            <span
              style={{
                float: "left",
                fontSize: "38px",
                lineHeight: 0.9,
                fontWeight: 800,
                color: themeColor,
                paddingRight: "8px",
                paddingTop: "4px",
              }}
            >
              {generated.openingParagraph.charAt(0)}
            </span>
            {generated.openingParagraph.slice(1)}
          </p>
        )}

        {bodyParagraphs.map((para, idx) => (
          <p key={idx} style={paragraphStyle}>
            {para}
          </p>
        ))}

        {generated.closingParagraph && <p style={paragraphStyle}>{generated.closingParagraph}</p>}

        {/* Signature */}
        <div style={{ marginTop: "24px" }}>
          {generated.signature && (
            <p style={{ fontSize: "11px", color: "#1f2937", margin: "0 0 8px 0" }}>
              {generated.signature}
            </p>
          )}
          {coverLetterInfo?.senderName && (
            <p
              style={{
                fontFamily: "'Caveat', 'Brush Script MT', cursive",
                fontSize: "28px",
                color: themeColor,
                margin: 0,
                lineHeight: 1,
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

export default CreativeBold;
