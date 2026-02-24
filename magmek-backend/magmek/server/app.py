"""Backend service provider for FDIS Bridge Status web app"""

import json

import logging


from flask import Flask, Response, g, request
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek import consts

app = Flask(__name__)


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)


def get_app():

    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    CORS(app)  # This allows all origins, methods, and headers for all routes

    @app.before_request
    def before_request():
        logger = get_logger()
        logger.info(f"ENDPOINT: {request.full_path}")
        g.logger = logger

    @app.route(f"{consts.BASE_URL}/health", methods=["GET"])
    def health() -> str:
        logger = get_logger()
        logger.info("Health endpoint reached")
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"

    @app.route(
        f"{consts.BASE_URL}/clean-log",
        methods=["POST"],
    )
    def clean_log():
        return Response(json.dumps({"test": "test"}))

    return app


def main():
    get_app().run(debug=True)


if __name__ == "__main__":
    main()
