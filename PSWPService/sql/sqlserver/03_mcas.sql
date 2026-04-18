-- ============================================================
-- Table: MCA  (entity: MCA)  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[MCA]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[MCA] (
        [Id]            INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_MCA] PRIMARY KEY,
        [McaId]         NVARCHAR(32)   NOT NULL,
        [Cpty]          NVARCHAR(16)   NOT NULL,
        [AgreementDate] DATETIME2      NULL,
        [ExecutionDate] DATETIME2      NULL,
        [ContractItems] NVARCHAR(MAX)  NOT NULL,   -- JSON: string[]  e.g. ["PaymentTerm","Notional"]
        [UpdateUser]    NVARCHAR(32)   NOT NULL,
        [UpdateTime]    DATETIME2      NOT NULL
    );
END
GO
