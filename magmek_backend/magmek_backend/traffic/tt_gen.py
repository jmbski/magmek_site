from dataclasses import dataclass, field
from datetime import datetime
from random import randint, random

from magmek_backend.traffic.entities import (
    DbAvatar,
    DbAvatarSnapshot,
    DbSim,
    DbSimSnapshot,
)
from magmek_backend.traffic.tr_models import (
    Avatar,
    AvatarSnapshot,
    Sim,
    SimSnapshot,
    SlVector,
)


def rand_vector(is_sim_pos: bool = False) -> SlVector:
    if is_sim_pos:
        return SlVector(x=randint(0, 30000), y=randint(0, 30000), z=0)
    return SlVector(x=random() * 256, y=random() * 256, z=random() * 4000)



@dataclass
class DataGenerator:
    start_ts: datetime
    end_ts: datetime
    interval: int = 60
    sim_name: str = ""

    cur_avs: list[Avatar] = field(default_factory=list)
    sim: Sim = field(default_factory=Sim)

    def __post_init__(self) -> None:
        self.sim = Sim(
            sim_pos=rand_vector(True),
            sim_name=self.sim_name,
            grid_name="agni",
        )

    def new_sim_snapshot(self) -> SimSnapshot:
        return SimSnapshot(
            sim_name=self.sim_name,
            sim_pos=self.sim.sim_pos,
            agent_count=len(self.cur_avs),
        )