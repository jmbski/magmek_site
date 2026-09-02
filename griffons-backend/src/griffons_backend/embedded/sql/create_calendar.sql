DROP TABLE IF EXISTS calendar_events;

CREATE TABLE calendar_events (
    `id` TEXT NOT NULL,
    `calendar_id` TEXT NOT NULL,

    `summary` TEXT,
    `description` TEXT,
    `location` TEXT,

    `start_time` DATETIME,
    `end_time` DATETIME,

    `start_date` DATE,
    `end_date` DATE,

    `is_all_day` BOOLEAN NOT NULL DEFAULT 0,

    `status` TEXT,
    `updated_at` DATETIME,
    `etag` TEXT,

    PRIMARY KEY (id)
);

CREATE INDEX ix_calendar_events_calendar_id
    ON calendar_events (calendar_id);