import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coverLetterTemplates } from "@/pages/dashboard/cover-letter/components/coverLetterDesignOptions";

const highlights = [
  "AI generates a tailored cover letter from your resume + the job description.",
  "10 professional templates — switch designs anytime, content stays the same.",
  "Tone control (formal / friendly / enthusiastic) and one-click PDF download.",
];

export default function PublicCoverLettersPage() {
  return (
    <>
      <Helmet>
        <title>Cover Letter Templates — NxtResume</title>
        <meta
          name="description"
          content="Browse 10 professionally designed cover letter templates. Generate tailored cover letters with AI in seconds."
        />
      </Helmet>

      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 pt-24 pb-12">
          <div className="absolute -left-16 top-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  <Sparkles className="h-3 w-3" />
                  AI-Powered Cover Letters
                </span>
                <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                  Cover letter templates that get noticed
                </h1>
                <p className="mt-4 text-lg text-slate-600">
                  10 professionally designed templates. Pick one, paste a job
                  description, and let AI craft a personalized cover letter in
                  seconds.
                </p>
                <ul className="mt-5 space-y-1.5">
                  {highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/auth/sign-in">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700"
                >
                  <Mail className="h-4 w-4" />
                  Create your cover letter
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Template grid */}
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold">All {coverLetterTemplates.length} templates</h2>
              <Link
                to="/auth/sign-in"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Sign in to use →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {coverLetterTemplates.map((tpl) => (
                <Link
                  key={tpl.id}
                  to="/auth/sign-in"
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-72 w-full overflow-hidden bg-slate-100">
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
                      className="absolute inset-0 hidden flex-col items-center justify-center gap-2"
                      style={{ backgroundColor: `${tpl.accentColor}15` }}
                    >
                      <div
                        className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md"
                        style={{ backgroundColor: tpl.accentColor }}
                      >
                        <Mail className="h-6 w-6" />
                      </div>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: tpl.accentColor }}
                      >
                        {tpl.name}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-800">
                        Use this template
                      </span>
                    </div>
                  </div>
                  <div
                    className="border-t px-4 py-3"
                    style={{ borderColor: `${tpl.accentColor}30` }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-800">{tpl.name}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Ready to land your dream role?
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Sign up free and generate your first AI cover letter in under a minute.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/auth/sign-in">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 text-white hover:from-emerald-600 hover:to-indigo-700"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/resumes">
                <Button size="lg" variant="outline">
                  Browse resume templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
