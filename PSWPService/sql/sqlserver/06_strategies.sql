-- ============================================================
-- Table: Strategies  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[Strategies]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Strategies] (
        [Id]           INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_Strategies] PRIMARY KEY,
        [StrategyType] NVARCHAR(16)   NOT NULL,   -- Lending | Borrowing | Funding | Self Funding
        [PortId]       NVARCHAR(8)    NOT NULL,
        [UpdateUser]   NVARCHAR(32)   NOT NULL,
        [UpdateTime]   DATETIME2      NOT NULL
    );
END
GO
