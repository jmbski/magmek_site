import os
import re
import platformdirs

from enum import StrEnum, auto
from pathlib import Path

from jbutils import joiner, jbutils

APP_NAME = "magmek_backend"
APP_VERSION = "0.1.0"

BASE_URL = "/api/v1"

PROBS_URL = f"{BASE_URL}/problems"
WARNINGS_URL = f"{BASE_URL}/warnings"



class GlobalConfig:
    local: bool = False
    local_ui_path: Path = (
        Path(__file__).parent.parent.parent / "aetherglow-ui" / "public"
    )
    server_ui_path: Path = Path("/var/www/aetherglow")

    @classmethod
    def ui_path(cls) -> Path:
        return cls.local_ui_path if cls.local else cls.server_ui_path

    @classmethod
    def galleria_path(cls) -> Path:
        return cls.ui_path() / "galleria"


DATA_DIR = Path(platformdirs.user_data_dir(APP_NAME, ensure_exists=True))
CHAR_MAP_PATH = DATA_DIR / "character_mapping.yaml"
IGNORED_CHARS_PATH = DATA_DIR / "ignored_characters.yaml"
DEPLOY_DIR = Path(__file__).parent.parent / "deployment"
BASE_DATA_DIR = DEPLOY_DIR / "base_data"
GALLERIA_DIR = BASE_DATA_DIR / "galleria"


DATE_RE_YYYY_MM_DD = re.compile(r"\[\d{4}\/\d{2}\/\d{2}\s*\d{2}:\d{2}\]")
TIMESTAMP_RE = re.compile(r"^\[\d.+?\]\s*")
LINE_RE = re.compile(r"^\[(\d.+?)\]\s*(.+?):(.+?$)")
OOC_RE = re.compile(r"^\(\(.+?")

CHAR_MAPPING: dict[str, str] = {}
IGNORED_CHARS: list[str] = []


class ApiErrTitles(StrEnum):
    # Errors
    GENERIC_ERROR = auto()
    REQ_TYPE_ERROR = auto()
    RESP_PARSE_ERROR = auto()

    # Warnings
    GENERIC_WARNING = auto()


class ApiErrTypes:
    # Errors
    GENERIC_ERROR = f"{PROBS_URL}/generic"
    REQ_TYPE_ERROR = f"{PROBS_URL}/request_type_error"
    RESP_PARSE_ERROR = f"{PROBS_URL}/response_parse_error"

    # Warnings
    GENERIC_WARNING = f"{WARNINGS_URL}/generic"


class ApiErrCodes:
    # Errors
    GENERIC_ERROR = 500
    REQ_TYPE_ERROR = 400
    RESP_PARSE_ERROR = 500
