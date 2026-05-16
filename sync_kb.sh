#!/bin/bash

# --- Sumit's AI Knowledge Base Sync Script ---
# This script refreshes the AI's memory with the latest data from:
# 1. Local Resume PDF
# 2. Projects & Skills in DB
# 3. Blog Posts
# 4. GitHub Repos

echo "🧠 Starting AI Knowledge Base Sync..."

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: backend/.env file not found!"
    exit 1
fi

# Set Python Path to project root to handle imports
export PYTHONPATH=$PYTHONPATH:.

# Run the ingestion script
python3 scripts/ingest_v2.py

echo "✅ Sync Process Completed!"
