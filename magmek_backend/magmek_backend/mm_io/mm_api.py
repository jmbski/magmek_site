"""Base API for the magmek.io website"""

from fastapi import APIRouter, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from datetime import datetime, timezone

from magmek_backend import consts
from magmek_backend.fast import CommonConn, Logger
from magmek_backend.mm_io.mm_models import UpdateServerRequest
from magmek_backend.mm_io.mm_entities import UpdateServer


def get_mm_router() -> APIRouter:
    router = APIRouter()

    @router.post(f"{consts.BASE_URL}/update-server")
    def assign_update_server(
        body: UpdateServerRequest, db: CommonConn, logger: Logger
    ):
        query = (
            insert(UpdateServer)
            .values(
                product_name=body.product_name,
                url=body.http_in_url,
            )
            .on_conflict_do_update(
                set_={
                    "url": body.http_in_url,
                }
            )
            .returning(UpdateServer.url)
        )

        url = db.execute(query).scalar_one()

        return {
            "status": "success",
            "data": {"url": url, "product_name": body.product_name},
        }

    @router.get(f"{consts.BASE_URL}/update-server")
    def get_update_server(product_name: str | None, db: CommonConn, logger: Logger):

        if product_name:
            query = select(UpdateServer.url).where(
                UpdateServer.product_name == product_name
            )

            db_result = db.execute(query).scalar_one_or_none()

            # TODO: Make a standardized method of response handling
            return {"status": "success", "data": db_result}

        query = select(UpdateServer.product_name, UpdateServer.url).order_by(
            desc(UpdateServer.product_name)
        )

        db_result = db.execute(query).all()

        result = {}

        for row in db_result:
            prod, url = row.tuple()

            result[prod] = url

        return result

    return router
