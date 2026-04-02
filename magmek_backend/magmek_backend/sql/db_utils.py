""" Common DB Utils """

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from magmek_backend.sql.db_types import DbConnection

# Use 'postgresql+psycopg2' or 'timescaledb' dialect
""" DATABASE_URL = "postgresql://magmek@localhost/sl_traffic"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) """


# Dependency for FastAPI endpoints
def db_conn_factory(db_url: str):
    engine = create_engine(db_url)
    session_local = sessionmaker()