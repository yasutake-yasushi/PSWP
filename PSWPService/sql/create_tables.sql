-- ============================================================
-- PSWP Database Schema (SQLite)
-- Generated: 2026-04-18
-- ============================================================


-- ------------------------------------------------------------
-- Users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Users" (
    "Id"        INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Name"      TEXT    NOT NULL,
    "Email"     TEXT    NOT NULL,
    "Role"      TEXT    NOT NULL,
    "CreatedAt" TEXT    NOT NULL,
    "IsActive"  INTEGER NOT NULL
);

INSERT INTO "Users" ("Id", "Name", "Email", "Role", "CreatedAt", "IsActive")
VALUES (1, '管理者', 'admin@example.com', 'admin', '2026-01-01 00:00:00', 1);


-- ------------------------------------------------------------
-- ContractItems
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ContractItems" (
    "Id"           TEXT NOT NULL CONSTRAINT "PK_ContractItems" PRIMARY KEY,
    "Category"     TEXT NOT NULL,
    "ItemName"     TEXT NOT NULL,
    "DataType"     TEXT NOT NULL,
    "Values"       TEXT,
    "DefaultValue" TEXT,
    "Description"  TEXT,
    "CreatedAt"    TEXT NOT NULL,
    "UpdatedAt"    TEXT NOT NULL
);


-- ------------------------------------------------------------
-- Mcas
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Mcas" (
    "Id"            TEXT NOT NULL CONSTRAINT "PK_Mcas" PRIMARY KEY,
    "McaId"         TEXT NOT NULL,
    "Cpty"          TEXT NOT NULL,
    "AgreementDate" TEXT,           -- DateOnly (nullable)
    "ExecutionDate" TEXT,           -- DateOnly (nullable)
    "ContractItems" TEXT NOT NULL,  -- JSON array of ItemName strings
    "CreatedAt"     TEXT NOT NULL,
    "UpdatedAt"     TEXT NOT NULL
);


-- ------------------------------------------------------------
-- McaPatterns
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "McaPatterns" (
    "Id"            TEXT NOT NULL CONSTRAINT "PK_McaPatterns" PRIMARY KEY,
    "McaPatternId"  TEXT NOT NULL,
    "McaId"         TEXT NOT NULL,
    "ContractItems" TEXT NOT NULL,  -- JSON array of {itemName, value}
    "TradeItems"    TEXT NOT NULL,  -- JSON array of {itemName, value}
    "SpecialNotes"  TEXT,
    "CreatedAt"     TEXT NOT NULL,
    "UpdatedAt"     TEXT NOT NULL
);


-- ------------------------------------------------------------
-- MailSettings
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "MailSettings" (
    "Id"          TEXT NOT NULL CONSTRAINT "PK_MailSettings" PRIMARY KEY,
    "EventType"   TEXT NOT NULL,  -- OTCCross | StockList | PreConfirmation
    "TemplateId"  TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Addresses"   TEXT NOT NULL,  -- JSON array of {kind, address}
    "Message"     TEXT NOT NULL,
    "CreatedAt"   TEXT NOT NULL,
    "UpdatedAt"   TEXT NOT NULL
);


-- ------------------------------------------------------------
-- Strategies
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Strategies" (
    "Id"           TEXT NOT NULL CONSTRAINT "PK_Strategies" PRIMARY KEY,
    "StrategyType" TEXT NOT NULL,  -- Lending | Borrowing | Funding | Self Funding
    "PortId"       TEXT NOT NULL,
    "CreatedAt"    TEXT NOT NULL,
    "UpdatedAt"    TEXT NOT NULL
);


-- ------------------------------------------------------------
-- SystemSettings  (singleton: Id = 1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SystemSettings" (
    "Id"             INTEGER NOT NULL CONSTRAINT "PK_SystemSettings" PRIMARY KEY AUTOINCREMENT,
    "MipsFilePath"   TEXT NOT NULL,
    "StrikeFilePath" TEXT NOT NULL,
    "UpdatedAt"      TEXT NOT NULL
);


-- ------------------------------------------------------------
-- EF Core migration history
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId"    TEXT NOT NULL CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY,
    "ProductVersion" TEXT NOT NULL
);
