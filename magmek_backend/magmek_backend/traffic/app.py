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
                agent_count=len(data.avatars),
                # ... map the rest of your 30+ fields here ...
                sim_status=data.sim_status,
                region_cpu_ratio=data.region_cpu_ratio,
            )
            db.add(new_sim_snapshot)

            # 4. Process Avatars
            for av_data in data.avatars:
                # Upsert the Avatar (Static)
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
