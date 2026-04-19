import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Star } from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";
import { resumeTemplates } from "@/pages/dashboard/edit-resume/components/resumeDesignOptions";
import PreviewPage from "@/pages/dashboard/edit-resume/components/PreviewPage";
import publicResumeTemplateData from "@/data/publicResumeTemplateData.json";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

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
  "digital-card": "#475569",
};

const HIGHLIGHTS = [
  "ATS-safe — clean structure, no hidden tables, no images where recruiters can't read them",
  "Print-perfect — the downloaded PDF matches the preview, down to the pixel",
  "Editable anywhere — switch templates anytime, content stays",
];

export default function PublicResumesPage() {
  const user = useSelector((s) => s.editUser.userData);
  const [selectedId, setSelectedId] = useState(
    resumeTemplates[0]?.id ?? "modern"
  );

  const selectedTemplate = useMemo(
    () =>
      resumeTemplates.find((t) => t.id === selectedId) || resumeTemplates[0],
    [selectedId]
  );

  const selectedResumeInfo = useMemo(
    () => ({
      ...publicResumeTemplateData,
      template: selectedTemplate.id,
      themeColor: templateThemeColors[selectedTemplate.id] || "#0F172A",
    }),
    [selectedTemplate]
  );

  return (
    <>
      <Helmet>
        <title>Free Resume Templates — 16 ATS-Friendly Designs · NxtResume</title>
        <meta
          name="description"
          content="Browse 16 free, ATS-friendly resume templates. Professional, executive, modern, creative, minimalist designs — all downloadable as pixel-perfect PDF. No sign-up to preview. Free forever."
        />
        <meta name="keywords" content="free resume templates, ATS friendly resume templates, professional resume templates, modern resume templates, resume templates PDF, best resume templates 2026, simple resume template, creative resume template, executive resume template, one page resume template" />
        <link rel="canonical" href="https://ai-resume-builder-ochre-five.vercel.app/resumes" />
        <meta property="og:title" content="Free Resume Templates — 16 ATS-Friendly Designs · NxtResume" />
        <meta property="og:description" content="Browse 16 free ATS-friendly resume templates. Professional, modern, creative, minimalist — all free, no credit card." />
        <meta property="og:url" content="https://ai-resume-builder-ochre-five.vercel.app/resumes" />
        <meta name="twitter:title" content="16 Free ATS-Friendly Resume Templates" />
        <meta name="twitter:description" content="Professional, modern, creative, minimalist resume templates — free, downloadable as PDF." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Free Resume Templates — 16 ATS-Friendly Designs",
          "description": "A gallery of 16 free, ATS-friendly resume templates covering professional, executive, modern, creative, and minimalist styles.",
          "url": "https://ai-resume-builder-ochre-five.vercel.app/resumes",
          "isPartOf": {
            "@type": "WebSite",
            "name": "NxtResume",
            "url": "https://ai-resume-builder-ochre-five.vercel.app"
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ai-resume-builder-ochre-five.vercel.app/" },
              { "@type": "ListItem", "position": 2, "name": "Resume Templates", "item": "https://ai-resume-builder-ochre-five.vercel.app/resumes" }
            ]
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Header user={user} />

        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-20 pt-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-24">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-slate-700">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                16 TEMPLATES · ALL FREE
              </span>

              <h1
                style={DISPLAY}
                className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[60px]"
              >
                Resume templates{" "}
                <span className="text-slate-400">
                  that look hand-designed.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-600">
                16 designs. ATS-safe by default. Pick one, fill in your details,
                and ship a resume recruiters actually read.
              </p>

              <ul className="mt-6 space-y-2">
                {HIGHLIGHTS.map((h) => (
                  <li
                    key={h}
                    className="flex gap-2.5 text-[14px] text-slate-700"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      style={{ color: ACCENT }}
                    />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link to="/auth/sign-in">
                  <button className="group inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-slate-800">
                    Build your resume free
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-1.5 px-2 text-[14px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
                >
                  Browse all 16 templates →
                </a>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[
                    "#FB923C",
                    "#8B5CF6",
                    "#10B981",
                    "#0EA5E9",
                    "#F43F5E",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-white ring-1 ring-slate-100"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="text-[13px] text-slate-600">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="ml-1 font-semibold text-slate-900">
                      4.9
                    </span>
                  </div>
                  <p className="text-slate-500">from 2,300+ student reviews</p>
                </div>
              </div>
            </div>

            {/* Right: live preview of selected template */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-[580px]">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-slate-100/80" />
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
                  <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="mx-auto flex h-5 max-w-[60%] flex-1 items-center justify-center rounded-md bg-white px-2 text-[10px] text-slate-500">
                      preview · {selectedTemplate.name}
                    </div>
                    <div className="h-5 w-5" />
                  </div>
                  <div
                    className="relative origin-top overflow-hidden bg-white"
                    style={{ aspectRatio: "794 / 1123" }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        transform: "scale(0.68)",
                        transformOrigin: "top left",
                        width: "147%",
                        height: "147%",
                      }}
                    >
                      <PreviewPage resumeData={selectedResumeInfo} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Gallery ── */}
        <section id="gallery" className="border-b border-slate-200 bg-[#FAFAF9]">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="max-w-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  All templates
                </p>
                <h2
                  className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
                  style={DISPLAY}
                >
                  {resumeTemplates.length} designs. One click to switch.
                </h2>
              </div>
              <Link
                to="/auth/sign-in"
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-900 underline-offset-4 hover:underline"
              >
                Sign in to use →
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }}
              transition={{ duration: 0.5 }}
              className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4"
            >
              {resumeTemplates.map((tpl) => {
                const active = selectedId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedId(tpl.id)}
                    className={`group overflow-hidden rounded-lg border bg-white text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      active
                        ? "border-slate-900 ring-2 ring-slate-900/10"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                      <img
                        src={tpl.previewUrl}
                        alt={tpl.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fb = e.currentTarget.nextElementSibling;
                          if (fb) fb.style.display = "flex";
                        }}
                      />
                      <div
                        className="absolute inset-0 hidden items-center justify-center"
                        style={{
                          backgroundColor: `${
                            templateThemeColors[tpl.id] || "#0F172A"
                          }12`,
                        }}
                      >
                        <NxtResumeWordmark size="18px" color={templateThemeColors[tpl.id] || "#0F172A"} />
                      </div>
                      {active && (
                        <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div
                      className="border-t px-3 py-2"
                      style={{
                        borderColor: `${
                          templateThemeColors[tpl.id] || "#0F172A"
                        }20`,
                      }}
                    >
                      <p className="text-[12px] font-semibold text-slate-900">
                        {tpl.name}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">
                        {tpl.category || "Template"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ── Why these templates ── */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-24 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Why these designs
              </p>
              <h2
                className="mt-3 text-[36px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
                style={DISPLAY}
              >
                We hired designers,{" "}
                <span className="text-slate-400">not a generator.</span>
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-slate-600">
                Every template is built on a real editorial grid, tested against
                ATS software (Workday, Greenhouse, Lever), and print-verified at
                A4 size. Nothing here is a stretched Canva file.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-7">
              {[
                {
                  k: "ATS-safe",
                  b: "Clean semantic HTML. No hidden text. No weird multi-column hacks that confuse parsers.",
                },
                {
                  k: "Print-perfect",
                  b: "PDF output matches preview. Margins, fonts, and line breaks behave the same on screen and paper.",
                },
                {
                  k: "Fast to edit",
                  b: "One section at a time. Live preview on the right. Switch template anytime without redoing content.",
                },
                {
                  k: "Pick by industry",
                  b: "Minimalist Pro for tech. Executive for senior roles. Creative Modern for design. Pick what fits.",
                },
              ].map((x) => (
                <div
                  key={x.k}
                  className="rounded-xl border border-slate-200 bg-white p-6"
                >
                  <p
                    className="text-[20px] font-semibold tracking-tight text-slate-900"
                    style={DISPLAY}
                  >
                    {x.k}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                    {x.b}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-slate-900 text-white">
          <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
            <h2
              className="text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-[52px]"
              style={DISPLAY}
            >
              Pick a template.{" "}
              <span className="text-white/50">Ship a resume tonight.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[16px] text-white/70">
              Free forever. No credit card. No premium lock. Just a good resume.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link to="/auth/sign-in">
                <button className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5">
                  Start building
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Link>
              <Link
                to="/cover-letters"
                className="text-[14px] font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
              >
                Browse cover letters →
              </Link>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </>
  );
}

function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center">
            <NxtResumeWordmark size="18px" color="#0F172A" />
          </div>
          <div className="flex items-center gap-5 text-[12px] text-slate-500">
            <Link to="/resumes" className="hover:text-slate-900">
              Resumes
            </Link>
            <Link to="/cover-letters" className="hover:text-slate-900">
              Cover Letters
            </Link>
            <Link to="/ats-checker" className="hover:text-slate-900">
              ATS Checker
            </Link>
            <Link to="/documentation" className="hover:text-slate-900">
              Docs
            </Link>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} NxtResume
          </p>
        </div>
      </div>
    </footer>
  );
}
