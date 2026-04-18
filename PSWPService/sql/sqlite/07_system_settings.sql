-- ============================================================
-- Table: SystemSettings  (singleton: Id = 1)
-- ============================================================
CREATE TABLE IF NOT EXISTS "SystemSettings" (
    "Id"             INTEGER NOT NULL CONSTRAINT "PK_SystemSettings" PRIMARY KEY AUTOINCREMENT,
    "MipsFilePath"   TEXT NOT NULL,
    "StrikeFilePath" TEXT NOT NULL,
    "UpdatedAt"      TEXT NOT NULL
);
