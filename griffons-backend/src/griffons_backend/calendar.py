from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import quote

import requests

from jbutils import jbutils
from google.auth.transport.requests import Request
from google.oauth2 import service_account

from griffons_backend import consts
from griffons_backend.models import CalendarEventModel
from griffons_backend.database import service, conn

SCOPES: list[str] = [
    "https://www.googleapis.com/auth/calendar.events.readonly",
]


def get_access_token() -> str:
    """Obtain an OAuth access token for the Google Calendar API.

    Returns:
        A valid OAuth 2.0 bearer token.
    """
    credentials = service_account.Credentials.from_service_account_file(
        consts.CALENDAR_AUTH_PATH,
        scopes=SCOPES,
    )

    credentials.refresh(Request())

    if credentials.token is None:
        raise RuntimeError(
            "Google authentication succeeded without returning a token."
        )

    return credentials.token


def parse_events(response: dict) -> list[CalendarEventModel]:
    raw_events = response.get("items")
    if not isinstance(raw_events, list):
        return []

    return [CalendarEventModel.model_validate(item) for item in raw_events]


def get_events() -> list[CalendarEventModel]:
    """Retrieve upcoming events from the configured Google Calendar.

    Returns:
        The raw Calendar API response as a dictionary.

    Raises:
        requests.HTTPError: If Google returns a non-successful HTTP response.
    """
    token = get_access_token()

    encoded_calendar_id = quote(consts.CALENDAR_ID, safe="")

    url = (
        "https://www.googleapis.com/calendar/v3/calendars/"
        f"{encoded_calendar_id}/events"
    )

    now = datetime.now(timezone.utc).isoformat()

    params = {
        "timeMin": now,
        "singleEvents": "true",
        "orderBy": "startTime",
        "maxResults": 20,
    }

    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }

    response = requests.get(
        url,
        headers=headers,
        params=params,
        timeout=10,
    )

    response.raise_for_status()

    return parse_events(response.json())


def poll_calendar():

    events = get_events()
    conn.ensure_database()
    service.bulk_upsert(events)
