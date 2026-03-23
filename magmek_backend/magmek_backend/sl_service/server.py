""" """  # bsd_backend/services/web_server.py

from gevent import monkey

from magmek_backend.logcleaner import appdata

# done here to prevent conflicts with other packages like redis that are
# imported implicitly through the core package
monkey.patch_all()

import argparse
import gunicorn.glogging

from argcomplete import autocomplete


from magmek_backend import consts
from magmek_backend.sl_service.app import get_sl_app
from magmek_backend.models import GunicornApp

# logconfig_dict = CONFIG.get("log-configs.rramps")


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

    bind = "unix:/run/gunicorn/sl_api.sock"
    if args.local:
        consts.GlobalConfig.local = True
        bind = "127.0.0.1:6000"
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

    GunicornApp(get_sl_app(), options).run()


if __name__ == "__main__":
    main()
