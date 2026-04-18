-- ============================================================
-- Table: Users
-- ============================================================
CREATE TABLE IF NOT EXISTS "Users" (
    "Id"        INTEGER NOT NULL CONSTRAINT "PK_Users" PRIMARY KEY AUTOINCREMENT,
    "Name"      TEXT    NOT NULL,
    "Email"     TEXT    NOT NULL,
    "Role"      TEXT    NOT NULL,
    "CreatedAt" TEXT    NOT NULL,
    "IsActive"  INTEGER NOT NULL
);

-- Seed data
INSERT OR IGNORE INTO "Users" ("Id", "Name", "Email", "Role", "CreatedAt", "IsActive")
VALUES (1, '管理者', 'admin@example.com', 'admin', '2026-01-01 00:00:00', 1);
