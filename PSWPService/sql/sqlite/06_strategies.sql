-- ============================================================
-- Table: Strategies
-- ============================================================
CREATE TABLE IF NOT EXISTS "Strategies" (
    "Id"           INTEGER NOT NULL CONSTRAINT "PK_Strategies" PRIMARY KEY AUTOINCREMENT,
    "StrategyType" VARCHAR(16) NOT NULL,  -- Lending | Borrowing | Funding | Self Funding
    "PortId"       VARCHAR(8) NOT NULL,
    "UpdateUser"   VARCHAR(32) NOT NULL,
    "UpdateTime"   DATETIME    NOT NULL
);
