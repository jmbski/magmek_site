"""Common types for database connections and interactions"""

from dataclasses import dataclass, field
from typing import Self

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker


@dataclass
class DbConnection:
    db_url: str

    def __post_init__(self) -> None:
        self.engine: Engine = create_engine(self.db_url)
        self.session_local: sessionmaker[Session] = sessionmaker(
            autocommit=False, autoflush=False, bind=self.engine
        )
        self.session: Session = self.session_local()

    def get_session(self):
        try:
            yield self.session
        finally:
            self.session.close()

    @classmethod
    def session_factory(cls, db_url: str):
        conn = cls(db_url)
        return conn.get_session
