-- ============================================================
-- Table: MCA  (entity: MCA)
-- ============================================================
CREATE TABLE IF NOT EXISTS "MCA" (
    "Id"            INTEGER NOT NULL CONSTRAINT "PK_MCA" PRIMARY KEY AUTOINCREMENT,
    "McaId"         VARCHAR(32)  NOT NULL,
    "Cpty"          VARCHAR(16)  NOT NULL,
    "AgreementDate" DATETIME,           -- DateOnly (nullable), format: YYYY-MM-DD
    "ExecutionDate" DATETIME,           -- DateOnly (nullable), format: YYYY-MM-DD
    "ContractItems" TEXT NOT NULL,  -- JSON: string[]  e.g. ["PaymentTerm","Notional"]
    "UpdateUser"    VARCHAR(32) NOT NULL,
    "UpdateTime"    DATETIME    NOT NULL
);
