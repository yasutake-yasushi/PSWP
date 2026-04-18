-- ============================================================
-- Table: MCAPatterns  (entity: MCAPattern)  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[MCAPatterns]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[MCAPatterns] (
        [Id]            NVARCHAR(MAX)  NOT NULL CONSTRAINT [PK_MCAPatterns] PRIMARY KEY,
        [McaPatternId]  NVARCHAR(MAX)  NOT NULL,
        [McaId]         NVARCHAR(MAX)  NOT NULL,
        [ContractItems] NVARCHAR(MAX)  NOT NULL,   -- JSON: {itemName:string, value:string}[]
        [TradeItems]    NVARCHAR(MAX)  NOT NULL,   -- JSON: {itemName:string, value:string}[]
        [SpecialNotes]  NVARCHAR(MAX)  NULL,
        [CreatedAt]     NVARCHAR(MAX)  NOT NULL,
        [UpdatedAt]     NVARCHAR(MAX)  NOT NULL
    );
END
GO
