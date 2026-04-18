#!/usr/bin/env bash
# ==============================================================
# install_all.sh  --  Create all PSWP tables in a SQLite DB
#
# Usage:
#   bash install_all.sh [database_file]
#
# Default database file: ../pswp.db  (PSWPService/pswp.db)
# ==============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_FILE="${1:-${SCRIPT_DIR}/../pswp.db}"

echo "Target DB: ${DB_FILE}"

SQL_FILES=(
    "02_contract_items.sql"
    "03_mcas.sql"
    "04_mca_patterns.sql"
    "05_mail_settings.sql"
    "06_strategies.sql"
    "07_system_settings.sql"
)

for f in "${SQL_FILES[@]}"; do
    echo "  Applying ${f}..."
    sqlite3 "${DB_FILE}" < "${SCRIPT_DIR}/${f}"
done

echo "Done. All tables created in ${DB_FILE}"
