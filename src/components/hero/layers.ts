export interface HeroLayer {
  /** Matches the source filename stem and the emitted public/hero/{id}-{w}.{ext}. */
  id: string;
  /** Horizontal travel in vw at scroll progress 1. Sign preserves the original
   *  artwork's left/right curtain split. */
  dx: number;
  /** Vertical travel in vh at progress 1. */
  dy: number;
  /** Scale at progress 1. Near layers scale more — that's the depth cue. */
  scale: number;
  /** Percent of extra width bled off each edge. MUST be >= |dx| or the layer
   *  translates far enough to expose the background behind it. */
  overscan: number;
  /** Mobile treatment. "drop" layers are display:none'd AND lazy-loaded, which
   *  means the browser never fetches them at all. */
  mobile: "full" | "reduced" | "drop";
}

/**
 * Replaces the original 12-case switch statement.
 *
 * Array order is DOM order, back to front. The old site stacked these as
 * 10,11,8,9,7,6,5,4,3,2,1,0 and — importantly — had the parallax inverted:
 * background layers moved at 1.0x while the foreground crawled at 0.1x. That
 * reads as a curtain opening, not as depth. Signs are preserved (the artwork
 * genuinely splits left/right) but the magnitudes are rebuilt so near layers
 * move most, which is how parallax actually works.
 *
 * 0.png and 1.png are the only layers the old mobile CSS kept visible, which
 * confirms they are the foreground framing — hence mobile: "full".
 */
export const HERO_LAYERS: HeroLayer[] = [
  { id: "11", dx: 1.5, dy: -1.0, scale: 1.0, overscan: 3, mobile: "full" }, // sky
  { id: "10", dx: -1.5, dy: -1.0, scale: 1.0, overscan: 3, mobile: "full" },
  { id: "9", dx: -2.5, dy: -1.8, scale: 1.01, overscan: 4, mobile: "reduced" },
  { id: "8", dx: 2.5, dy: -1.8, scale: 1.01, overscan: 4, mobile: "reduced" },
  { id: "7", dx: 4.0, dy: -2.6, scale: 1.02, overscan: 6, mobile: "drop" },
  { id: "6", dx: -4.0, dy: -2.6, scale: 1.02, overscan: 6, mobile: "drop" },
  { id: "5", dx: 6.0, dy: -3.4, scale: 1.03, overscan: 8, mobile: "reduced" },
  { id: "4", dx: -6.0, dy: -3.4, scale: 1.03, overscan: 8, mobile: "reduced" },
  { id: "3", dx: 9.0, dy: -4.2, scale: 1.05, overscan: 11, mobile: "reduced" },
  { id: "2", dx: -9.0, dy: -4.2, scale: 1.05, overscan: 11, mobile: "reduced" },
  { id: "1", dx: 14.0, dy: -5.0, scale: 1.08, overscan: 16, mobile: "full" },
  { id: "0", dx: -14.0, dy: -5.0, scale: 1.1, overscan: 16, mobile: "full" }, // nearest
];

/**
 * The sky pair. These are the backmost layers and the only ones that paint
 * edge to edge, which makes one of them the Largest Contentful Paint element
 * at every viewport size — confirmed by Lighthouse, which named 11 as LCP.
 * The foreground trees are visually dominant but cover far less area.
 */
export const LCP_LAYER_IDS = ["11", "10"] as const;

export function isLcpLayer(id: string): boolean {
  return (LCP_LAYER_IDS as readonly string[]).includes(id);
}

export const HERO_WIDTHS = [640, 1024, 1920] as const;

export function srcsetFor(id: string, ext: "avif" | "webp"): string {
  return HERO_WIDTHS.map((w) => `/hero/${id}-${w}.${ext} ${w}w`).join(", ");
}

/**
 * A plain `100vw` makes a 390px phone at DPR 2.6 request the 1024w variant,
 * and decoding twelve AVIFs at that size is the single largest main-thread
 * cost on a mid-range device.
 *
 * This is decorative art sitting behind text, so half density on small screens
 * is imperceptible while halving decode work. Larger screens keep full density.
 */
export const HERO_SIZES = "(max-width: 48rem) 50vw, 100vw";
