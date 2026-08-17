"""Runs the main code for the magmek python CLI tool"""

import argparse
import sys

import shutil

from pathlib import Path

from argcomplete import autocomplete
from jbutils import jbutils, JbuConsole
from ptpython import embed

from magmek_backend import consts
from magmek_backend.images import img_utils
from magmek_backend.logcleaner import parser
from magmek_backend.cli import music
from magmek_backend.errors import ApiErrTitles, ApiErrCodes, ApiErrTypes

GALLERIA_CMD = "galleria"
MUSIC_CMD = "music"

parser = argparse.ArgumentParser(description=__doc__)
subparsers = parser.add_subparsers(dest="action")
parser.add_argument(
    "--interactive",
    "-i",
    action="store_true",
    help="Run the CLI in interactive mode",
)

gal_parser = subparsers.add_parser(GALLERIA_CMD)

gal_parser.add_argument(
    "--local",
    "-l",
    action="store_true",
    help="Run command targeting the local repo instead of the webserver environment",
)
gal_parser.add_argument(
    "--crop-galleria", "-g", action="store_true", help="Crop galleria images"
)
gal_parser.add_argument(
    "--max-height", "-m", type=int, help="Set a height limiter for cropped images"
)
gal_parser.add_argument(
    "--scale-imgs",
    "-s",
    action="store_true",
    help="If true, scale images down by half",
)

music_parser = subparsers.add_parser(MUSIC_CMD)
music_parser.add_argument("--url", "-u", help="YouTube URL to grab audio from")
music_parser.add_argument(
    "--fname", "-f", help="Name of the output file, no extension included."
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


def dl_music():
    cmd = music.ytdlp_cmd(args.url, args.fname)
    JbuConsole.print(cmd)
    jbutils.cmdx(cmd)


def main() -> None:
    """Main function"""

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

    if args.action == GALLERIA_CMD:
        img_utils.crop_galleria(args.max_height, args.scale_imgs)
    elif args.action == MUSIC_CMD:
        dl_music()


if __name__ == "__main__":
    main()

lc_cols = [
    "name",
    "phonetic_inventory",
    "orthography_categories",
    "orth_syllables",
    "grapheme_lookup",
] 