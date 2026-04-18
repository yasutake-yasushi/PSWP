-- ============================================================
-- Table: SystemSettings  (singleton: Id = 1)  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[SystemSettings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[SystemSettings] (
        [Id]             INT            NOT NULL IDENTITY(1,1) CONSTRAINT [PK_SystemSettings] PRIMARY KEY,
        [MipsFilePath]   NVARCHAR(MAX)  NOT NULL,
        [StrikeFilePath] NVARCHAR(MAX)  NOT NULL,
        [UpdatedAt]      NVARCHAR(MAX)  NOT NULL
    );
END
GO
