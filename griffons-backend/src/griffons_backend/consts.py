import os

from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

SERVER_APP_NAME = "griffons-server"
POLLER_APP_NAME = "griffons-poller"

CALENDAR_ID = os.environ.get("GRIFFONS_GOOGLE_CALENDAR_ID", "")
CALENDAR_AUTH_PATH = os.environ.get("GRIFFONS_GOOGLE_CALENDAR_AUTH_FILE", "")
GRIFFONS_DB_PATH = os.environ.get("GRIFFONS_DB_PATH", "")

BASE_URL = "/api/v1"
LOG_DIR = Path("/var/logs")
LOG_FMT_ID = "[%(name)s::%(module)s::%(origFunc)s]"
LOG_FMT_RICH = f"{LOG_FMT_ID} %(message)s"
LOG_FMT_STND = f"%(asctime)s {LOG_FMT_ID} [%(levelname)s] %(message)s"
