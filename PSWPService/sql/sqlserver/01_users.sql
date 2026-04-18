-- ============================================================
-- Table: Users  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[Users]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Users] (
        [Id]        INT            NOT NULL IDENTITY(1,1) CONSTRAINT [PK_Users] PRIMARY KEY,
        [Name]      NVARCHAR(MAX)  NOT NULL,
        [Email]     NVARCHAR(MAX)  NOT NULL,
        [Role]      NVARCHAR(MAX)  NOT NULL,
        [CreatedAt] NVARCHAR(MAX)  NOT NULL,
        [IsActive]  BIT            NOT NULL
    );
END
GO

-- Seed data
IF NOT EXISTS (SELECT 1 FROM [dbo].[Users] WHERE [Id] = 1)
BEGIN
    SET IDENTITY_INSERT [dbo].[Users] ON;
    INSERT INTO [dbo].[Users] ([Id], [Name], [Email], [Role], [CreatedAt], [IsActive])
    VALUES (1, N'管理者', N'admin@example.com', N'admin', N'2026-01-01 00:00:00', 1);
    SET IDENTITY_INSERT [dbo].[Users] OFF;
END
GO
