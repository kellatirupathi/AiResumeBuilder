import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Upload,
  FileText,
  Target,
  Sparkles,
  BarChart3,
  Minus,
  Plus,
} from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY_FONT = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

// ── Static content ────────────────────────────────────────────────────
const score = 84;

const coveredKeywords = ["React", "Node.js", "MongoDB", "TypeScript", "REST API"];
const missingKeywords = ["CI/CD", "Agile", "Unit Testing", "AWS"];

const strengths = [
  "React.js, Node.js, MongoDB, and REST API skills match the role strongly.",
  "Project and work experience clearly show full-stack development ownership.",
  "Resume structure is ATS-friendly with clear headings and readable sections.",
];

const recommendations = [
  "Add cloud deployment and CI/CD terminology to projects or skills.",
  "Mention testing tools and workflow ownership more explicitly.",
  "Mirror a few exact job description keywords in the summary and experience bullets.",
];

const STEPS = [
  {
    n: "01",
    title: "Upload your resume",
    body: "Pick an existing resume you've built here, or drop in a PDF. We extract the content in seconds.",
    icon: Upload,
  },
  {
    n: "02",
    title: "Paste the job description",
    body: "The exact JD from the company posting. No need to clean it up — we read raw text fine.",
    icon: FileText,
  },
  {
    n: "03",
    title: "Get an actionable score",
    body: "A match score, missing keywords, and real suggestions to edit — not vague tips.",
    icon: Target,
  },
];

const WHAT_YOU_GET = [
  {
    title: "Match score",
    body: "A number out of 100 that tells you how close your resume is to the posted role — not a generic rating.",
    icon: BarChart3,
  },
  {
    title: "Missing keywords",
    body: "The exact skills, tools, and phrases from the JD that don't yet appear on your resume.",
    icon: Target,
  },
  {
    title: "Recommendations",
    body: "Specific, editable suggestions — rewrite this bullet, add this section, reorder that experience.",
    icon: Sparkles,
  },
];

const FAQS = [
  {
    q: "What's an ATS, actually?",
    a: "An Applicant Tracking System is software used by recruiters to store, filter, and rank resumes. Most mid-to-large companies use one (Workday, Greenhouse, Lever, iCIMS). Your resume is usually parsed by software before a human ever sees it.",
  },
  {
    q: "Does every company use an ATS?",
    a: "Most companies with more than a handful of open roles do. Small startups may read resumes manually, but if you're applying to 50+ companies, you'll hit an ATS filter at least 30 times. Designing for it is cheap insurance.",
  },
  {
    q: "How accurate is your ATS score?",
    a: "Our score mimics keyword coverage, section parsing, and role alignment — the same signals ATS filters weight. It won't predict whether a specific recruiter replies (that's on your story), but it reliably flags resumes that would be filtered out.",
  },
  {
    q: "Do I need a separate resume for every job?",
    a: "No — but you should tweak a few bullets and skills per role. The ATS checker tells you which ones. Think of it as 10-minute tailoring, not a rewrite.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────
export default function PublicATSCheckerPage() {
  const user = useSelector((s) => s.editUser.userData);

  return (
    <>
      <Helmet>
        <title>Free ATS Resume Checker — Score Your Resume vs Any Job Description · NxtResume</title>
        <meta
          name="description"
          content="Free ATS resume checker. Paste any job description, upload your resume, and get an instant ATS score with missing keywords, weak matches, and fix-it recommendations. Works with Workday, Greenhouse, Lever, iCIMS."
        />
        <meta name="keywords" content="ATS checker, ATS resume checker, ATS score checker, free ATS checker, resume ATS score, resume scanner, ATS resume scanner, ATS compliance checker, applicant tracking system checker, resume keyword checker" />
        <link rel="canonical" href="https://ai-resume-builder-ochre-five.vercel.app/ats-checker" />
        <meta property="og:title" content="Free ATS Resume Checker — Score Your Resume Against Any JD" />
        <meta property="og:description" content="Paste a job description, upload your resume, get an instant ATS score with missing keywords and fix-it recommendations. Free." />
        <meta property="og:url" content="https://ai-resume-builder-ochre-five.vercel.app/ats-checker" />
        <meta name="twitter:title" content="Free ATS Resume Checker" />
        <meta name="twitter:description" content="Score your resume against any job description. Find missing keywords before you apply." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "NxtResume ATS Checker",
          "url": "https://ai-resume-builder-ochre-five.vercel.app/ats-checker",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "description": "Free ATS resume checker that scores any resume against any job description and surfaces missing keywords, weak matches, and structural gaps.",
          "isAccessibleForFree": true,
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
          "featureList": [
            "Instant ATS score against a real job description",
            "Missing keyword detection",
            "Section-by-section match analysis",
            "Fix-it recommendations",
            "Compatible with Workday, Greenhouse, Lever, iCIMS"
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Header user={user} />

        <Hero />
        <HowItWorks />
        <WhatYouGet />
        <FaqSection />
        <CtaBand />
        <Footer />
      </div>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 pb-20 pt-16 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:pt-24">
        {/* Left: content */}
        <div className="lg:col-span-6 lg:pr-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-slate-700">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            ATS CHECKER
          </span>

          <h1
            style={DISPLAY_FONT}
            className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[60px]"
          >
            Will your resume even{" "}
            <span className="text-slate-400">reach a human?</span>
          </h1>

          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-600">
            Most applications get filtered by software before a recruiter even
            sees them. Score your resume against any JD, find the keywords
            you're missing, and fix them before you apply.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/auth/sign-in">
              <button className="group inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-slate-800">
                Try ATS Checker free
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-2 text-[14px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              Back to home →
            </Link>
          </div>
        </div>

        {/* Right: demo score card */}
        <div className="lg:col-span-6">
          <DemoScoreCard />
        </div>
      </div>
    </section>
  );
}

// Mock ATS result card
function DemoScoreCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto max-w-[560px]"
    >
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              Match score
            </p>
            <p className="mt-1 text-[13px] font-semibold text-slate-900">
              Full Stack Developer
            </p>
            <p className="text-[11px] text-slate-500">Fictitious Demo</p>
          </div>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
            style={{
              backgroundColor: `${ACCENT}12`,
              color: ACCENT,
            }}
          >
            Strong fit
          </span>
        </div>

        {/* Big score */}
        <div className="flex items-center gap-6 px-6 pb-2 pt-6">
          <div className="flex flex-col items-start">
            <div className="flex items-baseline gap-1">
              <span
                style={DISPLAY_FONT}
                className="text-[84px] font-semibold leading-none tracking-tight"
              >
                {score}
              </span>
              <span className="text-[22px] font-semibold text-slate-400">
                /100
              </span>
            </div>
            <span className="mt-1 text-[11px] uppercase tracking-wider text-slate-500">
              ATS score
            </span>
          </div>
          <div className="flex-1">
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full"
                style={{ width: `${score}%`, backgroundColor: ACCENT }}
              />
            </div>
            <p className="mt-3 text-[12px] leading-relaxed text-slate-600">
              Strong technical alignment. A few keywords to add before you hit
              apply.
            </p>
          </div>
        </div>

        {/* Keywords */}
        <div className="border-t border-slate-100 px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Covered keywords
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {coveredKeywords.map((k) => (
              <span
                key={k}
                className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  borderColor: `${ACCENT}30`,
                  backgroundColor: `${ACCENT}08`,
                  color: ACCENT,
                }}
              >
                {k}
              </span>
            ))}
          </div>

          <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Missing keywords
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {missingKeywords.map((k) => (
              <span
                key={k}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-medium text-slate-700"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tiny caption */}
      <p className="mt-3 text-center text-[11px] text-slate-400">
        Sample result — your live score reflects your resume and JD.
      </p>
    </motion.div>
  );
}

// ── How it works ──────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF9]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            How it works
          </p>
          <h2
            style={DISPLAY_FONT}
            className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
          >
            Three steps.{" "}
            <span className="text-slate-400">Under two minutes.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span
                  style={DISPLAY_FONT}
                  className="text-[28px] font-semibold tracking-tight"
                  // accent number
                >
                  <span style={{ color: ACCENT }}>{s.n}</span>
                </span>
                <s.icon className="h-4 w-4 text-slate-400" />
              </div>
              <h3
                style={DISPLAY_FONT}
                className="mt-5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
              >
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── What you get ──────────────────────────────────────────────────────
function WhatYouGet() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            What you get
          </p>
          <h2
            style={DISPLAY_FONT}
            className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
          >
            Not just a number.{" "}
            <span className="text-slate-400">A fix list.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {WHAT_YOU_GET.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="border-t border-slate-200 pt-6"
            >
              <item.icon className="h-4 w-4" style={{ color: ACCENT }} />
              <h3
                style={DISPLAY_FONT}
                className="mt-5 text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
              >
                {item.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Supporting editorial bits: strengths + recs */}
        <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: ACCENT }}
            >
              Sample strengths
            </p>
            <h3
              style={DISPLAY_FONT}
              className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
            >
              What worked on the demo resume.
            </h3>
            <ul className="mt-5 space-y-3">
              {strengths.map((s) => (
                <li key={s} className="flex gap-2.5 text-[14px] text-slate-700">
                  <span
                    className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-[#FAFAF9] p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Sample recommendations
            </p>
            <h3
              style={DISPLAY_FONT}
              className="mt-3 text-[22px] font-semibold leading-tight tracking-tight text-slate-900"
            >
              What to fix before applying.
            </h3>
            <ol className="mt-5 space-y-3">
              {recommendations.map((r, i) => (
                <li key={r} className="flex gap-3 text-[14px] text-slate-700">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────
function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF9]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-24 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Questions
          </p>
          <h2
            style={DISPLAY_FONT}
            className="mt-3 text-[36px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[42px]"
          >
            ATS, demystified.
          </h2>
          <p className="mt-4 text-[15px] text-slate-600">
            Short answers to the things people actually wonder before running a
            score.
          </p>
        </div>
        <div className="lg:col-span-8">
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {FAQS.map((faq, i) => (
              <button
                key={faq.q}
                onClick={() => setOpen(open === i ? -1 : i)}
                className="block w-full py-5 text-left"
              >
                <div className="flex items-start justify-between gap-6">
                  <p className="text-[16px] font-semibold text-slate-900">
                    {faq.q}
                  </p>
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600">
                    {open === i ? (
                      <Minus className="h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                  </span>
                </div>
                {open === i && (
                  <p className="mt-3 text-[14px] leading-relaxed text-slate-600">
                    {faq.a}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CTA band ──────────────────────────────────────────────────────────
function CtaBand() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <h2
          style={DISPLAY_FONT}
          className="text-[40px] font-semibold leading-[1.05] tracking-tight sm:text-[52px]"
        >
          Stop guessing if your resume passes.{" "}
          <span className="text-white/50">Know before you apply.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[16px] text-white/70">
          Free, unlimited, no credit card. Score every job before you send the
          application.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link to="/auth/sign-in">
            <button className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5">
              Start checking free
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </Link>
          <Link
            to="/documentation"
            className="text-[14px] font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Read the docs →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link to="/" className="flex items-center">
              <NxtResumeWordmark size="20px" color="#0F172A" />
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-slate-600">
              Resumes, cover letters, and ATS insights — crafted by AI, designed
              by humans, owned by you.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: "Resume templates", to: "/resumes" },
              { label: "Cover letters", to: "/cover-letters" },
              { label: "ATS checker", to: "/ats-checker" },
              { label: "Docs", to: "/documentation" },
            ]}
          />
          <FooterCol
            title="Account"
            links={[
              { label: "Sign in", to: "/auth/sign-in" },
              { label: "Dashboard", to: "/dashboard" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: "About", to: "/documentation" },
              { label: "Privacy", to: "/documentation" },
              { label: "Contact", to: "/documentation" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 md:flex-row md:items-center">
          <p className="text-[12px] text-slate-500">
            © {new Date().getFullYear()} NxtResume. Made with care.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-slate-500">
            <span
              className="flex h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
        {title}
      </p>
      <ul className="mt-4 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              className="text-[13px] text-slate-700 transition-colors hover:text-slate-900"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
