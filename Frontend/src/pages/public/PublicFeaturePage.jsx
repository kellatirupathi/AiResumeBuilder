import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import NxtResumeLogoMark from "@/components/brand/NxtResumeLogoMark";

function PublicFeaturePage({
  eyebrow,
  title,
  description,
  points,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50">
        <div className="absolute -left-16 top-16 h-52 w-52 rounded-full bg-emerald-200/30 blur-3xl" />
        <div className="absolute -right-16 top-0 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <div className="mb-6 flex items-center gap-3">
            <NxtResumeLogoMark className="h-12 w-12" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</div>
              <div className="text-xs text-slate-500">Public feature page</div>
            </div>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{description}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {points.map((point) => (
              <div key={point} className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm backdrop-blur-sm">
                <div className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-emerald-50 p-1.5 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{point}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link to={primaryHref}>
              <Button className="bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700">
                {primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to={secondaryHref}>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                {secondaryLabel}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

PublicFeaturePage.propTypes = {
  description: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  points: PropTypes.arrayOf(PropTypes.string).isRequired,
  primaryHref: PropTypes.string.isRequired,
  primaryLabel: PropTypes.string.isRequired,
  secondaryHref: PropTypes.string.isRequired,
  secondaryLabel: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default PublicFeaturePage;
