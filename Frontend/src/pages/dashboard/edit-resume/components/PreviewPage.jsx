import React from "react";
import { useSelector } from "react-redux";
import ModernTemplate from "./templates/ModernTemplate";
import ProfessionalTemplate from "./templates/ProfessionalTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import CreativeModernTemplate from "./templates/CreativeModernTemplate";
import TechStartupTemplate from "./templates/TechStartupTemplate";
import ElegantPortfolioTemplate from "./templates/ElegantPortfolioTemplate";
import ModernTimelineTemplate from "./templates/ModernTimelineTemplate";
import ModernGridTemplate from "./templates/ModernGridTemplate";
import ModernSidebarTemplate from "./templates/ModernSidebarTemplate";
import GradientAccentTemplate from "./templates/GradientAccentTemplate";
import BoldImpactTemplate from "./templates/BoldImpactTemplate";
import SplitFrameTemplate from "./templates/SplitFrameTemplate";
import MinimalistProTemplate from "./templates/MinimalistProTemplate";
import DigitalCardTemplate from "./templates/DigitalCardTemplate";

function PreviewPage({ resumeData: resumeDataProp = null }) {
  const resumeDataFromStore = useSelector((state) => state.editResume.resumeData);
  const resumeData = resumeDataProp || resumeDataFromStore;

  // If no data yet, show placeholder
  if (!resumeData) {
    return (
      <div className="shadow-xl bg-white h-full min-h-[800px] p-5 rounded-md flex items-center justify-center">
        <div className="text-center text-gray-400">
          <div className="animate-pulse">Loading resume data...</div>
        </div>
      </div>
    );
  }

  // Render the appropriate template based on the template property
  const renderTemplate = () => {
    switch(resumeData?.template) {
      case "professional":
        return <ProfessionalTemplate resumeInfo={resumeData} />;
      case "creative":
        return <CreativeTemplate resumeInfo={resumeData} />;
      case "minimalist":
        return <MinimalistTemplate resumeInfo={resumeData} />;
      case "executive":
        return <ExecutiveTemplate resumeInfo={resumeData} />;
      case "creative-modern":
        return <CreativeModernTemplate resumeInfo={resumeData} />;
      case "tech-startup":
        return <TechStartupTemplate resumeInfo={resumeData} />;
      case "elegant-portfolio":
        return <ElegantPortfolioTemplate resumeInfo={resumeData} />;
      case "modern-timeline":
        return <ModernTimelineTemplate resumeInfo={resumeData} />;
      case "modern-grid":
        return <ModernGridTemplate resumeInfo={resumeData} />;
      case "modern-sidebar":
        return <ModernSidebarTemplate resumeInfo={resumeData} />;
      case "gradient-accent":
        return <GradientAccentTemplate resumeInfo={resumeData} />;
      case "bold-impact":
        return <BoldImpactTemplate resumeInfo={resumeData} />;
      case "split-frame":
        return <SplitFrameTemplate resumeInfo={resumeData} />;
      case "minimalist-pro":
        return <MinimalistProTemplate resumeInfo={resumeData} />;
      case "digital-card":
        return <DigitalCardTemplate resumeInfo={resumeData} />;
      case "modern":
      default:
        return <ModernTemplate resumeInfo={resumeData} />;
    }
  };

  return renderTemplate();
}

export default PreviewPage;
