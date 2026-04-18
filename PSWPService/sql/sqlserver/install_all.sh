#!/usr/bin/env bash
# ============================================================
#  install_all.sh  [SQL Server]
#  Usage: ./install_all.sh [ServerName] [DatabaseName]
#  Example: ./install_all.sh localhost PSWP
#           ./install_all.sh "myserver.database.windows.net" PSWP -U myuser -P mypassword
#  Requires sqlcmd (SQL Server Command Line Tools / mssql-tools)
# ============================================================

set -euo pipefail

SERVER="${1:-localhost}"
DATABASE="${2:-PSWP}"

echo "Target: ${SERVER} / ${DATABASE}"
echo

# Create database if not exists
sqlcmd -S "${SERVER}" -Q "IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'${DATABASE}') CREATE DATABASE [${DATABASE}];"
echo "[OK] Database ready."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FILES=(
    02_contract_items.sql
    03_mcas.sql
    04_mca_patterns.sql
    05_mail_settings.sql
    06_strategies.sql
    07_system_settings.sql
    08_ef_migrations_history.sql
)

for f in "${FILES[@]}"; do
    echo "Applying ${f} ..."
    sqlcmd -S "${SERVER}" -d "${DATABASE}" -i "${SCRIPT_DIR}/${f}"
    echo "[OK] ${f}"
done

echo
echo "All tables created successfully."
