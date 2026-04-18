-- ============================================================
-- Table: MailSettings  [SQL Server]
-- ============================================================
IF OBJECT_ID(N'[dbo].[MailSettings]', N'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[MailSettings] (
        [Id]          INT             NOT NULL IDENTITY(1,1) CONSTRAINT [PK_MailSettings] PRIMARY KEY,
        [EventType]   NVARCHAR(32)   NOT NULL,   -- OTCCross | StockList | PreConfirmation
        [TemplateId]  NVARCHAR(32)   NOT NULL,
        [Description] NVARCHAR(256)  NOT NULL,
        [Addresses]   NVARCHAR(256)  NOT NULL,   -- JSON: {kind:"To"|"CC"|"BCC", address:string}[]
        [Message]     NVARCHAR(MAX)  NOT NULL,
        [UpdateUser]  NVARCHAR(32)   NOT NULL,
        [UpdateTime]  DATETIME2      NOT NULL
    );
END
GO
