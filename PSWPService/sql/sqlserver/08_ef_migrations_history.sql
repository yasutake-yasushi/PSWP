-- ============================================================
-- Table: __EFMigrationsHistory  (EF Core internal)  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[__EFMigrationsHistory]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[__EFMigrationsHistory] (
        [MigrationId]    NVARCHAR(150)  NOT NULL CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY,
        [ProductVersion] NVARCHAR(32)   NOT NULL
    );
END
GO
