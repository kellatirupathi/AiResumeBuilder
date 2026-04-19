import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Code,
  Download,
  FileText,
  FolderGit2,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Mail,
  Palette,
  PenLine,
  PieChart,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  User,
  WandSparkles,
} from "lucide-react";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const SECTIONS = [
  { id: "overview", label: "Product Overview", icon: LayoutDashboard },
  { id: "first-resume", label: "Create Your First Resume", icon: Plus },
  { id: "profile-data", label: "Complete Profile Data", icon: User },
  { id: "resume-sections", label: "Build Resume Sections", icon: FileText },
  { id: "ai-tools", label: "Use AI Tools", icon: Sparkles },
  { id: "cover-letter", label: "Write a Cover Letter", icon: Mail },
  { id: "ats-checker", label: "Check ATS Score", icon: PieChart },
  { id: "portfolio", label: "Generate Portfolio", icon: Palette },
  { id: "download-share", label: "Download & Share", icon: Download },
  { id: "best-practices", label: "Best Practices", icon: Star },
];

const WORKFLOW = [
  {
    n: "01",
    title: "Profile",
    body: "Add your reusable career data once.",
  },
  {
    n: "02",
    title: "Resume",
    body: "Create one or more tailored resumes.",
  },
  {
    n: "03",
    title: "Cover Letter",
    body: "Generate a letter against any job description.",
  },
  {
    n: "04",
    title: "ATS Check",
    body: "Score your resume against the real JD.",
  },
  {
    n: "05",
    title: "Portfolio",
    body: "Publish a portfolio from the saved profile.",
  },
];

const PROFILE_BLOCKS = [
  {
    title: "Personal Details",
    icon: User,
    items: [
      "Name, target job title, phone, email, and location.",
      "LinkedIn, GitHub, and portfolio — only active, recruiter-ready links.",
      "Keep the job title aligned with the role you are applying for.",
    ],
  },
  {
    title: "Professional Summary",
    icon: FileText,
    items: [
      "Write a short 3–5 sentence paragraph for your overall positioning.",
      "Use the AI Summary Writer for a draft against a specific target role.",
      "Stay in paragraph format — not bullets.",
    ],
  },
  {
    title: "Work Experience",
    icon: Briefcase,
    items: [
      "Add company name and job title before using Generate.",
      "Use Generate to produce bullets from the experience fields.",
      "Use Enhance With AI only when a work summary already exists.",
    ],
  },
  {
    title: "Projects",
    icon: FolderGit2,
    items: [
      "Add project name and tech stack before using Generate.",
      "Generate creates bullets from the project fields alone.",
      "Enhance With AI only works when a project summary already exists.",
    ],
  },
  {
    title: "Education · Skills · Certifications",
    icon: GraduationCap,
    items: [
      "Fill these sections completely — every resume and portfolio reuses them.",
      "Skills drive ATS matching, so use exact role keywords where relevant.",
      "Certifications and education strengthen trust signals, especially for early-career users.",
    ],
  },
];

const RESUME_SECTION_CARDS = [
  {
    title: "Summary",
    icon: FileText,
    body: "Keep it concise and role-aligned. Your quick recruiter pitch.",
  },
  {
    title: "Experience",
    icon: Briefcase,
    body: "Lead with action verbs, results, and numbers. Avoid duty-only bullets.",
  },
  {
    title: "Projects",
    icon: FolderGit2,
    body: "Show what you built, with what stack, and why it mattered.",
  },
  {
    title: "Skills",
    icon: Code,
    body: "Use accurate keywords from the target role. Don't stuff unrelated tech.",
  },
  {
    title: "Education & Certifications",
    icon: Award,
    body: "Support credibility, especially when experience is limited.",
  },
];

const AI_CARDS = [
  {
    title: "AI Summary Writer",
    icon: WandSparkles,
    body: "Type a target role and generate a professional summary draft. The typed role guides output more than the saved profile title.",
  },
  {
    title: "Experience — Generate / Enhance",
    icon: Briefcase,
    body: "Generate creates fresh bullets from the experience fields. Enhance rewrites an existing work summary.",
  },
  {
    title: "Project — Generate / Enhance",
    icon: FolderGit2,
    body: "Generate uses the project name and tech stack. Enhance improves an existing project summary instead of inventing one.",
  },
  {
    title: "Profile Assistant",
    icon: Sparkles,
    body: "Ask for rewrites, stronger bullets, role alignment, or project summaries. Use the inline Add action to push output into the right section.",
  },
];

const COVER_LETTER_STEPS = [
  "Open Dashboard → Cover Letters and click New Cover Letter.",
  "Choose one of the 10 cover-letter templates.",
  "Pick the resume you want to tailor from, or upload an external PDF.",
  "Paste the full job description — responsibilities, requirements, the whole thing.",
  "Review the AI-generated letter, edit inline, and save.",
  "Download as PDF or share a public link the same way you do with resumes.",
];

const ATS_RULES = [
  "Paste the actual job description text — not a link.",
  "Use a complete JD with responsibilities, requirements, and skills.",
  "If the input is too short, repetitive, or not sentence-like, the app will reject it as invalid.",
  "Treat ATS results as guidance based on the real JD you provide — not guessed keywords.",
];

const PORTFOLIO_STEPS = [
  "Complete and save your profile data first.",
  "Open Profile and click Generate Portfolio.",
  "Choose the portfolio template inside portfolio mode.",
  "Click Generate Portfolio and confirm that your profile is ready.",
  "After generation, review the generated portfolio link added back into your profile.",
];

const DOWNLOAD_STEPS = [
  "Preview the resume or cover letter and confirm the page count is correct.",
  "Download as PDF — the file mirrors the preview exactly.",
  "Share a public link — anyone with the URL can view the read-only version.",
  "Keep Drive Link on Download turned on in Notifications to get an email copy of every download.",
];

const BEST_PRACTICES = [
  "Create one strong base profile first. Every new resume becomes faster.",
  "Tailor summary, top experience bullets, and skills for each job — not a generic resume.",
  "Use AI to speed up drafting, but always review the final content before saving.",
  "For ATS checks, paste only real JDs. Invalid inputs create misleading analysis.",
  "Never generate from empty forms. Fill required fields first.",
  "Save your profile before generating a portfolio so it uses the latest content.",
];

// ────────────────────────────────────────────────────────────────────
// Primitives
// ────────────────────────────────────────────────────────────────────

const Callout = ({ type = "info", children }) => {
  const config = {
    info: {
      border: "border-slate-200",
      bg: "bg-slate-50",
      icon: <Lightbulb className="h-4 w-4 text-slate-600" />,
    },
    tip: {
      border: "border-emerald-200",
      bg: "bg-emerald-50/60",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    },
    warning: {
      border: "border-amber-200",
      bg: "bg-amber-50/60",
      icon: <ShieldCheck className="h-4 w-4 text-amber-600" />,
    },
  }[type];

  return (
    <div
      className={`mt-4 flex items-start gap-3 rounded-xl border p-4 text-[13.5px] leading-relaxed text-slate-700 ${config.border} ${config.bg}`}
    >
      <div className="mt-0.5 flex-shrink-0">{config.icon}</div>
      <div>{children}</div>
    </div>
  );
};
Callout.propTypes = {
  type: PropTypes.oneOf(["info", "tip", "warning"]),
  children: PropTypes.node.isRequired,
};

const Step = ({ number, title, children }) => (
  <div className="flex gap-4">
    <div
      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
      style={{ backgroundColor: ACCENT }}
    >
      {number}
    </div>
    <div className="min-w-0 flex-1 pt-0.5">
      {title && (
        <p className="mb-1 text-[14px] font-semibold text-slate-900">
          {title}
        </p>
      )}
      <div className="text-[13.5px] leading-relaxed text-slate-600">
        {children}
      </div>
    </div>
  </div>
);
Step.propTypes = {
  number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

function SectionBlock({ id, icon: Icon, eyebrow, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.35 }}
      className="scroll-mt-24"
    >
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {eyebrow}
        </p>
      </div>
      <h2
        style={DISPLAY}
        className="text-[30px] font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-[36px]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-slate-600">
          {subtitle}
        </p>
      )}
      <div className="mt-8 space-y-6">{children}</div>
    </motion.section>
  );
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-[14px] font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-3 text-[13.5px] leading-relaxed text-slate-600">
        {body}
      </p>
    </div>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700">
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: ACCENT }}
      />
      {children}
    </span>
  );
}

function TOC({ activeId, setActiveId }) {
  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <button
        onClick={() => window.history.back()}
        className="mb-6 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Dashboard
      </button>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        On this page
      </p>
      <nav className="mt-4 space-y-0.5 border-l border-slate-200">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setActiveId(id)}
            className={`-ml-[2px] flex items-center gap-2 border-l-2 px-3 py-1.5 text-[13px] transition-colors ${
              activeId === id
                ? "border-[#FF4800] font-semibold text-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

// ────────────────────────────────────────────────────────────────────
// Sections
// ────────────────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <SectionBlock
      id="overview"
      icon={LayoutDashboard}
      eyebrow="Section 01"
      title="Build, improve, score, publish — in that order."
      subtitle="NxtResume is not just a resume editor. It is one central profile that powers every tailored resume, every cover letter, every ATS check, and your portfolio."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {WORKFLOW.map((t) => (
          <div
            key={t.n}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <span
              style={DISPLAY}
              className="text-[24px] font-semibold tracking-tight"
            >
              <span style={{ color: ACCENT }}>{t.n}</span>
            </span>
            <h3
              style={DISPLAY}
              className="mt-3 text-[17px] font-semibold leading-tight tracking-tight text-slate-900"
            >
              {t.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-600">
              {t.body}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <Chip>Complete profile once</Chip>
        <Chip>Create role-specific resumes</Chip>
        <Chip>Use AI where it actually helps</Chip>
        <Chip>Run ATS check with a real JD</Chip>
      </div>

      <Callout type="tip">
        Treat the <strong>Profile</strong> page as your master data source.
        Better profile data produces better AI output, faster resume creation,
        and stronger portfolio generation.
      </Callout>
    </SectionBlock>
  );
}

function FirstResumeSection() {
  return (
    <SectionBlock
      id="first-resume"
      icon={Plus}
      eyebrow="Section 02"
      title="Create your first resume."
      subtitle="The fastest path: dashboard → New Resume → pick a template → import from profile. You'll have a draft in under two minutes."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          <Step number={1} title="Open the Dashboard">
            Go to <strong>Dashboard → Resumes</strong> and click{" "}
            <strong>New Resume</strong>.
          </Step>
          <Step number={2} title="Name it by the role you're targeting">
            e.g. "Frontend Engineer — Acme" — not "resume v4". The name shows
            up in the manage screen and helps you find drafts later.
          </Step>
          <Step number={3} title="Pick a template">
            Browse the 16 templates. You can switch later without losing
            content.
          </Step>
          <Step number={4} title="Import from Profile">
            Inside the editor, click <strong>Import from Profile</strong>.
            Every section that exists in your saved profile gets loaded in.
          </Step>
          <Step number={5} title="Tailor and save">
            Edit the summary, reorder bullets, tweak skills for this role —
            then Save. Preview on the right updates live.
          </Step>
        </div>
      </div>

      <Callout type="info">
        If your profile is empty, finish it first. The import is what makes
        the second, third, and tenth resume fast.
      </Callout>
    </SectionBlock>
  );
}

function ProfileDataSection() {
  return (
    <SectionBlock
      id="profile-data"
      icon={User}
      eyebrow="Section 03"
      title="Complete profile data."
      subtitle="The Profile page is the one place where every field lives. Fill it fully once — every resume, cover letter, ATS check, and portfolio reads from it."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {PROFILE_BLOCKS.map(({ title, icon: Icon, items }) => (
          <div
            key={title}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700">
                <Icon className="h-4 w-4" />
              </span>
              <h3 className="text-[14px] font-semibold text-slate-900">
                {title}
              </h3>
            </div>
            <ul className="mt-3 space-y-1.5 text-[13px] leading-relaxed text-slate-600">
              {items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span
                    className="mt-2 h-1 w-1 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function ResumeSectionsSection() {
  return (
    <SectionBlock
      id="resume-sections"
      icon={FileText}
      eyebrow="Section 04"
      title="Build the resume sections."
      subtitle="Each section has one job. Treat them differently — summaries read, experience proves, skills match keywords."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {RESUME_SECTION_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
      <Callout type="warning">
        Do not duplicate the same content across summary, experience, and
        projects. Recruiters skim — repetition looks like padding.
      </Callout>
    </SectionBlock>
  );
}

function AIToolsSection() {
  return (
    <SectionBlock
      id="ai-tools"
      icon={Sparkles}
      eyebrow="Section 05"
      title="Use AI where it actually helps."
      subtitle="Every AI action is tied to a specific field or section. Know which tool does what before clicking."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {AI_CARDS.map((card) => (
          <FeatureCard key={card.title} {...card} />
        ))}
      </div>
      <Callout type="tip">
        <strong>Generate</strong> needs inputs — fill the fields first.{" "}
        <strong>Enhance</strong> needs existing content — use it to polish
        what you already wrote.
      </Callout>
    </SectionBlock>
  );
}

function CoverLetterSection() {
  return (
    <SectionBlock
      id="cover-letter"
      icon={Mail}
      eyebrow="Section 06"
      title="Write a cover letter."
      subtitle="10 cover-letter templates. Paste a JD, pick a resume, and AI drafts a tailored letter — then you edit before sending."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          {COVER_LETTER_STEPS.map((text, i) => (
            <Step key={text} number={i + 1}>
              {text}
            </Step>
          ))}
        </div>
      </div>
      <Callout type="info">
        Never upload a resume that is not yours. The generator pulls
        specifics directly from the resume content — accuracy matters.
      </Callout>
    </SectionBlock>
  );
}

function ATSSection() {
  return (
    <SectionBlock
      id="ats-checker"
      icon={PieChart}
      eyebrow="Section 07"
      title="Check your ATS score."
      subtitle="Match your resume against a real job description before you apply. The ATS Checker catches missing keywords, weak matches, and structural gaps."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <ul className="space-y-3">
          {ATS_RULES.map((rule) => (
            <li key={rule} className="flex items-start gap-3">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                style={{ color: ACCENT }}
              />
              <span className="text-[13.5px] leading-relaxed text-slate-700">
                {rule}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Callout type="warning">
        A bad JD in produces a bad score out. If the input is too short or
        not a real description, the checker will reject it rather than
        guess.
      </Callout>
    </SectionBlock>
  );
}

function PortfolioSection() {
  return (
    <SectionBlock
      id="portfolio"
      icon={Palette}
      eyebrow="Section 08"
      title="Generate a portfolio."
      subtitle="One click on a saved profile produces a shareable portfolio page. The portfolio reuses exactly what's in Profile — so save before you generate."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          {PORTFOLIO_STEPS.map((text, i) => (
            <Step key={text} number={i + 1}>
              {text}
            </Step>
          ))}
        </div>
      </div>
      <Callout type="tip">
        The generated portfolio link is saved back into your profile. Share
        it directly — no re-export needed.
      </Callout>
    </SectionBlock>
  );
}

function DownloadSection() {
  return (
    <SectionBlock
      id="download-share"
      icon={Download}
      eyebrow="Section 09"
      title="Download & share."
      subtitle="Every resume and cover letter can be downloaded as a pixel-perfect PDF or shared via a public link."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="space-y-5">
          {DOWNLOAD_STEPS.map((text, i) => (
            <Step key={text} number={i + 1}>
              {text}
            </Step>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip>Pixel-accurate PDF</Chip>
        <Chip>Public share link</Chip>
        <Chip>Google Drive backup</Chip>
      </div>
    </SectionBlock>
  );
}

function BestPracticesSection() {
  return (
    <SectionBlock
      id="best-practices"
      icon={Star}
      eyebrow="Section 10"
      title="Best practices."
      subtitle="Shortcuts from users who've shipped resumes on NxtResume for months."
    >
      <ul className="space-y-3">
        {BEST_PRACTICES.map((practice) => (
          <li
            key={practice}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <span
              className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="text-[14px] leading-relaxed text-slate-700">
              {practice}
            </span>
          </li>
        ))}
      </ul>
    </SectionBlock>
  );
}

// ────────────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────────────

export default function Documentation() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState("overview");

  useEffect(() => {
    const ids = SECTIONS.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 pt-12 pb-14 lg:px-10 lg:pt-20">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>

          <div className="mt-6 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-700">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
              Product Documentation
            </span>
            <h1
              style={DISPLAY}
              className="mt-5 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px]"
            >
              Everything you need to{" "}
              <span className="text-slate-400">
                ship a resume, a letter, and a portfolio.
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-slate-600">
              Organized around the real NxtResume workflow. Start with the
              profile, create tailored resumes, write cover letters, validate
              with ATS, then publish a portfolio — all from one saved source.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Chip>Profile-driven workflow</Chip>
              <Chip>16 resume + 10 cover letter templates</Chip>
              <Chip>ATS checker + portfolio pages</Chip>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-[240px_1fr] lg:px-10">
          <TOC activeId={activeId} setActiveId={setActiveId} />

          <div className="space-y-20">
            <OverviewSection />
            <FirstResumeSection />
            <ProfileDataSection />
            <ResumeSectionsSection />
            <AIToolsSection />
            <CoverLetterSection />
            <ATSSection />
            <PortfolioSection />
            <DownloadSection />
            <BestPracticesSection />

            {/* Closing CTA */}
            <div className="rounded-2xl border border-slate-200 bg-[#FBFAF7] p-10 text-center">
              <h3
                style={DISPLAY}
                className="text-[28px] font-semibold leading-tight tracking-tight text-slate-900"
              >
                Ready to put this into practice?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-slate-600">
                Jump back into the app — profile first, resume second, cover
                letter third.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => navigate("/complete-profile")}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#FF4800]"
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Finish my profile
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-900 px-5 text-[13px] font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                >
                  Go to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
