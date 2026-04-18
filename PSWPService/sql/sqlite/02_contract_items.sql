-- ============================================================
-- Table: ContractItems
-- ============================================================
CREATE TABLE IF NOT EXISTS "ContractItems" (
    "Id"           INTEGER NOT NULL CONSTRAINT "PK_ContractItems" PRIMARY KEY AUTOINCREMENT,
    "Category"     VARCHAR(16)  NOT NULL,   -- Contract | Trade | CFRoll | Equity | Interest
    "ItemName"     VARCHAR(32)  NOT NULL,
    "DataType"     VARCHAR(16)  NOT NULL,   -- String | Date | Int | Number | Bool | Enum
    "Values"       TEXT,            -- newline-separated list (used for Bool/Enum)
    "DefaultValue" VARCHAR(32),
    "Description"  TEXT,
    "UpdateUser"   VARCHAR(32) NOT NULL,
    "UpdateTime"   DATETIME    NOT NULL
);
