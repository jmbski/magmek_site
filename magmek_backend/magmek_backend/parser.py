import json
import re

from jbutils import jbutils

from magmek_backend import consts
from magmek_backend.models import LogLine


def get_loglines(
    lines: list[str],
    addl_chars: dict[str, str] | None = None,
    addl_ignored: list[str] | None = None,
) -> list[LogLine]:
    lines = [line.strip() for line in lines if line.strip()]
    log_lines = []
    for i, line in enumerate(lines):
        try:
            logline = LogLine.from_line(line)
            log_lines.append(logline)
        except Exception as e:
            print(e)
            print(f"Logline error occurred on line: {i}\nLine: {line}")
    return [LogLine.from_line(line, addl_chars, addl_ignored) for line in lines]


def get_header(lines: list[LogLine], category: str, title: str) -> str:
    chars = list({line.charName for line in lines if not line.warning_unk_speaker})
    chars.sort()
    event_date = lines[0].timestamp.strftime("%A, %B %d, %Y")

    return (
        f"{category}\n"
        f"{title}\n"
        f"{event_date}\n\n"
        f"Participants: {", ".join(chars)}\n\n\n"
    )


def parse_log(
    text: list[str],
    category: str = "Second Life RP Chat Log",
    title: str = "RP Event",
    addl_chars: dict[str, str] | None = None,
    addl_ignored: list[str] | None = None,
):
    lines = get_loglines(text, addl_chars, addl_ignored)
    filtered = [line for line in lines if line.is_narrative]
    header = get_header(filtered, category=category, title=title)
    new_names = get_unknown_speakers(filtered)
    narrative = "\n\n".join(line.format_text() for line in filtered)

    return {
        "header": header,
        "narrative": narrative,
        "new_names": new_names,
        "lines": [line.to_dict() for line in filtered],
    }


def get_unique_speakers(lines: list[LogLine]):

    names = list({line.speaker for line in lines if line.is_narrative})
    names.sort()
    return names


def get_unknown_speakers(lines: list[LogLine]):
    return [
        name
        for name in get_unique_speakers(lines)
        if name not in consts.CHAR_MAPPING and name not in consts.IGNORED_CHARS
    ]
