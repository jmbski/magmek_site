from dataclasses import dataclass, field
from typing import Any

from jbutils.models import Base

from magmek_backend import consts
from magmek_backend.consts import ApiErrTitles, ApiErrCodes, ApiErrTypes


@dataclass
class ApiError(Base):
    type: str = ApiErrTypes.GENERIC_ERROR
    title: str = ApiErrTitles.GENERIC_ERROR
    status: int | None = ApiErrCodes.GENERIC_ERROR
    detail: str = ""
    instance: str = ""


@dataclass
class ApiWarning(ApiError):
    type: str = ApiErrTypes.GENERIC_WARNING
    title: str = ApiErrTitles.GENERIC_WARNING
    status: int | None = None


@dataclass
class ReqTypeError(ApiError):
    type: str = ApiErrTypes.REQ_TYPE_ERROR
    title: str = ApiErrTitles.REQ_TYPE_ERROR
    status: int | None = ApiErrCodes.REQ_TYPE_ERROR

    def __post_init__(self) -> None:
        self.detail = f"Error encountered parsing request data.\n{self.detail}"


@dataclass
class RespParseError(ApiError):
    type: str = ApiErrTypes.RESP_PARSE_ERROR
    title: str = ApiErrTitles.RESP_PARSE_ERROR
    status: int | None = ApiErrCodes.RESP_PARSE_ERROR

    def __post_init__(self) -> None:
        self.detail = f"Error encountered parsing response data.\n{self.detail}"
