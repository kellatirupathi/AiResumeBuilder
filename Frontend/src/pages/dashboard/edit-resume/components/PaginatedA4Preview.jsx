import React, { useLayoutEffect, useRef, useState } from "react";

/**
 * PaginatedA4Preview — Option B: Element-level safe breaks.
 *
 * Splits the resume into discrete A4 page cards stacked vertically.
 * Walks ALL nested elements (sections → items → bullets) and picks the
 * deepest break point that fits within the page. Never splits a text line,
 * a bullet, or any leaf element.
 *
 * Page geometry matches the PDF's @page CSS rules:
 *   @page         { margin: 15mm 0 15mm 0; }   // 15mm top + 15mm bottom
 *   @page :first  { margin-top: 0; }            // page 1 has no top margin
 */

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const TOP_MARGIN_MM = 15;
const BOTTOM_MARGIN_MM = 15;

const PX_PER_MM = 3.7795275591;
const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;
const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;
const TOP_MARGIN_PX = TOP_MARGIN_MM * PX_PER_MM;
const BOTTOM_MARGIN_PX = BOTTOM_MARGIN_MM * PX_PER_MM;

const PAGE_1_CONTENT_PX = A4_HEIGHT_PX - BOTTOM_MARGIN_PX;
const PAGE_N_CONTENT_PX = A4_HEIGHT_PX - TOP_MARGIN_PX - BOTTOM_MARGIN_PX;

// Tags that should never be split internally — they are atomic leaf-like
// units even if they contain children (e.g. a bullet line, a paragraph).
const ATOMIC_TAGS = new Set([
  "LI",
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "TR",
  "IMG",
  "SVG",
  "CANVAS",
]);

/**
 * Recursively find the deepest safe break point inside `el` such that
 * everything above the returned Y is on the current page (i.e. ends at or
 * before `pageBottom`) and at least some content fits.
 *
 * Returns a Y offset (relative to root) where the next page should start,
 * or null if NO safe break inside this subtree fits the page.
 */
function findDeepestBreak(el, pageTop, pageBottom, rootRect) {
  // Atomic elements: cannot break inside. Either they fit entirely or not.
  if (ATOMIC_TAGS.has(el.tagName)) {
    return null;
  }

  const children = Array.from(el.children);
  if (children.length === 0) return null;

  // Walk children. Find the first child that crosses pageBottom.
  let bestBreak = null;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const rect = child.getBoundingClientRect();
    if (rect.height === 0 || rect.width === 0) continue;

    // Skip absolute/fixed-positioned elements — they are out of normal flow
    // (decorative dots, sidebars, overlays) and must not drive page breaks.
    const position = window.getComputedStyle(child).position;
    if (position === "absolute" || position === "fixed") continue;

    const childTop = rect.top - rootRect.top;
    const childBottom = rect.bottom - rootRect.top;

    if (childBottom <= pageBottom) {
      // Child fits entirely on the page — candidate break is AFTER it.
      // (We can break before the next sibling.)
      bestBreak = childBottom;
      continue;
    }

    if (childTop >= pageBottom) {
      // Child starts at/past page boundary — break BEFORE this child.
      // Use bestBreak (prior sibling's bottom); never childTop, which is
      // past pageBottom and would lose the slice between pageBottom and Y.
      return bestBreak;
    }

    // Child straddles the boundary — try to break inside it.
    const innerBreak = findDeepestBreak(child, pageTop, pageBottom, rootRect);
    if (innerBreak !== null && innerBreak > pageTop) {
      return innerBreak;
    }

    // Cannot break inside — break BEFORE this straddling child.
    if (bestBreak === null) {
      // No prior sibling fit. The child itself is too tall for the page.
      // Caller will fall back to a hard cut.
      return null;
    }
    return bestBreak;
  }

  return bestBreak;
}

function calculateBreakPoints(rootEl, totalHeight) {
  if (totalHeight <= PAGE_1_CONTENT_PX) return [0];

  const rootRect = rootEl.getBoundingClientRect();
  const breakPoints = [0];
  let pageTop = 0;
  let pageBottom = PAGE_1_CONTENT_PX;
  let safety = 0;

  while (pageBottom < totalHeight && safety < 50) {
    safety++;

    let breakAt = findDeepestBreak(rootEl, pageTop, pageBottom, rootRect);

    // Fallback: nothing fits cleanly (e.g. an oversized image/heading at
    // the top of the page) — hard-cut at the page boundary so we still
    // make forward progress.
    if (breakAt === null || breakAt <= pageTop + 50) {
      breakAt = pageBottom;
    }

    // Defensive clamp: a break point must never sit past pageBottom,
    // otherwise the strip between pageBottom and breakAt is lost between
    // the visible page card (clipped at pageBottom) and the next page
    // (which starts at breakAt).
    if (breakAt > pageBottom) {
      breakAt = pageBottom;
    }

    breakPoints.push(breakAt);
    pageTop = breakAt;
    pageBottom = breakAt + PAGE_N_CONTENT_PX;
  }

  return breakPoints;
}

export default function PaginatedA4Preview({ children }) {
  const measureRef = useRef(null);
  const [pages, setPages] = useState([
    { start: 0, end: PAGE_1_CONTENT_PX },
  ]);

  useLayoutEffect(() => {
    const element = measureRef.current;
    if (!element) return undefined;

    const recalc = () => {
      const totalHeight =
        element.scrollHeight || element.offsetHeight || 0;

      if (totalHeight === 0) return;

      const breaks = calculateBreakPoints(element, totalHeight);

      const newPages = breaks.map((start, idx) => {
        const end = idx + 1 < breaks.length ? breaks[idx + 1] : totalHeight;
        return { start, end };
      });

      setPages(newPages);
    };

    recalc();

    const observer = new ResizeObserver(recalc);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      style={{
        background: "#f3f4f6",
        padding: "24px 0",
        minHeight: "100%",
        width: "100%",
      }}
    >
      {/* Hidden measurement container — renders children once to measure */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-99999px",
          top: 0,
          width: `${A4_WIDTH_PX}px`,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        <div ref={measureRef}>{children}</div>
      </div>

      {/* Visible A4 page cards */}
      {pages.map((page, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const topPadPx = isFirstPage ? 0 : TOP_MARGIN_PX;
        const maxContentHeightPx = isFirstPage
          ? PAGE_1_CONTENT_PX
          : PAGE_N_CONTENT_PX;

        const actualContentHeightPx = Math.min(
          page.end - page.start,
          maxContentHeightPx
        );

        return (
          <div
            key={pageIdx}
            style={{
              width: `${A4_WIDTH_PX}px`,
              height: `${A4_HEIGHT_PX}px`,
              background: "white",
              boxShadow:
                "0 1px 3px rgba(0,0,0,0.12), 0 4px 6px rgba(0,0,0,0.04)",
              margin: "0 auto",
              marginBottom: pageIdx < pages.length - 1 ? "24px" : 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: `${topPadPx}px`,
                left: 0,
                right: 0,
                height: `${actualContentHeightPx}px`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: `${-page.start}px`,
                  left: 0,
                  right: 0,
                  width: `${A4_WIDTH_PX}px`,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
