import type { Project } from "./types";

/**
 * Curated, not exhaustive. The old site listed eight cards that all shared one
 * generic icon; three of them predate the Paytm work and dilute the backend +
 * AI signal. Featured projects get a full card, the rest a compact row.
 */
export const projects: Project[] = [
  {
    slug: "neurohub",
    title: "NeuroHub",
    kicker: "LLM-powered learning management system",
    description:
      "A full LMS built with a team of five, combining AI-generated-assignment detection with live face detection to keep assessments honest.",
    featured: true,
    year: "2024",
    stack: [
      "React",
      "Node.js",
      "Microservices",
      "JWT",
      "Hugging Face",
      "TensorFlow",
      "Python",
      "AWS",
    ],
    repoUrl: "https://github.com/NeuroHub2024",
    highlights: [
      "98% accuracy detecting AI-generated assignment submissions",
      "30% increase in user engagement after the interface rework",
      "Microservice split across auth, content, and inference",
    ],
  },
  {
    slug: "talk-with-mongo",
    title: "Talk With Mongo",
    kicker: "Natural language to MongoDB queries",
    description:
      "Translates plain English into NoSQL queries via a Hugging Face LLM and LangChain, then connects to a live database and runs them — schema introspection included.",
    featured: true,
    year: "2024",
    stack: ["Python", "LangChain", "Hugging Face", "MongoDB"],
    repoUrl: "https://github.com/Yuji-Itadorii/Talk_With_Mongo",
    highlights: [
      "Schema-aware prompting so generated queries match the live collection shape",
      "Interactive interface for connecting and querying without writing NoSQL",
    ],
  },
  {
    slug: "raptor-qa-bot",
    title: "Document Q&A with RAPTOR",
    kicker: "Hierarchical RAG over textbook corpora",
    description:
      "Extracts content from textbooks, builds a MILVUS vector store using RAPTOR hierarchical indexing, and answers questions over it with an LLM.",
    featured: true,
    year: "2024",
    stack: ["Python", "LangChain", "MILVUS", "RAG", "Hugging Face"],
    repoUrl: "https://github.com/Yuji-Itadorii/Document-Q-A-Bot-Using-Raptor-Indexing",
    highlights: [
      "RAPTOR recursive summarization tree for multi-level retrieval",
      "Handles questions that span chapters, not just single passages",
    ],
  },
  {
    slug: "ai-text-detector",
    title: "AI-Generated Text Detector",
    kicker: "Transformer classifier, deployed on EC2",
    description:
      "Distinguishes AI-generated from human-written text at 98.8% accuracy using a Hugging Face transformer architecture, served from AWS EC2.",
    featured: false,
    year: "2024",
    stack: ["Python", "TensorFlow", "Hugging Face", "AWS"],
    repoUrl: "https://github.com/Yuji-Itadorii/AI-Text-Detection",
  },
  {
    slug: "youtube-video-assistant",
    title: "YouTube Video Assistant",
    kicker: "Context-aware Q&A over video transcripts",
    description:
      "Takes a YouTube link, analyses the transcript, and answers arbitrary questions about the content with citations back to the source.",
    featured: false,
    year: "2024",
    stack: ["Python", "LangChain", "RAG"],
    repoUrl: "https://github.com/Yuji-Itadorii/Youtube-Video-Assistant-LangChain",
  },
  {
    slug: "lstm-stock-prediction",
    title: "LSTM Equity Forecasting",
    kicker: "Sequence model with a backtested strategy",
    description:
      "LSTM model forecasting equity prices, paired with a simple trading strategy that returned 11.45% in simulation.",
    featured: false,
    year: "2024",
    stack: ["Python", "TensorFlow", "pandas", "yfinance"],
    repoUrl: "https://github.com/Yuji-Itadorii/Stocks-Trading-With-LSTM-Model",
  },
  {
    slug: "arima-stock-prediction",
    title: "ARIMA Trading Strategy",
    kicker: "Classical baseline for the LSTM work",
    description:
      "Statistical price prediction with ARIMA and a matching trading strategy — the 7.45% baseline the LSTM model was measured against.",
    featured: false,
    year: "2024",
    stack: ["Python", "statsmodels", "pandas"],
    repoUrl: "https://github.com/Yuji-Itadorii/Stocks-Trading-With-ARIMA-Model",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const otherProjects = projects.filter((p) => !p.featured);
