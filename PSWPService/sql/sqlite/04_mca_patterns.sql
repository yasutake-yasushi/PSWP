-- ============================================================
-- Table: MCAPatterns  (entity: MCAPattern)
-- ============================================================
CREATE TABLE IF NOT EXISTS "MCAPatterns" (
    "Id"            INTEGER NOT NULL CONSTRAINT "PK_MCAPatterns" PRIMARY KEY AUTOINCREMENT,
    "McaPatternId"  VARCHAR(32) NOT NULL,
    "McaId"         VARCHAR(32) NOT NULL,
    "ContractItems" TEXT NOT NULL,  -- JSON: {itemName:string, value:string}[]
    "TradeItems"    TEXT NOT NULL,  -- JSON: {itemName:string, value:string}[]
    "SpecialNotes"  TEXT,
    "UpdateUser"    VARCHAR(32) NOT NULL,
    "UpdateTime"    DATETIME    NOT NULL
);
