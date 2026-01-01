
import sys
import os

# Add the parent directory to sys.path to resolve 'app' module
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.schemas import Experience

def seed_experience():
    db = SessionLocal()
    try:
        # Clear existing experiences to avoid duplicates or messy state?
        # User said "first do a bulk insert", implies fresh or append. 
        # Safest is to append or update, but for simplicity let's just add them.
        # I'll check if they exist first based on company/title.
        
        experiences = [
            {
                "company": "Gen Digital (formerly NortonLifeLock)",
                "title": "Data Engineer",
                "start_date": "2024-12",
                "end_date": None, # Present
                "description": (
                    "Engineered a custom Java-based Kafka Connect SMT library to process Debezium CDC events from AWS DocumentDB, eliminating critical DebeziumException errors and ensuring 100% data integrity for real-time document processing.\n\n"
                    "Implemented multi-field validation and smart filtering systems in Java/Spring Boot transaction normalization services, reducing invalid data processing by 40% and preventing empty transaction arrays from downstream propagation.\n\n"
                    "Architected enhanced data streaming services on AWS ECS using Kafka (MSK) to support Gen’s Unified Data Model (UDM) initiative, consolidating disparate data silos for critical smart alert generation.\n\n"
                    "Designed and deployed a Python-based event-driven microservice (on ECS) to manage member data operations, integrating Kafka for event consumption and DynamoDB for persistence with comprehensive GDPR compliance & GUID sync strategy.\n\n"
                    "Led development of 'FINN,' a full-stack financial wellness platform during company-wide hackathon, featuring dual AI engines with proprietary emotion scoring intelligence and OpenAI GPT for behavioral spending analysis."
                ),
                "technologies": [
                    "Java", "Spring Boot", "Python", "FastAPI", "Kafka", "Kafka Connect", 
                    "Debezium", "AWS ECS", "DocumentDB", "DynamoDB", "OpenAI GPT", "React"
                ],
                "company_logo": "https://media.licdn.com/dms/image/v2/C560BAQFh-XFnkC4f_Q/company-logo_200_200/company-logo_200_200/0/1667844673863?e=2147483647&v=beta&t=7u7u7u7u", # Placeholder or fetched? I'll leave empty or find a generic one. Let's leave empty for now.
                "order": 1
            },
            {
                "company": "Tata Consultancy Services (Client: PayPal)",
                "title": "Data Engineer",
                "start_date": "2021-07",
                "end_date": "2024-11",
                "description": (
                    "**Data Migration Framework (Mar 2023– Nov 2024)**: Developed a scalable ETL framework for PayPal’s data migration using Python, AWS, and BigQuery, reducing migration time by 20% and improving scalability by 30%.\n\n"
                    "Built automated dashboards with Matplotlib for stakeholder visibility and deployed orchestration using Airflow with auto-generated DAG scripts.\n\n"
                    "**Lynx Framework Optimization (Jan 2024– May 2024)**: Optimized the Lynx entity linkage framework, achieving 35% improvement in data linkage accuracy and 40% reduction in approximate nearest neighbor search time through LSH algorithm enhancements.\n\n"
                    "Leveraged Scala/Spark and Google’s APSS algorithm for optimal performance in similarity scoring and conducted comprehensive testing with ML algorithms (RPDBSCAN, K-Means).\n\n"
                    "**On-Demand Merchant Reporting (Aug 2021– Jan 2023)**: Built on-demand merchant reporting system, increasing data accuracy by 15% and reducing report generation time by 25%.\n\n"
                    "Created Python pipeline integrating report requests with authentication, Oracle DB validation, and GCP Dataproc processing, automated via DALM (internal Airflow)."
                ),
                "technologies": [
                    "Python", "AWS", "BigQuery", "Airflow", "Matplotlib", "PySpark", 
                    "Scala", "APSS", "GCP Dataproc", "GCP GCS", "Oracle", "SQL"
                ],
                "order": 2
            },
            {
                "company": "NIT Patna (Internship)",
                "title": "Data Science Research Intern",
                "start_date": "2020-05",
                "end_date": "2020-07",
                "description": (
                    "Developed a real-time forest fire detection system using Python-based ML algorithms and fuzzy logic, achieving 90% accuracy in predicting fire likelihood and severity."
                ),
                "technologies": ["Python", "Machine Learning", "Fuzzy Logic"],
                "order": 3
            }
        ]

        print(f"Seeding {len(experiences)} experiences...")
        
        for exp_data in experiences:
            # Check if exists
            exists = db.query(Experience).filter(
                Experience.company == exp_data["company"],
                Experience.title == exp_data["title"]
            ).first()
            
            if not exists:
                exp = Experience(**exp_data)
                db.add(exp)
                print(f"Added: {exp_data['company']}")
            else:
                print(f"Skipped (Exists): {exp_data['company']}")

        db.commit()
        print("Done!")

    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_experience()
