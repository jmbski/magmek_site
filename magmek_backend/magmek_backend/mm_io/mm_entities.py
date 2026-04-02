from datetime import datetime
from uuid import uuid4
from sqlalchemy import (
    Column,
    String,
    Integer,
    BigInteger,
    Numeric,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship
from geoalchemy2 import Geometry


class MmBase(DeclarativeBase):
    pass


class UpdateServer(MmBase):
    __tablename__ = "update_server"

    id = Column(BigInteger, primary_key=True, default=uuid4)
    url = Column(String(256), nullable=False)
    product_name = Column(String(256), nullable=False)
