import os

from collections.abc import Generator
from contextlib import contextmanager
from pathlib import Path
from typing import Any

from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from griffons_backend import consts
from griffons_backend.database.entities import Base


def build_database_url(db_path: Path) -> str:
    """Build a SQLAlchemy SQLite URL.

    Args:
        db_path: Path to the SQLite database file.

    Returns:
        A SQLAlchemy connection URL for the database.
    """
    absolute_path = db_path.expanduser().resolve()

    return f"sqlite+pysqlite:///{absolute_path}"


def create_db_engine(db_path: Path) -> Engine:
    """Create the Griffons SQLAlchemy engine.

    Args:
        db_path: Path to the SQLite database file.

    Returns:
        A configured SQLAlchemy engine.
    """
    engine = create_engine(
        build_database_url(db_path),
    )

    _configure_sqlite(engine)

    return engine


def _configure_sqlite(engine: Engine) -> None:
    """Configure SQLite-specific connection behavior.

    Args:
        engine: SQLAlchemy engine to configure.
    """

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(
        dbapi_connection: Any,
        connection_record: Any,
    ) -> None:
        cursor = dbapi_connection.cursor()

        try:
            cursor.execute("PRAGMA foreign_keys = ON")
        finally:
            cursor.close()


def create_schema(engine: Engine) -> None:
    """Create any database tables that do not already exist.

    Args:
        engine: SQLAlchemy engine whose database should be initialized.
    """
    Base.metadata.create_all(engine)


def _get_database_path() -> Path:
    """Get and validate the configured database path.

    Returns:
        The configured SQLite database path.

    Raises:
        RuntimeError: If GRIFFONS_DB_PATH is not configured.
        ValueError: If the configured path points to a directory.
    """
    if not consts.GRIFFONS_DB_PATH:
        raise RuntimeError(
            "GRIFFONS_DB_PATH environment variable is not configured."
        )

    db_path = Path(consts.GRIFFONS_DB_PATH).expanduser().resolve()

    if db_path.exists() and not db_path.is_file():
        raise ValueError(f"GRIFFONS_DB_PATH does not reference a file: {db_path}")

    return db_path


DB_PATH = _get_database_path()

DB_PATH.parent.mkdir(
    parents=True,
    exist_ok=True,
)

ENGINE = create_db_engine(DB_PATH)

SessionFactory = sessionmaker(
    bind=ENGINE,
    class_=Session,
    expire_on_commit=False,
)


def ensure_database() -> None:
    """Ensure the Griffons database schema exists."""
    create_schema(ENGINE)


def rebuild_database() -> None:
    path = _get_database_path()
    os.remove(path)
    ensure_database()


@contextmanager
def get_db_session() -> Generator[Session]:
    """Provide a transactional SQLAlchemy session.

    Yields:
        A database session.

    Raises:
        Exception: Re-raises exceptions occurring during the transaction.
    """
    with SessionFactory.begin() as session:
        yield session

