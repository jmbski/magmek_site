"""Common types shared among FastAPI implementations"""

import logging

from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from magmek_backend import consts
from magmek_backend.consts import DB_CONN_STRS
from magmek_backend.fast import api_utils
from magmek_backend.sql import DbConnection

Logger = Annotated[logging.Logger, Depends(api_utils.get_logger)]

TtConn = Annotated[
    Session, Depends(DbConnection.session_factory(DB_CONN_STRS.traffic))
]

CommonConn = Annotated[
    Session, Depends(DbConnection.session_factory(DB_CONN_STRS.common))
]
