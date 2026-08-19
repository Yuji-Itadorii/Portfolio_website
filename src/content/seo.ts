import { profile } from "./profile";
import { socials } from "./socials";

export const seo = {
  title: "Abhay Rawat — Backend & AI Engineer",
  titleTemplate: "%s · Abhay Rawat",
  description:
    "Backend and AI engineer at Paytm. I build Node.js, Express and Spring Boot microservices for high-traffic consumer fintech, and agentic LLM tooling that cut feature delivery time by 35%.",
  siteUrl: "https://abhay-rawat.onrender.com",
  ogImage: "/og.png",
  ogImageAlt: "Abhay Rawat — Backend & AI Engineer at Paytm",
  locale: "en_IN",
  themeColor: { light: "#faf9f7", dark: "#0d1117" },
} as const;

/** JSON-LD Person, emitted once in BaseLayout. */
export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: seo.siteUrl,
  image: `${seo.siteUrl}${seo.ogImage}`,
  jobTitle: profile.currentRole.title,
  worksFor: {
    "@type": "Organization",
    name: profile.currentRole.company,
    url: profile.currentRole.companyUrl,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "National Institute of Technology, Kurukshetra",
  },
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Noida", addressCountry: "IN" },
  knowsAbout: [
    "Node.js",
    "Express.js",
    "Java",
    "Spring Boot",
    "Microservices",
    "System Design",
    "Redis",
    "MongoDB",
    "Apache Cassandra",
    "LangChain",
    "LangGraph",
    "Retrieval-Augmented Generation",
    "AI Agents",
  ],
  sameAs: socials.filter((s) => !s.href.startsWith("mailto:")).map((s) => s.href),
};
