export * from "./types";
export { profile } from "./profile";
export { experience } from "./experience";
export { projects, featuredProjects, otherProjects } from "./projects";
export { skillGroups } from "./skills";
export { education } from "./education";
export { achievements } from "./achievements";
export { socials } from "./socials";
export { metrics } from "./metrics";
export { seo, personSchema } from "./seo";

/** Section registry — the single source of truth for nav links, scroll-spy
 *  targets, and command-palette jump entries. Order matches the page. */
export const sections = [
  { id: "work", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
