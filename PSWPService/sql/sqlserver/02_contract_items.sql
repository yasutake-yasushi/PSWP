-- ============================================================
-- Table: ContractItems  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[ContractItems]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ContractItems] (
        [Id]           NVARCHAR(MAX)  NOT NULL CONSTRAINT [PK_ContractItems] PRIMARY KEY,
        [Category]     NVARCHAR(MAX)  NOT NULL,   -- Contract | Trade | CFRoll | Equity | Interest
        [ItemName]     NVARCHAR(MAX)  NOT NULL,
        [DataType]     NVARCHAR(MAX)  NOT NULL,   -- String | Date | Int | Number | Bool | Enum
        [Values]       NVARCHAR(MAX)  NULL,        -- newline-separated list (used for Bool/Enum)
        [DefaultValue] NVARCHAR(MAX)  NULL,
        [Description]  NVARCHAR(MAX)  NULL,
        [CreatedAt]    NVARCHAR(MAX)  NOT NULL,
        [UpdatedAt]    NVARCHAR(MAX)  NOT NULL
    );
END
GO
