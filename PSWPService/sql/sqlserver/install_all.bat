@echo off
REM ============================================================
REM  install_all.bat  [SQL Server]
REM  Usage: install_all.bat [ServerName] [DatabaseName]
REM  Example: install_all.bat .\SQLEXPRESS PSWP
REM  Requires sqlcmd (SQL Server Command Line Tools)
REM ============================================================

SET SERVER=%1
SET DATABASE=%2

IF "%SERVER%"=="" SET SERVER=.\SQLEXPRESS
IF "%DATABASE%"=="" SET DATABASE=PSWP

ECHO Target: %SERVER% / %DATABASE%
ECHO.

REM Create database if not exists
sqlcmd -S %SERVER% -Q "IF NOT EXISTS (SELECT 1 FROM sys.databases WHERE name = N'%DATABASE%') CREATE DATABASE [%DATABASE%];"
IF ERRORLEVEL 1 ( ECHO [ERROR] Failed to create database. & EXIT /B 1 )

ECHO [OK] Database ready.

REM Apply each DDL file
FOR %%F IN (
    02_contract_items.sql
    03_mcas.sql
    04_mca_patterns.sql
    05_mail_settings.sql
    06_strategies.sql
    07_system_settings.sql
    08_ef_migrations_history.sql
) DO (
    ECHO Applying %%F ...
    sqlcmd -S %SERVER% -d %DATABASE% -i "%%F"
    IF ERRORLEVEL 1 ( ECHO [ERROR] %%F failed. & EXIT /B 1 )
    ECHO [OK] %%F
)

ECHO.
ECHO All tables created successfully.
