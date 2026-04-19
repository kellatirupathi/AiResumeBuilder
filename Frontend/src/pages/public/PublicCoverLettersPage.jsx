import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Check, Mail } from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import { coverLetterTemplates } from "@/pages/dashboard/cover-letter/components/coverLetterDesignOptions";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const HIGHLIGHTS = [
  "AI reads your resume + the job description, then writes a letter tailored to the role",
  "10 professional templates — switch anytime, content stays the same",
  "Tone presets (formal · friendly · enthusiastic), one-click PDF, Drive sharing",
];

const FLOW = [
  {
    n: "01",
    t: "Pick a resume",
    d: "Choose an existing resume or upload a PDF.",
  },
  {
    n: "02",
    t: "Paste the JD",
    d: "Job title, company, and the full description.",
  },
  {
    n: "03",
    t: "Ship it",
    d: "Edit if you want. Download PDF. Share the link.",
  },
];

export default function PublicCoverLettersPage() {
  const user = useSelector((s) => s.editUser.userData);

  return (
    <>
      <Helmet>
        <title>Cover Letter Templates — NxtResume</title>
        <meta
          name="description"
          content="10 professionally designed cover letter templates. Generate tailored cover letters with AI in seconds. Free forever."
        />
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
                AI-GENERATED · 10 TEMPLATES · FREE
              </span>

              <h1
                style={DISPLAY}
                className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[60px]"
              >
                The cover letter,{" "}
                <span className="text-slate-400">solved.</span>
              </h1>

              <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-600">
                Upload your resume. Paste a job description. Walk away with a
                cover letter that matches the role — not a "Dear Sir/Madam"
                template.
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
                    Write one free
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </Link>
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-1.5 px-2 text-[14px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
                >
                  Browse templates →
                </a>
              </div>
            </div>

            {/* Right: template mosaic */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-[600px]">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-slate-100/80" />
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
                  {coverLetterTemplates.slice(0, 6).map((tpl) => (
                    <div
                      key={tpl.id}
                      className="overflow-hidden rounded-md bg-slate-100"
                    >
                      <div
                        className="h-1 w-full"
                        style={{ backgroundColor: tpl.accentColor }}
                      />
                      <img
                        src={tpl.previewUrl}
                        alt={tpl.name}
                        className="aspect-[3/4] w-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fb = e.currentTarget.nextElementSibling;
                          if (fb) fb.style.display = "flex";
                        }}
                      />
                      <div
                        className="hidden aspect-[3/4] items-center justify-center"
                        style={{ backgroundColor: `${tpl.accentColor}15` }}
                      >
                        <Mail
                          className="h-5 w-5"
                          style={{ color: tpl.accentColor }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="border-b border-slate-200 bg-[#FAFAF9]">
          <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                How it works
              </p>
              <h2
                className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
                style={DISPLAY}
              >
                Three steps.{" "}
                <span className="text-slate-400">Under a minute.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {FLOW.map((step) => (
                <motion.div
                  key={step.n}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5 }}
                  className="rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <div
                    className="text-[14px] font-bold tracking-[0.2em]"
                    style={{ color: ACCENT }}
                  >
                    {step.n}
                  </div>
                  <p
                    className="mt-3 text-[24px] font-semibold text-slate-900"
                    style={DISPLAY}
                  >
                    {step.t}
                  </p>
                  <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                    {step.d}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Template gallery ── */}
        <section id="gallery" className="border-b border-slate-200 bg-white">
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
                  {coverLetterTemplates.length} designs. One letter.
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
              className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              {coverLetterTemplates.map((tpl) => (
                <Link
                  key={tpl.id}
                  to="/auth/sign-in"
                  className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
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
                      style={{ backgroundColor: `${tpl.accentColor}15` }}
                    >
                      <Mail
                        className="h-8 w-8"
                        style={{ color: tpl.accentColor }}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                        Use this
                      </span>
                    </div>
                  </div>
                  <div
                    className="border-t px-3 py-2"
                    style={{ borderColor: `${tpl.accentColor}25` }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] font-semibold text-slate-900">
                        {tpl.name}
                      </p>
                      <span className="text-[10px] uppercase tracking-wide text-slate-400">
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Dark band / reassurance ── */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-white">
          <div
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 15%, rgba(255,72,0,0.4), transparent 45%)",
            }}
          />
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-24 lg:grid-cols-12 lg:px-8">
            <div className="lg:col-span-7">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: ACCENT }}
              >
                Personalized, always
              </p>
              <h2
                className="mt-3 text-[40px] font-semibold leading-tight tracking-tight sm:text-[48px]"
                style={DISPLAY}
              >
                No "Dear Sir/Madam" nonsense.
              </h2>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/80">
                Every letter is tailored. The AI reads your resume experience,
                matches it to the job description's specific requirements, and
                writes in the tone you pick. You can regenerate, switch
                templates, and edit any paragraph inline.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:col-span-5">
              {[
                "Tone presets",
                "Switch template anytime",
                "Drive sharing",
                "Public link",
                "PDF download",
                "Regenerate on demand",
              ].map((f) => (
                <div
                  key={f}
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-[13px] font-medium text-white/90 backdrop-blur-sm"
                >
                  <Check
                    className="-ml-0.5 mr-1 inline h-3.5 w-3.5"
                    style={{ color: ACCENT }}
                  />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="bg-white">
          <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
            <h2
              className="text-[40px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[52px]"
              style={DISPLAY}
            >
              Ready to land your dream role?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[16px] text-slate-600">
              Free forever. Generate your first tailored cover letter in under a
              minute.
            </p>
            <div className="mt-10 flex items-center justify-center gap-3">
              <Link to="/auth/sign-in">
                <button className="group inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-slate-800">
                  Get started free
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </Link>
              <Link
                to="/resumes"
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
              >
                Browse resume templates
                <ArrowRight className="h-3.5 w-3.5" />
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
          <div className="flex items-center gap-2.5">
            <NxtResumeLogoMark className="h-7 w-7" />
            <span
              className="text-[15px] font-semibold tracking-tight text-slate-900"
              style={DISPLAY}
            >
              NxtResume
            </span>
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
