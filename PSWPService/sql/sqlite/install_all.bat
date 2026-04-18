@echo off
rem ==============================================================
rem install_all.bat  --  Create all PSWP tables in a SQLite DB
rem
rem Usage:
rem   install_all.bat [database_file]
rem
rem Default database file: ..\pswp.db  (PSWPService\pswp.db)
rem Requires sqlite3.exe to be on PATH
rem ==============================================================

setlocal

set SCRIPT_DIR=%~dp0
if "%~1"=="" (
    set DB_FILE=%SCRIPT_DIR%..\pswp.db
) else (
    set DB_FILE=%~1
)

echo Target DB: %DB_FILE%

for %%f in (
    02_contract_items.sql
    03_mcas.sql
    04_mca_patterns.sql
    05_mail_settings.sql
    06_strategies.sql
    07_system_settings.sql
    08_ef_migrations_history.sql
) do (
    echo   Applying %%f...
    sqlite3 "%DB_FILE%" < "%SCRIPT_DIR%%%f"
    if errorlevel 1 (
        echo ERROR: Failed to apply %%f
        exit /b 1
    )
)

echo Done. All tables created in %DB_FILE%
endlocal
