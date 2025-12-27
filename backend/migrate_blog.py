from sqlalchemy import text
from app.database import engine

def migrate():
    try:
        with engine.connect() as conn:
            # Check if column exists first to avoid duplicate error?
            # Or just wrap in try/except.
            # Postgres: ALTER TABLE table ADD COLUMN IF NOT EXISTS col type;
            print("Attempting validation of blog_posts table schema...")
            
            # Use raw SQL for migration
            sql = text("ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS updated_at VARCHAR;")
            conn.execute(sql)
            conn.commit()
            print("Successfully added 'updated_at' column to 'blog_posts' table.")
            
    except Exception as e:
        print(f"Migration error: {e}")

if __name__ == "__main__":
    migrate()
