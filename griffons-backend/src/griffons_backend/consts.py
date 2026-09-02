import os

from dotenv import load_dotenv

load_dotenv()

CALENDAR_ID = os.environ.get("GRIFFONS_GOOGLE_CALENDAR_ID", "")
CALENDAR_AUTH_PATH = os.environ.get("GRIFFONS_GOOGLE_CALENDAR_AUTH_FILE", "")
GRIFFONS_DB_PATH = os.environ.get("GRIFFONS_DB_PATH", "")

BASE_URL = "/api/v1"
