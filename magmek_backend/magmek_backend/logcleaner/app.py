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


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)


def get_data(request: Request) -> dict:
    match request.method:
        case "GET":
            return dict(request.args)
        case _:
            return request.json


# TODO: Implement flask-restx, DAO, errors, and other pieces in a new standardized structure

API_URL = consts.BASE_URL + "/log-cleaner"


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

    @app.get(f"{API_URL}/char-mapping")
    def get_mapping():
        # return Response(json.dumps(consts.CHAR_MAPPING), status=200)
        return ServerResponse.to_flask(
            consts.CHAR_MAPPING, "Successfully retrieved character mapping"
        )

    @app.post(f"{API_URL}/char-mapping")
    def add_mapping():
        data = request.json

        mapping = data.get("mapping", {})
        key = data.get("key", "")
        value = data.get("value", "")

        if mapping:
            g.logger.info(f"adding mapping: {mapping}")
            appdata.add_char_mapping(mapping)
        elif key and value:
            appdata.add_char_mapping(key, value)
        else:
            return ServerResponse.req_type_error(
                data, "dict[str,str] | {key: str, value: str}"
            )

        return ServerResponse.to_flask(
            consts.CHAR_MAPPING, "mapping successfully updated"
        )

    @app.put(f"{API_URL}/char-mapping")
    def set_mapping():
        data = request.json

        mapping = data.get("mapping", {})

        if mapping:
            appdata.set_char_mapping(mapping)
        else:
            return ServerResponse.req_type_error(
                data, "dict[str,str] | {key: str, value: str}"
            )

        return ServerResponse.to_flask(mapping, "mapping successfully set")

    @app.delete(f"{API_URL}/char-mapping")
    def rem_mapping():

        data = get_data(request)
        keys = data.get("keys", [])
        if not isinstance(keys, (str, list)):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.rem_char_mapping(keys)

        return ServerResponse.to_flask(
            consts.CHAR_MAPPING, "Mappings successfully removed"
        )

    @app.get(f"{API_URL}/ignored")
    def get_ignored():
        return ServerResponse.to_flask(consts.IGNORED_CHARS)

    @app.post(f"{API_URL}/ignored")
    def add_ignored():
        data = get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.add_ignored(keys)

        return ServerResponse.to_flask(
            consts.IGNORED_CHARS, "Names successfully added to the ignored list"
        )

    @app.put(f"{API_URL}/ignored")
    def set_ignored():
        data = get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.set_ignored(keys)

        return ServerResponse.to_flask(
            consts.IGNORED_CHARS, "Names successfully added to the ignored list"
        )

    @app.delete(f"{API_URL}/ignored")
    def rem_ignored():
        data = get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.rem_ignored(keys)

        return ServerResponse.to_flask(
            consts.IGNORED_CHARS, "Names successfully removed from ignored list"
        )

    @app.post(f"{API_URL}/clean-log")
    def clean_log():
        data = request.json
        lines = data.get("lines", [])
        event_category = data.get("event_category", "")
        title = data.get("title", "")

        if not isinstance(lines, list):
            return ServerResponse.req_type_error(data, "list[str]")

        try:
            payload = parser.parse_log(lines, event_category, title)

            return ServerResponse.to_flask(payload)
        except Exception as e:
            return ServerResponse.error(e, endpoint=request.endpoint or clean_log)

    @app.post(f"{API_URL}/unmapped-names")
    def get_unmapped_names():
        data = request.json
        lines = data.get("lines", [])
        if not isinstance(lines, list):
            return ServerResponse.req_type_error(data, "list[str]")

        try:
            log_lines = parser.get_loglines(lines)
            names = parser.get_unknown_speakers(log_lines)

            return ServerResponse.to_flask(names)
        except Exception as e:
            return ServerResponse.error(e, endpoint=request.endpoint or clean_log)

    @app.get(f"{API_URL}/galleria-images")
    def get_galleria_imgs():
        images = [
            f"/galleria/{image}"
            for image in os.listdir(consts.GlobalConfig.galleria_path())
        ]
        return ServerResponse.to_flask(images)

    return app


def main():
    get_app().run(debug=True)


if __name__ == "__main__":
    main()
