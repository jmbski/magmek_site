import os
import re
import platformdirs

from pathlib import Path

from jbutils import joiner, jbutils

APP_NAME = "magmek_backend"

BASE_URL = "/api/v1"


DATA_DIR = Path(platformdirs.user_data_dir(APP_NAME, ensure_exists=True))
CHAR_MAP_PATH = DATA_DIR / "character_mapping.yaml"
IGNORED_CHARS_PATH = DATA_DIR / "ignored_characters.yaml"

DATE_RE_YYYY_MM_DD = re.compile(r"\[\d{4}\/\d{2}\/\d{2}\s*\d{2}:\d{2}\]")
TIMESTAMP_RE = re.compile(r"^\[\d.+?\]\s*")
LINE_RE = re.compile(r"^\[(\d.+?)\]\s*(.+?):(.+?$)")
OOC_RE = re.compile(r"^\(\(.+?")

CHAR_MAPPING: dict[str, str] = {}
IGNORED_CHARS: list[str] = []
