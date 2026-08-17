import type { SkillGroup } from "./types";

/**
 * Icons resolve from local @iconify-json packages and are inlined as SVG at
 * build time. Where no brand mark exists (LangGraph, Cursor) or the thing is a
 * concept rather than a product (Microservices, System Design), we use a
 * Lucide glyph plus a `note`, or a plain text chip.
 */
export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    glyph: "lucide:code-2",
    skills: [
      { name: "JavaScript", icon: { kind: "iconify", name: "devicon:javascript" }, level: "core" },
      { name: "Java", icon: { kind: "iconify", name: "devicon:java" }, level: "core" },
      { name: "C++", icon: { kind: "iconify", name: "devicon:cplusplus" }, level: "core" },
      { name: "SQL", icon: { kind: "iconify", name: "devicon:azuresqldatabase" }, level: "core" },
      {
        name: "TypeScript",
        icon: { kind: "iconify", name: "devicon:typescript" },
        level: "working",
      },
      { name: "Python", icon: { kind: "iconify", name: "devicon:python" }, level: "working" },
    ],
  },
  {
    id: "backend",
    label: "Backend & Frameworks",
    glyph: "lucide:server",
    skills: [
      { name: "Node.js", icon: { kind: "iconify", name: "devicon:nodejs" }, level: "core" },
      {
        name: "Express.js",
        icon: { kind: "iconify", name: "simple-icons:express" },
        level: "core",
      },
      { name: "Spring Boot", icon: { kind: "iconify", name: "devicon:spring" }, level: "core" },
      {
        name: "REST APIs",
        icon: { kind: "iconify", name: "lucide:webhook" },
        level: "core",
        note: "Design, versioning, contract testing",
      },
      { name: "React", icon: { kind: "iconify", name: "devicon:react" }, level: "working" },
    ],
  },
  {
    id: "databases",
    label: "Databases",
    glyph: "lucide:database",
    skills: [
      { name: "MongoDB", icon: { kind: "iconify", name: "devicon:mongodb" }, level: "core" },
      { name: "Redis", icon: { kind: "iconify", name: "devicon:redis" }, level: "core" },
      { name: "MySQL", icon: { kind: "iconify", name: "devicon:mysql" }, level: "core" },
      {
        name: "Cassandra",
        icon: { kind: "iconify", name: "devicon:cassandra" },
        level: "working",
        note: "Wide-column store for high-write workloads",
      },
    ],
  },
  {
    id: "architecture",
    label: "Architecture",
    glyph: "lucide:blocks",
    skills: [
      {
        name: "Microservices",
        icon: { kind: "iconify", name: "lucide:network" },
        level: "core",
        note: "Service decomposition, inter-service contracts",
      },
      {
        name: "System Design",
        icon: { kind: "iconify", name: "lucide:layers" },
        level: "core",
      },
      {
        name: "Rule Engines",
        icon: { kind: "iconify", name: "lucide:git-branch" },
        level: "core",
        note: "Drools — dynamic decisioning in transaction flows",
      },
      { name: "Drools", icon: { kind: "text" }, level: "working" },
      { name: "MVC", icon: { kind: "text" }, level: "working" },
    ],
  },
  {
    id: "devops",
    label: "DevOps & Tools",
    glyph: "lucide:container",
    skills: [
      { name: "Docker", icon: { kind: "iconify", name: "devicon:docker" }, level: "core" },
      { name: "Git", icon: { kind: "iconify", name: "devicon:git" }, level: "core" },
      {
        name: "Claude Code",
        icon: { kind: "iconify", name: "simple-icons:anthropic" },
        level: "core",
        note: "Agentic SDLC workflows with MCP servers",
      },
      {
        name: "Cursor",
        icon: { kind: "iconify", name: "lucide:mouse-pointer-click" },
        level: "working",
      },
    ],
  },
  {
    id: "ai",
    label: "AI / ML & Automation",
    glyph: "lucide:bot",
    skills: [
      {
        name: "LangChain",
        icon: { kind: "iconify", name: "simple-icons:langchain" },
        level: "core",
      },
      {
        name: "LangGraph",
        icon: { kind: "iconify", name: "lucide:workflow" },
        level: "core",
        note: "Stateful multi-agent graphs",
      },
      {
        name: "AI Agents",
        icon: { kind: "iconify", name: "lucide:bot" },
        level: "core",
        note: "Tool-use loops, MCP server integration",
      },
      {
        name: "RAG",
        icon: { kind: "iconify", name: "lucide:file-search" },
        level: "core",
        note: "Retrieval-augmented generation, RAPTOR indexing",
      },
      {
        name: "Hugging Face",
        icon: { kind: "iconify", name: "simple-icons:huggingface" },
        level: "working",
      },
      {
        name: "TensorFlow",
        icon: { kind: "iconify", name: "devicon:tensorflow" },
        level: "working",
      },
      { name: "NLP", icon: { kind: "text" }, level: "working" },
    ],
  },
];
