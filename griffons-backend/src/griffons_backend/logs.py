"""Logging setup for BSD project"""

from __future__ import annotations

import logging
import logging.config
import traceback

from collections.abc import Callable
from logging import LogRecord
from typing import Any

from griffons_backend import consts
from griffons_backend.config import CONFIG

# from bsd_backend.consts import CONFIG

# Toggle this if you ever want to force-disable Rich console output.
USE_RICH_CONSOLE: bool = True


class LevelAllowList(logging.Filter):
    """Allow only specific logging levels to pass to a handler.

    Args:
        levels: The set of numeric logging levels (e.g., {logging.DEBUG, logging.ERROR}).

    Returns:
        True if the record's level is in the allow-list; otherwise False.
    """

    def __init__(self, levels: set[int]) -> None:
        super().__init__()
        self.levels = levels

    def filter(self, record: LogRecord) -> bool:
        return record.levelno in self.levels


class ColoredFormatter(logging.Formatter):
    """Minimal ANSI-colored formatter (fallback when Rich isn't available).

    Colors:
        DEBUG=dim, INFO=default, WARNING=yellow, ERROR=red, CRITICAL=bold red
    """

    _RESET = "\033[0m"
    _DIM = "\033[2m"
    _YELLOW = "\033[33m"
    _RED = "\033[31m"
    _BOLD = "\033[1m"

    def format(self, record: LogRecord) -> str:
        base = super().format(record)
        if record.levelno >= logging.CRITICAL:
            return f"{self._BOLD}{self._RED}{base}{self._RESET}"
        if record.levelno >= logging.ERROR:
            return f"{self._RED}{base}{self._RESET}"
        if record.levelno >= logging.WARNING:
            return f"{self._YELLOW}{base}{self._RESET}"
        if record.levelno == logging.DEBUG:
            return f"{self._DIM}{base}{self._RESET}"
        return base


def setup_logging(app_name: str) -> None:
    """Configure logging.

    Rules:
      * File handler: captures everything (DEBUG and up).
      * Console handler: shows only
          - DEBUG (only when CONFIG.debug is True)
          - ERROR and CRITICAL (always)
        INFO/WARNING never appear on console.

    Uses rich.logging.RichHandler when available (and USE_RICH_CONSOLE is True),
    otherwise falls back to a tiny ANSI-colored formatter.
    """
    console_levels: set[int] = {logging.ERROR, logging.CRITICAL}
    if CONFIG.debug:
        console_levels.add(logging.DEBUG)

    # Try to import RichHandler if allowed.
    rich_handler_class: str | None = None
    if USE_RICH_CONSOLE:
        try:
            import rich.logging  # noqa: F401

            rich_handler_class = "rich.logging.RichHandler"
        except Exception:
            rich_handler_class = None

    # Common formatters
    formatters: dict[str, dict] = {
        "file_generic": {
            "format": consts.LOG_FMT_STND,
            "datefmt": "%Y-%m-%d %H:%M:%S",
            "class": "logging.Formatter",
        }
    }

    handlers: dict[str, dict] = {
        "file": {
            "class": "logging.handlers.RotatingFileHandler",
            "level": "DEBUG",
            "formatter": "file_generic",
            "filename": consts.LOG_DIR / app_name / "stdout.log",
            "maxBytes": 104_857_600,  # 100 MB
            "backupCount": 3,
            "encoding": "utf-8",
        }
    }

    filters: dict[str, dict] = {
        "console_level_filter": {
            "()": LevelAllowList,  # direct callable
            "levels": console_levels,  # passed to __init__
        }
    }

    if rich_handler_class:
        # Use RichHandler: it renders its own pretty console output.
        # Keep formatter simple (message only) — Rich prints time/level beautifully.
        handlers["console"] = {
            "class": rich_handler_class,
            "level": "DEBUG" if CONFIG.debug else "ERROR",
            "filters": ["console_level_filter"],
            "rich_tracebacks": True,
            "tracebacks_show_locals": False,
            "show_time": True,
            "show_level": True,
            "show_path": True,  # toggle to False if you prefer less noise
            "markup": True,
            # With RichHandler, formatter should usually be message-only:
            "formatter": "console_message_only",
        }
        formatters["console_message_only"] = {
            "format": consts.LOG_FMT_RICH,
            "class": "logging.Formatter",
        }
    else:
        # Fallback: basic ANSI colorized formatter
        handlers["console"] = {
            "class": "logging.StreamHandler",
            "level": "DEBUG" if CONFIG.debug else "ERROR",
            "filters": ["console_level_filter"],
            "formatter": "console_colored",
            "stream": "ext://sys.stdout",
        }
        formatters["console_colored"] = {
            "()": ColoredFormatter,
            "format": consts.LOG_FMT_STND,
            "datefmt": "%Y-%m-%d %H:%M:%S",
        }

    log_config: dict = {
        "version": 1,
        "disable_existing_loggers": False,
        "filters": filters,
        "formatters": formatters,
        "handlers": handlers,
        "root": {
            "level": "DEBUG" if CONFIG.debug else "INFO",
            "handlers": ["file", "console"],
        },
        # Example named logger that only writes to file:
        "loggers": {
            "smdb": {
                "level": "DEBUG" if CONFIG.debug else "INFO",
                "handlers": ["file"],
                "propagate": False,
            },
        },
    }

    logging.config.dictConfig(CONFIG.get("log-configs.standard", log_config))


def _format_stack(stack: str, err: Exception) -> str:
    return f"\n{stack}\n\nException: {err}"


def loggable(name: str = __name__) -> Callable:
    def decorator(func: Callable) -> Callable:
        def wrapper(*args, **kwargs):
            try:
                func(*args, **kwargs)
            except Exception as err:
                formatted_traceback = _format_stack(traceback.format_exc(), err)

                logging.getLogger(name).error(
                    formatted_traceback,
                    extra={"origFunc": func.__name__},
                )

        return wrapper

    return decorator
