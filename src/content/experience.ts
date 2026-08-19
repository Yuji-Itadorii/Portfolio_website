import type { ExperienceRole } from "./types";

/** Newest first — the timeline renders in array order. */
export const experience: ExperienceRole[] = [
  {
    company: "Paytm",
    companyUrl: "https://paytm.com",
    title: "Software Engineer",
    location: "Noida, India",
    start: "2025-06",
    end: "present",
    summary:
      "End-to-end owner of Cancellation Protect and Travel Insurance within Paytm Travel — architecture, development, and production support on consumer-scale traffic.",
    highlights: [
      {
        text: "Built an AI-powered agentic SDLC workflow on Claude and Cursor, wired to Jira and Confluence MCP servers, which also generates automated QA handoffs.",
        metric: { value: "35%", label: "faster feature delivery" },
      },
      {
        text: "Migrated the pricing microservice behind Cancellation Protect and Travel Insurance across Paytm Travel.",
        metric: { value: "20%", label: "faster API response" },
      },
      {
        text: "Cut infrastructure spend on the migrated pricing service as part of the same effort.",
        metric: { value: "10%", label: "lower deployment cost" },
      },
      {
        text: "Architect, develop and maintain scalable backend services in Node.js, Express and Java Spring Boot for high-traffic consumer flows.",
      },
    ],
    stack: [
      "Node.js",
      "Express.js",
      "Java",
      "Spring Boot",
      "Microservices",
      "Docker",
      "Redis",
      "AI Agents",
    ],
  },
  {
    company: "Paytm",
    companyUrl: "https://paytm.com",
    title: "Software Engineer Intern",
    location: "Noida, India",
    start: "2025-01",
    end: "2025-06",
    summary:
      "Backend development on financial transaction flows, with a focus on rule-driven decisioning and production observability.",
    highlights: [
      {
        text: "Developed and optimized backend services in Node.js and Express, tuned for throughput and scalability.",
      },
      {
        text: "Worked with the Drools rule engine to streamline dynamic decision-making in financial transaction paths.",
      },
      {
        text: "Designed and deployed automated alerting for API and service failures, improving reliability and production monitoring.",
      },
    ],
    stack: ["Node.js", "Express.js", "Drools", "SQL", "Docker"],
  },
  {
    company: "MentorAide",
    title: "Software Developer Intern",
    location: "Remote",
    start: "2024-01",
    end: "2024-07",
    summary:
      "Full-stack product work alongside quantitative forecasting research for equity price prediction.",
    highlights: [
      {
        text: "Built LSTM and ARIMA forecasting pipelines for equity price prediction; the LSTM strategy outperformed ARIMA's 7.45% in simulated portfolio returns.",
        metric: { value: "11.45%", label: "simulated return (LSTM)" },
      },
      {
        text: "Led development and maintenance of scalable web applications in React and Redux, focused on robust interfaces and render performance.",
      },
    ],
    stack: ["React", "Redux", "Python", "TensorFlow"],
  },
];
