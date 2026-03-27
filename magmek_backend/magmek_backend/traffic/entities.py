from datetime import datetime
from uuid import uuid4
from sqlalchemy import (
    Column,
    String,
    Integer,
    BigInteger,
    Numeric,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship
from geoalchemy2 import Geometry


class Base(DeclarativeBase):
    pass


# --- Static Tables ---


class DbSim(Base):
    __tablename__ = "sim"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    sim_name = Column(String(256), nullable=False)
    grid_name = Column(String(256), nullable=False)
    # PostGIS Point (0 is the SRID for 'No SRID' as in your SQL)
    sim_pos = Column(Geometry("POINT", srid=0), nullable=False)

    snapshots = relationship("DbSimSnapshot", back_populates="sim")


class DbAvatar(Base):
    __tablename__ = "avatar"
    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(256), nullable=False, unique=True)
    birth_date = Column(Date, nullable=False)


# --- TimescaleDB Hypertables ---


class DbSimSnapshot(Base):
    __tablename__ = "sim_snapshot"
    # Note: In Timescale, the primary key usually includes the timestamp
    ts = Column(DateTime(timezone=True), primary_key=True, nullable=False)
    sim_id = Column(UUID(as_uuid=True), ForeignKey("sim.id"), primary_key=True)

    sim_name = Column(String(256), nullable=False)
    agent_count = Column(Integer, nullable=False)
    sim_pos = Column(Geometry("POINT"), nullable=False)
    sim_status = Column(String(256))
    sim_rating = Column(String(256))
    agent_limit = Column(Integer)
    agent_limit_max = Column(Integer)
    agent_reserved = Column(Integer)
    agent_unreserved = Column(Integer)
    dynamic_pathfinding = Column(String(256))
    estate_id = Column(Integer)
    estate_name = Column(String(256))
    frame_number = Column(Integer)
    region_cpu_ratio = Column(Integer)
    region_idle = Column(Integer)
    region_product_name = Column(String(256))
    region_product_sku = Column(String(256))
    region_start_time = Column(Integer)
    sim_channel = Column(String(256))
    sim_version = Column(String(256))
    simulator_hostname = Column(String(256))
    region_max_prims = Column(Integer)
    region_object_bonus = Column(Numeric)
    whisper_range = Column(Numeric)
    chat_range = Column(Numeric)
    shout_range = Column(Numeric)
    grid = Column(String(256))
    allow_damage_adjust = Column(Boolean)
    restrict_combat_log = Column(Boolean)
    restore_health = Column(Boolean)
    invulnerability_time = Column(Numeric)
    damage_throttle = Column(Numeric)
    health_regen_rate = Column(Numeric)
    death_action = Column(Integer)
    damage_limit = Column(Numeric)

    sim = relationship("DbSim", back_populates="snapshots")

    __table_args__ = (
        {
            "timescaledb_hypertable": {"time_column_name": "ts"},
        },
    )


class DbAvatarSnapshot(Base):
    __tablename__ = "avatar_snapshot"
    ts = Column(DateTime(timezone=True), primary_key=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("avatar.id"), primary_key=True)
    sim_id = Column(UUID(as_uuid=True), ForeignKey("sim.id"))

    language = Column(String(256))
    position = Column(Geometry("POINTZ"))  # Point with Z-axis for SL altitude

    __table_args__ = (
        {
            "timescaledb_hypertable": {"time_column_name": "ts"},
        },
    )
