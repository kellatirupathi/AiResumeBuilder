import { Crown, Layout, Sparkles, Star, Wand2 } from "lucide-react";

export const resumeThemeColors = [
  "#0077B5",
  "#2E77BC",
  "#336699",
  "#339999",
  "#33CC99",
  "#669933",
  "#FF5733",
  "#FF3366",
  "#9933CC",
  "#6633CC",
  "#33CCFF",
  "#FF9933",
  "#333333",
  "#666666",
  "#993366",
  "#CC6633",
  "#CC9933",
  "#66CC33",
  "#CC3366",
  "#3366FF",
];

export const resumeTemplates = [
  {
    id: "modern",
    name: "Modern Resume",
    category: "popular",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252179/Resume%20Images%20Templates/pu5pkgxohwvxd13d9iee.png",
  },
  {
    id: "professional",
    name: "Professional Resume",
    category: "popular",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252179/Resume%20Images%20Templates/r704slu2x5avnh5wmifi.png",
  },
  {
    id: "creative",
    name: "Creative Resume",
    category: "creative",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252179/Resume%20Images%20Templates/xpcaprlpan0rgawykgdm.png",
  },
  {
    id: "minimalist",
    name: "Minimalist Resume",
    category: "popular",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/qnz20syiomsegdj7uwn0.png",
  },
  {
    id: "executive",
    name: "Executive Resume",
    category: "professional",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/jtxlrpuvrrxkqwrww7p9.png",
  },
  {
    id: "creative-modern",
    name: "Creative Modern",
    category: "creative",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/sojnjw3soaktcibgb79c.png",
  },
  {
    id: "tech-startup",
    name: "Tech Startup",
    category: "tech",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/zjsgyy4zqfoouchownft.png",
  },
  {
    id: "elegant-portfolio",
    name: "Elegant Portfolio",
    category: "creative",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252179/Resume%20Images%20Templates/qo0clke0rznfrwcbxwxg.png",
  },
  {
    id: "modern-timeline",
    name: "Modern Timeline",
    category: "popular",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/odqtrwbnplyveig7sgz4.png",
  },
  {
    id: "modern-grid",
    name: "Modern Grid",
    category: "modern",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/hdeeyaq1gs8fw47looly.png",
  },
  {
    id: "modern-sidebar",
    name: "Modern Sidebar",
    category: "modern",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/fgfttdr0u4dn5yqti9sc.png",
  },
  {
    id: "gradient-accent",
    name: "Gradient Accent",
    category: "creative",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252179/Resume%20Images%20Templates/l55qzqfhne05iri6jhfb.png",
  },
  {
    id: "bold-impact",
    name: "Bold Impact",
    category: "modern",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252180/Resume%20Images%20Templates/ekngtf9xnhwfpbhlro6s.png",
  },
  {
    id: "split-frame",
    name: "Split Frame",
    category: "creative",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252178/Resume%20Images%20Templates/dkokrk7qfdxszto8pai4.png",
  },
  {
    id: "minimalist-pro",
    name: "Minimalist Pro",
    category: "professional",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252179/Resume%20Images%20Templates/bstwcl1k73xttix5kekh.png",
  },
  {
    id: "digital-card",
    name: "Digital Card",
    category: "modern",
    previewUrl: "https://res.cloudinary.com/dja7l3iq8/image/upload/v1747252178/Resume%20Images%20Templates/o9asyqx9szi9hdkuburu.png",
  },
];

export const resumeTemplateCategories = [
  { id: "all", name: "All Templates", icon: Layout },
  { id: "popular", name: "Popular", icon: Star },
  { id: "professional", name: "Professional", icon: Crown },
  { id: "creative", name: "Creative", icon: Sparkles },
  { id: "tech", name: "Tech", icon: Wand2 },
];

export const getResumeTemplateById = (templateId) =>
  resumeTemplates.find((template) => template.id === templateId) || resumeTemplates[0];

export const getResumeTemplateName = (templateId) => getResumeTemplateById(templateId)?.name || "Modern Resume";
