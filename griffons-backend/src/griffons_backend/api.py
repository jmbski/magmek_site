from fastapi import APIRouter

from jbutils.api import ApiLogger, build_server

from griffons_backend import consts
from griffons_backend.database import service
from griffons_backend.models import CalendarEventModel


def get_router() -> APIRouter:
    router = APIRouter()

    @router.get(
        f"{consts.BASE_URL}/calendar-events",
        response_model=list[CalendarEventModel],
    )
    def get_calendar_events(logger: ApiLogger):
        return service.get_upcoming_events()

    return router


def get_server():
    return build_server([get_router()], port=5050, socket="griffons-api")
