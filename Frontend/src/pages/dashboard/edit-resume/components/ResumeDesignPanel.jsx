import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CheckCircle,
  ChevronRight,
  Crown,
  Layout,
  Loader2,
  Palette,
  Sparkles,
  Star,
  Wand2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { updateThisResume } from "@/Services/resumeAPI";
import {
  resumeTemplates,
  resumeThemeColors,
} from "./resumeDesignOptions";

const templateCategories = [
  { id: "all", name: "All Templates", icon: Layout },
  { id: "popular", name: "Popular", icon: Star },
  { id: "professional", name: "Professional", icon: Crown },
  { id: "creative", name: "Creative", icon: Sparkles },
  { id: "tech", name: "Tech", icon: Wand2 },
];

function ResumeDesignPanel({
  resumeId,
  resumeInfo,
  onResumeInfoChange,
  defaultTab = "color",
}) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState(
    resumeInfo?.themeColor || "#333333"
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    resumeInfo?.template || "modern"
  );
  const [applying, setApplying] = useState(false);
  const [hoverColor, setHoverColor] = useState(null);
  const [previewHover, setPreviewHover] = useState(null);
  const [fullPreview, setFullPreview] = useState(null);

  useEffect(() => {
    setSelectedColor(resumeInfo?.themeColor || "#333333");
    setSelectedTemplate(resumeInfo?.template || "modern");
  }, [resumeInfo?.template, resumeInfo?.themeColor]);

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "all") {
      return resumeTemplates;
    }

    return resumeTemplates.filter((template) => template.category === activeCategory);
  }, [activeCategory]);

  const syncResumeInfo = (updates) => {
    const updatedResumeInfo = { ...resumeInfo, ...updates };
    dispatch(addResumeData(updatedResumeInfo));
    onResumeInfoChange?.(updatedResumeInfo);
  };

  const handleColorSelect = async (color) => {
    setSelectedColor(color);
    setApplying(true);
    syncResumeInfo({ themeColor: color });

    try {
      await updateThisResume(resumeId, {
        data: {
          themeColor: color,
        },
      });

      toast.success("Theme color updated", {
        description: "Your resume preview has been refreshed.",
        icon: <CheckCircle className="h-4 w-4" style={{ color }} />,
      });
    } catch (error) {
      toast.error("Error updating theme color", {
        description: error.message,
      });
    } finally {
      setApplying(false);
    }
  };

  const handleTemplateSelect = async (templateId) => {
    setSelectedTemplate(templateId);
    setActiveTab("template");
    setApplying(true);
    syncResumeInfo({ template: templateId });

    try {
      await updateThisResume(resumeId, {
        data: {
          template: templateId,
        },
      });
    } catch (error) {
      toast.error("Error updating template", {
        description: error.message,
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <>
      {fullPreview ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setFullPreview(null)}
        >
          <div
            className="relative flex flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={fullPreview.previewUrl}
              alt={fullPreview.name}
              className="max-h-[90vh] max-w-full object-contain shadow-2xl"
            />
            <button
              type="button"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:bg-red-600"
              onClick={() => {
                setFullPreview(null);
                setActiveTab("template");
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col overflow-hidden border-r border-gray-200 bg-white">
          <div className="border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab("color")}
                className={`relative flex-1 border-r px-5 py-4 text-sm font-medium transition-colors ${
                  activeTab === "color"
                    ? "bg-white text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                style={{
                  boxShadow:
                    activeTab === "color" ? "inset 0 -2px 0 0 #111827" : "none",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Palette className="h-4 w-4" />
                  Color Theme
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("template")}
                className={`relative flex-1 px-5 py-4 text-sm font-medium transition-colors ${
                  activeTab === "template"
                    ? "bg-white text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                style={{
                  boxShadow:
                    activeTab === "template" ? "inset 0 -2px 0 0 #111827" : "none",
                }}
              >
                <span className="flex items-center justify-center gap-2">
                  <Layout className="h-4 w-4" />
                  Resume Templates
                </span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "color" ? (
              <div className="p-3">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Choose Resume Accent Color</p>
                    <p className="text-xs text-gray-500">
                      Changes apply live to the preview on the right.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-xs font-medium text-gray-600">{selectedColor}</span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6 xl:grid-cols-5">
                  {resumeThemeColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorSelect(color)}
                      onMouseEnter={() => setHoverColor(color)}
                      onMouseLeave={() => setHoverColor(null)}
                      disabled={applying}
                      className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm transition-all duration-300 hover:scale-110 ${
                        selectedColor === color ? "ring-2 ring-offset-2" : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        ringColor: color,
                        transform:
                          hoverColor === color || selectedColor === color
                            ? "scale(1.08)"
                            : "scale(1)",
                      }}
                      title={`Select ${color}`}
                    >
                      {selectedColor === color && (
                        <CheckCircle className="h-5 w-5 text-white drop-shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col overflow-hidden">
                <div className="flex gap-2 overflow-x-auto px-3 pb-2 pt-3 hide-scrollbar sm:px-4">
                  {templateCategories.map((category) => {
                    const CategoryIcon = category.icon;
                    const isActive = activeCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setActiveCategory(category.id)}
                        className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-gray-800 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        <CategoryIcon className="h-3.5 w-3.5" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {filteredTemplates.map((template) => {
                      const isSelected = selectedTemplate === template.id;
                      const isHovered = previewHover === template.id;

                      return (
                        <div
                          key={template.id}
                          onClick={() => {
                            if (!applying) {
                              handleTemplateSelect(template.id);
                            }
                          }}
                          onMouseEnter={() => setPreviewHover(template.id)}
                          onMouseLeave={() => setPreviewHover(null)}
                          className="group relative overflow-hidden rounded-lg border-2 text-left transition-all"
                          style={{
                            borderColor:
                              isSelected || isHovered ? selectedColor : "rgb(229, 231, 235)",
                            transform:
                              isSelected || isHovered ? "translateY(-2px)" : "translateY(0)",
                            boxShadow:
                              isSelected || isHovered
                                ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                                : "none",
                            cursor: applying ? "default" : "pointer",
                            opacity: applying ? 0.7 : 1,
                          }}
                        >
                          {isSelected && (
                            <div
                              className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md"
                              style={{ backgroundColor: selectedColor }}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </div>
                          )}

                          <div className="absolute left-2 top-2 z-10">
                            {template.category === "popular" && (
                              <div className="flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-xs text-white">
                                <Star className="h-3 w-3" />
                                Popular
                              </div>
                            )}
                          </div>

                          <div className="relative h-48 overflow-hidden bg-white">
                            <img
                              src={template.previewUrl}
                              alt={template.name}
                              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                              <button
                                type="button"
                                className="rounded-full bg-white/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/40"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setFullPreview(template);
                                }}
                              >
                                Preview
                              </button>
                            </div>
                          </div>

                          <div
                            className="flex items-center justify-between border-t px-3 py-2 text-sm font-medium transition-colors duration-300"
                            style={{
                              backgroundColor:
                                isSelected || isHovered ? `${selectedColor}10` : "rgb(249, 250, 251)",
                              borderColor: isSelected ? selectedColor : "rgb(229, 231, 235)",
                            }}
                          >
                            <span>{template.name}</span>
                            <ChevronRight
                              className="h-4 w-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                              style={{
                                color:
                                  isSelected || isHovered ? selectedColor : "rgb(156, 163, 175)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ResumeDesignPanel;
