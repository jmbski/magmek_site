"""Backend service provider for FDIS Bridge Status web app"""

import io
import json
import os

import logging


from flask import Flask, Response, g, request, send_file, Request
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import consts
from magmek_backend.models import ServerResponse
from magmek_backend.logcleaner import appdata, parser
511674
506413
506477


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)


def get_data(request: Request) -> dict:
    match request.method:
        case "GET":
            return dict(request.args)
        case _:
            return request.json


# TODO: Implement flask-restx, DAO, errors, and other pieces in a new standardized structure

API_URL = consts.BASE_URL + "/sl-api"


def get_app():

    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    CORS(app)  # This allows all origins, methods, and headers for all routes

    @app.before_request
    def before_request():
        logger = get_logger()
        logger.info(f"ENDPOINT: {request.full_path}")
        logger.info(request.method)
        g.logger = logger

    @app.route(f"{API_URL}/health", methods=["GET"])
    def health() -> str:
        logger = get_logger()
        logger.info("Health endpoint reached")
        data = get_data(request)
        logger.info(data)
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"
    return app



def main():
    get_app().run(debug=True)


if __name__ == "__main__":
    main()
