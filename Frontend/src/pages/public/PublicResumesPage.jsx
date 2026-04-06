import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, LayoutTemplate, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resumeTemplates } from "@/pages/dashboard/edit-resume/components/resumeDesignOptions";
import PreviewPage from "@/pages/dashboard/edit-resume/components/PreviewPage";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import publicResumeTemplateData from "@/data/publicResumeTemplateData.json";

const templateThemeColors = {
  modern: "#0f766e",
  professional: "#1f2937",
  creative: "#7c3aed",
  minimalist: "#2563eb",
  executive: "#334155",
  "creative-modern": "#1e3a8a",
  "tech-startup": "#059669",
  "elegant-portfolio": "#1d4ed8",
  "modern-timeline": "#0f172a",
  "modern-grid": "#1d4ed8",
  "modern-sidebar": "#0ea5e9",
  "gradient-accent": "#4338ca",
  "bold-impact": "#0f172a",
  "split-frame": "#1f2937",
  "minimalist-pro": "#111827",
  "digital-card": "#475569"
};

const highlights = [
  "One shared fullstack resume dataset shown across every template.",
  "All sections are included: summary, skills, experience, projects, education, certifications, hobbies, languages, and publications.",
  "Two real-looking projects and one experience item are rendered exactly through the frontend template components."
];

const previewScale = 0.92;
const previewWidth = 794;
const previewHeight = 1123;

export default function PublicResumesPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(resumeTemplates[0]?.id ?? "modern");

  const selectedTemplate = useMemo(
    () => resumeTemplates.find((template) => template.id === selectedTemplateId) ?? resumeTemplates[0],
    [selectedTemplateId]
  );

  const selectedResumeInfo = useMemo(
    () => ({
      ...publicResumeTemplateData,
      template: selectedTemplate.id,
      themeColor: templateThemeColors[selectedTemplate.id] || "#2563eb"
    }),
    [selectedTemplate]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50">
        <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                See how the same fullstack resume looks across every NxtResume template.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Explore real frontend template previews using one shared dummy resume with all important sections already filled. This lets users compare visual style, hierarchy, readability, and project presentation before signing in.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/auth/sign-in">
                  <Button className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map((highlight) => (
                <div key={highlight} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <div className="flex gap-3">
                    <div className="mt-0.5 rounded-full bg-emerald-50 p-1.5 text-emerald-600">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-6 text-slate-700">{highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <LayoutTemplate className="h-4 w-4 text-indigo-600" />
                Templates
              </div>
              <p className="text-3xl font-bold text-slate-950">{resumeTemplates.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Filled Sections
              </div>
              <p className="text-3xl font-bold text-slate-950">9+</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Eye className="h-4 w-4 text-indigo-600" />
                Preview Type
              </div>
              <p className="text-base font-semibold text-slate-950">Real frontend templates</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1720px] px-6 py-12">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,1),rgba(248,250,252,0.92))] px-8 py-8">
            <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Template Gallery</div>
                <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.65rem]">
                  Browse templates on the left. Inspect a full resume stage on the right.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  This section is built for comparison. Every design uses the same dummy resume, so what changes is only the
                  template structure, spacing, typography, and overall presentation quality.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Templates</div>
                  <div className="mt-2 text-2xl font-bold text-slate-950">{resumeTemplates.length}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Content</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">One shared resume</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Render</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">Live frontend preview</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-[650px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50/70 xl:border-b-0 xl:border-r xl:border-slate-200">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">Browse Templates</h3>
                    <p className="mt-1 text-sm text-slate-500">Fixed cards, three-column grid, fast visual comparison.</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                    {resumeTemplates.length} options
                  </span>
                </div>
              </div>

              <div className="grid max-h-[1180px] grid-cols-1 gap-4 overflow-y-auto p-6 sm:grid-cols-2 xl:grid-cols-3">
                {resumeTemplates.map((template) => {
                  const isSelected = template.id === selectedTemplateId;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(template.id)}
                      className={`group flex min-h-[246px] flex-col overflow-hidden rounded-2xl border text-left transition ${
                        isSelected
                          ? "border-slate-950 bg-white shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className="px-4 py-3">
                        <h4 className="truncate text-sm font-bold text-slate-950">{template.name}</h4>
                      </div>

                      <div className="flex flex-1 items-center justify-center border-t border-slate-200 bg-slate-50/50 p-3">
                        <img
                          src={template.previewUrl}
                          alt={`${template.name} preview`}
                          className="h-[172px] w-full rounded-xl border border-slate-200 object-cover object-top shadow-sm"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </aside>

            <article className="bg-white">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Selected Template</div>
                    <h3 className="mt-1 text-2xl font-bold text-slate-950">{selectedTemplate.name}</h3>
                    <p className="mt-1 text-sm capitalize text-slate-500">{selectedTemplate.category} template</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      {selectedTemplate.id}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                      Full page stage
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 lg:p-6 xl:p-8">
                <div
                  className="mx-auto overflow-auto rounded-[30px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
                  style={{
                    width: `${previewWidth * previewScale}px`,
                    height: `${previewHeight * previewScale}px`,
                    maxWidth: "100%"
                  }}
                >
                  <div
                    className="origin-top-left"
                    style={{
                      width: "210mm",
                      transform: `scale(${previewScale})`,
                      transformOrigin: "top left",
                      height: `${previewHeight}px`
                    }}
                  >
                    <PreviewPage resumeData={selectedResumeInfo} />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
