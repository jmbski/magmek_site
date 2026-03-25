import json

from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Any

from flask import Response
from jbutils.models import Base

from magmek_backend import consts
from magmek_backend.errors import ApiErrTitles, ApiErrTypes, ApiErrCodes
from magmek_backend.models.resp_error import (
    ApiError,
    ApiWarning,
    ReqTypeError,
    RespParseError,
)


@dataclass
class RespMetaData(Base):
    timestamp: str = ""
    version: str = consts.APP_VERSION

    def __post_init__(self) -> None:
        slt = ZoneInfo(
            "America/Los_Angeles"
        )  # Convert to SL Time, aka Pacific Standard Time
        now_slt = datetime.now(slt)
        self.timestamp = now_slt.isoformat()


@dataclass
class ServerResponse(Base):
    data: Any = ""
    message: str = ""
    correlation_id: str = ""  # TODO: implement and investigate
    warnings: list[ApiWarning] = field(default_factory=list)
    meta: RespMetaData = field(default_factory=RespMetaData)

    def parse_error(self, e: Exception) -> Response:
        # TODO: Restructure
        orig = self.to_dict()
        orig["data"] = str(self.data)
        detail = f"Original Response:\n{json.dumps(orig)}\n\nError:\n{e}"
        err = RespParseError(detail=detail)
        return Response(json.dumps(err.to_dict()), status=err.status)

    def as_flask(self) -> Response:
        try:
            return Response(json.dumps(self.to_dict()), mimetype="application/json")
        except Exception as e:
            return self.parse_error(e)

    @classmethod
    def to_flask(
        cls,
        payload: Any,
        message: str = "",
        corr_id: str = "",
        warnings: list[ApiWarning] | None = None,
    ) -> Response:
        warnings = warnings or []
        return cls(payload, message, corr_id, warnings).as_flask()

    @classmethod
    def req_type_error(
        cls, req_data: Any, expected: str, message: str = "", status: int = 400
    ) -> Response:
        message = message or "Error encountered parsing request data"
        detail = f"{message}\nInvalid request data provide. Expected '{expected}', but received {type(req_data)}.\nData Received: {req_data}"
        err = ReqTypeError(detail=detail, status=status)

        return Response(json.dumps(err.to_dict()), status=status)

    @classmethod
    def error(
        cls,
        e: Exception | str,
        err_type: str = ApiErrTypes.GENERIC_ERROR,
        message: str = "",
        title: str = ApiErrTitles.GENERIC_ERROR,
        status: int = ApiErrCodes.GENERIC_ERROR,
        endpoint: Callable | str = "",
    ) -> Response:
        if message:
            message += "\n"
        message += str(e)
        instance = endpoint if isinstance(endpoint, str) else endpoint.__name__

        err = ApiError(err_type, title, status, message, instance)

        return Response(
            json.dumps(err.to_dict),
            status=status,
            mimetype="application/problem+json",
        )
