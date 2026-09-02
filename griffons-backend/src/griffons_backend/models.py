from collections.abc import Mapping
from datetime import date, datetime
from typing import Any

from caseconverter import snakecase
from jbutils import JbuConsole
from pydantic import BaseModel, Field, model_validator, ConfigDict
from pydantic.alias_generators import to_camel


class CommonModel(BaseModel):

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )


class CalendarUser(CommonModel):
    id: str = ""
    email: str = ""
    display_name: str = ""
    self: bool = False


class CalendarAttendee(CalendarUser):
    organizer: bool = False
    resource: bool = False
    optional: bool = False
    response_status: str | None = None
    comment: str | None = None
    additional_guests: int = 0
    async_operation: str | None = None


class CalendarDate(CommonModel):
    date: Any = None
    date_time: Any = None
    time_zone: str = ""


class CalendarProperties(CommonModel):
    private: dict[str, str] = Field(default_factory=dict)
    shared: dict[str, str] = Field(default_factory=dict)


class CalendarSource(CommonModel):
    url: str = ""
    title: str = ""


class CalendarAttachment(CommonModel):
    file_url: str = ""
    title: str = ""
    mime_type: str = ""
    icon_link: str = ""
    file_id: str = ""


class CalendarEventModel(CommonModel):
    id: str = ""
    status: str = ""
    html_link: str = ""
    created: datetime | None = None
    updated: datetime | None = None
    summary: str = ""
    description: str = ""
    location: str = ""
    i_cal_uid: str = ""
    # creator: CalendarUser = Field(default_factory=CalendarUser)
    creator_id: str = ""
    creator_display_name: str = ""
    creator_email: str = ""
    # organizer: CalendarUser = Field(default_factory=CalendarUser)
    organizer_id: str = ""
    organizer_display_name: str = ""
    organizer_email: str = ""
    # start: CalendarDate = Field(default_factory=CalendarDate)
    start_date: date | None = None
    start_time: datetime | None = None
    # end: CalendarDate = Field(default_factory=CalendarDate)
    end_date: date | None = None
    end_time: datetime | None = None
    end_time_unspecified: bool = False
    recurrence: list[str] = Field(default_factory=list)
    recurring_event_id: str | None = None
    # original_start_time: CalendarDate = Field(default_factory=CalendarDate)
    transparency: str | None = None
    visibility: str | None = None
    attendees: list[CalendarAttendee] = Field(default_factory=list)
    attendees_omitted: bool = False
    """ extended_properties: CalendarProperties = Field(
        default_factory=CalendarProperties
    ) """
    private_copy: bool = False
    locked: bool = False
    # source: CalendarSource = Field(default_factory=CalendarSource)
    event_type: str = ""
    is_all_day: bool = False

    @model_validator(mode="before")
    @classmethod
    def normalize_datetimes(cls, data: dict) -> dict:
        if not isinstance(data, Mapping):
            return data

        has_date = 0

        for key in ["start", "end"]:
            value = data.get(key)
            if not isinstance(value, dict):
                continue

            date_value = value.get("date")
            time_value = value.get("dateTime")

            if isinstance(date_value, str):
                has_date += 1
                data[f"{key}_date"] = date.fromisoformat(date_value)
            if isinstance(time_value, str):
                data[f"{key}_time"] = datetime.fromisoformat(time_value)

        if has_date == 2:
            data["is_all_day"] = True

        return data

    @model_validator(mode="before")
    @classmethod
    def normalize_users(cls, data: dict) -> dict:
        if not isinstance(data, Mapping):
            return data
        for key in ["creator", "organizer"]:
            obj = data.get(key)
            if not isinstance(obj, dict):
                continue

            changes = {}
            for obj_key, obj_val in obj.items():
                changes[f"{key}_{snakecase(obj_key)}"] = obj_val
            # JbuConsole.print(changes)
            data.update(changes)
        return data
