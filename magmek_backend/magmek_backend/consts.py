import os
import re
import platformdirs

from pathlib import Path

import redis

from jbutils import joiner, jbutils

APP_NAME = "magmek_backend"
APP_VERSION = "0.1.0"

BASE_URL = "/api/v1"

PROBS_URL = joiner(f"{BASE_URL}/problems")
WARNINGS_URL = joiner(f"{BASE_URL}/warnings")


# Redis connection (used for one-time codes + nonce replay prevention).
REDIS_URL = os.environ.get("REDIS_URL", "redis://localhost:6379/0")
rdb = redis.Redis.from_url(REDIS_URL, decode_responses=True)

# Shared secret used to verify that the request came from your HUD script.
# In prod: must be set.
SL_SHARED_SECRET = os.environ.get("SL_SHARED_SECRET", "")

# Hardening knobs
AUTH_TS_SKEW_SECONDS = int(os.environ.get("SL_AUTH_TS_SKEW_SECONDS", "90"))
NONCE_TTL_SECONDS = int(os.environ.get("SL_AUTH_NONCE_TTL_SECONDS", "300"))
LOGIN_CODE_TTL_SECONDS = int(os.environ.get("SL_LOGIN_CODE_TTL_SECONDS", "60"))


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

PLAYLIST_DIR = Path(__file__).parent.parent.parent / "liquidsoap" / "playlists"
PLAYLIST_OUTPUT_DIR = Path("/var/www/stream/playlists")
if not PLAYLIST_OUTPUT_DIR.exists():
    os.makedirs(PLAYLIST_OUTPUT_DIR, exist_ok=True)

DATE_RE_YYYY_MM_DD = re.compile(r"\[\d{4}\/\d{2}\/\d{2}\s*\d{2}:\d{2}\]")
TIMESTAMP_RE = re.compile(r"^\[\d.+?\]\s*")
LINE_RE = re.compile(r"^\[(\d.+?)\]\s*(.+?):(.+?$)")
OOC_RE = re.compile(r"^\(\(.+?")

CHAR_MAPPING: dict[str, str] = {}
IGNORED_CHARS: list[str] = []


PORT_MAPPINGS: dict[str, int] = {
    "tof": 8007,
    "ag": 8006,
}
