import logging

from flask import Request


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)


def get_data(request: Request) -> dict:
    match request.method:
        case "GET":
            return dict(request.args)
        case _:
            return request.json
