-- Create extensions

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for UUIDs
-- Optional but recommended for future:
CREATE EXTENSION IF NOT EXISTS postgis;


-- Clear existing schema

DROP INDEX IF EXISTS idx_avatar_geom;
DROP INDEX IF EXISTS idx_avatar_snapshots_language;
DROP INDEX IF EXISTS idx_avatar_snapshots_user_id;
DROP INDEX IF EXISTS idx_avatar_snapshots_sim_time;
DROP INDEX IF EXISTS idx_sim_snapshot_sim_time;
DROP TABLE IF EXISTS avatar_snapshot;
DROP TABLE IF EXISTS avatar;
DROP TABLE IF EXISTS sim_snapshot;
DROP TABLE IF EXISTS sim;


-- Create tables
CREATE TABLE sim (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	sim_pos GEOMETRY(PointZ, 0) NOT NULL,
	sim_name VARCHAR(256) NOT NULL,
	grid_name VARCHAR(256) NOT NULL,
	UNIQUE(sim_pos, sim_name, grid_name)
);

CREATE TABLE sim_snapshot (
    sim_pos GEOMETRY(PointZ, 0) NOT NULL,
    sim_status VARCHAR(256),
    sim_rating VARCHAR(256),
    sim_name VARCHAR(256) NOT NULL,
	ts TIMESTAMPTZ NOT NULL,
	agent_count INTEGER NOT NULL,
    agent_limit INTEGER,
    agent_limit_max INTEGER,
    agent_reserved INTEGER,
    agent_unreserved INTEGER,
    dynamic_pathfinding VARCHAR(256),
    estate_id INTEGER,
    estate_name VARCHAR(256),
    frame_number INTEGER,
    region_cpu_ratio INTEGER,
    region_idle INTEGER,
    region_product_name VARCHAR(256),
    region_product_sku VARCHAR(256),
    region_start_time INTEGER,
    sim_channel VARCHAR(256),
    sim_version VARCHAR(256),
    simulator_hostname VARCHAR(256),
    region_max_prims INTEGER,
    region_object_bonus NUMERIC(25,5),
    whisper_range NUMERIC(25,5),
    chat_range NUMERIC(25,5),
    shout_range NUMERIC(25,5),
    grid VARCHAR(256),
    allow_damage_adjust BOOLEAN,
    restrict_combat_log BOOLEAN,
    restore_health BOOLEAN,
    invulnerability_time NUMERIC(25,5),
    damage_throttle NUMERIC(25,5),
    health_regen_rate NUMERIC(25,5),
    death_action INTEGER,
    damage_limit NUMERIC(25,5),

	sim_id UUID NOT NULL REFERENCES sim(id) ON DELETE CASCADE
) WITH (
  tsdb.hypertable,
  tsdb.segmentby='sim_name',
  tsdb.orderby='ts DESC'
);

CREATE TABLE avatar (
	id UUID PRIMARY KEY,
	name VARCHAR(256) NOT NULL UNIQUE,
	birth_date DATE NOT NULL
);

CREATE TABLE avatar_snapshot (
	language VARCHAR(256),
	position GEOMETRY(PointZ),
	name VARCHAR(256),
	ts TIMESTAMPTZ NOT NULL,
	
	user_id UUID NOT NULL REFERENCES avatar(id),
	sim_id UUID NOT NULL REFERENCES sim(id)
) WITH (
  tsdb.hypertable,
  tsdb.segmentby='name',
  tsdb.orderby='ts DESC'
);


CREATE INDEX idx_sim_snapshot_sim_time
ON sim_snapshot(sim_id, ts DESC);

CREATE INDEX idx_avatar_snapshots_sim_time
ON avatar_snapshot(sim_id, ts DESC);

CREATE INDEX idx_avatar_snapshots_language
ON avatar_snapshot(language);

CREATE INDEX idx_avatar_snapshots_user_id
ON avatar_snapshot(user_id);

CREATE INDEX idx_avatar_geom
ON avatar_snapshot
USING GIST (position);


SELECT add_retention_policy('avatar_snapshot', INTERVAL '14 days');

SELECT add_retention_policy('sim_snapshot', INTERVAL '90 days');