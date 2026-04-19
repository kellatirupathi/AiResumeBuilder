import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Award,
  Folder,
  Gauge,
  Clock,
} from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const SECTIONS = [
  { id: "personal", label: "Personal Details", icon: User },
  { id: "summary", label: "Professional Summary", icon: FileText },
  { id: "experience", label: "Work Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Folder },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "ats", label: "ATS & Format", icon: Gauge },
  { id: "maintain", label: "Maintain & Update", icon: Sparkles },
];

export default function ResumePreparation() {
  const user = useSelector((s) => s.editUser.userData);
  const [activeId, setActiveId] = useState("personal");

  return (
    <>
      <Helmet>
        <title>How to Write a Resume · NxtResume</title>
        <meta
          name="description"
          content="A field-by-field guide to writing a strong, ATS-safe resume — what to add, what to skip, and how to keep it fresh."
        />
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Header user={user} />

        <Hero />

        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-24 pt-12 lg:grid-cols-[240px_1fr] lg:px-8">
            <TOC activeId={activeId} setActiveId={setActiveId} />
            <div className="space-y-20">
              <PersonalDetails />
              <SummarySection />
              <ExperienceSection />
              <ProjectsSection />
              <EducationSection />
              <SkillsSection />
              <CertificationsSection />
              <ATSSection />
              <MaintainSection />
              <ClosingCTA />
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

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
            RESUME PREPARATION
          </span>

          <h1
            style={DISPLAY}
            className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[60px]"
          >
            Write a resume that{" "}
            <span className="text-slate-400">earns the callback.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-600">
            A field-by-field guide to every section of a strong, ATS-safe
            resume. What's required, what to skip, and how to keep it fresh.
          </p>

          <div className="mt-8 flex items-center gap-4 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Est. 10 min to read
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Works with every template in NxtResume</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TOC({ activeId, setActiveId }) {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
        On this page
      </p>
      <nav className="mt-4 space-y-0.5 border-l border-slate-200">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={() => setActiveId(id)}
            className={`flex items-center gap-2 border-l-2 px-3 py-1.5 -ml-[2px] text-[13px] transition-colors ${
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

function SectionBlock({ id, icon: Icon, label, title, subtitle, children }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4 }}
      className="scroll-mt-24"
    >
      <div className="mb-6 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          {label}
        </p>
      </div>
      <h2
        style={DISPLAY}
        className="text-[32px] font-semibold leading-tight tracking-tight text-slate-900 sm:text-[38px]"
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

function FieldCard({ name, required, description, example }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold text-slate-900">{name}</h3>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            required
              ? "bg-[#FF4800]/10 text-[#FF4800]"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {required ? "Required" : "Optional"}
        </span>
      </div>
      <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
        {description}
      </p>
      {example && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] text-slate-700">
          <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Example
          </span>
          {example}
        </div>
      )}
    </div>
  );
}

function TipBox({ children, variant = "tip" }) {
  const isWarn = variant === "warn";
  const Icon = isWarn ? AlertTriangle : CheckCircle2;
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        isWarn
          ? "border-amber-200 bg-amber-50/60"
          : "border-emerald-200 bg-emerald-50/60"
      }`}
    >
      <Icon
        className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
          isWarn ? "text-amber-600" : "text-emerald-600"
        }`}
      />
      <div className="text-[13px] leading-relaxed text-slate-700">
        {children}
      </div>
    </div>
  );
}

function PersonalDetails() {
  return (
    <SectionBlock
      id="personal"
      icon={User}
      label="Section 01"
      title="Personal Details"
      subtitle="The header of your resume. Recruiters read this first — make it clean, current, and reachable."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Full name"
          required
          description="Your legal or preferred name. Keep it consistent across LinkedIn, GitHub, and email."
          example="Tirupathi Rao Kella"
        />
        <FieldCard
          name="Job title"
          required
          description="The role you are applying for, not your last job title. Align with the JD."
          example="Fullstack Developer"
        />
        <FieldCard
          name="Email"
          required
          description="A professional address you check daily. Avoid nicknames or numbers."
          example="firstname.lastname@gmail.com"
        />
        <FieldCard
          name="Phone"
          required
          description="Include country code. Skip landlines and office numbers."
          example="+91 63036 39014"
        />
        <FieldCard
          name="Location"
          required
          description="City and state — no full street address. Add 'Open to relocation' if true."
          example="Hyderabad, Telangana"
        />
        <FieldCard
          name="LinkedIn, GitHub, Portfolio"
          description="Add only active, recruiter-ready links. Keep usernames short and branded."
          example="linkedin.com/in/yourname"
        />
      </div>
      <TipBox>
        Your photo is usually <strong>not</strong> needed in markets like the
        US, UK, Canada, or Australia. Include only for markets where it is
        customary (parts of Europe, LATAM, APAC).
      </TipBox>
    </SectionBlock>
  );
}

function SummarySection() {
  return (
    <SectionBlock
      id="summary"
      icon={FileText}
      label="Section 02"
      title="Professional Summary"
      subtitle="Two to four sentences, at most. Who you are, what you do, what you have shipped."
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Structure
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13.5px] leading-relaxed text-slate-700">
          <li>
            <strong>Identity</strong> — your role + years of experience.
          </li>
          <li>
            <strong>Core skills</strong> — the 3–5 things you are best at.
          </li>
          <li>
            <strong>Impact</strong> — one quantifiable result or specialty.
          </li>
          <li>
            <strong>Intent</strong> — what you are looking for next (optional).
          </li>
        </ol>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sample
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-800">
          Fullstack developer with 2+ years of experience building React and
          Node.js applications. Comfortable across TypeScript, MongoDB, and
          AWS. Shipped an internal analytics tool used by 40+ ops users,
          cutting manual reporting time by 60%. Looking to join a product
          team working on developer tools.
        </p>
      </div>

      <TipBox variant="warn">
        Avoid clichés like "hard-working team player," "results-driven," and
        "passionate about." Recruiters skip them.
      </TipBox>
    </SectionBlock>
  );
}

function ExperienceSection() {
  return (
    <SectionBlock
      id="experience"
      icon={Briefcase}
      label="Section 03"
      title="Work Experience"
      subtitle="The heart of your resume. Each role needs four fields plus 3–5 bullets."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Company"
          required
          description="Exact legal name. Add a one-line descriptor if unknown (e.g., 'fintech startup')."
        />
        <FieldCard
          name="Role / Title"
          required
          description="Your official title. If it was informal, use a common equivalent."
          example="Software Engineer"
        />
        <FieldCard
          name="Dates"
          required
          description="Month and year. Use 'Present' for current roles."
          example="Mar 2024 — Present"
        />
        <FieldCard
          name="Location"
          required
          description="City, state or 'Remote'. Drop full address."
          example="Hyderabad, India"
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Writing bullets (the SAR formula)
        </p>
        <p className="mt-3 text-[13.5px] leading-relaxed text-slate-700">
          <strong>S</strong>ituation + <strong>A</strong>ction +{" "}
          <strong>R</strong>esult. Start with a strong verb, say what you did,
          end with a number.
        </p>
        <div className="mt-4 grid gap-3">
          <BulletRow
            bad="Worked on the checkout flow."
            good="Rebuilt the checkout flow in React, reducing drop-off by 18% across 12k monthly sessions."
          />
          <BulletRow
            bad="Helped with team productivity."
            good="Introduced a weekly code-review rotation that cut PR turnaround time from 3 days to 18 hours."
          />
          <BulletRow
            bad="Responsible for APIs."
            good="Built 14 REST endpoints in Node.js + Express, handling 2M requests/month with p95 < 120ms."
          />
        </div>
      </div>

      <TipBox>
        Aim for <strong>3–5 bullets</strong> per role — more for your current
        job, fewer for older ones. Stop at 10 years back unless earlier roles
        are directly relevant.
      </TipBox>
    </SectionBlock>
  );
}

function BulletRow({ bad, good }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2 text-[13px] text-slate-700">
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
          Weak
        </span>
        {bad}
      </div>
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2 text-[13px] text-slate-700">
        <span className="mr-2 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          Strong
        </span>
        {good}
      </div>
    </div>
  );
}

function ProjectsSection() {
  return (
    <SectionBlock
      id="projects"
      icon={Folder}
      label="Section 04"
      title="Projects"
      subtitle="Especially important for students and early-career engineers. Pick 2–4 that show range."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Project name"
          required
          description="Short and descriptive. Skip version numbers."
          example="Smart Task Manager"
        />
        <FieldCard
          name="Tech stack"
          required
          description="Languages, frameworks, and major libraries. Comma-separated."
          example="React, Node.js, MongoDB"
        />
        <FieldCard
          name="Bullets"
          required
          description="2–4 bullets. What you built, hard parts you solved, and a quantifiable outcome."
        />
        <FieldCard
          name="Links"
          description="Live demo, GitHub repo, or blog post. Verify they load."
        />
      </div>
      <TipBox>
        A project with a live link and a public repo beats three "side
        projects" with no proof.
      </TipBox>
    </SectionBlock>
  );
}

function EducationSection() {
  return (
    <SectionBlock
      id="education"
      icon={GraduationCap}
      label="Section 05"
      title="Education"
      subtitle="Short and factual. Only include GPA if it's 3.5+ (or equivalent) and you graduated recently."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Institution"
          required
          description="Full name of the college or university."
          example="Harvey University"
        />
        <FieldCard
          name="Degree"
          required
          description="Abbreviated degree name and major."
          example="BTech in EEE"
        />
        <FieldCard
          name="Dates"
          required
          description="Start month/year – end month/year (or 'Expected')."
          example="Apr 2020 — May 2023"
        />
        <FieldCard
          name="GPA / CGPA"
          description="Only include if impressive (≥ 3.5 / ≥ 8.0) and you're within 2 years of graduation."
          example="CGPA: 9.0"
        />
      </div>
    </SectionBlock>
  );
}

function SkillsSection() {
  return (
    <SectionBlock
      id="skills"
      icon={Code}
      label="Section 06"
      title="Skills"
      subtitle="Group by area — it is easier to scan and better for ATS. NxtResume uses four buckets."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Frontend"
          description="Languages, frameworks, styling."
          example="HTML, CSS, JavaScript, React, TypeScript, Redux"
        />
        <FieldCard
          name="Backend"
          description="Runtime, frameworks, API patterns."
          example="Node.js, Express.js, REST, GraphQL"
        />
        <FieldCard
          name="Database"
          description="Relational, document, caching."
          example="MongoDB, PostgreSQL, Redis, Firebase"
        />
        <FieldCard
          name="Other / DevOps"
          description="Tooling, cloud, CI/CD, VCS."
          example="Git, GitHub Actions, Docker, AWS, CI/CD"
        />
      </div>
      <TipBox variant="warn">
        Only list skills you can defend in an interview. "Familiar with" or
        ratings out of 5 add noise without adding signal — skip them.
      </TipBox>
    </SectionBlock>
  );
}

function CertificationsSection() {
  return (
    <SectionBlock
      id="certifications"
      icon={Award}
      label="Section 07"
      title="Certifications"
      subtitle="Optional. Add only if they are recent, from a known issuer, and relevant to the role."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Certification name"
          required
          description="Exact title as issued."
          example="AWS Certified Solutions Architect – Associate"
        />
        <FieldCard
          name="Issuer"
          required
          description="Organization that granted the certification."
          example="Amazon Web Services"
        />
        <FieldCard
          name="Issue date"
          required
          description="Month and year. Include expiry if applicable."
          example="February 2025"
        />
        <FieldCard
          name="Credential URL"
          description="Direct verification link, if the issuer provides one."
        />
      </div>
    </SectionBlock>
  );
}

function ATSSection() {
  return (
    <SectionBlock
      id="ats"
      icon={Gauge}
      label="Section 08"
      title="ATS & Format"
      subtitle="Most resumes are read by software first, humans second. These rules keep both happy."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <RuleCard
          title="One page under 7 years of experience"
          body="Two pages only when every line earns its place. Never three."
        />
        <RuleCard
          title="Standard fonts only"
          body="Inter, Arial, Calibri, Georgia, or the fonts baked into NxtResume templates. No script fonts."
        />
        <RuleCard
          title="No tables, columns, or images behind text"
          body="Screening software reads left to right, top to bottom. Fancy layouts scramble the output."
        />
        <RuleCard
          title="Match keywords to the JD"
          body="Use the same terms the recruiter uses — 'React' not 'ReactJS', 'CI/CD' not 'continuous deployment' — when accurate."
        />
        <RuleCard
          title="Export as PDF"
          body="PDFs preserve formatting. DOCX can shift margins between machines. NxtResume exports both."
        />
        <RuleCard
          title="Name the file sensibly"
          body="Firstname-Lastname-Role.pdf. Not resume_final_v4.pdf."
        />
      </div>
      <TipBox>
        Run your resume through the{" "}
        <Link to="/ats-checker" className="font-semibold underline">
          ATS Checker
        </Link>{" "}
        with the JD before you apply. It's the fastest way to catch missing
        keywords.
      </TipBox>
    </SectionBlock>
  );
}

function RuleCard({ title, body }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-2">
        <CheckCircle2
          className="mt-0.5 h-4 w-4 flex-shrink-0"
          style={{ color: ACCENT }}
        />
        <h3 className="text-[14px] font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-2 pl-6 text-[13px] leading-relaxed text-slate-600">
        {body}
      </p>
    </div>
  );
}

function MaintainSection() {
  return (
    <SectionBlock
      id="maintain"
      icon={Sparkles}
      label="Section 09"
      title="Maintain & Update"
      subtitle="A resume is not a one-time document. Keep it warm and you'll never scramble the night before."
    >
      <ul className="space-y-3">
        {[
          "Update the moment you ship — add bullets while the work is fresh, not six months later.",
          "Re-run the ATS Checker every time you change jobs or target a new role.",
          "Refresh your LinkedIn and GitHub bios in the same session to keep the story consistent.",
          "Archive old versions per role in NxtResume so you can diff and reuse bullets.",
          "Ask a peer or mentor to review once a quarter — fresh eyes catch drift.",
          "Re-read every quarter: if a bullet no longer sounds true, rewrite or remove it.",
        ].map((t) => (
          <li
            key={t}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4"
          >
            <span
              className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
            <span className="text-[14px] leading-relaxed text-slate-700">
              {t}
            </span>
          </li>
        ))}
      </ul>
    </SectionBlock>
  );
}

function ClosingCTA() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-[#FBFAF7] p-10 text-center">
      <h3
        style={DISPLAY}
        className="text-[28px] font-semibold leading-tight tracking-tight text-slate-900"
      >
        Ready to put this into practice?
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-slate-600">
        Start a resume from a clean template, or let AI draft your bullets
        from a rough input.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/resumes"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#FF4800]"
        >
          Browse templates
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to="/ats-checker"
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-900 px-5 text-[13px] font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
        >
          Run ATS Checker
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-5 py-10 md:flex-row md:items-center lg:px-8">
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
      </div>
    </footer>
  );
}
