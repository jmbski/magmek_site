"""Backend service provider for FDIS Bridge Status web app"""

import io
import json
import os

import logging


from flask import Flask, Response, g, request, send_file, Request
from flask_cors import CORS
from jbutils import jbutils
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import appdata, consts, server_utils
from magmek_backend.cli import music
from magmek_backend.models import ServerResponse
from magmek_backend.logcleaner import parser


# TODO: Implement flask-restx, DAO, errors, and other pieces in a new standardized structure


def get_lc_app(app: Flask | None = None) -> Flask:
    api_url = consts.BASE_URL + "/log-cleaner"

    if app is None:
        app = Flask(__name__)
        app.wsgi_app = ProxyFix(
            app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )
        CORS(app)  # This allows all origins, methods, and headers for all routes

    @app.route(f"{api_url}/health", methods=["GET"])
    def lc_health() -> str:
        logger = server_utils.get_logger()
        logger.info("Health endpoint reached")
        data = server_utils.get_data(request)
        logger.info(data)
        # return json.dumps(CONFIG.get("test"), indent=2)
        return "Service working"

    @app.get(f"{api_url}/char-mapping")
    def get_mapping():
        # return Response(json.dumps(consts.CHAR_MAPPING), status=200)
        return ServerResponse.to_flask(
            consts.CHAR_MAPPING, "Successfully retrieved character mapping"
        )

    @app.post(f"{api_url}/char-mapping")
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

    @app.put(f"{api_url}/char-mapping")
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

    @app.delete(f"{api_url}/char-mapping")
    def rem_mapping():

        data = server_utils.get_data(request)
        keys = data.get("keys", [])
        if not isinstance(keys, (str, list)):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.rem_char_mapping(keys)

        return ServerResponse.to_flask(
            consts.CHAR_MAPPING, "Mappings successfully removed"
        )

    @app.get(f"{api_url}/ignored")
    def get_ignored():
        return ServerResponse.to_flask(consts.IGNORED_CHARS)

    @app.post(f"{api_url}/ignored")
    def add_ignored():
        data = server_utils.get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.add_ignored(keys)

        return ServerResponse.to_flask(
            consts.IGNORED_CHARS, "Names successfully added to the ignored list"
        )

    @app.put(f"{api_url}/ignored")
    def set_ignored():
        data = server_utils.get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.set_ignored(keys)

        return ServerResponse.to_flask(
            consts.IGNORED_CHARS, "Names successfully added to the ignored list"
        )

    @app.delete(f"{api_url}/ignored")
    def rem_ignored():
        data = server_utils.get_data(request)

        keys = data.get("keys")
        if not isinstance(keys, list):
            return ServerResponse.req_type_error(data, "list[str]")

        appdata.rem_ignored(keys)

        return ServerResponse.to_flask(
            consts.IGNORED_CHARS, "Names successfully removed from ignored list"
        )

    @app.post(f"{api_url}/clean-log")
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

    @app.post(f"{api_url}/unmapped-names")
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

    @app.get(f"{api_url}/galleria-images")
    def get_galleria_imgs():
        images = [
            f"/galleria/{image}"
            for image in os.listdir(consts.GlobalConfig.galleria_path())
        ]
        return ServerResponse.to_flask(images)

    @app.post(f"{api_url}/change-radio")
    def change_radio():
        data = request.json
        playlist = data.get("playlist")
        source = data.get("source", "tof")
        port = consts.PORT_MAPPINGS.get(source, 8007)

        if playlist:
            music.switch_playlist(playlist, port)
            return ServerResponse.to_flask(f"Switching to: {playlist}")

        return ServerResponse.error("No playlist provided")

    return app


def main():
    get_lc_app().run(debug=True)


if __name__ == "__main__":
    main()
