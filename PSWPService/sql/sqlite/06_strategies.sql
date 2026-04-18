-- ============================================================
-- Table: Strategies
-- ============================================================
CREATE TABLE IF NOT EXISTS "Strategies" (
    "Id"           INTEGER NOT NULL CONSTRAINT "PK_Strategies" PRIMARY KEY AUTOINCREMENT,
    "StrategyType" TEXT NOT NULL,  -- Lending | Borrowing | Funding | Self Funding
    "PortId"       TEXT NOT NULL,
    "CreatedAt"    TEXT NOT NULL,
    "UpdatedAt"    TEXT NOT NULL
);
