-- ============================================================
-- Table: MCA  (entity: MCA)
-- ============================================================
CREATE TABLE IF NOT EXISTS "MCA" (
    "Id"            TEXT NOT NULL CONSTRAINT "PK_MCA" PRIMARY KEY,
    "McaId"         TEXT NOT NULL,
    "Cpty"          TEXT NOT NULL,
    "AgreementDate" TEXT,           -- DateOnly (nullable), format: YYYY-MM-DD
    "ExecutionDate" TEXT,           -- DateOnly (nullable), format: YYYY-MM-DD
    "ContractItems" TEXT NOT NULL,  -- JSON: string[]  e.g. ["PaymentTerm","Notional"]
    "CreatedAt"     TEXT NOT NULL,
    "UpdatedAt"     TEXT NOT NULL
);
