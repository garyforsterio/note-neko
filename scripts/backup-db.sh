#!/bin/bash
set -e

# This script backs up the PostgreSQL database using pg_dump.
# It expects DATABASE_URL to be set in the environment.

# Ensure backups directory exists in the root
mkdir -p backups

# Generate filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="backups/db_backup_${TIMESTAMP}.sql"

echo "Backing up database to ${FILENAME}..."

# Check if pg_dump is available
if ! command -v pg_dump &> /dev/null; then
    echo "Error: pg_dump is not installed or not in PATH."
    exit 1
fi

# Use pg_dump to backup
# The DATABASE_URL environment variable is used to connect
pg_dump "${DATABASE_URL}" > "${FILENAME}"

echo "Backup completed successfully."
