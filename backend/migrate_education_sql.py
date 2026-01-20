from app.database import SessionLocal, engine
from sqlalchemy import text

# Raw SQL to add columns
sql_commands = [
    "ALTER TABLE site_config ADD COLUMN IF NOT EXISTS education_degree VARCHAR",
    "ALTER TABLE site_config ADD COLUMN IF NOT EXISTS education_institution VARCHAR",
    "ALTER TABLE site_config ADD COLUMN IF NOT EXISTS education_years VARCHAR"
]

try:
    with engine.connect() as conn:
        for sql in sql_commands:
            conn.execute(text(sql))
            print(f"✅ Executed: {sql}")
        conn.commit()
    print("\n🎉 All columns added successfully!")
except Exception as e:
    print(f"❌ Error: {e}")
