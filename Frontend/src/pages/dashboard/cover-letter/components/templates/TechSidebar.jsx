import React from "react";
import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";

const TechSidebar = ({ coverLetterInfo }) => {
  const themeColor = coverLetterInfo?.themeColor || "#0ea5e9";
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

  const SidebarItem = ({ icon: Icon, text }) =>
    text ? (
      <div className="flex items-start gap-2" style={{ marginBottom: "10px" }}>
        <Icon size={13} className="mt-0.5 flex-shrink-0" />
        <span style={{ fontSize: "10.5px", lineHeight: 1.4, wordBreak: "break-word" }}>{text}</span>
      </div>
    ) : null;

  return (
    <div
      className="shadow-xl bg-white h-full min-h-[800px] rounded-md overflow-hidden relative"
      style={{
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: "#1f2937",
      }}
    >
      {/* Sidebar */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: "32%",
          backgroundColor: themeColor,
          color: "#ffffff",
          padding: "36px 22px",
        }}
      >
        {coverLetterInfo?.senderName && (
          <h1 style={{ fontSize: "20px", fontWeight: 800, margin: 0, lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {coverLetterInfo.senderName}
          </h1>
        )}
        {coverLetterInfo?.jobTitle && (
          <p style={{ fontSize: "11px", marginTop: "6px", opacity: 0.85, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {coverLetterInfo.jobTitle}
          </p>
        )}

        <div
          style={{
            height: "2px",
            backgroundColor: "rgba(255,255,255,0.35)",
            margin: "18px 0",
          }}
        />

        <p style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.85, margin: "0 0 12px 0", fontWeight: 600 }}>
          Contact
        </p>

        <SidebarItem icon={Mail} text={coverLetterInfo?.senderEmail} />
        <SidebarItem icon={Phone} text={coverLetterInfo?.senderPhone} />
        <SidebarItem icon={MapPin} text={coverLetterInfo?.senderAddress} />
        <SidebarItem icon={Linkedin} text={coverLetterInfo?.senderLinkedin} />
        <SidebarItem icon={Globe} text={coverLetterInfo?.senderPortfolio} />
      </div>

      {/* Right column */}
      <div className="ml-[32%]" style={{ padding: "36px 32px 36px 36px" }}>
        <div className="text-right" style={{ fontSize: "10.5px", color: "#6b7280", marginBottom: "20px" }}>
          {formattedDate}
        </div>

        <div style={{ marginBottom: "18px", fontSize: "11px", lineHeight: 1.5 }}>
          <p style={{ margin: 0, fontWeight: 700, color: themeColor }}>
            {coverLetterInfo?.hiringManagerName || "Hiring Manager"}
          </p>
          {coverLetterInfo?.companyName && (
            <p style={{ margin: 0, color: "#374151" }}>{coverLetterInfo.companyName}</p>
          )}
          {coverLetterInfo?.jobTitle && (
            <p style={{ margin: 0, color: "#6b7280" }}>Re: {coverLetterInfo.jobTitle}</p>
          )}
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

        <div style={{ marginTop: "26px" }}>
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

export default TechSidebar;
