/** Shared motion helpers. Client-side only — never import from frontmatter. */

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
export const NARROW_QUERY = "(max-width: 48rem)";

export function prefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Standard easing for reveals — matches --ease-out-expo in tokens.css. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
