from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Use 'postgresql+psycopg2' or 'timescaledb' dialect
DATABASE_URL = "postgresql://magmek@localhost/sl_traffic"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency for FastAPI endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
