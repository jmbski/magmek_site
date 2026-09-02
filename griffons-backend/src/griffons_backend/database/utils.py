from datetime import datetime, timezone
from uuid import uuid4

from griffons_backend.models import CalendarEventModel
from griffons_backend.database.entities import CalendarEventEntity


def model_to_entity(event: CalendarEventModel) -> CalendarEventEntity:
    return CalendarEventEntity(
        id=event.id,
        status=event.status,
        html_link=event.html_link,
        event_created=event.created,
        event_updated=event.updated,
        summary=event.summary,
        description=event.description,
        location=event.location,
        i_cal_uid=event.i_cal_uid,
        creator_id=event.creator_id,
        creator_display_name=event.creator_display_name,
        creator_email=event.creator_email,
        organizer_id=event.organizer_id,
        organizer_display_name=event.organizer_display_name,
        organizer_email=event.organizer_email,
        start_date=event.start_date,
        start_time=event.start_time,
        end_date=event.end_date,
        end_time=event.end_time,
        is_all_day=event.is_all_day,
        updated_at=datetime.now(),
    )


def entity_to_model(event: CalendarEventEntity) -> CalendarEventModel:
    return CalendarEventModel.model_validate(event)


def entities_to_models(
    events: list[CalendarEventEntity],
) -> list[CalendarEventModel]:
    return [entity_to_model(event) for event in events]


def update_event(entity: CalendarEventEntity, model: CalendarEventModel) -> None:
    entity.description = model.description
    entity.end_date = model.end_date
    entity.end_time = model.end_time
    entity.event_updated = model.updated
    entity.html_link = model.html_link
    entity.is_all_day = model.is_all_day
    entity.location = model.location
    entity.organizer_display_name = model.organizer_display_name
    entity.organizer_email = model.organizer_email
    entity.organizer_id = model.organizer_id
    entity.start_date = model.start_date
    entity.start_time = model.start_time
    entity.status = model.status
    entity.summary = model.summary
    entity.updated_at = datetime.now()
