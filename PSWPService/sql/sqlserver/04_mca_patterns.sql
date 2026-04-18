-- ============================================================
-- Table: MCAPatterns  (entity: MCAPattern)  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[MCAPatterns]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[MCAPatterns] (
        [Id]            INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_MCAPatterns] PRIMARY KEY,
        [McaPatternId]  NVARCHAR(32)   NOT NULL,
        [McaId]         NVARCHAR(32)   NOT NULL,
        [ContractItems] NVARCHAR(MAX)  NOT NULL,   -- JSON: {itemName:string, value:string}[]
        [TradeItems]    NVARCHAR(MAX)  NOT NULL,   -- JSON: {itemName:string, value:string}[]
        [SpecialNotes]  NVARCHAR(MAX)  NULL,
        [UpdateUser]    NVARCHAR(32)   NOT NULL,
        [UpdateTime]    DATETIME2      NOT NULL
    );
END
GO
