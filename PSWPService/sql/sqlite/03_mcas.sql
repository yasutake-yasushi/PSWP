-- ============================================================
-- Table: Mcas  (entity: MCA)
-- ============================================================
CREATE TABLE IF NOT EXISTS "Mcas" (
    "Id"            TEXT NOT NULL CONSTRAINT "PK_Mcas" PRIMARY KEY,
    "McaId"         TEXT NOT NULL,
    "Cpty"          TEXT NOT NULL,
    "AgreementDate" TEXT,           -- DateOnly (nullable), format: YYYY-MM-DD
    "ExecutionDate" TEXT,           -- DateOnly (nullable), format: YYYY-MM-DD
    "ContractItems" TEXT NOT NULL,  -- JSON: string[]  e.g. ["PaymentTerm","Notional"]
    "CreatedAt"     TEXT NOT NULL,
    "UpdatedAt"     TEXT NOT NULL
);
