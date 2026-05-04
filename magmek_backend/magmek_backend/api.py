""" """

from fastapi import FastAPI
from jbutils.api import api_utils

from magmek_backend import appdata, consts, server_utils
from magmek_backend.ag_api import ag_api_routes
from magmek_backend.logcleaner import lc_api_routes
from magmek_backend.sl_service import get_sl_app
from magmek_backend.sl_service.app import get_sl_app
from magmek_backend.models import GunicornApp

import argparse

from argcomplete import autocomplete


def build_api() -> FastAPI:
    router = lc_api_routes()
    app = FastAPI()
    app.include_router(router)

    """ @app.before_request
    def before_request():
        logger = server_utils.get_logger()
        logger.info(f"ENDPOINT: {request.full_path}")
        logger.info(request.method)
        logger.info(f"Headers: {dict(request.headers)}")
        g.logger = logger """
    """ 
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    ) """

    return app


def main() -> None:
    """parser = argparse.ArgumentParser()
    parser.add_argument(
        "--local", "-l", action="store_true", help="Run the server in local mode"
    )

    parser.add_argument(
        "--force-embed",
        "-f",
        action="store_true",
        help="If true, force embedding of default data",
    )

    autocomplete(parser)
    args = parser.parse_args()

    appdata.embed_base_data(args.force_embed)

    bind = "unix:/run/gunicorn/magmek_backend.sock"
    if args.local:
        consts.GlobalConfig.local = True
        bind = "127.0.0.1:7000"
        print(f"in local mode, bind: {bind}")

    options = {
        "bind": bind,
        "workers": 4,
        "worker_class": "gevent",
        "loglevel": "info",
        "keepalive": 10,
        "max_requests": 0,
        "preload_app": False,
        "umask": 0o007,
        "logger_class": "gunicorn.glogging.Logger",
    }"""

    server = api_utils.build_server(
        [
            lc_api_routes(),
            ag_api_routes(),
        ],
        port=7000,
    )

    server.run()


if __name__ == "__main__":
    main()
