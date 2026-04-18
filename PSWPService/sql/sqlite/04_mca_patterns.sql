-- ============================================================
-- Table: McaPatterns  (entity: MCAPattern)
-- ============================================================
CREATE TABLE IF NOT EXISTS "McaPatterns" (
    "Id"            TEXT NOT NULL CONSTRAINT "PK_McaPatterns" PRIMARY KEY,
    "McaPatternId"  TEXT NOT NULL,
    "McaId"         TEXT NOT NULL,
    "ContractItems" TEXT NOT NULL,  -- JSON: {itemName:string, value:string}[]
    "TradeItems"    TEXT NOT NULL,  -- JSON: {itemName:string, value:string}[]
    "SpecialNotes"  TEXT,
    "CreatedAt"     TEXT NOT NULL,
    "UpdatedAt"     TEXT NOT NULL
);
