"""Runs the main code for the magmek python CLI tool"""

import argparse
import re
import sys

import shutil

from pathlib import Path

from argcomplete import autocomplete
from jbutils import jbutils, JbuConsole
from PIL import Image
from ptpython import embed

from magmek_backend import consts
from magmek_backend.models import LogLine, ServerResponse
from magmek_backend.images import img_utils
from magmek_backend.logcleaner import appdata, parser
from magmek_backend.cli import music


parser = argparse.ArgumentParser(description=__doc__)

parser.add_argument(
    "--interactive",
    "-i",
    action="store_true",
    help="Run the CLI in interactive mode",
)
parser.add_argument(
    "--local",
    "-l",
    action="store_true",
    help="Run command targeting the local repo instead of the webserver environment",
)
parser.add_argument(
    "--crop-galleria", "-g", action="store_true", help="Crop galleria images"
)
parser.add_argument(
    "--max-height", "-m", type=int, help="Set a height limiter for cropped images"
)
parser.add_argument(
    "--scale-imgs",
    "-s",
    action="store_true",
    help="If true, scale images down by half",
)
jbutils.add_common_args(parser, __file__)
autocomplete(parser)

args = parser.parse_args()


def copy_supervisor_configs() -> None:
    config = (
        "magmek.supervisord-local.conf" if args.local else "magmek.supervisord.conf"
    )

    conf_d_path = Path("/etc/supervisor/conf.d")
    src = consts.DEPLOY_DIR / config
    dst = conf_d_path / config

    if conf_d_path.exists():
        JbuConsole.print(f"Copying '{src}' to '{dst}'")
        shutil.copy2(src, dst)


def main() -> None:
    """Main function"""

    consts.GlobalConfig.local = args.local

    if args.crop_galleria:
        img_utils.crop_galleria(args.max_height, args.scale_imgs)
        return

    if args.interactive:
        sys.exit(
            embed(
                globals=globals(),
                locals=locals(),
                history_filename=str(
                    consts.DATA_DIR / f"{consts.APP_NAME}.cli.history"
                ),
            )
        )


if __name__ == "__main__":
    main()
