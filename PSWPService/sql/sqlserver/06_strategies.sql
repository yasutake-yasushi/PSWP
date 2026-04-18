-- ============================================================
-- Table: Strategies  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[Strategies]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Strategies] (
        [Id]           INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_Strategies] PRIMARY KEY,
        [StrategyType] NVARCHAR(MAX)  NOT NULL,   -- Lending | Borrowing | Funding | Self Funding
        [PortId]       NVARCHAR(MAX)  NOT NULL,
        [CreatedAt]    NVARCHAR(MAX)  NOT NULL,
        [UpdatedAt]    NVARCHAR(MAX)  NOT NULL
    );
END
GO
