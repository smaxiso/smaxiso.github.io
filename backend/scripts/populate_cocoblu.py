import sys
import os
import json

# Add backend to path so imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.schemas import Experience, Project, Skill

db = SessionLocal()

def run():
    print("Injecting Cocoblu Experience...")
    # Experience
    cocoblu_exp = Experience(
        company="Cocoblu",
        title="Senior Manager – DSIT (Data Science & IT)",
        start_date="2026-02",
        end_date="Present",
        description="""Engineered a product classification pipeline utilizing **Gemini 2.5 Flash** and **AWS Bedrock** to process **50,000+ ASINs**. Implemented global image deduplication and fuzzy-matching algorithms, reducing LLM token costs by **93%** and increasing classification accuracy to **96.6%**.

Architected a Master Data Management (MDM) platform using **React** and **FastAPI** to unify organizational data workflows. Engineered a centralized ingestion backend utilizing **AWS Redshift** staging tables and **S3 COPY**, enabling high-volume asynchronous bulk upserts and deprecating isolated legacy data pipelines.

Optimized organizational data pipelines utilizing **AWS Step Functions** to eliminate redundant execution steps. Engineered an **AI agent-based** pricing pipeline that performs competitor product analysis and interfaces with **Amazon SP-API** to execute continuous, automated price adjustments across the product catalog.

Architected a centralized **Self-Healing AI Agent** and enterprise automation SDK using **AWS Lambda** and **Amazon Bedrock (Claude)**. Engineered an autonomous CI/CD remediation loop that intercepts pipeline crashes, generates LLM-driven code fixes, executes test validations via **AWS CodeBuild**, and automatically submits Pull Requests.

Engineered hybrid **Machine Learning and Operations Research (OR)** backend systems utilizing **PuLP (MILP)** and **ADMM engines** for supply chain automation. Implemented mathematical solvers and **EOQ models** to optimize purchasing decisions for continuous in-stock availability and automate ASIN deal shortlisting against business constraints.

Engineered a Python SDK integrating **SP-API** domain interfaces to facilitate high-throughput data extraction and automated pricing pipelines. Built the networking layer with **SigV4 signing**, **token caching**, exponential backoff, and circuit breakers to handle API rate limits and transient failures.""",
        technologies=["AWS Redshift", "AWS Step Functions", "Amazon Bedrock", "Claude", "Gemini", "PuLP (MILP)", "FastAPI", "React", "Amazon SP-API"],
        order=0
    )
    
    # Check if already exists to prevent duplicate
    existing_exp = db.query(Experience).filter_by(company="Cocoblu").first()
    if not existing_exp:
        db.add(cocoblu_exp)
    else:
        print("Cocoblu experience already exists, skipping.")

    print("Injecting Cocoblu Projects...")
    # Projects
    projects = [
        Project(
            id="self-healing-agent",
            title="Autonomous Self-Healing AI Agent",
            description="Architected a centralized Self-Healing AI Agent and enterprise automation SDK using AWS Lambda and Amazon Bedrock (Claude). Engineered an autonomous CI/CD remediation loop that intercepts pipeline crashes, generates LLM-driven code fixes, executes test validations via AWS CodeBuild, and automatically submits Pull Requests.",
            category="AI & Architecture",
            company="Cocoblu",
            technologies=["AWS Lambda", "Amazon Bedrock", "Claude", "AWS CodeBuild", "Python"]
        ),
        Project(
            id="mdm-platform",
            title="Enterprise MDM Platform",
            description="Architected a Master Data Management (MDM) platform using React and FastAPI to unify organizational data workflows. Engineered a centralized ingestion backend utilizing AWS Redshift staging tables and S3 COPY, enabling high-volume asynchronous bulk upserts and deprecating isolated legacy data pipelines.",
            category="Data Engineering",
            company="Cocoblu",
            technologies=["React", "FastAPI", "AWS Redshift", "S3 COPY", "Python"]
        ),
        Project(
            id="supply-chain-optimizer",
            title="Hybrid Supply Chain Optimizer",
            description="Engineered hybrid Machine Learning and Operations Research (OR) backend systems utilizing PuLP (MILP) and ADMM engines for supply chain automation. Implemented mathematical solvers and EOQ models to optimize purchasing decisions for continuous in-stock availability and automate ASIN deal shortlisting against business constraints.",
            category="Operations Research",
            company="Cocoblu",
            technologies=["PuLP (MILP)", "ADMM", "EOQ", "Mathematical Solvers", "Python"]
        ),
        Project(
            id="sp-api-sdk",
            title="Amazon SP-API SDK",
            description="Engineered a Python SDK integrating SP-API domain interfaces to facilitate high-throughput data extraction and automated pricing pipelines. Built the networking layer with SigV4 signing, token caching, exponential backoff, and circuit breakers to handle API rate limits and transient failures.",
            category="Backend / SDK",
            company="Cocoblu",
            technologies=["Amazon SP-API", "Python", "SigV4", "Networking", "Resilience"]
        )
    ]
    
    for p in projects:
        existing_p = db.query(Project).filter_by(id=p.id).first()
        if not existing_p:
            db.add(p)
        else:
            print(f"Project {p.id} already exists, skipping.")

    print("Injecting New Skills...")
    # Skills
    skills = [
        Skill(category="AI / Operations", name="Generative AI (LLMs)", icon="bx bx-brain", level="Expert"),
        Skill(category="AI / Operations", name="Operations Research (OR)", icon="bx bx-math", level="Advanced"),
        Skill(category="AI / Operations", name="Cloud Orchestration", icon="bx bx-cloud", level="Expert")
    ]
    
    for s in skills:
        existing_s = db.query(Skill).filter_by(name=s.name).first()
        if not existing_s:
            db.add(s)
        else:
            print(f"Skill {s.name} already exists, skipping.")

    db.commit()
    print("Database updated successfully.")

if __name__ == "__main__":
    run()
