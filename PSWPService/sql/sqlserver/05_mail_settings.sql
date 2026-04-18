-- ============================================================
-- Table: MailSettings  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[MailSettings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[MailSettings] (
        [Id]          INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_MailSettings] PRIMARY KEY,
        [EventType]   NVARCHAR(MAX)  NOT NULL,   -- OTCCross | StockList | PreConfirmation
        [TemplateId]  NVARCHAR(MAX)  NOT NULL,
        [Description] NVARCHAR(MAX)  NOT NULL,
        [Addresses]   NVARCHAR(MAX)  NOT NULL,   -- JSON: {kind:"To"|"CC"|"BCC", address:string}[]
        [Message]     NVARCHAR(MAX)  NOT NULL,
        [CreatedAt]   NVARCHAR(MAX)  NOT NULL,
        [UpdatedAt]   NVARCHAR(MAX)  NOT NULL
    );
END
GO
