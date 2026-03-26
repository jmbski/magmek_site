import logging

from fastapi import FastAPI

from magmek_backend import consts, server_utils
from magmek_backend.models import SimSnapshot


def get_app() -> FastAPI:
    app = FastAPI()

    @app.get(f"{consts.BASE_URL}/health")
    def health():
        server_utils.get_logger().info("Health works")

        return {"data": "Health worked"}

    @app.post(f"{consts.BASE_URL}/sim-snapshot")
    async def update_item(snapshot: SimSnapshot):
        logger = server_utils.get_logger()
        logger.info(snapshot)
        return {"data": "test"}

    return app
