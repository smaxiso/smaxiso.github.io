
import os
import sys

# Add backend directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models import schemas

def audit_update():
    db = SessionLocal()
    
    updates = [
        {
            "title": "Fuzzy Control System for Forest Fire Detection",
            "description": "Developed a real-time forest fire detection system utilizing Python-based machine learning algorithms and fuzzy logic. Achieved 90% accuracy in predicting the likelihood and severity of forest fires."
        },
        {
            "title": "School Chale Ham",
            "description": "An academic blogging platform for K-12 education. Features include efficient blog creation and management. Backend powered by Express.js with MongoDB; Frontend built with Next.js."
        },
        {
            "title": "Real-time Transaction Normalization & Scalable Data Lake Design",
            "description": "Built a real-time transaction normalization pipeline using Kafka (AWS MSK), ECS, and Java (Spring Boot) for fraud detection. Optimised the normalization service for vendor compatibility. Designed a scalable Data Lake using S3 Hudi and optimized ETL pipelines for Athena querying. Built a Java-based test automation service."
        },
        {
            "title": "Data Migration Framework",
            "description": "Developed a scalable Data Migration Framework for a global payments company using Python, AWS, GCS, and BigQuery. Reduced data migration time by 20% and improved scalability by 30%."
        },
        {
            "title": "Contextual News System",
            "description": "AI-driven news aggregation system using NLP for content personalization and relevance."
        },
        {
             "title": "Bihar COVID Help",
             "description": "Built a resource-sharing platform for COVID-19 relief, connecting volunteer doctors with patients and aggregating information on critical supplies like oxygen and hospital beds."
        },
        {
            "title": "Lynx Framework Optimization",
            "description": "Optimized the Lynx entity linkage framework, improving accuracy and efficiency. Enhanced the Locality-Sensitive Hashing (LSH) algorithm, reducing nearest neighbor search time by 40%. Streamlined feature aggregation pipelines, reducing processing latency by 25%."
        },
         {
            "title": "Reporting Framework",
            "description": "Developed on-demand merchant reporting solutions, improving data accuracy by 15% and reducing report generation time by 25%. Contributed to the Argo Framework for report generation at scale."
        }
    ]
    
    print("Starting Content Audit Update...")
    updated_count = 0
    
    for update in updates:
        project = db.query(schemas.Project).filter(schemas.Project.title == update["title"]).first()
        if project:
            print(f"Updating '{project.title}'...")
            project.description = update["description"]
            updated_count += 1
        else:
            print(f"Warning: Project '{update['title']}' not found.")
            
    if updated_count > 0:
        db.commit()
        print(f"Successfully updated {updated_count} projects.")
    else:
        print("No changes made.")
        
    db.close()

if __name__ == "__main__":
    audit_update()
