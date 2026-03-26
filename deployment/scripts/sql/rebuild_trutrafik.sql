CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for UUIDs
-- Optional but recommended for future:
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE sims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sim_name TEXT NOT NULL UNIQUE,

    region_x INTEGER NOT NULL,
    region_y INTEGER NOT NULL,

    rating TEXT NOT NULL, -- PG, Mature, Adult
    status TEXT NOT NULL, -- online, offline, etc.

    first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sims_region_coords ON sims(region_x, region_y);

CREATE TABLE snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    sim_id UUID NOT NULL REFERENCES sims(id) ON DELETE CASCADE,

    ts TIMESTAMPTZ NOT NULL,

    agent_count INTEGER NOT NULL,

    -- optional raw metadata snapshot (future flexibility)
    raw_meta JSONB
);

SELECT create_hypertable('snapshots', 'ts');

CREATE TABLE avatars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    avatar_key TEXT NOT NULL UNIQUE, -- SL UUID or identifier

    first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    birth_date DATE
);

CREATE TABLE avatar_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    snapshot_id UUID NOT NULL REFERENCES snapshots(id) ON DELETE CASCADE,
    sim_id UUID NOT NULL REFERENCES sims(id) ON DELETE CASCADE,

    ts TIMESTAMPTZ NOT NULL,

    avatar_key TEXT NOT NULL, -- denormalized for performance

    display_name TEXT,
    language TEXT,

    position_x REAL,
    position_y REAL,

    -- optional geo column (if PostGIS enabled)
    geom GEOMETRY(Point, 0)
);

SELECT create_hypertable('avatar_snapshots', 'ts');

CREATE INDEX idx_snapshots_sim_time
ON snapshots(sim_id, ts DESC);

CREATE INDEX idx_avatar_snapshots_sim_time
ON avatar_snapshots(sim_id, ts DESC);

CREATE INDEX idx_avatar_snapshots_language
ON avatar_snapshots(language);

CREATE INDEX idx_avatar_snapshots_avatar_key
ON avatar_snapshots(avatar_key);

CREATE INDEX idx_avatar_geom
ON avatar_snapshots
USING GIST (geom);

CREATE MATERIALIZED VIEW sim_traffic_5m
WITH (timescaledb.continuous) AS
SELECT
    sim_id,
    time_bucket('5 minutes', ts) AS bucket,
    AVG(agent_count) AS avg_agents,
    MAX(agent_count) AS peak_agents
FROM snapshots
GROUP BY sim_id, bucket;

CREATE MATERIALIZED VIEW sim_language_hourly
WITH (timescaledb.continuous) AS
SELECT
    sim_id,
    time_bucket('1 hour', ts) AS bucket,
    language,
    COUNT(*) AS count
FROM avatar_snapshots
GROUP BY sim_id, bucket, language;

SELECT add_retention_policy('avatar_snapshots', INTERVAL '14 days');

SELECT add_retention_policy('snapshots', INTERVAL '90 days');