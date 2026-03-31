import React, { useId } from "react";
import { cn } from "@/lib/utils";

function NxtResumeLogoMark({ className, title = "NxtResume logo" }) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  const backgroundGradient = `nxtresume-bg-${id}`;
  const orbGradient = `nxtresume-orb-${id}`;
  const shineGradient = `nxtresume-shine-${id}`;
  const paperGradient = `nxtresume-paper-${id}`;
  const foldGradient = `nxtresume-fold-${id}`;
  const accentGradient = `nxtresume-accent-${id}`;
  const sparkleGradient = `nxtresume-spark-${id}`;
  const outerShadow = `nxtresume-outer-shadow-${id}`;
  const cardShadow = `nxtresume-card-shadow-${id}`;

  return (
    <svg
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-label={title}
      className={cn("shrink-0", className)}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={backgroundGradient} x1="16" y1="12" x2="79" y2="84" gradientUnits="userSpaceOnUse">
          <stop stopColor="#081321" />
          <stop offset="0.5" stopColor="#2448D8" />
          <stop offset="1" stopColor="#0FBF9F" />
        </linearGradient>
        <radialGradient id={orbGradient} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(27 22) rotate(35) scale(24 22)">
          <stop stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="0.45" stopColor="#A5C8FF" stopOpacity="0.3" />
          <stop offset="1" stopColor="#A5C8FF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={shineGradient} x1="62" y1="14" x2="82" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.65" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={paperGradient} x1="31" y1="20" x2="67.5" y2="73" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.58" stopColor="#EEF4FF" />
          <stop offset="1" stopColor="#DCE8FF" />
        </linearGradient>
        <linearGradient id={foldGradient} x1="56.5" y1="20" x2="67.5" y2="33.4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D7E6FF" />
          <stop offset="1" stopColor="#9AB8FF" />
        </linearGradient>
        <linearGradient id={accentGradient} x1="38.5" y1="39.5" x2="60.5" y2="57" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EBE9A" />
          <stop offset="0.55" stopColor="#2474FF" />
          <stop offset="1" stopColor="#0A4BFF" />
        </linearGradient>
        <radialGradient id={sparkleGradient} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(60.75 41.75) rotate(90) scale(4)">
          <stop stopColor="#D8FEFF" />
          <stop offset="1" stopColor="#57D7FF" stopOpacity="0" />
        </radialGradient>
        <filter id={outerShadow} x="2" y="4" width="92" height="92" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="#081321" floodOpacity="0.34" />
        </filter>
        <filter id={cardShadow} x="20" y="15" width="56" height="68" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="5" stdDeviation="3.5" floodColor="#16336C" floodOpacity="0.18" />
        </filter>
      </defs>

      <g filter={`url(#${outerShadow})`}>
        <rect x="10" y="10" width="76" height="76" rx="22" fill={`url(#${backgroundGradient})`} />
        <rect x="10.75" y="10.75" width="74.5" height="74.5" rx="21.25" stroke="white" strokeOpacity="0.14" strokeWidth="1.5" />
        <circle cx="27" cy="22" r="22" fill={`url(#${orbGradient})`} />
        <path d="M60 13.5C72 17.5 80.5 26.5 84 40.5" stroke={`url(#${shineGradient})`} strokeWidth="1.25" strokeLinecap="round" />
      </g>

      <g filter={`url(#${cardShadow})`}>
        <path
          d="M33.5 22.5H58.5L69 33V65.5C69 69.0899 66.0899 72 62.5 72H39.5C35.9101 72 33 69.0899 33 65.5V23C33 22.7239 33.2239 22.5 33.5 22.5Z"
          fill="#96AAFF"
          fillOpacity="0.18"
        />
        <path
          d="M31.5 20H56.5L67.5 31V65.5C67.5 69.6421 64.1421 73 60 73H36C31.8579 73 28.5 69.6421 28.5 65.5V23C28.5 21.3431 29.8431 20 31.5 20Z"
          fill={`url(#${paperGradient})`}
        />
        <path
          d="M56.5 20V27.75C56.5 30.8438 59.0062 33.35 62.1 33.35H67.5L56.5 20Z"
          fill={`url(#${foldGradient})`}
        />
        <path d="M40 36.5H52.5" stroke="#C7D7FF" strokeWidth="2.7" strokeLinecap="round" />
        <path d="M39.5 63.5H56.5" stroke="#CCDAFF" strokeWidth="2.7" strokeLinecap="round" />
        <path d="M39.5 68.5H53.5" stroke="#D6E2FF" strokeWidth="2.7" strokeLinecap="round" />
        <path
          d="M37.5 57V39.5L45.75 57V39.5"
          stroke={`url(#${accentGradient})`}
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M50 57V39.5H54.9C58.1585 39.5 60.8 42.1415 60.8 45.4C60.8 48.6585 58.1585 51.3 54.9 51.3H50M55 51.2L61.25 57"
          stroke={`url(#${accentGradient})`}
          strokeWidth="4.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="60.75" cy="41.75" r="4" fill={`url(#${sparkleGradient})`} />
      </g>
    </svg>
  );
}

export default NxtResumeLogoMark;
