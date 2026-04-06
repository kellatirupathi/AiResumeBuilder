import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  FileText,
  PieChart,
  Search,
  Target,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const score = 84;

const strengths = [
  "React.js, Node.js, MongoDB, and REST API skills match the role strongly.",
  "Project and work experience clearly show full-stack development ownership.",
  "Resume structure is ATS-friendly with clear headings and readable sections.",
];

const missingKeywords = ["CI/CD", "Agile", "Unit Testing", "AWS"];

const recommendations = [
  "Add cloud deployment and CI/CD terminology to projects or skills.",
  "Mention testing tools and workflow ownership more explicitly.",
  "Mirror a few exact job description keywords in the summary and experience bullets.",
];

const jobDescriptionPreview = `We are looking for a Full Stack Developer with strong React.js, Node.js, MongoDB, REST APIs, CI/CD, and Agile experience.

Responsibilities:
- Build scalable web applications
- Collaborate across teams
- Improve performance and maintainability
- Contribute to testing and release workflows`;

export default function PublicATSCheckerPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-indigo-200/25 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">ATS Checker</div>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Check how strongly your resume matches a job description before you apply.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
                Use the same ATS workflow from the app: choose a resume source, paste a JD, and review a structured score with
                missing keywords, strengths, and recommendations.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/auth/sign-in">
                  <Button className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700">
                    Try ATS Checker
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">ATS Match Score</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  See how well the resume aligns with the exact wording, skills, and requirements in the JD.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Search className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">Missing Keywords</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Find important skills and terms your resume should mention more clearly.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">Resume Analysis</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Evaluate experience, role fit, technical stack, structure, and readability together.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-slate-950">Actionable Fixes</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use the recommendations to tailor your resume instead of applying blindly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1700px] px-6 py-12">
        <div className="overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-8 py-8">
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Public Demo</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-[2.55rem]">
                  Product-style ATS analysis preview.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                  This public page mirrors the application flow. The left panel shows the resume source and JD input pattern.
                  The right panel shows the type of score and insight cards users get after analysis.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Workflow</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">Resume + JD + Score</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Result</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">Keyword & fit analysis</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Use Case</div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">Before every application</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid xl:grid-cols-[560px_minmax(0,1fr)]">
            <aside className="border-b border-slate-200 bg-slate-50/70 xl:border-b-0 xl:border-r xl:border-slate-200">
              <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-lg font-bold text-slate-950">Analysis Input</h3>
                <p className="mt-1 text-sm text-slate-500">Choose a resume source and paste the target job description.</p>
              </div>

              <div className="space-y-6 p-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">1</span>
                    <h4 className="text-sm font-semibold text-slate-900">Choose resume source</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <FileText className="h-4 w-4" />
                        Saved Resume
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                        <Upload className="h-4 w-4" />
                        Upload PDF
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Selected Resume</div>
                    <div className="mt-2 text-sm font-semibold text-slate-900">Fullstack Developer Resume</div>
                    <div className="mt-1 text-xs text-slate-500">Updated recently and ready for ATS analysis</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">2</span>
                    <h4 className="text-sm font-semibold text-slate-900">Paste job description</h4>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-600">{jobDescriptionPreview}</pre>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">3</span>
                    <h4 className="text-sm font-semibold text-slate-900">Run ATS analysis</h4>
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Zap className="h-4 w-4" />
                    Analyze Resume
                  </button>
                </div>
              </div>
            </aside>

            <article className="bg-white">
              <div className="border-b border-slate-200 px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Analysis Result</div>
                    <h3 className="mt-1 text-2xl font-bold text-slate-950">ATS Match Score Preview</h3>
                    <p className="mt-1 text-sm text-slate-500">Structured feedback users see after checking resume-to-JD fit.</p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                    Great Match
                  </span>
                </div>
              </div>

              <div className="space-y-5 p-6 lg:p-8">
                <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <PieChart className="h-5 w-5" />
                      </div>
                      <div className="text-sm font-semibold text-slate-900">ATS Score</div>
                    </div>

                    <div className="flex h-36 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-emerald-600">{score}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.16em] text-slate-500">out of 100</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-950">Resume Fit Summary</h4>
                        <p className="text-sm text-slate-500">Strong technical alignment with a few keyword gaps to fix.</p>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Role Match</div>
                        <div className="mt-2 text-xl font-bold text-slate-950">High</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Keyword Fit</div>
                        <div className="mt-2 text-xl font-bold text-slate-950">Strong</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="text-xs uppercase tracking-[0.16em] text-slate-500">Readiness</div>
                        <div className="mt-2 text-xl font-bold text-slate-950">Apply Soon</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <h4 className="text-base font-bold text-slate-950">Strengths</h4>
                    </div>
                    <ul className="space-y-3">
                      {strengths.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-white p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <h4 className="text-base font-bold text-slate-950">Missing Keywords</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-indigo-600" />
                    <h4 className="text-base font-bold text-slate-950">Recommendations</h4>
                  </div>
                  <div className="grid gap-3">
                    {recommendations.map((item, index) => (
                      <div key={item} className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-6 text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <Link to="/auth/sign-in">
                    <Button className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700">
                      Start ATS Analysis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/resumes">
                    <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                      Explore Resume Templates
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
