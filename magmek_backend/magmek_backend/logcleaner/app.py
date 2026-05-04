from typing import Dict, Any

from fastapi import APIRouter, FastAPI, Request
from jbutils.api import api_utils, ApiLogger

from magmek_backend import appdata, consts, server_utils
from magmek_backend.cli import music
from magmek_backend.models import ServerResponse
from magmek_backend.logcleaner import parser, lc_models


def lc_api_routes() -> APIRouter:
    router = APIRouter()

    api_url = consts.BASE_URL + "/log-cleaner"

    @router.get(f"{api_url}/health")
    def lc_health(data: Dict[Any, Any], logger: ApiLogger) -> str:

        logger.info("Health endpoint reached")
        logger.info(data)
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"

    @router.get(f"{api_url}/char-mapping")
    def get_mapping():
        return ServerResponse.to_fast(
            consts.CHAR_MAPPING, "Successfully retrieved character mapping"
        )

    @router.post(f"{api_url}/char-mapping")
    def add_mapping(data: lc_models.AddMappingRequest, logger: ApiLogger):

        if data.mapping:
            logger.info(f"adding mapping: {data.mapping}")
            appdata.add_char_mapping(data.mapping)
        elif data.key and data.value:
            appdata.add_char_mapping(data.key, data.value)
        else:
            return ServerResponse.req_type_error(
                data, "dict[str,str] | {key: str, value: str}"
            )

        return ServerResponse.to_fast(
            consts.CHAR_MAPPING, "mapping successfully updated"
        )

    @router.put(f"{api_url}/char-mapping")
    def set_mapping(data: lc_models.SetMappingRequest, logger: ApiLogger):
        if data.mapping:
            appdata.set_char_mapping(data.mapping)
        else:
            return ServerResponse.req_type_error(
                data, "dict[str,str] | {key: str, value: str}"
            )

        return ServerResponse.to_fast(data.mapping, "mapping successfully set")

    @router.delete(f"{api_url}/char-mapping")
    def rem_mapping(data: lc_models.RemMappingRequest, logger: ApiLogger):

        if not isinstance(data.keys, (str, list)):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.rem_char_mapping(data.keys)

        return ServerResponse.to_fast(
            consts.CHAR_MAPPING, "Mappings successfully removed"
        )

    @router.get(f"{api_url}/ignored")
    def get_ignored():
        return ServerResponse.to_fast(consts.IGNORED_CHARS)

    @router.post(f"{api_url}/ignored")
    def add_ignored(data: lc_models.UpdateIgnoredRequest, logger: ApiLogger):

        if not isinstance(data.keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.add_ignored(data.keys)

        return ServerResponse.to_fast(
            consts.IGNORED_CHARS, "Names successfully added to the ignored list"
        )

    @router.put(f"{api_url}/ignored")
    def set_ignored(data: lc_models.UpdateIgnoredRequest, logger: ApiLogger):

        if not isinstance(data.keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.set_ignored(data.keys)

        return ServerResponse.to_fast(
            consts.IGNORED_CHARS, "Names successfully added to the ignored list"
        )

    @router.delete(f"{api_url}/ignored")
    def rem_ignored(data: lc_models.UpdateIgnoredRequest, logger: ApiLogger):

        if not isinstance(data.keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.rem_ignored(data.keys)

        return ServerResponse.to_fast(
            consts.IGNORED_CHARS, "Names successfully removed from ignored list"
        )

    @router.post(f"{api_url}/clean-log")
    def clean_log(
        data: lc_models.CleanLogRequest, logger: ApiLogger, request: Request
    ):

        if not isinstance(data.lines, list):
            return ServerResponse.req_type_error(data, "list[str]")

        try:
            payload = parser.parse_log(data.lines, data.event_category, data.title)

            return ServerResponse.to_fast(payload)
        except Exception as e:
            return ServerResponse.error(
                e, endpoint=request.scope.get("route") or clean_log
            )

    @router.post(f"{api_url}/unmapped-names")
    def get_unmapped_names(
        data: lc_models.UnmappedLinesRequest, logger: ApiLogger, request: Request
    ):

        if not isinstance(data.lines, list):
            return ServerResponse.req_type_error(data, "list[str]")

        try:
            log_lines = parser.get_loglines(data.lines)
            names = parser.get_unknown_speakers(log_lines)

            return ServerResponse.to_fast(names)
        except Exception as e:
            return ServerResponse.error(
                e, endpoint=request.scope.get("route") or clean_log
            )

    return router
