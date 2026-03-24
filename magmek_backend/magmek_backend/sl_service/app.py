"""Backend service provider for FDIS Bridge Status web app"""

import io
import json
import os


from flask import Flask, Response, g, request, send_file, Request
from flask_cors import CORS
from jbutils import jbutils
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import consts, server_utils
from magmek_backend.models import ServerResponse
from magmek_backend.sl_service.auth import get_auth_api


# TODO: Implement flask-restx, DAO, errors, and other pieces in a new standardized structure


def get_sl_app(app: Flask | None = None):

    api_url = consts.BASE_URL + "/sl"

    if app is None:
        app = Flask(__name__)
        app.wsgi_app = ProxyFix(
            app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )
        CORS(app)  # This allows all origins, methods, and headers for all routes


    @app.route(f"{api_url}/health", methods=["GET"])
    def sl_health() -> str:
        logger = server_utils.get_logger()
        logger.info("Health endpoint reached")
        data = server_utils.get_data(request)
        logger.info(data)
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"

    app = get_auth_api(app)
    return app


def main():
    get_sl_app().run(debug=True)


if __name__ == "__main__":
    main()
