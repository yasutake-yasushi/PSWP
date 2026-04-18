-- ============================================================
-- Table: Strategies
-- ============================================================
CREATE TABLE IF NOT EXISTS "Strategies" (
    "Id"           TEXT NOT NULL CONSTRAINT "PK_Strategies" PRIMARY KEY,
    "StrategyType" TEXT NOT NULL,  -- Lending | Borrowing | Funding | Self Funding
    "PortId"       TEXT NOT NULL,
    "CreatedAt"    TEXT NOT NULL,
    "UpdatedAt"    TEXT NOT NULL
);
