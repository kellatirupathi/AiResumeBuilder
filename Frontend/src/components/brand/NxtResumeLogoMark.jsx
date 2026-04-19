import React from "react";
import { cn } from "@/lib/utils";

/**
 * NxtResume logo mark — minimal, editorial, designed to sit next to the
 * "NxtResume" wordmark. Uses the brand charcoal `#0F172A` and a warm
 * orange `#FF4800` accent dot (the only two colors in the mark, matching
 * the rest of the marketing site).
 *
 * The letterform is a geometric three-bar "N" inside a rounded square.
 * The small orange dot in the bottom-right reads as a cursor blink or
 * completion indicator — a subtle hook that hints at the product without
 * shouting "AI tool".
 */
function NxtResumeLogoMark({
  className,
  title = "NxtResume",
  background = "#0F172A",
  foreground = "#FFFFFF",
  accent = "#FF4800",
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      {title ? <title>{title}</title> : null}

      {/* Rounded-square base */}
      <rect width="64" height="64" rx="14" fill={background} />

      {/* Subtle inner hairline — gives the mark a touch of depth without a gradient */}
      <rect
        x="0.5"
        y="0.5"
        width="63"
        height="63"
        rx="13.5"
        stroke={foreground}
        strokeOpacity="0.08"
      />

      {/* Geometric "N" — three bars */}
      <g fill={foreground}>
        <rect x="16" y="15" width="6" height="34" rx="1.8" />
        <polygon points="22,15 28,15 48,49 42,49" />
        <rect x="42" y="15" width="6" height="34" rx="1.8" />
      </g>

      {/* Warm accent dot — the single touch of personality */}
      <circle cx="51" cy="50" r="3" fill={accent} />
    </svg>
  );
}

export default NxtResumeLogoMark;
