""" """

from gevent import monkey

from magmek_backend.logcleaner import appdata

# done here to prevent conflicts with other packages like redis that are
# imported implicitly through the core package
monkey.patch_all()


from flask import Flask, request, g
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import consts, server_utils
from magmek_backend.logcleaner import get_lc_app
from magmek_backend.sl_service import get_sl_app
from magmek_backend.sl_service.app import get_sl_app
from magmek_backend.models import GunicornApp

import argparse

from argcomplete import autocomplete


def build_api() -> Flask:
    app = Flask(__name__)
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)
    CORS(app)  # This allows all origins, methods, and headers for all routes

    @app.before_request
    def before_request():
        logger = server_utils.get_logger()
        logger.info(f"ENDPOINT: {request.full_path}")
        logger.info(request.method)
        logger.info(f"Headers: {dict(request.headers)}")
        g.logger = logger

    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
    )
    app = get_lc_app(app)
    app = get_sl_app(app)

    return app


def main() -> None:
    parser = argparse.ArgumentParser()
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
    }

    GunicornApp(build_api(), options).run()


if __name__ == "__main__":
    main()
