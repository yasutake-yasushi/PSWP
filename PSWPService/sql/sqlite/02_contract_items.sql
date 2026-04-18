-- ============================================================
-- Table: ContractItems
-- ============================================================
CREATE TABLE IF NOT EXISTS "ContractItems" (
    "Id"           INTEGER NOT NULL CONSTRAINT "PK_ContractItems" PRIMARY KEY AUTOINCREMENT,
    "Category"     TEXT NOT NULL,   -- Contract | Trade | CFRoll | Equity | Interest
    "ItemName"     TEXT NOT NULL,
    "DataType"     TEXT NOT NULL,   -- String | Date | Int | Number | Bool | Enum
    "Values"       TEXT,            -- newline-separated list (used for Bool/Enum)
    "DefaultValue" TEXT,
    "Description"  TEXT,
    "CreatedAt"    TEXT NOT NULL,
    "UpdatedAt"    TEXT NOT NULL
);
