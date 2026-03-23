"""Backend service provider for FDIS Bridge Status web app"""

import io
import json
import os

import logging


from flask import Flask, Response, g, request, send_file, Request
from flask_cors import CORS
from jbutils import jbutils
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import consts, server_utils
from magmek_backend.cli import music
from magmek_backend.models import ServerResponse
from magmek_backend.logcleaner import appdata, parser


# TODO: Implement flask-restx, DAO, errors, and other pieces in a new standardized structure

API_URL = consts.BASE_URL + "/sl"


def get_app():

    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    CORS(app)  # This allows all origins, methods, and headers for all routes

    @app.before_request
    def before_request():
        logger = server_utils.get_logger()
        logger.info(f"ENDPOINT: {request.full_path}")
        logger.info(request.method)
        g.logger = logger

    @app.route(f"{API_URL}/health", methods=["GET"])
    def health() -> str:
        logger = server_utils.get_logger()
        logger.info("Health endpoint reached")
        data = server_utils.get_data(request)
        logger.info(data)
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"

    return app


def main():
    get_app().run(debug=True)


if __name__ == "__main__":
    main()
