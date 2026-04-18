-- ============================================================
-- Table: ContractItems  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[ContractItems]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[ContractItems] (
        [Id]           INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_ContractItems] PRIMARY KEY,
        [Category]     NVARCHAR(16)   NOT NULL,   -- Contract | Trade | CFRoll | Equity | Interest
        [ItemName]     NVARCHAR(32)   NOT NULL,
        [DataType]     NVARCHAR(16)   NOT NULL,   -- String | Date | Int | Number | Bool | Enum
        [Values]       NVARCHAR(MAX)  NULL,        -- newline-separated list (used for Bool/Enum)
        [DefaultValue] NVARCHAR(32)   NULL,
        [Description]  NVARCHAR(MAX)  NULL,
        [UpdateUser]   NVARCHAR(32)   NOT NULL,
        [UpdateTime]   DATETIME2       NOT NULL
    );
END
GO
