"""Data models for the SL Traffic FastAPI"""

import datetime

from typing import Any, Annotated, Self

from pydantic import (
    BaseModel,
    field_validator,
    model_validator,
    BeforeValidator,
)
from geoalchemy2.shape import to_shape
from shapely.geometry import Point

from magmek_backend import server_utils
from magmek_backend.traffic import entities


def datetime_to_unix(v: Any) -> int:
    # If it's already an int (incoming from SL), leave it alone
    if isinstance(v, int):
        return v
    # If it's a datetime (from SQLAlchemy), convert to Unix int
    if isinstance(v, datetime.datetime):
        return int(v.timestamp())
    return v


# Create a reusable type alias for your timestamps
UnixTimestamp = Annotated[int, BeforeValidator(datetime_to_unix)]


class TrModelBase(BaseModel):

    @classmethod
    def from_entity(cls, entity: entities.Base) -> Self:
        pass


class SlVector(BaseModel):
    x: float | int = 0
    y: float | int = 0
    z: float | int = 0

    model_config = {
        "from_attributes": True
    }  # For Pydantic v2class SlVector(BaseModel):

    @model_validator(mode="before")
    @classmethod
    def parse_geometry(cls, data: Any) -> Any:
        logger = server_utils.get_logger()
        logger.info(f"geo parser: {data}")
        # If the data is already a dict or SlVector, return it as-is
        if isinstance(data, (dict, cls)):
            return data
        logger.info("Passes type check")
        # If it's a GeoAlchemy2 element, convert it using Shapely
        try:
            # to_shape converts WKBElement to a Shapely Point
            shape = to_shape(data)
            logger.info(f"in try, shape type: {type(shape)}, shape: {shape}")
            if isinstance(shape, Point):
                return {
                    "x": shape.x,
                    "y": shape.y,
                    "z": getattr(shape, "z", 0.0),  # Handle 2D vs 3D points
                }
        except Exception as e:
            logger.warning("Hit exception trying to parse geometry")
            logger.error(f"{e}")
        logger.info(f"After parse, data = {data}")
        return data

    model_config = {"from_attributes": True}


class AvatarSnapshot(BaseModel):
    language: str = ""
    position: SlVector | None = None
    name: str = ""
    ts: UnixTimestamp = 0
    birth_date: datetime.date = datetime.date.today()
    user_id: str = ""

    model_config = {"from_attributes": True}  # For Pydantic v2


class Avatar(BaseModel):
    name: str = ""
    birth_date: datetime.date = datetime.date.today()
    key: str = ""

    model_config = {"from_attributes": True}  # For Pydantic v2


class Sim(BaseModel):
    sim_pos: SlVector = SlVector()
    sim_name: str = ""
    grid_name: str = ""

    model_config = {"from_attributes": True}  # For Pydantic v2


class SimSnapshot(BaseModel):
    sim_pos: SlVector = SlVector()
    sim_status: str = ""
    sim_rating: str = ""
    sim_name: str = ""
    ts: UnixTimestamp = 0
    agent_count: int = 0
    agent_limit: int = 0
    agent_limit_max: int = 0
    agent_reserved: int = 0
    agent_unreserved: int = 0
    dynamic_pathfinding: str = ""
    estate_id: int = 0
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

    model_config = {"from_attributes": True}  # For Pydantic v2
