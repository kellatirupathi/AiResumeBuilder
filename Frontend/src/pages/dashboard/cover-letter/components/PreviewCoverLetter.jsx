import React from "react";
import ExecutiveClassic from "./templates/ExecutiveClassic";
import ModernMinimal from "./templates/ModernMinimal";
import CreativeBold from "./templates/CreativeBold";
import CorporateFormal from "./templates/CorporateFormal";
import TechSidebar from "./templates/TechSidebar";
import ElegantSerif from "./templates/ElegantSerif";
import SplitHeader from "./templates/SplitHeader";
import VerticalAccent from "./templates/VerticalAccent";
import ModernCard from "./templates/ModernCard";
import NewsletterCL from "./templates/NewsletterCL";

function PreviewCoverLetter({ coverLetterInfo }) {
  if (!coverLetterInfo) {
    return (
      <div className="shadow-xl bg-white h-full min-h-[800px] p-5 rounded-md flex items-center justify-center">
        <div className="text-center text-gray-400 animate-pulse">Loading cover letter...</div>
      </div>
    );
  }

  // Map legacy template names to new ones
  const legacyMap = { classic: "executive-classic", modern: "modern-minimal" };
  const template = legacyMap[coverLetterInfo?.template] || coverLetterInfo?.template;

  switch (template) {
    case "modern-minimal":
    case "modern":
      return <ModernMinimal coverLetterInfo={coverLetterInfo} />;
    case "creative-bold":
      return <CreativeBold coverLetterInfo={coverLetterInfo} />;
    case "corporate-formal":
      return <CorporateFormal coverLetterInfo={coverLetterInfo} />;
    case "tech-sidebar":
      return <TechSidebar coverLetterInfo={coverLetterInfo} />;
    case "elegant-serif":
      return <ElegantSerif coverLetterInfo={coverLetterInfo} />;
    case "split-header":
      return <SplitHeader coverLetterInfo={coverLetterInfo} />;
    case "vertical-accent":
      return <VerticalAccent coverLetterInfo={coverLetterInfo} />;
    case "modern-card":
      return <ModernCard coverLetterInfo={coverLetterInfo} />;
    case "newsletter":
      return <NewsletterCL coverLetterInfo={coverLetterInfo} />;
    case "executive-classic":
    default:
      return <ExecutiveClassic coverLetterInfo={coverLetterInfo} />;
  }
}

export default PreviewCoverLetter;
