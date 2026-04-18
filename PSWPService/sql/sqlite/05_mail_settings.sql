-- ============================================================
-- Table: MailSettings
-- ============================================================
CREATE TABLE IF NOT EXISTS "MailSettings" (
    "Id"          INTEGER NOT NULL CONSTRAINT "PK_MailSettings" PRIMARY KEY AUTOINCREMENT,
    "EventType"   VARCHAR(32) NOT NULL,  -- OTCCross | StockList | PreConfirmation
    "TemplateId"  VARCHAR(32) NOT NULL,
    "Description" VARCHAR(256) NOT NULL,
    "Addresses"   VARCHAR(256) NOT NULL,  -- JSON: {kind:"To"|"CC"|"BCC", address:string}[]
    "Message"     TEXT NOT NULL,
    "UpdateUser"  VARCHAR(32) NOT NULL,
    "UpdateTime"  DATETIME    NOT NULL
);
