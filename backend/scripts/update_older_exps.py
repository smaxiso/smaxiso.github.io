import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.schemas import Experience

db = SessionLocal()

def run():
    print("Syncing older experiences to match resume...")

    # 1. Gen Digital
    gen = db.query(Experience).filter_by(company="Gen Digital (formerly NortonLifeLock)").first()
    if gen:
        gen.description = """Engineered custom **Java-based Kafka Connect SMT library** for Debezium CDC processing from AWS DocumentDB, achieving **100% data integrity** and eliminating critical DebeziumException errors across real-time document pipelines.
Engineered and deployed a **Spring Boot API tier** (AWS ECS) for real-time transaction normalization and metadata extraction utilizing NLP (Spacy), supporting robust data lakes via **AWS MSK (Kafka)** and S3."""

    # 2. PayPal
    paypal = db.query(Experience).filter(Experience.company.like("%PayPal%")).first()
    if paypal:
        paypal.company = "PayPal (via TCS)"
        paypal.title = "Data Engineer"
        paypal.description = """Developed a **metadata-driven ETL framework** (Python, PySpark, Airflow) for PayPal’s merchant data migration to BigQuery, orchestrating dynamic DAG generation and optimizing parallel load strategies.
Optimized the **Lynx entity linkage framework** (Scala, Spark) utilizing Locality Sensitive Hashing (LSH) and approximate nearest neighbor search (APSS), improving distributed similarity scoring across high-dimensional feature spaces.
Built an on-demand merchant reporting pipeline integrating robust authentication, Oracle DB state management, and **GCP Dataproc cluster orchestration**."""

    # 3. NIT Patna
    nit = db.query(Experience).filter(Experience.company.like("%NIT Patna%")).first()
    if nit:
        nit.company = "National Institute of Technology, Patna"
        nit.title = "Data Science Research Intern"
        nit.description = "Developed a real-time forest fire detection system utilizing Python-based machine learning algorithms and fuzzy logic."

    db.commit()
    print("Database Experiences fully synchronized with resume!")

if __name__ == "__main__":
    run()
