import json

from collections.abc import Callable
from dataclasses import dataclass, field
from datetime import datetime
from zoneinfo import ZoneInfo
from typing import Any

from fastapi import Response
from jbutils.models import Base
from pydantic import BaseModel, model_validator

from magmek_backend import consts
from magmek_backend.errors import ApiErrTitles, ApiErrTypes, ApiErrCodes
from magmek_backend.models.resp_error import (
    ApiError,
    ApiWarning,
    ReqTypeError,
    RespParseError,
)


class MMBaseModel(BaseModel):

    model_config = {"from_attributes": True}  # For Pydantic v2

    def to_dict(self) -> dict:
        """Recursively iterate the class and any child values to return
            a dict version of the entire structure

        Returns:
            dict: A dict representing the class and any children it has
                defined
        """

        def get_value(value: Any) -> Any:
            if isinstance(value, MMBaseModel):
                return value.to_dict()
            elif isinstance(value, dict):
                return {
                    k: get_value(v)
                    for k, v in value.items()
                    if not k.startswith("_")
                }
            elif isinstance(value, list):
                return [get_value(v) for v in value]
            else:
                return value

        return get_value(vars(self))


class RespMetaData(MMBaseModel):
    timestamp: str = ""
    version: str = consts.APP_VERSION

    @model_validator(mode="before")
    def init(cls, data: dict):
        slt = ZoneInfo(
            "America/Los_Angeles"
        )  # Convert to SL Time, aka Pacific Standard Time
        now_slt = datetime.now(slt)
        data["timestamp"] = now_slt.isoformat()
        return data


class ServerResponse(MMBaseModel):
    data: Any = ""
    message: str = ""
    correlation_id: str = ""  # TODO: implement and investigate
    warnings: list[ApiWarning] = []
    meta: RespMetaData = RespMetaData()

    @model_validator(mode="before")
    @classmethod
    def init(cls, data: dict):
        data["meta"] = RespMetaData()
        return data

    def parse_error(self, e: Exception) -> Response:
        # TODO: Restructure
        orig = self.to_dict()
        orig["data"] = str(self.data)
        detail = f"Original Response:\n{json.dumps(orig)}\n\nError:\n{e}"
        err = RespParseError(detail=detail)
        return Response(json.dumps(err.to_dict()), status_code=err.status or 400)

    def as_fast(self) -> Response:
        try:
            return Response(
                json.dumps(self.to_dict()), media_type="application/json"
            )
        except Exception as e:
            return self.parse_error(e)

    @classmethod
    def to_fast(
        cls,
        payload: Any,
        message: str = "",
        corr_id: str = "",
        warnings: list[ApiWarning] | None = None,
    ) -> Response:
        warnings = warnings or []
        return cls(
            data=payload, message=message, correlation_id=corr_id, warnings=warnings
        ).as_fast()

    @classmethod
    def req_type_error(
        cls, req_data: Any, expected: str, message: str = "", status: int = 400
    ) -> Response:
        message = message or "Error encountered parsing request data"
        detail = f"{message}\nInvalid request data provide. Expected '{expected}', but received {type(req_data)}.\nData Received: {req_data}"
        err = ReqTypeError(detail=detail, status=status)

        return Response(json.dumps(err.to_dict()), status_code=status)

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
            status_code=status,
            media_type="application/problem+json",
        )
