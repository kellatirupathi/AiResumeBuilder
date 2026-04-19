import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Mail,
  User,
  Building2,
  MessageSquare,
  PenLine,
  Sparkles,
  Clock,
  FileSignature,
} from "lucide-react";
import Header from "@/components/custom/Header";
import NxtResumeWordmark from "@/components/brand/NxtResumeWordmark";

const DISPLAY = { fontFamily: "Fraunces, Georgia, serif" };
const ACCENT = "#FF4800";

const SECTIONS = [
  { id: "purpose", label: "Purpose", icon: Sparkles },
  { id: "header", label: "Header", icon: User },
  { id: "recipient", label: "Recipient & Greeting", icon: Building2 },
  { id: "opening", label: "Opening Paragraph", icon: PenLine },
  { id: "body", label: "Body Paragraphs", icon: MessageSquare },
  { id: "closing", label: "Closing & Signature", icon: FileSignature },
  { id: "tone", label: "Tone & Length", icon: Mail },
  { id: "tailor", label: "Tailor for the Role", icon: Sparkles },
];

export default function CoverLetterPreparation() {
  const user = useSelector((s) => s.editUser.userData);
  const [activeId, setActiveId] = useState("purpose");

  return (
    <>
      <Helmet>
        <title>How to Write a Cover Letter — Examples, Structure, Tone · NxtResume</title>
        <meta
          name="description"
          content="Step-by-step guide to writing a cover letter that actually gets read. Covers header, recipient, opening, body, closing, tone, length, and how to tailor for each role — with real examples."
        />
        <meta name="keywords" content="how to write a cover letter, cover letter guide, cover letter structure, cover letter tips, cover letter examples, cover letter format, cover letter template, professional cover letter, job application letter, cover letter tone" />
        <link rel="canonical" href="https://ai-resume-builder-ochre-five.vercel.app/cover-letter-preparation" />
        <meta property="og:title" content="How to Write a Cover Letter — Examples, Structure, Tone · NxtResume" />
        <meta property="og:description" content="Step-by-step guide to writing a cover letter that gets read. Field-by-field structure, tone rules, and real examples." />
        <meta property="og:url" content="https://ai-resume-builder-ochre-five.vercel.app/cover-letter-preparation" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": "How to Write a Cover Letter",
          "description": "A structured guide to writing a cover letter that sounds human — field by field.",
          "totalTime": "PT8M",
          "step": [
            { "@type": "HowToStep", "name": "Header", "text": "Match your resume header exactly: name, phone, email, location, LinkedIn or portfolio." },
            { "@type": "HowToStep", "name": "Recipient & Greeting", "text": "Address the hiring manager or team by name. Never use 'To whom it may concern'." },
            { "@type": "HowToStep", "name": "Opening Paragraph", "text": "2–3 sentences: state the role, lead with your strongest qualification, hint at a specific reason you want to join." },
            { "@type": "HowToStep", "name": "Body Paragraphs", "text": "One or two paragraphs covering proof of fit (story with a quantified result) and a complementary strength." },
            { "@type": "HowToStep", "name": "Closing & Signature", "text": "Two sentences — a small concrete ask and a warm sign-off." },
            { "@type": "HowToStep", "name": "Tone & Length", "text": "Keep it 250–400 words. Write like a person. Drop clichés." },
            { "@type": "HowToStep", "name": "Tailor for the Role", "text": "Change the opening, swap the proof-of-fit story, mirror 1–2 JD keywords naturally." }
          ]
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-white text-slate-900 antialiased">
        <Header user={user} />
        <Hero />
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 pb-24 pt-12 lg:grid-cols-[240px_1fr] lg:px-8">
            <TOC activeId={activeId} setActiveId={setActiveId} />
            <div className="space-y-20">
              <PurposeSection />
              <HeaderSection />
              <RecipientSection />
              <OpeningSection />
              <BodySection />
              <ClosingSection />
              <ToneSection />
              <TailorSection />
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
            COVER LETTER PREPARATION
          </span>
          <h1
            style={DISPLAY}
            className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[56px] lg:text-[60px]"
          >
            A cover letter that{" "}
            <span className="text-slate-400">actually gets read.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-600">
            Field by field. What to include, the order that works, the tone
            to strike — and the phrases to drop.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" style={{ color: ACCENT }} />
              Est. 8 min to read
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Pairs with all 10 NxtResume templates</span>
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

function PurposeSection() {
  return (
    <SectionBlock
      id="purpose"
      icon={Sparkles}
      label="Section 01"
      title="What a cover letter is for"
      subtitle="Not a recap of your resume. A short, pointed argument for why you are the right person for this role."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <InfoCard
          title="Connect"
          body="Link your experience to the specific problem the team is solving."
        />
        <InfoCard
          title="Differentiate"
          body="Say the one thing about you a recruiter will not see from your resume alone."
        />
        <InfoCard
          title="Invite"
          body="End with a small, concrete ask — a call, a conversation, a portfolio link."
        />
      </div>
      <TipBox variant="warn">
        If your cover letter could be sent to any company, it will be treated
        that way. Write for <strong>this role, this team</strong> — every
        time.
      </TipBox>
    </SectionBlock>
  );
}

function InfoCard({ title, body }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">
        {body}
      </p>
    </div>
  );
}

function HeaderSection() {
  return (
    <SectionBlock
      id="header"
      icon={User}
      label="Section 02"
      title="Header — your details"
      subtitle="Match exactly what is at the top of your resume. Recruiters cross-reference the two."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Full name"
          required
          description="Same spelling as on your resume and LinkedIn."
        />
        <FieldCard
          name="Phone"
          required
          description="Include country code."
          example="+91 63036 39014"
        />
        <FieldCard
          name="Email"
          required
          description="The address you check daily. Same as your resume."
        />
        <FieldCard
          name="Location"
          required
          description="City and state. No full street address."
        />
        <FieldCard
          name="LinkedIn / Portfolio"
          description="One or two links max — only active, branded URLs."
        />
        <FieldCard
          name="Date"
          description="Full date in long form."
          example="April 19, 2026"
        />
      </div>
    </SectionBlock>
  );
}

function RecipientSection() {
  return (
    <SectionBlock
      id="recipient"
      icon={Building2}
      label="Section 03"
      title="Recipient & greeting"
      subtitle="The few seconds you spend here are the difference between feeling generic and feeling intentional."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FieldCard
          name="Hiring manager / recruiter name"
          description="Check the JD, LinkedIn, or the company's team page. If you cannot find one, it is okay — see below."
          example="Dear Priya Mehta,"
        />
        <FieldCard
          name="Team name fallback"
          description="Use the team or role, not 'To whom it may concern'."
          example="Dear Engineering Team,"
        />
        <FieldCard
          name="Company"
          required
          description="Full, correctly-spelled company name."
          example="NxtWave"
        />
        <FieldCard
          name="Role you are applying for"
          required
          description="Use the exact title from the JD."
          example="Senior Frontend Engineer"
        />
      </div>
      <TipBox variant="warn">
        Never use "Dear Sir/Madam." It signals you did not try. A team name is
        always better than a generic salutation.
      </TipBox>
    </SectionBlock>
  );
}

function OpeningSection() {
  return (
    <SectionBlock
      id="opening"
      icon={PenLine}
      label="Section 04"
      title="Opening paragraph"
      subtitle="2–3 sentences. Role, why you, and a hook that makes the reader continue."
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          Structure
        </p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-[13.5px] leading-relaxed text-slate-700">
          <li>State the role and where you found it.</li>
          <li>Name your strongest relevant qualification in one line.</li>
          <li>Hint at a specific reason you want to work there.</li>
        </ol>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sample
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-800">
          I'm applying for the Senior Frontend Engineer role at NxtWave after
          reading Priya's post about the new design-system push. I've led
          two design-system migrations at mid-size startups — most recently
          reducing component duplication across 40+ teams — and would love to
          bring that experience to your product group.
        </p>
      </div>
      <TipBox variant="warn">
        Avoid openers like "I am writing to apply for…" — it's filler. Lead
        with the reason you're qualified.
      </TipBox>
    </SectionBlock>
  );
}

function BodySection() {
  return (
    <SectionBlock
      id="body"
      icon={MessageSquare}
      label="Section 05"
      title="Body paragraphs"
      subtitle="One or two paragraphs. Show you can do the work and that you understand their problem."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          title="Paragraph 1 — proof of fit"
          body="Pick one hard thing from the JD and tell the story of when you did it. Number the result."
        />
        <InfoCard
          title="Paragraph 2 — what you bring"
          body="A complementary strength that isn't in the resume bullets — mentorship, cross-team leadership, a tool you built, etc."
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sample body paragraph
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-800">
          In my current role at Acme, I led the migration of our main
          checkout flow from a legacy template system to a modular React
          architecture. The work cut page load times by 32%, shipped in four
          two-week iterations, and became the reference pattern the team
          reused for three other surfaces. The JD mentions a similar
          migration on your dashboard — I'd love to help on it from day one.
        </p>
      </div>
      <TipBox>
        Keep each paragraph <strong>under 5 sentences</strong>. If it spills
        over, you're retelling your resume instead of making an argument.
      </TipBox>
    </SectionBlock>
  );
}

function ClosingSection() {
  return (
    <SectionBlock
      id="closing"
      icon={FileSignature}
      label="Section 06"
      title="Closing & signature"
      subtitle="Two sentences. A small, specific ask and a warm sign-off."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <InfoCard
          title="The ask"
          body='"I would love to chat about the role — happy to walk through my portfolio." Better than a passive "looking forward to hearing from you."'
        />
        <InfoCard
          title="The sign-off"
          body='"Thanks," / "Best," / "Sincerely," — all work. Pair with your name exactly as on your resume.'
        />
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
          Sample
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-slate-800">
          Thanks for reading this far. I'd love the chance to walk through my
          portfolio and learn more about how the design-system team works
          today.
          <br />
          <br />
          Best,
          <br />
          Tirupathi Rao Kella
        </p>
      </div>
    </SectionBlock>
  );
}

function ToneSection() {
  return (
    <SectionBlock
      id="tone"
      icon={Mail}
      label="Section 07"
      title="Tone & length"
      subtitle="Warm, specific, confident — never formal-for-the-sake-of-formal."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <RuleCard
          title="250 – 400 words"
          body="One page is more than enough. Shorter is better than padded."
        />
        <RuleCard
          title="Write like a person"
          body="Read it aloud. If you wouldn't say it in an interview, rewrite it."
        />
        <RuleCard
          title="One voice across documents"
          body="Cover letter, resume summary, and LinkedIn bio should all sound like the same person."
        />
      </div>
      <TipBox variant="warn">
        Words to drop: <em>esteemed, cutting-edge, synergy, dynamic,
        hard-working, passionate, results-driven, utilize</em>. They sound
        like everyone else.
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

function TailorSection() {
  return (
    <SectionBlock
      id="tailor"
      icon={Sparkles}
      label="Section 08"
      title="Tailor for every role"
      subtitle="You don't need to write from scratch every time — but the top third must be specific."
    >
      <ul className="space-y-3">
        {[
          "Change the opening to reference the exact role and company.",
          "Swap the proof-of-fit story to match the hardest requirement in the JD.",
          "Mirror 1–2 keywords from the JD naturally — don't force them.",
          "Update the 'ask' to reference a specific team or project if you can find one.",
          "Re-read once, cut one sentence, and send.",
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
      <TipBox>
        NxtResume's AI Cover Letter generator handles the heavy lifting —
        paste the JD, upload your resume, and review the tailored draft in
        under a minute.
      </TipBox>
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
        Ready to draft yours?
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-[14px] leading-relaxed text-slate-600">
        Pick from 10 cover letter templates or let AI tailor one for you
        against any job description.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/cover-letters"
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-slate-900 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#FF4800]"
        >
          Browse templates
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          to="/auth/sign-in"
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-slate-900 px-5 text-[13px] font-semibold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
        >
          Start with AI
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
