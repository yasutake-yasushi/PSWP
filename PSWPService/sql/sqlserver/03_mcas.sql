-- ============================================================
-- Table: MCAs  (entity: MCA)  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[MCAs]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[MCAs] (
        [Id]            NVARCHAR(MAX)  NOT NULL CONSTRAINT [PK_MCAs] PRIMARY KEY,
        [McaId]         NVARCHAR(MAX)  NOT NULL,
        [Cpty]          NVARCHAR(MAX)  NOT NULL,
        [AgreementDate] NVARCHAR(MAX)  NULL,       -- DateOnly (nullable), format: YYYY-MM-DD
        [ExecutionDate] NVARCHAR(MAX)  NULL,       -- DateOnly (nullable), format: YYYY-MM-DD
        [ContractItems] NVARCHAR(MAX)  NOT NULL,   -- JSON: string[]  e.g. ["PaymentTerm","Notional"]
        [CreatedAt]     NVARCHAR(MAX)  NOT NULL,
        [UpdatedAt]     NVARCHAR(MAX)  NOT NULL
    );
END
GO
