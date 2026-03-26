"""Data models for the SL Traffic FastAPI"""

import datetime

from pydantic import BaseModel


class SlVector(BaseModel):
    x: float | int = 0
    y: float | int = 0
    z: float | int = 0


class AvatarSnapshot(BaseModel):
    language: str = ""
    position: SlVector | None = None
    name: str = ""
    ts: int = 0
    birth_date: datetime.date = datetime.date.today()
    user_id: str = ""


class Avatar(BaseModel):
    name: str = ""
    birth_date: datetime.date = datetime.date.today()
    key: str = ""


class Sim(BaseModel):
    sim_pos: SlVector = SlVector()
    sim_name: str = ""
    grid_name: str = ""


class SimSnapshot(BaseModel):
    sim_pos: SlVector = SlVector()
    sim_status: str = ""
    sim_rating: str = ""
    sim_name: str = ""
    ts: int = 0
    agent_limit: int = 0
    agent_limit_max: int = 0
    agent_reserved: int = 0
    agent_unreserved: int = 0
    dynamic_pathfinding: str = ""
    estate_id: str = ""
    estate_name: str = ""
    frame_number: int = 0
    region_cpu_ratio: int = 0
    region_idle: int = 0
    region_product_name: str = ""
    region_product_sku: str = ""
    region_start_time: int = 0
    sim_channel: str = ""
    sim_version: str = ""
    simulator_hostname: str = ""
    region_max_prims: int = 0
    region_object_bonus: float = 0
    whisper_range: float = 10
    chat_range: float = 20
    shout_range: float = 100
    region_rating: str = ""
    grid: str = ""
    allow_damage_adjust: bool = False
    restrict_combat_log: bool = False
    restore_health: bool = False
    invulnerability_time: float = 0
    damage_throttle: float = 0
    health_regen_rate: float = 0
    death_action: int = 0
    damage_limit: float = 0
    avatars: list[AvatarSnapshot] = []
