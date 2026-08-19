/**
 * Single source of truth for every content shape on the site.
 *
 * Content lives in plain typed modules rather than Astro content collections:
 * these are a handful of hand-maintained arrays, not many markdown files, so
 * plain modules give better autocomplete and let `astro check` catch typos in
 * icon names and cross-references at build time.
 */

/**
 * How a skill or link renders its glyph.
 *
 * `iconify` names are inlined as SVG at build time from local @iconify-json
 * packages — no runtime JS, no CDN request, tree-shaken to only what's used.
 *
 * `text` is the deliberate fallback for things with no brand mark (LangGraph,
 * Cursor, abstract concepts). A monospace pill among logo chips reads as
 * intentional; a placeholder logo reads as broken.
 */
export type IconRef = { kind: "iconify"; name: string } | { kind: "text" };

export type SkillLevel = "core" | "working" | "familiar";

export interface Skill {
  name: string;
  icon: IconRef;
  /** Surfaced as a tooltip and in the accessible name. Keeps the section from
   *  being a wall of unexplained logos, which is what the old site was. */
  note?: string;
  level: SkillLevel;
}

export type SkillGroupId = "languages" | "backend" | "databases" | "architecture" | "devops" | "ai";

export interface SkillGroup {
  id: SkillGroupId;
  label: string;
  /** Lucide glyph for the group header. */
  glyph: string;
  skills: Skill[];
}

/** A resume bullet. `metric` is pulled out and rendered as a large mono
 *  figure — that pull-out is what makes the page scannable in 40 seconds. */
export interface Highlight {
  text: string;
  metric?: { value: string; label: string };
}

export interface ExperienceRole {
  company: string;
  companyUrl?: string;
  title: string;
  location: string;
  /** ISO year-month, e.g. "2025-06". */
  start: string;
  end: string | "present";
  /** One-line framing of scope, rendered above the bullets. */
  summary: string;
  highlights: Highlight[];
  /** Each entry should match a `Skill.name` so chips stay consistent. */
  stack: string[];
}

export interface Project {
  slug: string;
  title: string;
  /** Short kicker shown under the title. */
  kicker: string;
  description: string;
  /** Featured projects get a full card; the rest go in a compact grid. */
  featured: boolean;
  year: string;
  stack: string[];
  repoUrl?: string;
  liveUrl?: string;
  highlights?: string[];
  /** Reserved: populating this later enables /projects/[slug] without a
   *  refactor of this module. */
  caseStudy?: string;
}

export interface EducationEntry {
  institution: string;
  qualification: string;
  detail: string;
  period: string;
  location: string;
}

export interface Achievement {
  title: string;
  detail?: string;
  /** Lucide or simple-icons name. */
  icon: string;
  year?: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
  /** Shown in the command palette. */
  handle: string;
}

/** A headline number for the impact strip. */
export interface Metric {
  value: string;
  label: string;
  detail: string;
}

export interface Profile {
  name: string;
  /** Rotated in the hero. First entry is the static fallback under
   *  prefers-reduced-motion. */
  roles: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  currentRole: { title: string; company: string; companyUrl: string };
}
