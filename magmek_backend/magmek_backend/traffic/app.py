import logging

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from datetime import datetime, timezone

from magmek_backend import consts, server_utils
from magmek_backend.models import SimSnapshot, Sim, Avatar
from magmek_backend.traffic import sql_conn, traffic_utils, entities


def get_app() -> FastAPI:
    app = FastAPI()

    @app.get(f"{consts.BASE_URL}/health")
    def health():
        server_utils.get_logger().info("Health works")

        return {"data": "Health worked"}

    @app.post(f"{consts.BASE_URL}/sim-snapshot")
    async def record_snapshot(
        data: SimSnapshot, db: Session = Depends(sql_conn.get_db)
    ):
        logger = server_utils.get_logger()
        logger.info(data)
        try:
            # 1. Convert Unix TS to Python Datetime
            snapshot_time = datetime.fromtimestamp(data.ts, tz=timezone.utc)

            # 2. Upsert Sim (Static Metadata)
            # We use PostgreSQL's 'ON CONFLICT' to handle the unique constraint
            sim_stmt = (
                insert(entities.DbSim)
                .values(
                    sim_name=data.sim_name,
                    grid_name=data.grid,
                    sim_pos=traffic_utils.to_wkt(data.sim_pos),
                )
                .on_conflict_do_update(
                    index_elements=["sim_name", "grid_name", "sim_pos"],
                    set_={
                        "sim_name": data.sim_name
                    },  # Minimal update to keep record fresh
                )
                .returning(entities.DbSim.id)
            )

            sim_id = db.execute(sim_stmt).scalar_one()

            # 3. Insert Sim Snapshot (Time-series)
            new_sim_snapshot = entities.DbSimSnapshot(
                ts=snapshot_time,
                sim_id=sim_id,
                sim_name=data.sim_name,
                agent_count=data.agent_count,
                sim_pos=data.sim_pos,
                sim_status=data.sim_status,
                sim_rating=data.sim_rating,
                agent_limit=data.agent_limit,
                agent_limit_max=data.agent_limit_max,
                agent_reserved=data.agent_reserved,
                agent_unreserved=data.agent_unreserved,
                dynamic_pathfinding=data.dynamic_pathfinding,
                estate_id=data.estate_id,
                estate_name=data.estate_name,
                frame_number=data.frame_number,
                region_cpu_ratio=data.region_cpu_ratio,
                region_idle=data.region_idle,
                region_product_name=data.region_product_name,
                region_product_sku=data.region_product_sku,
                region_start_time=data.region_start_time,
                sim_channel=data.sim_channel,
                sim_version=data.sim_version,
                simulator_hostname=data.simulator_hostname,
                region_max_prims=data.region_max_prims,
                region_object_bonus=data.region_object_bonus,
                whisper_range=data.whisper_range,
                chat_range=data.chat_range,
                shout_range=data.shout_range,
                grid=data.grid,
                allow_damage_adjust=data.allow_damage_adjust,
                restrict_combat_log=data.restrict_combat_log,
                restore_health=data.restore_health,
                invulnerability_time=data.invulnerability_time,
                damage_throttle=data.damage_throttle,
                health_regen_rate=data.health_regen_rate,
                death_action=data.death_action,
                damage_limit=data.damage_limit,
            )
            db.add(new_sim_snapshot)

            # 4. Process Avatars
            for av_data in data.avatars:
                # Upsert the Avatar (Static)
                logger.info(f"AV bdate: {av_data.birth_date}")
                av_stmt = (
                    insert(entities.DbAvatar)
                    .values(
                        id=av_data.user_id,
                        name=av_data.name,
                        birth_date=av_data.birth_date,
                    )
                    .on_conflict_do_nothing()
                )  # Identity doesn't change

                db.execute(av_stmt)

                # Insert Avatar Snapshot (Time-series)
                new_av_snap = entities.DbAvatarSnapshot(
                    ts=snapshot_time,
                    user_id=av_data.user_id,
                    sim_id=sim_id,
                    language=av_data.language,
                    position=(
                        traffic_utils.to_wkt(av_data.position, has_z=True)
                        if av_data.position
                        else None
                    ),
                )
                db.add(new_av_snap)

            # 5. Commit all changes at once
            db.commit()
            return {"status": "success", "processed_agents": len(data.avatars)}

        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    return app
