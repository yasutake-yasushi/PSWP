-- ============================================================
-- Table: MailSettings
-- ============================================================
CREATE TABLE IF NOT EXISTS "MailSettings" (
    "Id"          TEXT NOT NULL CONSTRAINT "PK_MailSettings" PRIMARY KEY,
    "EventType"   TEXT NOT NULL,  -- OTCCross | StockList | PreConfirmation
    "TemplateId"  TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Addresses"   TEXT NOT NULL,  -- JSON: {kind:"To"|"CC"|"BCC", address:string}[]
    "Message"     TEXT NOT NULL,
    "CreatedAt"   TEXT NOT NULL,
    "UpdatedAt"   TEXT NOT NULL
);
