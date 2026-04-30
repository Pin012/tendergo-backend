-- Migration: Create Tracking Table
CREATE TABLE IF NOT EXISTS tracking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tender_id TEXT UNIQUE NOT NULL,
    title TEXT,
    org_name TEXT,
    end_date TEXT,
    tender_url TEXT,
    created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tracking_tender_id ON tracking(tender_id);
