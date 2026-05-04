import os

from fastapi import APIRouter, FastAPI
from jbutils.api import api_utils, ApiLogger

from magmek_backend import consts
from magmek_backend.cli import music
from magmek_backend.models import ServerResponse, MMBaseModel


class ChangeRadioRequest(MMBaseModel):
    playlist: str = ""
    source: str = "tof"
    port: int = 8007


def ag_api_routes() -> APIRouter:
    router = APIRouter()

    api_url = consts.BASE_URL + "/service"

    @router.get(f"{api_url}/health")
    def health(logger: ApiLogger):
        logger.info("Service health endpoint working")
        return {"data": "Service health endpoint working"}

    @router.get(f"{api_url}/galleria-images")
    def get_galleria_imgs():
        images = [
            f"/galleria/{image}"
            for image in os.listdir(consts.GlobalConfig.galleria_path())
        ]
        return ServerResponse.to_fast(images)

    @router.post(f"{api_url}/change-radio")
    def change_radio(data: ChangeRadioRequest, logger: ApiLogger):

        if data.playlist:
            music.switch_playlist(data.playlist, data.port)
            return ServerResponse.to_fast(f"Switching to: {data.playlist}")

        return ServerResponse.error("No playlist provided")

    return router
