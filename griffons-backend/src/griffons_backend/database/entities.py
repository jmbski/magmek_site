from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    pass


class CalendarEventEntity(Base):
    __tablename__ = "calendar_events"

    id: Mapped[str] = mapped_column(String, primary_key=True)

    status: Mapped[str] = mapped_column(String)
    html_link: Mapped[str] = mapped_column(String)
    event_created: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    event_updated: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    summary: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(Text)
    location: Mapped[str] = mapped_column(String)
    i_cal_uid: Mapped[str] = mapped_column(String)

    creator_id: Mapped[str] = mapped_column(String)
    creator_display_name: Mapped[str] = mapped_column(String)
    creator_email: Mapped[str] = mapped_column(String)

    organizer_id: Mapped[str] = mapped_column(String)
    organizer_display_name: Mapped[str] = mapped_column(String)
    organizer_email: Mapped[str] = mapped_column(String)

    start_date: Mapped[date | None] = mapped_column(Date)
    start_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    end_date: Mapped[date | None] = mapped_column(Date)
    end_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    is_all_day: Mapped[bool] = mapped_column(Boolean, default=False)

    updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
