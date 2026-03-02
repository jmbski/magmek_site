from dataclasses import dataclass, field
from datetime import datetime
from typing import Self

from jbutils.models import Base
from jbutils.types import Predicate

from magmek_backend import consts, appdata


def parse_timestamp(value: str) -> datetime:
    """Parse a Second Life chat log timestamp.

    Args:
        value: Timestamp string in format
            'YYYY/MM/DD HH:MM' or
            'YYYY/MM/DD HH:MM:SS'.

    Returns:
        A datetime object representing the timestamp.

    Raises:
        ValueError: If the timestamp format is invalid.
    """
    for fmt in ("%Y/%m/%d %H:%M:%S", "%Y/%m/%d %H:%M"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError as e:
            continue

    raise ValueError(f"Invalid timestamp format: {value}")


def default_datetimestamp(*args, **kwargs) -> datetime:
    return datetime.now()


@dataclass
class LogLine(Base):
    timestamp_str: str = ""
    speaker: str = ""
    line_text: str = ""
    char_name: str = ""
    formatted_line: str = ""
    timestamp: datetime = field(default_factory=default_datetimestamp)

    _addl_char_map: dict[str, str] = field(default_factory=dict)
    _addl_ignored: list[str] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.timestamp = parse_timestamp(self.timestamp_str)

        self.char_name = appdata.get_char_map(self._addl_char_map).get(
            self.speaker, self.speaker
        )

    def to_dict(self) -> dict:
        data = super().to_dict()
        data["timestamp"] = str(self.timestamp)
        return data

    @classmethod
    def from_line(
        cls,
        line: str,
        addl_chars: dict[str, str] | None = None,
        addl_ignored: list[str] | None = None,
    ) -> Self:
        groups = consts.LINE_RE.findall(line)
        if not groups:
            result = cls()
        else:
            parts = (part.strip() for part in groups[0])
            result = cls(*parts)

        result._addl_char_map = addl_chars or {}
        result._addl_ignored = addl_ignored or []

        return result

    @property
    def is_online_status(self) -> bool:
        return self.line_text in ["is online.", "is offline."]

    @property
    def is_ooc(self) -> bool:
        return bool(consts.OOC_RE.search(self.line_text))

    @property
    def is_secondlife(self) -> bool:
        return self.speaker == "Second Life"

    @property
    def is_ignored(self) -> bool:
        return self.speaker in appdata.get_ignored(self._addl_ignored)

    @property
    def warning_unk_speaker(self) -> bool:
        return self.speaker not in appdata.get_char_map(self._addl_char_map)

    @property
    def is_slash_me(self) -> bool:
        return self.line_text.startswith("/me")

    @property
    def is_narrative(self) -> bool:
        return not bool(
            self.is_online_status
            + self.is_ooc
            + self.is_secondlife
            + self.is_ignored
        )

    def to_raw_text(self) -> str:
        return f"{self.timestamp_str}  {self.speaker}: {self.line_text}"

    def format_text(self) -> str:
        text = self.line_text

        if self.is_slash_me:
            text = text.replace("/me", self.char_name)
        else:
            if text[0] != text[0].upper():
                text = text[0].upper() + text[1:]
            if text[0] not in ['"', "'"]:
                text = '"' + text
            if text[-1] not in ['"', "'"]:
                text += '"'

            text = f"{text} said {self.char_name}"

        if self.warning_unk_speaker:
            warn_text = "** [WARNING] - Unmapped speaker username **"
            text = f"{warn_text}\n{text}\n{warn_text}"

        self.formatted_line = text
        return text
