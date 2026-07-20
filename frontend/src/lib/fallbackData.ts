import { Experience, Project } from "@/types";

export const fallbackExperiences: Experience[] = [
  {
    id: 1,
    company: "Cocoblu",
    title: "Senior Manager – DSIT (Data Science & IT)",
    start_date: "2026-02",
    end_date: "Present",
    description: `**Data Pipelines & Platform Architecture**
Architected a **React/FastAPI** Master Data Management platform, consolidating **65+ pipelines** from ad-hoc Excel/Glue workflows into a centrally governed system with **RBAC**-scoped self-service access for business teams.
Re-architected **99 parallel data pipelines** into a unified, config-driven **ETL framework** -- cutting infrastructure cost by **90+%** and eliminating the need for custom engineering on new integrations.

**Agentic AI Systems**
Architected an AI-powered product classification pipeline across **50,000+ ASINs** using **Gemini 2.5 Flash** and **AWS Bedrock** with automatic model fallback, global image deduplication, and fuzzy-matching -- achieving **96.6%** classification accuracy at production scale.
Architected a **Self-Healing AI Agent** that connects into any underlying automation service, intercepts crashes, generates **LLM-driven** code fixes, validates via **AWS CodeBuild**, and submits Pull Requests for human review.
Engineered an **agentic pricing pipeline** utilizing a custom **SP-API SDK** (SigV4 signing, token caching, circuit breakers) that scores product similarity and branches decisioning for automated competitor-based price actioning. Extended the same architectural approach into **Operations Research** -- a hybrid ML/OR system (**ADMM**, **EOQ**) for supply chain inventory optimization.`,
    technologies: ["AWS Redshift", "AWS Step Functions", "AWS Bedrock", "Claude", "Gemini", "PuLP (MILP)", "FastAPI", "React", "SP-API", "AWS Glue"],
    order: 0
  }
  // Other past experiences can be fetched from DB or added here if needed
];

export const fallbackProjects: Project[] = [
  {
    id: "self-healing-agent",
    title: "Autonomous Self-Healing AI Agent",
    description: "Architected a Self-Healing AI Agent that connects into any underlying automation service, intercepts crashes, generates LLM-driven code fixes, validates via AWS CodeBuild, and submits Pull Requests for human review.",
    category: "AI & Architecture",
    company: "Cocoblu",
    technologies: ["AWS Lambda", "AWS Bedrock", "Claude", "AWS CodeBuild", "AWS Glue", "Python"]
  },
  {
    id: "mdm-platform",
    title: "Enterprise MDM Platform",
    description: "Architected a React/FastAPI Master Data Management platform, consolidating 65+ pipelines from ad-hoc Excel/Glue workflows into a centrally governed system with RBAC-scoped self-service access for business teams.",
    category: "Data Engineering",
    company: "Cocoblu",
    technologies: ["React", "FastAPI", "AWS Redshift", "Python"]
  },
  {
    id: "supply-chain-optimizer",
    title: "Hybrid Supply Chain Optimizer",
    description: "Engineered a hybrid ML/OR system (ADMM, EOQ) for supply chain inventory optimization, demonstrating architectural rigor across complex mathematical domains.",
    category: "Operations Research",
    company: "Cocoblu",
    technologies: ["PuLP (MILP)", "ADMM", "EOQ", "Mathematical Solvers", "Python"]
  },
  {
    id: "sp-api-sdk",
    title: "Amazon SP-API SDK & Pricing Engine",
    description: "Engineered an agentic pricing pipeline on SP-API that scores product similarity and branches decisioning. Built the underlying SP-API SDK (SigV4 signing, token caching, circuit breakers), now adopted across the team's automation suite.",
    category: "Backend / SDK",
    company: "Cocoblu",
    technologies: ["SP-API", "Python", "SigV4", "Networking", "Resilience"]
  }
];
