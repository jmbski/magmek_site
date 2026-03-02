"""Backend service provider for FDIS Bridge Status web app"""

import io
import json

import logging


from flask import Flask, Response, g, request, send_file, Request
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import consts, appdata, parser

app = Flask(__name__)


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)


def get_data(request: Request) -> dict:
    match request.method:
        case "GET":
            return dict(request.args)
        case _:
            return request.json


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

    @app.route(f"{consts.BASE_URL}/health", methods=["GET"])
    def health() -> str:
        logger = get_logger()
        logger.info("Health endpoint reached")
        data = get_data(request)
        logger.info(data)
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"

    @app.get(f"{consts.BASE_URL}/char-mapping")
    def get_mapping():
        return Response(json.dumps(consts.CHAR_MAPPING), status=200)

    @app.post(f"{consts.BASE_URL}/char-mapping")
    def add_mapping():
        data = request.json

        mapping = data.get("mapping", {})
        key = data.get("key", "")
        value = data.get("value", "")

        if mapping:
            appdata.set_char_mapping(mapping)
        elif key and value:
            appdata.add_char_mapping(key, value)
        else:
            return Response(
                json.dumps({"error": "Invalid update data provided", "data": data}),
                status=500,
            )
        return Response(
            json.dumps(
                {"message": "mapping successfully updated", "payload": mapping}
            ),
            status=200,
        )

    @app.delete(f"{consts.BASE_URL}/char-mapping")
    def rem_mapping():

        data = get_data(request)
        keys = data.get("keys")
        if not isinstance(keys, (str, list)):
            return Response(
                json.dumps({"messsage": "Error: invalid data provided"}), status=500
            )

        appdata.rem_char_mapping(keys)

        return Response(
            json.dumps({"message": "Mappings successfully removed"}), status=200
        )

    @app.get(f"{consts.BASE_URL}/ignored")
    def get_ignored():
        return Response(json.dumps(consts.IGNORED_CHARS), status=200)

    @app.post(f"{consts.BASE_URL}/ignored")
    def add_ignored():
        data = get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return Response(
                json.dumps(
                    {"messsage": "Error: invalid data provided", "payload": keys}
                ),
                status=500,
            )

        appdata.set_ignored(keys)

        return Response(
            json.dumps({"message": "Names successfully added to the ignored list"}),
            status=200,
        )

    @app.delete(f"{consts.BASE_URL}/ignored")
    def rem_ignored():
        data = get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return Response(
                json.dumps({"messsage": "Error: invalid data provided"}), status=500
            )

        appdata.rem_ignored(keys)

        return Response(
            json.dumps({"message": "Names successfully removed from ignored list"}),
            status=200,
        )

    @app.post(f"{consts.BASE_URL}/clean-log")
    def clean_log():
        data = request.json
        lines = data.get("lines", [])
        cleaned_text, new_speakers = parser.parse_log(lines)

        return Response(
            json.dumps({"payload": {"text": cleaned_text, "names": new_speakers}}),
            status=200,
        )

    return app


def main():
    get_app().run(debug=True)


if __name__ == "__main__":
    main()
