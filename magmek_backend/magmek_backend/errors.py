from dataclasses import dataclass
from enum import StrEnum, auto

from magmek_backend import consts


class ApiErrTitles(StrEnum):
    # Errors
    GENERIC_ERROR = auto()
    REQ_TYPE_ERROR = auto()
    RESP_PARSE_ERROR = auto()
    TS_RANGE_ERROR = auto()
    REPLAY_ERROR = auto()

    # Warnings
    GENERIC_WARNING = auto()


class ApiErrTypes(StrEnum):
    # Errors
    GENERIC_ERROR = consts.PROBS_URL("generic")
    REQ_TYPE_ERROR = consts.PROBS_URL("request_type_error")
    RESP_PARSE_ERROR = consts.PROBS_URL("response_parse_error")
    TS_RANGE_ERROR = consts.PROBS_URL("timestamp_range_error")
    REPLAY_ERROR = consts.PROBS_URL("replay_error")

    # Warnings
    GENERIC_WARNING = consts.WARNINGS_URL("generic")


class ApiErrCodes:
    # Errors
    GENERIC_ERROR = 500
    REQ_TYPE_ERROR = 400
    RESP_PARSE_ERROR = 500
    TS_RANGE_ERROR = 401
    REPLAY_ERROR = 401
