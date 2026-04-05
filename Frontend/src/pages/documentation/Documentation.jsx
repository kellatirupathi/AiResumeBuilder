import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle,
  Code,
  Download,
  FileText,
  FolderGit,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Link2,
  Palette,
  PieChart,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  User,
  WandSparkles,
} from "lucide-react";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

const sections = [
  { id: "overview", label: "Product Overview", icon: LayoutDashboard },
  { id: "first-resume", label: "Create Your First Resume", icon: Plus },
  { id: "profile-data", label: "Complete Profile Data", icon: User },
  { id: "resume-sections", label: "Build Resume Sections", icon: FileText },
  { id: "ai-tools", label: "Use AI Tools", icon: Sparkles },
  { id: "ats-checker", label: "Check ATS Score", icon: PieChart },
  { id: "portfolio", label: "Generate Portfolio", icon: Palette },
  { id: "download-share", label: "Download & Share", icon: Download },
  { id: "best-practices", label: "Best Practices", icon: Star },
];

const profileBlocks = [
  {
    title: "Personal Details",
    icon: User,
    items: [
      "Add your name, target job title, phone, email, and location.",
      "Add LinkedIn, GitHub, and portfolio links if they are active and recruiter-ready.",
      "Keep the job title aligned with the role you are applying for.",
    ],
  },
  {
    title: "Professional Summary",
    icon: FileText,
    items: [
      "Write a short 3-5 sentence paragraph for your overall positioning.",
      "Use the AI Summary Writer if you want a draft for a target role.",
      "This section should stay in paragraph format, not bullet points.",
    ],
  },
  {
    title: "Work Experience",
    icon: Briefcase,
    items: [
      "Add company name and job title before using Generate.",
      "Use Generate to create new bullets from the experience fields.",
      "Use Enhance With AI only after you already have a work summary to improve.",
    ],
  },
  {
    title: "Projects",
    icon: FolderGit,
    items: [
      "Add project name and tech stack before using Generate.",
      "Use Generate to create project bullets from the project fields only.",
      "Use Enhance With AI only when a project summary already exists.",
    ],
  },
  {
    title: "Education, Skills, Certifications",
    icon: GraduationCap,
    items: [
      "Fill these sections completely so every resume and portfolio can reuse them.",
      "Skills are important for ATS matching, so use exact role keywords where appropriate.",
      "Certifications and education strengthen trust signals, especially for early-career users.",
    ],
  },
];

const resumeSectionCards = [
  {
    title: "Summary",
    icon: FileText,
    body: "Keep this concise and role-aligned. It is your quick recruiter pitch.",
  },
  {
    title: "Experience",
    icon: Briefcase,
    body: "Lead with action verbs, results, numbers, and impact. Avoid generic duty-only bullets.",
  },
  {
    title: "Projects",
    icon: FolderGit,
    body: "Show what you built, with what stack, and why it mattered. Bullet points work best here.",
  },
  {
    title: "Skills",
    icon: Code,
    body: "Use accurate keywords from the target role. Do not stuff unrelated technologies.",
  },
  {
    title: "Education & Certifications",
    icon: Award,
    body: "Use these to support credibility, especially when experience is limited.",
  },
];

const aiCards = [
  {
    title: "AI Summary Writer",
    icon: WandSparkles,
    body: "Type a target role and generate a professional summary draft. The typed role should guide the output more than the saved profile title.",
  },
  {
    title: "Experience Generate / Enhance",
    icon: Briefcase,
    body: "Generate creates fresh bullets from the experience item fields. Enhance rewrites an existing work summary.",
  },
  {
    title: "Project Generate / Enhance",
    icon: FolderGit,
    body: "Generate uses the project name and tech stack. Enhance improves an existing project summary instead of inventing one.",
  },
  {
    title: "Profile Assistant",
    icon: Sparkles,
    body: "Ask for rewrites, stronger bullets, role alignment, or project summaries. If the reply is relevant, use the inline Add action to push it into the right section.",
  },
];

const atsRules = [
  "Paste the actual job description text. Do not paste only a link.",
  "Use a complete JD with responsibilities, requirements, and skills.",
  "If the input is too short, repetitive, or not sentence-like, the app should reject it as invalid.",
  "Treat ATS results as product guidance based on the real JD you provide, not guessed keywords.",
];

const portfolioSteps = [
  "Complete and save your profile data first.",
  "Open Profile and click Generate Portfolio.",
  "Choose the portfolio template inside portfolio mode.",
  "Click Generate Portfolio and confirm that your profile is ready.",
  "After generation, review the generated portfolio link added back into your profile.",
];

const bestPractices = [
  "Create one strong base profile first. That makes every new resume faster to create.",
  "Tailor the summary, top experience bullets, and skills for each job instead of sending one generic resume everywhere.",
  "Use AI to speed up drafting, but always review the final content before saving.",
  "For ATS checks, paste only real job descriptions. Invalid inputs create misleading analysis.",
  "For projects and experience, do not generate content from empty forms. Fill the required fields first.",
  "Save your profile before generating a portfolio so the portfolio uses the latest content.",
];

const Callout = ({ type = "info", children }) => {
  const styles = {
    info: {
      box: "border-blue-200 bg-blue-50 text-blue-900",
      icon: <Lightbulb className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />,
    },
    tip: {
      box: "border-emerald-200 bg-emerald-50 text-emerald-900",
      icon: <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />,
    },
    warning: {
      box: "border-amber-200 bg-amber-50 text-amber-900",
      icon: <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />,
    },
  };
  const style = styles[type];

  return (
    <div className={`my-4 flex gap-3 rounded-2xl border p-4 text-sm ${style.box}`}>
      {style.icon}
      <div className="leading-6">{children}</div>
    </div>
  );
};

Callout.propTypes = {
  type: PropTypes.oneOf(["info", "tip", "warning"]),
  children: PropTypes.node.isRequired,
};

const Step = ({ number, title, children }) => (
  <div className="flex gap-4">
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
      {number}
    </div>
    <div>
      <p className="mb-1 text-sm font-semibold text-gray-900">{title}</p>
      <div className="text-sm leading-6 text-gray-600">{children}</div>
    </div>
  </div>
);

Step.propTypes = {
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6">
    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
      <Icon className="h-3.5 w-3.5" />
      {title}
    </div>
    <p className="max-w-3xl text-sm leading-7 text-gray-600">{subtitle}</p>
  </div>
);

SectionHeader.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const sectionMap = useMemo(() => Object.fromEntries(sections.map((section) => [section.id, section])), []);

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="sticky top-0 hidden h-screen w-72 flex-shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-slate-200 px-5 py-5">
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 transition-colors hover:text-indigo-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
                  activeSection === id
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${activeSection === id ? "text-indigo-600" : "text-slate-400"}`} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
            <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                <Target className="h-3.5 w-3.5" />
                Product Documentation
              </div>
              <h1 className="max-w-4xl text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Build, improve, score, and publish your resume in the right order
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
                This guide is organized around the real NxtResume workflow. Start with profile data, create your first resume, improve sections with AI, validate it with the ATS checker, and then generate a portfolio from the same saved profile.
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-4">
                {[
                  "Complete profile once",
                  "Create role-specific resumes",
                  "Use AI where it actually helps",
                  "Run ATS check with a real JD",
                ].map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <section id="overview" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap.overview.icon}
                  title="Product Overview"
                  subtitle="NxtResume is not just a resume editor. It uses one central profile as the source for resume creation, AI assistance, ATS analysis, and portfolio generation."
                />

                <div className="grid gap-4 md:grid-cols-4">
                  {[
                    { title: "1. Profile", body: "Add your reusable career data once." },
                    { title: "2. Resume", body: "Create one or more tailored resumes." },
                    { title: "3. ATS", body: "Check how well a resume matches a real JD." },
                    { title: "4. Portfolio", body: "Generate a portfolio from the saved profile." },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 p-4">
                      <p className="mb-1 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{item.body}</p>
                    </div>
                  ))}
                </div>

                <Callout type="tip">
                  Treat the <strong>Profile</strong> page as your master data source. Better profile data produces better AI output, better portfolio generation, and faster resume creation.
                </Callout>
              </section>

              <section id="first-resume" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["first-resume"].icon}
                  title="Create Your First Resume"
                  subtitle="If this is a new account, the best sequence is profile first, then resume creation, then ATS checking."
                />

                <div className="space-y-5">
                  <Step number={1} title="Open Dashboard">
                    Start from the main dashboard after login. This is the entry point for profile, resumes, ATS checker, and portfolio-related work.
                  </Step>
                  <Step number={2} title="Complete your profile before heavy editing">
                    Open <strong>Profile</strong> and add your personal details, experience, projects, education, skills, and certifications. This prevents empty AI generations and weak portfolio output later.
                  </Step>
                  <Step number={3} title="Create a new resume">
                    Use the dashboard create-resume flow and give the resume a clear internal title, such as <strong>Backend Developer - Product Companies</strong> or <strong>Salesforce Developer - Enterprise Roles</strong>.
                  </Step>
                  <Step number={4} title="Tailor it for a specific role">
                    Use your reusable profile data, then adjust the resume summary, skills, experience bullets, and project emphasis for the role you want to target.
                  </Step>
                </div>

                <Callout type="info">
                  Real product usage should encourage multiple tailored resumes, not one universal resume for every role.
                </Callout>
              </section>

              <section id="profile-data" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["profile-data"].icon}
                  title="Complete Profile Data"
                  subtitle="Profile data powers AI generation, Add-to-Profile actions from the assistant, and portfolio generation. Incomplete profile data creates weak output everywhere."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {profileBlocks.map(({ title, icon: Icon, items }) => (
                    <div key={title} className="rounded-2xl border border-slate-200 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-2">
                          <Icon className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                      </div>
                      <ul className="space-y-2 text-sm leading-6 text-slate-600">
                        {items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Callout type="warning">
                  Generate and Enhance actions in <strong>Experience</strong> and <strong>Projects</strong> should only be used after the required local fields are filled. Empty forms should be fixed first, not AI-generated.
                </Callout>
              </section>

              <section id="resume-sections" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["resume-sections"].icon}
                  title="Build Resume Sections"
                  subtitle="Once profile data is in place, shape the resume into a role-specific document. These are the sections that usually matter most in hiring workflows."
                />

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {resumeSectionCards.map(({ title, icon: Icon, body }) => (
                    <div key={title} className="rounded-2xl border border-slate-200 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-slate-100 p-2">
                          <Icon className="h-4 w-4 text-slate-700" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{body}</p>
                    </div>
                  ))}
                </div>

                <Callout type="tip">
                  Use paragraph format for the professional summary. Use bullet-style, outcome-focused content for work experience and project summaries.
                </Callout>
              </section>

              <section id="ai-tools" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["ai-tools"].icon}
                  title="Use AI Tools"
                  subtitle="AI should speed up drafting and rewriting, but it should follow the right source fields and the right section behavior."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {aiCards.map(({ title, icon: Icon, body }) => (
                    <div key={title} className="rounded-2xl border border-slate-200 p-5">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="rounded-xl bg-purple-50 p-2">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{title}</p>
                      </div>
                      <p className="text-sm leading-6 text-slate-600">{body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-5">
                  <Step number={1} title="Use Generate when you need fresh content">
                    This is the right action when a section is mostly empty but enough required fields are present.
                  </Step>
                  <Step number={2} title="Use Enhance when you already have a draft">
                    This is the right action when you want stronger wording, cleaner bullets, or better impact statements.
                  </Step>
                  <Step number={3} title="Use Profile Assistant for conversational editing">
                    Ask for a summary rewrite, project bullets, or role alignment suggestions. If the answer is relevant, use the inline <strong>Add to Profile</strong> action under the assistant reply.
                  </Step>
                </div>

                <Callout type="warning">
                  AI output should be reviewed before saving. It should support your real experience, not invent claims you cannot defend in an interview.
                </Callout>
              </section>

              <section id="ats-checker" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["ats-checker"].icon}
                  title="Check ATS Score"
                  subtitle="ATS analysis is useful only when the job description input is real. The product should reject links, repetitive keyword spam, and fake JD text."
                />

                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-5">
                    <Step number={1} title="Open ATS Checker from the dashboard">
                      Choose either a saved resume or upload a PDF, depending on which version you want to evaluate.
                    </Step>
                    <Step number={2} title="Paste the full job description text">
                      Paste responsibilities, requirements, skills, preferred qualifications, and other real JD content into Step 2.
                    </Step>
                    <Step number={3} title="Run analysis only with valid JD input">
                      The app should reject URL-only text and weak fake inputs. Analysis should happen only when the JD looks like a real role description.
                    </Step>
                    <Step number={4} title="Use the result to revise the resume">
                      Review the score, strengths, missing keywords, and recommendations. Then go back and update the relevant sections instead of copying keywords blindly.
                    </Step>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Link2 className="h-4 w-4 text-indigo-600" />
                      ATS input rules
                    </div>
                    <ul className="space-y-3 text-sm leading-6 text-slate-600">
                      {atsRules.map((rule) => (
                        <li key={rule} className="flex gap-2">
                          <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Callout type="tip">
                  Use ATS results as revision guidance. A better score should come from better resume relevance, not keyword stuffing or guessing.
                </Callout>
              </section>

              <section id="portfolio" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap.portfolio.icon}
                  title="Generate Portfolio"
                  subtitle="Portfolio generation now depends on your saved profile content. The cleaner the profile, the better the portfolio output."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="mb-3 text-sm font-semibold text-slate-900">Recommended flow</p>
                    <ol className="space-y-3 text-sm leading-6 text-slate-600">
                      {portfolioSteps.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-5">
                    <p className="mb-3 text-sm font-semibold text-slate-900">What to expect</p>
                    <ul className="space-y-3 text-sm leading-6 text-slate-600">
                      <li className="flex gap-2">
                        <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>Portfolio generation happens from the profile page, not from an isolated data source.</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>The UI should confirm readiness before generating so users can fix missing profile data first.</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle className="mt-1 h-4 w-4 flex-shrink-0 text-emerald-500" />
                        <span>After generation, the portfolio link should be available back in the profile for reuse and sharing.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section id="download-share" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["download-share"].icon}
                  title="Download & Share"
                  subtitle="Once a resume is tailored and checked, use the final output options confidently."
                />

                <div className="grid gap-4 md:grid-cols-3">
                  {[
                    {
                      title: "Save Profile",
                      body: "Save changes before leaving Profile or generating a portfolio so all downstream features use the latest data.",
                    },
                    {
                      title: "Download PDF",
                      body: "Export the resume only after the final content review. Regenerate the PDF after every important edit.",
                    },
                    {
                      title: "Share Links",
                      body: "Use resume or portfolio links only when the public output is polished and recruiter-ready.",
                    },
                  ].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-slate-200 p-5">
                      <p className="mb-2 text-sm font-semibold text-slate-900">{item.title}</p>
                      <p className="text-sm leading-6 text-slate-600">{item.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="best-practices" className="rounded-[24px] border border-slate-200 bg-white p-8 shadow-sm">
                <SectionHeader
                  icon={sectionMap["best-practices"].icon}
                  title="Best Practices"
                  subtitle="These are the operational habits that make the product useful in real job-search workflows."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  {bestPractices.map((tip) => (
                    <div key={tip} className="flex gap-3 rounded-2xl border border-slate-200 p-4">
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      <p className="text-sm leading-6 text-slate-600">{tip}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 rounded-[24px] border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-8 text-center">
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-950">Recommended user journey</h3>
                  <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                    Complete profile data, create a resume for a target role, use AI to improve section quality, validate against a real job description in ATS Checker, then generate a portfolio from the same saved profile.
                  </p>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4" />
                    Go to Dashboard
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
