import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  MessageCircle,
  Clock,
  Play,
} from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

// ── Design tokens ─────────────────────────────────────────────────────
const DISPLAY_FONT = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

// ── Data ──────────────────────────────────────────────────────────────
const TRACKS = [
  {
    n: "01",
    title: "Build your first resume",
    body: "Start from a template, import from LinkedIn, or paste an existing resume. Under 10 minutes.",
    to: "/resumes",
  },
  {
    n: "02",
    title: "Write a cover letter",
    body: "Upload a resume, paste a JD, pick a template. Done. Tailored — not generic.",
    to: "/cover-letters",
  },
  {
    n: "03",
    title: "Use the ATS checker",
    body: "Score your resume against any job description. Find missing keywords before you apply.",
    to: "/ats-checker",
  },
  {
    n: "04",
    title: "Share & download",
    body: "Download as PDF, share a public link, or export to Google Drive. All free.",
    to: "/auth/sign-in",
  },
];

const POPULAR_ARTICLES = [
  {
    title: "How AI rewrites your experience bullets",
    blurb:
      "Understand what AI Polish changes, what it leaves alone, and why weak verbs disappear first.",
    updated: "Apr 12, 2026",
    read: "4 min",
  },
  {
    title: "The 5-minute ATS checklist",
    blurb:
      "Five quick edits that get most resumes past automated filters without rewriting content.",
    updated: "Apr 04, 2026",
    read: "5 min",
  },
  {
    title: "Choosing a template that matches your industry",
    blurb:
      "When to pick a classic format, when to pick modern, and why it matters less than people think.",
    updated: "Mar 28, 2026",
    read: "6 min",
  },
  {
    title: "Cover letters that don't sound like cover letters",
    blurb:
      "Opening lines to avoid, the three-paragraph structure that works, and tone presets explained.",
    updated: "Mar 22, 2026",
    read: "5 min",
  },
  {
    title: "Exporting to PDF, DOCX, and sharing a public link",
    blurb:
      "Everything you can do once your resume is written — formats, permissions, and Drive sync.",
    updated: "Mar 15, 2026",
    read: "3 min",
  },
];

// ── Page ──────────────────────────────────────────────────────────────
export default function PublicDocumentationPage() {
  const user = useSelector((s) => s.editUser.userData);

  return (
    <>
      <Helmet>
        <title>Documentation · NxtResume</title>
        <meta
          name="description"
          content="Guides, tracks, and articles for building a great resume with NxtResume."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Header user={user} />

        <Hero />
        <QuickStartTracks />
        <PopularAndVideo />
        <StillNeedHelp />
        <Footer />
      </div>
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-16 lg:px-8 lg:pt-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium tracking-wide text-slate-700">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            DOCUMENTATION
          </span>

          <h1
            style={DISPLAY_FONT}
            className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[60px]"
          >
            Everything you need to{" "}
            <span className="text-slate-400">ship a great resume.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-slate-600">
            Guides, short articles, and walkthroughs for every part of
            NxtResume — from your first bullet point to your first callback.
          </p>

          <div className="mt-8 flex items-center gap-4 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Est. 12 min to read
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Updated weekly</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Quick start tracks ────────────────────────────────────────────────
function QuickStartTracks() {
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF9]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-16 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Quick-start tracks
          </p>
          <h2
            style={DISPLAY_FONT}
            className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
          >
            Four paths.{" "}
            <span className="text-slate-400">Pick one, finish today.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {TRACKS.map((t, i) => (
            <motion.div
              key={t.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
            >
              <Link
                to={t.to}
                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span
                  style={DISPLAY_FONT}
                  className="text-[28px] font-semibold tracking-tight"
                >
                  <span style={{ color: ACCENT }}>{t.n}</span>
                </span>
                <h3
                  style={DISPLAY_FONT}
                  className="mt-5 text-[20px] font-semibold leading-tight tracking-tight text-slate-900"
                >
                  {t.title}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-slate-600">
                  {t.body}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900 underline-offset-4 group-hover:underline">
                  Read
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Popular articles + video guide ────────────────────────────────────
function PopularAndVideo() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Popular articles list */}
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Popular articles
            </p>
            <h2
              style={DISPLAY_FONT}
              className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[38px]"
            >
              The ones people actually read.
            </h2>

            <ul className="mt-10 divide-y divide-slate-200 border-y border-slate-200">
              {POPULAR_ARTICLES.map((a, i) => (
                <motion.li
                  key={a.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: "easeOut" }}
                >
                  <Link
                    to="/documentation"
                    className="group flex items-start justify-between gap-6 py-6"
                  >
                    <div className="min-w-0 flex-1">
                      <h3
                        style={DISPLAY_FONT}
                        className="text-[20px] font-semibold leading-snug tracking-tight text-slate-900 group-hover:underline group-hover:decoration-slate-300 group-hover:underline-offset-4"
                      >
                        {a.title}
                      </h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                        {a.blurb}
                      </p>
                      <div className="mt-3 flex items-center gap-3 text-[12px] text-slate-500">
                        <span>Updated {a.updated}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>{a.read} read</span>
                      </div>
                    </div>
                    <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-slate-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-700" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Video guide placeholder */}
          <div className="lg:col-span-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Video guide
            </p>
            <h2
              style={DISPLAY_FONT}
              className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[38px]"
            >
              Watch, don't read.
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-600">
              A full walkthrough — resume, cover letter, ATS — in one 6-minute
              tour.
            </p>

            <div className="mt-8">
              <VideoMockup />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Empty browser mockup frame with overlay
function VideoMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative mx-auto max-w-[520px]"
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="mx-auto flex h-5 max-w-[60%] flex-1 items-center justify-center rounded-md bg-white px-2 text-[10px] text-slate-500">
            nxtresume.com/docs/walkthrough
          </div>
          <div className="h-5 w-5" />
        </div>

        {/* Empty video area */}
        <div className="relative flex aspect-video items-center justify-center bg-[#FAFAF9]">
          {/* Subtle grid pattern */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative flex flex-col items-center text-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md"
              style={{ backgroundColor: ACCENT }}
            >
              <Play className="h-5 w-5" fill="white" />
            </span>
            <p
              style={DISPLAY_FONT}
              className="mt-5 text-[18px] font-semibold tracking-tight text-slate-900"
            >
              Video walkthrough coming soon
            </p>
            <p className="mt-1 text-[12px] text-slate-500">
              Drop your email and we'll ping you when it ships.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Still need help ───────────────────────────────────────────────────
function StillNeedHelp() {
  return (
    <section className="border-b border-slate-200 bg-[#FAFAF9]">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-14 max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Still need help?
          </p>
          <h2
            style={DISPLAY_FONT}
            className="mt-3 text-[38px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[44px]"
          >
            Talk to a human.{" "}
            <span className="text-slate-400">We reply fast.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <a
            href="mailto:psm@nxtwave.in"
            className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${ACCENT}12` }}
            >
              <Mail className="h-4 w-4" style={{ color: ACCENT }} />
            </span>
            <div className="flex-1">
              <h3
                style={DISPLAY_FONT}
                className="text-[20px] font-semibold leading-tight tracking-tight text-slate-900"
              >
                Email us
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Send a note — we read everything. Average reply under 6 hours on
                weekdays.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900 underline-offset-4 group-hover:underline">
                psm@nxtwave.in
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>

          <a
            href="https://discord.gg/nxtresume"
            className="group flex items-start gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${ACCENT}12` }}
            >
              <MessageCircle className="h-4 w-4" style={{ color: ACCENT }} />
            </span>
            <div className="flex-1">
              <h3
                style={DISPLAY_FONT}
                className="text-[20px] font-semibold leading-tight tracking-tight text-slate-900"
              >
                Join Discord
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-slate-600">
                Swap resumes, share callbacks, and get feedback from other job
                seekers in real time.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-slate-900 underline-offset-4 group-hover:underline">
                discord.gg/nxtresume
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </a>
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
