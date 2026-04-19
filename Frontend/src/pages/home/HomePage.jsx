import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  Sparkles,
  Mail,
  Minus,
  Plus,
  Star,
} from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";
import { addUserData } from "@/features/user/userFeatures";
import { useSessionUserQuery } from "@/hooks/useAppQueryData";
import { coverLetterTemplates } from "@/pages/dashboard/cover-letter/components/coverLetterDesignOptions";

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY_FONT = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

// ── Static content data ───────────────────────────────────────────────
const TRUST_LOGOS = [
  "NxtWave",
  "IIT Hyderabad",
  "NIT Warangal",
  "IIIT Bangalore",
  "VIT",
  "SRM",
];

const FEATURES = [
  {
    eyebrow: "Write with AI",
    title: "Stop staring at a blank page.",
    body: "Paste your role, click generate, and an AI trained on real recruiter feedback polishes every bullet until it sounds like you on your best day.",
    bullet: [
      "Rewrites work summaries in recruiter-friendly language",
      "Flags weak verbs and vague claims",
      "Keeps your voice — no generic template clichés",
    ],
    screenshot: "resume-ai",
  },
  {
    eyebrow: "16 templates. 0 cliché.",
    title: "Designs that don't scream 'template'.",
    body: "We hired real designers. Every template is built to clear ATS filters, print correctly on A4, and look nothing like the Canva resume in the reject pile.",
    bullet: [
      "ATS-safe — no hidden text, no weird tables",
      "Pixel-perfect print output via our PDF pipeline",
      "Change template anytime — your content stays",
    ],
    screenshot: "templates",
  },
  {
    eyebrow: "Cover letters",
    title: "A cover letter in 12 seconds.",
    body: "Upload your resume, paste the job description, pick a template. We handle the rest. Tailored to the role. Never generic.",
    bullet: [
      "Matches your experience to every requirement",
      "10 professional layouts, pick by industry",
      "Download as PDF, share via link",
    ],
    screenshot: "cover-letter",
  },
  {
    eyebrow: "ATS score",
    title: "Will it even reach a human?",
    body: "Our ATS checker scores your resume against the actual job description, surfaces missing keywords, and tells you exactly what to fix.",
    bullet: [
      "Match score per-job (not generic)",
      "Keyword gap analysis",
      "Actionable fixes, not just a number",
    ],
    screenshot: "ats",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Got 3 interviews in 2 weeks after rewriting my resume here. The AI rewrote my project summaries better than I could have in 10 drafts.",
    name: "Ananya Reddy",
    role: "SDE I at Zomato",
    initials: "AR",
    color: "#E67E22",
  },
  {
    quote:
      "I've used 4 different resume builders. This is the first one where the downloaded PDF actually matched the preview. Sounds small, matters a lot.",
    name: "Karthik Subramanian",
    role: "Full-stack developer",
    initials: "KS",
    color: "#8B5CF6",
  },
  {
    quote:
      "The cover letter generator saved my last job hunt. I applied to 34 roles in 6 days. Would've been impossible otherwise.",
    name: "Priya Menon",
    role: "Data Analyst",
    initials: "PM",
    color: "#0EA5E9",
  },
];

const FAQS = [
  {
    q: "Is NxtResume actually free?",
    a: "Yes. You can build unlimited resumes, generate unlimited cover letters, and download unlimited PDFs without paying. We may introduce a premium tier later with extra AI credits and analytics, but the core is and will stay free.",
  },
  {
    q: "Will my resume pass ATS (applicant tracking systems)?",
    a: "Every template is tested against the most common ATS software (Workday, Greenhouse, Lever, iCIMS). Our built-in ATS Checker scores your resume against a specific job description and surfaces missing keywords.",
  },
  {
    q: "Does the AI read my data?",
    a: "We send your resume content to the AI model only when you explicitly click an AI action (Polish, Regenerate, Generate Cover Letter). We do not train on your data. You own your content.",
  },
  {
    q: "Can I export to Word or Google Docs?",
    a: "PDF is the default (recruiters prefer it). DOCX export is on the roadmap. Google Drive sharing works today — upload once, share the link with anyone.",
  },
  {
    q: "I don't have a resume yet. Where do I start?",
    a: "Import your LinkedIn profile or start from a template and fill in sections one at a time. Our editor guides you through each section with examples from real hired candidates.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const reduxUser = useSelector((s) => s.editUser.userData);
  const sessionQuery = useSessionUserQuery();
  const sessionUser = sessionQuery.data;
  const user = sessionUser || reduxUser;

  useEffect(() => {
    if (sessionUser) dispatch(addUserData(sessionUser));
  }, [dispatch, sessionUser]);

  const goGetStarted = () => {
    if (user) navigate("/dashboard");
    else navigate("/auth/sign-in");
  };

  return (
    <>
      <Helmet>
        <title>NxtResume — Resumes that actually get callbacks</title>
        <meta
          name="description"
          content="Craft a sharp, ATS-friendly resume and cover letter with AI. 16 designer templates. Free forever. Used by students across NxtWave, IIT, NIT, IIIT."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Header user={user} />

        <Hero onStart={goGetStarted} user={user} />
        <TrustBar />
        <StatsRow />
        <FeaturesSection />
        <TemplatesShowcase />
        <CoverLettersBand />
        <Testimonials />
        <FaqSection />
        <FinalCTA onStart={goGetStarted} />
        <Footer />
      </div>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero({ onStart, user }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,72,0,0.06),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 pb-20 pt-16 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-24">
        {/* Left: content */}
        <div className="lg:col-span-6 lg:pr-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-slate-700">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            BUILT IN 2024 · USED BY 14,000+ STUDENTS
          </span>

          <h1
            style={DISPLAY_FONT}
            className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[64px]"
          >
            The resume that{" "}
            <span className="relative whitespace-nowrap">
              <span className="relative z-10">gets you a reply.</span>
              <span
                className="absolute inset-x-0 bottom-1 z-0 h-3 opacity-40"
                style={{ backgroundColor: ACCENT }}
              />
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-slate-600">
            Sharp writing, ATS-safe design, and AI that knows when to shut up.
            Ship a resume, cover letter, and portfolio link — in one sitting.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={onStart}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-slate-800"
            >
              {user ? "Open your dashboard" : "Start free — 60 seconds"}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <Link
              to="/resumes"
              className="inline-flex items-center gap-1.5 px-2 text-[14px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              Browse 16 templates →
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#FB923C", "#8B5CF6", "#10B981", "#0EA5E9", "#F43F5E"].map(
                (c, i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-white ring-1 ring-slate-100"
                    style={{ backgroundColor: c }}
                  />
                )
              )}
            </div>
            <div className="text-[13px] text-slate-600">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-1 font-semibold text-slate-900">4.9</span>
              </div>
              <p className="text-slate-500">from 2,300+ student reviews</p>
            </div>
          </div>
        </div>

        {/* Right: product mockup */}
        <div className="lg:col-span-6">
          <BrowserMockup>
            <HeroDashboardPreview />
          </BrowserMockup>
        </div>
      </div>
    </section>
  );
}

// Fake browser chrome for product screenshot
function BrowserMockup({ children }) {
  return (
    <div className="relative mx-auto max-w-[620px]">
      <div className="absolute -inset-4 -z-10 rounded-3xl bg-slate-100/80" />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto flex h-5 max-w-[60%] flex-1 items-center justify-center rounded-md bg-white px-2 text-[10px] text-slate-500">
            nxtresume.com/dashboard
          </div>
          <div className="h-5 w-5" />
        </div>
        {children}
      </div>
    </div>
  );
}

function HeroDashboardPreview() {
  return (
    <div className="bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p
            style={DISPLAY_FONT}
            className="text-[18px] font-semibold text-slate-900"
          >
            Good morning, Ananya
          </p>
          <p className="text-[11px] text-slate-500">Sunday, April 19, 2026</p>
        </div>
        <div className="flex h-8 items-center gap-2 rounded-full border border-slate-200 pl-1 pr-3 text-[11px] text-slate-600">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
            AR
          </span>
          Ananya
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-b border-slate-200 text-[11px] font-medium">
        <button
          className="-mb-px border-b-2 pb-2"
          style={{ borderColor: ACCENT, color: "#0F172A" }}
        >
          Resumes · 3
        </button>
        <button className="pb-2 text-slate-500">Cover Letters · 2</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { color: "#0F172A", name: "Professional" },
          { color: ACCENT, name: "Executive" },
          { color: "#8B5CF6", name: "Modern" },
        ].map((r, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-md border border-slate-200 bg-white"
          >
            <div
              className="h-2 w-full"
              style={{ backgroundColor: r.color }}
            />
            <div className="h-28 bg-gradient-to-b from-slate-50 to-white p-2">
              <div
                className="mb-1 h-2 w-1/2 rounded"
                style={{ backgroundColor: r.color }}
              />
              <div className="h-1 w-full rounded bg-slate-200" />
              <div className="mt-1 h-1 w-5/6 rounded bg-slate-200" />
              <div className="mt-2 h-1 w-1/3 rounded bg-slate-300" />
              <div className="mt-1 h-1 w-full rounded bg-slate-100" />
              <div className="mt-1 h-1 w-2/3 rounded bg-slate-100" />
            </div>
            <div className="border-t border-slate-100 px-2 py-1.5 text-[9px] text-slate-500">
              {r.name}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-slate-300 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100">
            <Sparkles className="h-3 w-3 text-slate-600" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-800">
              AI Polish applied
            </p>
            <p className="text-[10px] text-slate-500">
              12 bullet points rewritten
            </p>
          </div>
        </div>
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          +24% ATS
        </span>
      </div>
    </div>
  );
}

// ── Trust bar ─────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Used by students and professionals across
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {TRUST_LOGOS.map((name) => (
            <span
              key={name}
              className="text-[15px] font-semibold tracking-tight text-slate-400 transition-colors hover:text-slate-700"
              style={DISPLAY_FONT}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Stats row (editorial style) ───────────────────────────────────────
function StatsRow() {
  const stats = [
    { value: "14,293", label: "Resumes generated" },
    { value: "8,741", label: "Cover letters written" },
    { value: "16", label: "AI-polished templates" },
    { value: "4.9", label: "Avg. rating" },
  ];

  return (
    <section className="border-b border-slate-200 bg-[#FAFAF9]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-slate-200 px-5 py-10 sm:grid-cols-4 sm:divide-x lg:px-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-3 sm:text-center ${i === 0 ? "sm:pl-0" : ""} ${
              i === stats.length - 1 ? "sm:pr-0" : ""
            }`}
          >
            <div
              className="text-[32px] font-semibold tracking-tight text-slate-900 sm:text-[40px]"
              style={DISPLAY_FONT}
            >
              {s.value}
            </div>
            <div className="mt-1 text-[12px] uppercase tracking-wider text-slate-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features (alternating rows) ───────────────────────────────────────
function FeaturesSection() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-20 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            What you get
          </p>
          <h2
            className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[48px]"
            style={DISPLAY_FONT}
          >
            Built for the last draft,{" "}
            <span className="text-slate-400">not the first.</span>
          </h2>
        </div>

        <div className="space-y-24">
          {FEATURES.map((f, i) => (
            <FeatureRow key={f.eyebrow} feature={f} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({ feature, reversed }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14 ${
        reversed ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      <div className="lg:col-span-5">
        <p
          className="text-[12px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: ACCENT }}
        >
          {feature.eyebrow}
        </p>
        <h3
          className="mt-3 text-[30px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[36px]"
          style={DISPLAY_FONT}
        >
          {feature.title}
        </h3>
        <p className="mt-4 text-[16px] leading-relaxed text-slate-600">
          {feature.body}
        </p>
        <ul className="mt-5 space-y-2">
          {feature.bullet.map((b) => (
            <li key={b} className="flex gap-2.5 text-[14px] text-slate-700">
              <Check
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                style={{ color: ACCENT }}
              />
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:col-span-7">
        <FeatureVisual kind={feature.screenshot} />
      </div>
    </motion.div>
  );
}

function FeatureVisual({ kind }) {
  if (kind === "resume-ai") {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Before
          </p>
          <p className="mt-2 text-[13px] text-slate-400 line-through">
            Worked on frontend things for the website and helped customers.
          </p>
        </div>
        <div className="p-5" style={{ backgroundColor: `${ACCENT}08` }}>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" style={{ color: ACCENT }} />
            <p
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: ACCENT }}
            >
              After AI polish
            </p>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-800">
            Redesigned and shipped 4 React components that reduced checkout
            drop-off by <span className="font-semibold">28%</span>, directly
            handling support tickets from <span className="font-semibold">200+</span>{" "}
            enterprise customers.
          </p>
        </div>
      </div>
    );
  }
  if (kind === "templates") {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[
          "#0F172A",
          "#FF4800",
          "#059669",
          "#8B5CF6",
          "#0EA5E9",
          "#E11D48",
        ].map((c, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
          >
            <div className="h-1.5 w-full" style={{ backgroundColor: c }} />
            <div className="h-40 bg-gradient-to-b from-slate-50 to-white p-3">
              <div className="h-2 w-2/3 rounded" style={{ backgroundColor: c }} />
              <div className="mt-1.5 h-1 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 h-1 w-full rounded bg-slate-100" />
              <div className="mt-1 h-1 w-5/6 rounded bg-slate-100" />
              <div className="mt-1 h-1 w-4/6 rounded bg-slate-100" />
              <div className="mt-3 h-1 w-1/4 rounded bg-slate-300" />
              <div className="mt-1 h-1 w-full rounded bg-slate-100" />
              <div className="mt-1 h-1 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (kind === "cover-letter") {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-5">
          <div
            className="col-span-2 p-5 text-white"
            style={{ backgroundColor: "#0F172A" }}
          >
            <p className="text-[18px] font-semibold" style={DISPLAY_FONT}>
              Ananya R.
            </p>
            <p className="text-[10px] uppercase tracking-wider opacity-70">
              Frontend Engineer
            </p>
            <div className="mt-4 space-y-1.5 text-[10px] opacity-80">
              <div>ananya@mail.com</div>
              <div>+91 98765 43210</div>
              <div>Hyderabad, IN</div>
            </div>
          </div>
          <div className="col-span-3 p-5">
            <p className="mb-3 text-right text-[10px] text-slate-500">
              April 19, 2026
            </p>
            <p className="text-[11px] font-semibold text-slate-800">
              Dear Hiring Manager,
            </p>
            <div className="mt-2 space-y-1">
              <div className="h-1 w-full rounded bg-slate-100" />
              <div className="h-1 w-5/6 rounded bg-slate-100" />
              <div className="h-1 w-full rounded bg-slate-100" />
            </div>
            <div className="mt-3 space-y-1">
              <div className="h-1 w-full rounded bg-slate-100" />
              <div className="h-1 w-3/4 rounded bg-slate-100" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div
                className="flex h-5 items-center gap-1 rounded-full px-2 text-[9px] font-semibold text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <Mail className="h-2.5 w-2.5" /> Tailored to JD
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // ATS
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 p-5">
        <p className="text-[13px] font-semibold text-slate-800">
          Match score for Frontend Engineer @ Razorpay
        </p>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: ACCENT }}
        >
          82
        </div>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Missing keywords
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["Redux Toolkit", "Jest", "Webpack", "CI/CD", "A/B testing"].map(
            (k) => (
              <span
                key={k}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] text-slate-700"
              >
                {k}
              </span>
            )
          )}
        </div>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Covered
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {["React", "TypeScript", "Node.js", "MongoDB"].map((k) => (
            <span
              key={k}
              className="rounded-full border px-2.5 py-0.5 text-[11px]"
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
      </div>
    </div>
  );
}

// ── Templates showcase ────────────────────────────────────────────────
function TemplatesShowcase() {
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF9]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Cover letter templates
            </p>
            <h2
              className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
              style={DISPLAY_FONT}
            >
              Ten designs. One click to switch.
            </h2>
          </div>
          <Link
            to="/cover-letters"
            className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-900 underline-offset-4 hover:underline"
          >
            See all 10 templates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {coverLetterTemplates.slice(0, 10).map((tpl) => (
            <Link
              key={tpl.id}
              to="/cover-letters"
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
                  style={{ backgroundColor: `${tpl.accentColor}12` }}
                >
                  <Mail
                    className="h-8 w-8"
                    style={{ color: tpl.accentColor }}
                  />
                </div>
              </div>
              <div className="border-t border-slate-100 px-3 py-2">
                <p className="text-[12px] font-semibold text-slate-900">
                  {tpl.name}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  {tpl.category}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Cover letters band ────────────────────────────────────────────────
function CoverLettersBand() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-slate-900 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(255,72,0,0.4), transparent 40%)",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 py-24 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-6">
          <p
            className="text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: ACCENT }}
          >
            Cover letters
          </p>
          <h2
            className="mt-3 text-[40px] font-semibold leading-tight tracking-tight sm:text-[52px]"
            style={DISPLAY_FONT}
          >
            The cover letter, solved.
          </h2>
          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/80">
            Upload a resume. Paste the job description. Pick a template. Walk
            away with a cover letter that actually matches the role — not a
            "Dear Sir/Madam" template you lightly edited.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "Tone presets",
              "Switch template anytime",
              "Drive sharing",
              "Public link",
              "PDF download",
            ].map((f) => (
              <span
                key={f}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/90"
              >
                <Check className="-ml-0.5 mr-1 inline h-3 w-3" />
                {f}
              </span>
            ))}
          </div>
          <Link
            to="/cover-letter/creation-part"
            className="mt-10 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-[14px] font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
          >
            Write a cover letter now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="lg:col-span-6">
          <div className="grid grid-cols-2 gap-3">
            {coverLetterTemplates.slice(0, 6).map((tpl) => (
              <div
                key={tpl.id}
                className="overflow-hidden rounded-lg bg-white shadow-lg"
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
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            From actual students
          </p>
          <h2
            className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
            style={DISPLAY_FONT}
          >
            Small team. Loud feedback.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md"
            >
              <blockquote
                className="flex-1 text-[15px] leading-relaxed text-slate-800"
                style={DISPLAY_FONT}
              >
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold text-white"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
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
            className="mt-3 text-[36px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[42px]"
            style={DISPLAY_FONT}
          >
            The stuff everyone asks.
          </h2>
          <p className="mt-4 text-[15px] text-slate-600">
            Can't find your answer?{" "}
            <Link
              to="/documentation"
              className="text-slate-900 underline underline-offset-2"
            >
              Read the docs
            </Link>{" "}
            or email us.
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

// ── Final CTA ─────────────────────────────────────────────────────────
function FinalCTA({ onStart }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <h2
          className="text-[42px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px]"
          style={DISPLAY_FONT}
        >
          Good resumes take hours.{" "}
          <span className="text-slate-400">This one takes minutes.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] text-slate-600">
          No credit card. No limits. No "premium" lock behind the best features.
          Just your resume, done right.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={onStart}
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-slate-900 px-6 text-[14px] font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Start building free
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <Link
            to="/resumes"
            className="text-[14px] font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            Browse templates instead →
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
            <Link to="/" className="flex items-center gap-2.5">
              <NxtResumeLogoMark className="h-8 w-8" />
              <span
                className="text-[18px] font-semibold tracking-tight text-slate-900"
                style={DISPLAY_FONT}
              >
                NxtResume
              </span>
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
