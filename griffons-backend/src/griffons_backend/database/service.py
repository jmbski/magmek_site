from sqlalchemy import select
from sqlalchemy.orm import Session

from griffons_backend.models import CalendarEventModel
from griffons_backend.database import conn, utils
from griffons_backend.database.entities import CalendarEventEntity


def get_event(
    event_id: str,
) -> CalendarEventModel | None:
    """Retrieve a cached calendar event.

    Args:
        event_id: Google Calendar event ID.

    Returns:
        The matching calendar event, if one exists.
    """
    with conn.get_db_session() as session:
        resp = session.get(
            CalendarEventEntity,
            event_id,
        )
        if resp:
            return utils.entity_to_model(resp)


def get_upcoming_events() -> list[CalendarEventModel]:
    """Retrieve cached calendar events ordered by start time.

    Returns:
        Cached calendar events ordered chronologically.
    """
    with conn.get_db_session() as session:
        statement = select(CalendarEventEntity).order_by(
            CalendarEventEntity.start_time
        )

        resp_events = list(session.scalars(statement).all())
        return utils.entities_to_models(resp_events)


def upsert_event(event: CalendarEventModel) -> CalendarEventEntity:
    with conn.get_db_session() as session:
        entity = session.get(CalendarEventEntity, event.id)

        if entity is None:
            entity = utils.model_to_entity(event)
            session.add(entity)
            return entity

        utils.update_event(entity, event)
        return entity


def bulk_upsert(events: list[CalendarEventModel]):
    # TODO: Optimize this
    for event in events:
        upsert_event(event)
