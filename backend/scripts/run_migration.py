#!/usr/bin/env python3
"""
Run database migration to add show_work_badge column
Usage: python scripts/run_migration.py
"""
import os
import sys
from pathlib import Path

# Add parent directory to path so we can import from app
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import SessionLocal, engine


def run_migration():
    """Add show_work_badge column to site_config table"""
    db = SessionLocal()
    try:
        # Check if column already exists
        check_query = text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='site_config' 
            AND column_name='show_work_badge'
        """)
        
        result = db.execute(check_query).fetchone()
        
        if result:
            print("✓ Column 'show_work_badge' already exists. Skipping migration.")
            return
        
        # Add the column
        print("Adding 'show_work_badge' column to site_config table...")
        add_column_query = text("""
            ALTER TABLE site_config 
            ADD COLUMN show_work_badge BOOLEAN DEFAULT true
        """)
        
        db.execute(add_column_query)
        db.commit()
        
        print("✓ Migration completed successfully!")
        print("  - Added column: show_work_badge (BOOLEAN, default: true)")
        
    except Exception as e:
        print(f"✗ Migration failed: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Database Migration: Add show_work_badge to site_config")
    print("=" * 60)
    print()
    
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("✗ ERROR: DATABASE_URL environment variable not set")
        sys.exit(1)
    
    # Mask password in URL for display
    display_url = database_url.split("@")[1] if "@" in database_url else "localhost"
    print(f"Database: {display_url}")
    print()
    
    try:
        run_migration()
    except Exception as e:
        print(f"\n✗ Migration failed with error: {e}")
        sys.exit(1)
    
    print()
    print("=" * 60)
    print("Migration complete! You can now use the work badge toggle.")
    print("=" * 60)
