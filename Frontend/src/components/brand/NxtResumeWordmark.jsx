import React from "react";
import { cn } from "@/lib/utils";

/**
 * NxtResumeWordmark — the unified NxtResume logo.
 *
 * Instead of a separate icon + text pair, this is a single typographic
 * wordmark where the brand *is* the typography:
 *
 *   Nxt • Resume
 *
 * - "Nxt" in Fraunces bold
 * - A small warm-orange dot (the brand accent — acts as the tittle/period)
 * - "Resume" in Fraunces regular weight — creates quiet contrast
 *
 * The size follows `fontSize` (via the `size` prop or Tailwind class), so it
 * scales cleanly anywhere: nav header, footer, sign-in screen, dashboards.
 */
function NxtResumeWordmark({
  className,
  size = "20px",
  color = "currentColor",
  accent = "#FF4800",
  title = "NxtResume",
}) {
  return (
    <span
      role="img"
      aria-label={title}
      className={cn("inline-flex select-none items-baseline", className)}
      style={{
        fontFamily: "Fraunces, Georgia, serif",
        letterSpacing: "-0.015em",
        color,
        fontSize: size,
        lineHeight: 1,
      }}
    >
      <span style={{ fontWeight: 700 }}>Nxt</span>
      <span
        aria-hidden="true"
        style={{
          display: "inline-block",
          width: "0.28em",
          height: "0.28em",
          margin: "0 0.18em 0 0.1em",
          backgroundColor: accent,
          borderRadius: "50%",
          transform: "translateY(-0.25em)",
        }}
      />
      <span style={{ fontWeight: 400 }}>Resume</span>
    </span>
  );
}

export default NxtResumeWordmark;
