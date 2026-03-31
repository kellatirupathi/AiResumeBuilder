import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ChevronRight,
  ChevronDown,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderGit,
  Award,
  Sparkles,
  PieChart,
  Download,
  Eye,
  Plus,
  Edit,
  Palette,
  LayoutDashboard,
  ArrowLeft,
  CheckCircle,
  Lightbulb,
  AlertCircle,
  Zap,
  Star,
  Target,
} from "lucide-react";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

const sections = [
  { id: "overview",        label: "Overview",             icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "create-resume",   label: "Creating a Resume",    icon: <Plus            className="h-4 w-4" /> },
  { id: "personal",        label: "Personal Details",     icon: <User            className="h-4 w-4" /> },
  { id: "summary",         label: "Professional Summary", icon: <FileText        className="h-4 w-4" /> },
  { id: "experience",      label: "Work Experience",      icon: <Briefcase       className="h-4 w-4" /> },
  { id: "education",       label: "Education",            icon: <GraduationCap   className="h-4 w-4" /> },
  { id: "skills",          label: "Skills",               icon: <Code            className="h-4 w-4" /> },
  { id: "projects",        label: "Projects",             icon: <FolderGit       className="h-4 w-4" /> },
  { id: "certifications",  label: "Certifications",       icon: <Award           className="h-4 w-4" /> },
  { id: "ai-features",     label: "AI Features",          icon: <Sparkles        className="h-4 w-4" /> },
  { id: "ats-checker",     label: "ATS Score Checker",    icon: <PieChart        className="h-4 w-4" /> },
  { id: "theme",           label: "Theme & Appearance",   icon: <Palette         className="h-4 w-4" /> },
  { id: "download",        label: "Download & Share",     icon: <Download        className="h-4 w-4" /> },
  { id: "tips",            label: "Pro Tips",             icon: <Star            className="h-4 w-4" /> },
];

const Callout = ({ type = "info", children }) => {
  const styles = {
    info:    { bg: "bg-blue-50 dark:bg-blue-900/20",   border: "border-blue-200 dark:border-blue-700",   icon: <Lightbulb  className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" /> },
    tip:     { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-700", icon: <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" /> },
    warning: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-700", icon: <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" /> },
  };
  const s = styles[type];
  return (
    <div className={`flex gap-2.5 p-3.5 rounded-lg border ${s.bg} ${s.border} my-4 text-sm`}>
      {s.icon}
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
};

const Step = ({ number, title, children }) => (
  <div className="flex gap-4 mb-5">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
      {number}
    </div>
    <div>
      <p className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{title}</p>
      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{children}</div>
    </div>
  </div>
);

const Field = ({ name, required, description }) => (
  <div className="flex gap-3 py-2.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="min-w-[140px]">
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{name}</span>
      {required && <span className="ml-1.5 text-[10px] font-semibold text-red-500 bg-red-50 dark:bg-red-900/30 px-1.5 py-0.5 rounded-full">required</span>}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default function Documentation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");

  const scrollTo = (id) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen sticky top-0 overflow-y-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-3 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2.5">
            <NxtResumeLogoMark className="h-8 w-8" />
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">NxtResume Docs</p>
              <p className="text-[10px] text-gray-400">Complete Guide</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-0.5">
          {sections.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-all duration-150 ${
                activeSection === id
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <span className={activeSection === id ? "text-indigo-500" : "text-gray-400"}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10 space-y-16">

          {/* ─ HERO ─ */}
          <div className="text-center pb-6 border-b border-gray-200 dark:border-gray-700">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Zap className="h-3.5 w-3.5" /> Complete User Guide
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3">
              How to Create a Resume <span className="text-indigo-600">from Scratch</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-base max-w-xl mx-auto">
              A step-by-step walkthrough covering every section of NxtResume — from your first click to downloading a job-ready PDF.
            </p>
          </div>

          {/* ─ OVERVIEW ─ */}
          <section id="overview">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <LayoutDashboard className="h-5 w-5 text-indigo-500" /> Overview
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
              NxtResume is an AI-powered resume builder that helps you craft professional, ATS-friendly resumes in minutes.
              The workflow is straightforward:
            </p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: <Plus className="h-4 w-4 text-emerald-500" />,    step: "1", label: "Create a new resume" },
                { icon: <Edit className="h-4 w-4 text-indigo-500" />,     step: "2", label: "Fill in each section" },
                { icon: <Sparkles className="h-4 w-4 text-purple-500" />, step: "3", label: "Use AI to polish content" },
                { icon: <Download className="h-4 w-4 text-blue-500" />,   step: "4", label: "Download as PDF" },
              ].map(({ icon, step, label }) => (
                <div key={step} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-3 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center">{icon}</div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Step {step}</span>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
                  </div>
                </div>
              ))}
            </div>
            <Callout type="tip">
              Your profile data (experience, education, skills, etc.) is shared across all resumes. Fill it in once and it will auto-populate every new resume you create.
            </Callout>
          </section>

          {/* ─ CREATING A RESUME ─ */}
          <section id="create-resume">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-indigo-500" /> Creating a Resume
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
              Starting a brand-new resume takes only a few seconds.
            </p>
            <Step number={1} title='Click the "+ Create New Resume" card'>
              On the Dashboard, you will see a dashed-border card labelled <strong>Create New Resume</strong>. Click it to open the creation dialog.
            </Step>
            <Step number={2} title="Enter a resume title">
              Give your resume a descriptive name, for example <em>"Software Engineer – Google 2025"</em> or <em>"Frontend Developer Resume"</em>. This title is only visible to you and helps you stay organised when you have multiple resumes.
            </Step>
            <Step number={3} title="Click Create">
              Hit the <strong>Create</strong> button. You will be taken directly into the resume editor where you can start filling in your details.
            </Step>
            <Callout type="info">
              You can create as many resumes as you like. Tailor each one to a specific job role or company for the best results.
            </Callout>
          </section>

          {/* ─ PERSONAL DETAILS ─ */}
          <section id="personal">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <User className="h-5 w-5 text-indigo-500" /> Personal Details
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              The first tab in the editor. This section forms the header of your resume.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              <Field name="Full Name"       required description="Your legal full name as it should appear at the top of the resume." />
              <Field name="Job Title"       required description="Your current or desired job title, e.g. 'Senior Frontend Developer'." />
              <Field name="Email"           required description="A professional email address that you actively monitor." />
              <Field name="Phone"           required description="Your mobile number with country code, e.g. +91 98765 43210." />
              <Field name="Address"                  description="City and State are sufficient. You don't need to include your full street address." />
              <Field name="LinkedIn URL"             description="Paste your full LinkedIn profile URL. Recruiters click this regularly." />
              <Field name="GitHub / Portfolio URL"   description="Link to your GitHub profile or personal portfolio website." />
            </div>
            <Callout type="tip">
              Keep your job title consistent with the role you are applying for. Recruiters often scan this first to decide whether to keep reading.
            </Callout>
          </section>

          {/* ─ SUMMARY ─ */}
          <section id="summary">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-indigo-500" /> Professional Summary
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              A 2–4 sentence paragraph at the top of your resume that gives recruiters an instant snapshot of who you are.
              Write it in the first person, omit "I", and lead with your strongest attribute.
            </p>
            <Step number={1} title="Navigate to the Summary tab in the editor">
              Click <strong>Summary</strong> in the left form panel inside the resume editor.
            </Step>
            <Step number={2} title="Write or paste your summary">
              Type your summary directly in the rich-text editor. Aim for 3 sentences: who you are, what you specialise in, and what value you bring.
            </Step>
            <Step number={3} title='Use "Generate with AI" for a first draft'>
              Click the <strong>Generate with AI</strong> button. The AI will read your other sections (experience, skills) and produce a tailored summary automatically. You can edit it afterwards.
            </Step>
            <Callout type="info">
              <strong>Good summary example:</strong> "Results-driven Software Engineer with 3+ years of experience building scalable React applications. Passionate about clean code and developer experience. Seeking to bring my full-stack expertise to a fast-moving product team."
            </Callout>
          </section>

          {/* ─ EXPERIENCE ─ */}
          <section id="experience">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Briefcase className="h-5 w-5 text-indigo-500" /> Work Experience
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              The most heavily weighted section on most resumes. List your positions in reverse chronological order (newest first).
            </p>
            <Step number={1} title='Click "Add Experience"'>
              In the Experience tab, click the <strong>+ Add Experience</strong> button to open a new entry form.
            </Step>
            <Step number={2} title="Fill in the company and role details">
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 mt-2">
                <Field name="Company Name" required description="Full legal name of the employer." />
                <Field name="Job Title"    required description="Your exact title at that company." />
                <Field name="Start Date"   required description="Month and year you started, e.g. Jan 2022." />
                <Field name="End Date"              description='Month and year you left, or leave blank / type "Present" if current.' />
                <Field name="Location"              description="City, State or 'Remote'." />
                <Field name="Description"  required description="Bullet points describing your responsibilities and achievements." />
              </div>
            </Step>
            <Step number={3} title="Write achievement-focused bullet points">
              Start each bullet with a strong action verb (Built, Reduced, Led, Increased, Designed). Use numbers wherever possible.
              <br /><br />
              <em>Weak:</em> "Was responsible for the frontend."<br />
              <em>Strong:</em> "Redesigned the checkout flow, reducing cart abandonment by 18%."
            </Step>
            <Step number={4} title='Use "Improve with AI" on your descriptions'>
              After writing a draft, click the AI wand icon next to the description field. The AI will rewrite your bullets to be more impactful and quantified.
            </Step>
            <Callout type="warning">
              Avoid listing job duties alone. Recruiters already know what a Software Engineer does. Show what <em>you</em> specifically achieved or improved.
            </Callout>
          </section>

          {/* ─ EDUCATION ─ */}
          <section id="education">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 text-indigo-500" /> Education
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              List your highest qualification first. Include university details, degree, major and graduation year.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              <Field name="Institution"     required description="Name of university, college, or school." />
              <Field name="Degree"          required description="e.g. Bachelor of Technology, Master of Science." />
              <Field name="Field of Study"  required description="Your major or specialisation, e.g. Computer Science." />
              <Field name="Start Year"      required description="Year you enrolled." />
              <Field name="End Year"                 description="Year you graduated or expected graduation year." />
              <Field name="Grade / CGPA"             description="Include if it's strong (typically 7.5+ / 10 or 3.5+ / 4.0)." />
              <Field name="Description"              description="Relevant coursework, awards, clubs, or notable projects." />
            </div>
            <Callout type="tip">
              If you are a recent graduate with limited experience, put Education above Experience in your resume. You can reorder sections in the editor.
            </Callout>
          </section>

          {/* ─ SKILLS ─ */}
          <section id="skills">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Code className="h-5 w-5 text-indigo-500" /> Skills
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              A concise list of your technical and soft skills. These are keyword-matched by ATS scanners.
            </p>
            <Step number={1} title="Open the Skills tab">
              Click <strong>Skills</strong> in the left panel of the resume editor.
            </Step>
            <Step number={2} title="Add individual skills">
              Type a skill name (e.g. <em>React.js</em>, <em>Python</em>, <em>Project Management</em>) and press Enter or click Add. Each skill appears as a tag on your resume.
            </Step>
            <Step number={3} title="Optionally set a proficiency rating">
              You can rate each skill from Beginner to Expert. This adds a visual progress bar on certain themes.
            </Step>
            <Callout type="tip">
              Mirror keywords from the job description exactly. If the JD says "Node.js", add "Node.js" not "NodeJS". ATS systems do exact-match keyword searches.
            </Callout>
            <Callout type="info">
              Aim for 10–15 skills. Fewer looks sparse; more can appear unfocused. Prioritise the ones most relevant to the target role.
            </Callout>
          </section>

          {/* ─ PROJECTS ─ */}
          <section id="projects">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <FolderGit className="h-5 w-5 text-indigo-500" /> Projects
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Projects are especially valuable for freshers, career changers, and developers who want to demonstrate hands-on skills.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              <Field name="Project Name"   required description="A clear, descriptive name — not just 'My Project'." />
              <Field name="Technologies"   required description="Comma-separated list: React, Node.js, MongoDB, AWS." />
              <Field name="GitHub Link"             description="Link to the public repository." />
              <Field name="Live Demo URL"           description="Deployed app URL, if available." />
              <Field name="Start / End Date"        description="Month and year range of the project." />
              <Field name="Description"   required description="What the project does, your role, and the impact or outcome." />
            </div>
            <Callout type="tip">
              For each project, answer three questions: What problem did it solve? What did you build? What technologies did you use? That gives recruiters everything they need.
            </Callout>
          </section>

          {/* ─ CERTIFICATIONS ─ */}
          <section id="certifications">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-indigo-500" /> Certifications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Credentials and courses that validate your expertise. These can differentiate you from other candidates.
            </p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
              <Field name="Certification Name" required description="Full name as it appears on your certificate, e.g. 'AWS Certified Solutions Architect – Associate'." />
              <Field name="Issuing Authority"  required description="The organisation that issued it, e.g. Amazon Web Services, Coursera, NxtWave." />
              <Field name="Issue Date"                  description="Month and year you received it." />
              <Field name="Expiry Date"                 description="Leave blank if the certification does not expire." />
              <Field name="Credential URL"              description="Direct link to verify the certificate online." />
            </div>
          </section>

          {/* ─ AI FEATURES ─ */}
          <section id="ai-features">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-indigo-500" /> AI Features
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              NxtResume has AI built into several places to save you time and improve your content quality.
            </p>

            <div className="space-y-4 mb-4">
              {[
                {
                  title: "AI Summary Generator",
                  icon: <FileText className="h-4 w-4 text-purple-500" />,
                  desc: "Available in the Summary tab. Reads your experience, skills and job title then writes a polished 3-sentence professional summary automatically.",
                },
                {
                  title: "AI Bullet Point Improver",
                  icon: <Zap className="h-4 w-4 text-amber-500" />,
                  desc: "In the Experience and Projects tabs, click the wand icon next to any description. The AI rewrites vague bullets into strong, metrics-driven statements.",
                },
                {
                  title: "AI Resume Review",
                  icon: <Target className="h-4 w-4 text-emerald-500" />,
                  desc: "Click 'AI Review' in the editor toolbar for an overall critique of your resume — covering tone, completeness, keyword gaps and formatting issues.",
                },
              ].map(({ title, icon, desc }) => (
                <div key={title} className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">{icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Callout type="warning">
              AI-generated content is a starting point, not a final answer. Always review and personalise it — add specific numbers, company names, and details that only you would know.
            </Callout>
          </section>

          {/* ─ ATS CHECKER ─ */}
          <section id="ats-checker">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <PieChart className="h-5 w-5 text-indigo-500" /> ATS Score Checker
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Most companies use Applicant Tracking Systems (ATS) to auto-filter resumes before a human ever sees them.
              NxtResume's ATS Checker helps you pass that filter.
            </p>
            <Step number={1} title='Click "ATS Checker" in the sidebar'>
              From the Dashboard sidebar, click <strong>ATS Checker</strong>. A modal will appear listing all your resumes.
            </Step>
            <Step number={2} title="Select a resume and paste a job description">
              Choose the resume you want to check, then paste the full job description text from the company's careers page into the text area.
            </Step>
            <Step number={3} title="View your match score and keyword gaps">
              The tool will show you a percentage score, a list of <strong>matched keywords</strong> (green), and <strong>missing keywords</strong> (red) that appear in the job description but not in your resume.
            </Step>
            <Step number={4} title="Go back and fill in the gaps">
              Return to the resume editor and naturally incorporate the missing keywords into your skills, summary, or experience bullets.
            </Step>
            <Callout type="tip">
              Aim for an ATS match score above <strong>75%</strong> before applying. Scores below 60% mean your resume is likely filtered out before a recruiter reads it.
            </Callout>
          </section>

          {/* ─ THEME ─ */}
          <section id="theme">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Palette className="h-5 w-5 text-indigo-500" /> Theme & Appearance
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Change how your resume looks using the theme panel in the editor.
            </p>
            <Step number={1} title='Click the "Theme" button in the editor toolbar'>
              It is represented by a palette icon at the top of the editor. A panel will slide in from the right.
            </Step>
            <Step number={2} title="Pick an accent colour">
              Choose any colour from the colour picker. All headings, dividers and accents on your resume will update instantly in the preview pane.
            </Step>
            <Step number={3} title="Switch templates">
              Browse available resume templates. Each template has a different layout — classic single-column, modern two-column, minimal, etc. The live preview updates instantly so you can compare them.
            </Step>
            <Callout type="info">
              For corporate and finance roles, choose a conservative dark navy or charcoal colour. For creative and tech roles you can be bolder with indigo or emerald.
            </Callout>
          </section>

          {/* ─ DOWNLOAD ─ */}
          <section id="download">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
              <Download className="h-5 w-5 text-indigo-500" /> Download & Share
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              When your resume is ready, you have two options for sharing it.
            </p>
            <Step number={1} title='Click "Download PDF" in the editor'>
              The editor generates a print-quality PDF. The file is named after your resume title.
            </Step>
            <Step number={2} title="Or copy the shareable link">
              Click <strong>Share</strong> to generate a public URL (e.g. <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">/public/resume/abc123</code>). Anyone with the link can view a read-only version of your resume in their browser — no login required.
            </Step>
            <Callout type="warning">
              Always download a fresh PDF after you make changes. Sending an old PDF while your online version has been updated can cause confusion.
            </Callout>
            <Callout type="tip">
              When emailing your resume, name the file <strong>FirstName_LastName_Resume.pdf</strong> so it stands out in a recruiter's downloads folder.
            </Callout>
          </section>

          {/* ─ PRO TIPS ─ */}
          <section id="tips">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-indigo-500" /> Pro Tips
            </h2>
            <div className="space-y-3">
              {[
                { tip: "One page rule", body: "Keep your resume to one page if you have under 10 years of experience. Recruiters spend on average 7 seconds scanning a resume — don't make them scroll." },
                { tip: "Tailor for every role", body: "Never send the same generic resume twice. Use NxtResume's multiple resume feature to create a tailored version for each company. Adjust your summary, skills and top bullet points to match the JD." },
                { tip: "Use numbers everywhere", body: "Quantify every achievement you can. \"Improved performance\" is vague. \"Reduced API response time by 40%\" is compelling." },
                { tip: "Avoid tables and columns in the PDF", body: "Some ATS systems struggle to parse multi-column layouts. Use NxtResume's clean single-column or ATS-safe two-column templates." },
                { tip: "Check spelling carefully", body: "Use the browser spell-check as a baseline, then read your resume out loud. One typo can cost you an interview." },
                { tip: "Update your profile regularly", body: "Add new skills, certifications, and projects to your profile as you earn them. Your next application will be ready much faster." },
                { tip: "Get a second opinion", body: "Share your resume's public link with a friend, mentor, or career counsellor. Fresh eyes catch things you miss." },
              ].map(({ tip, body }) => (
                <div key={tip} className="flex gap-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
                  <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-0.5">{tip}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="mt-10 text-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-8">
              <Sparkles className="h-8 w-8 text-indigo-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ready to build your resume?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Head back to the dashboard and create your first resume in minutes.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-900/20"
              >
                <Plus className="h-4 w-4" /> Go to Dashboard
              </button>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
