"""Utility functions for handling images"""

import os

from pathlib import Path

from jbutils import jbutils, JbuConsole, RuntimeGlobals
from PIL import Image
from tqdm import tqdm

from magmek_backend import consts


def clear_galleria() -> None:
    gal_dir = consts.GlobalConfig.galleria_path()
    JbuConsole.print(f"Clearing '{gal_dir}'")
    if not gal_dir.exists():
        raise FileExistsError(f"Path: '{gal_dir}' does not exist")

    for path in tqdm(jbutils.list_paths(gal_dir, rtn_abs=True)):
        JbuConsole.info(f"Removing: `{path}`")
        os.remove(path)


def crop_galleria(max_height: int | None = None, scale_imgs: bool = False):
    paths = jbutils.list_paths(consts.GALLERIA_DIR, rtn_abs=True)

    imgs = [Image.open(path) for path in paths]

    min_height = min(img.height for img in imgs)
    max_height = max_height or min_height
    min_height = min(max_height, min_height)

    min_width = min(img.width for img in imgs)
    h_split = int(min_height / 2)
    w_split = int(min_width / 2)

    clear_galleria()

    JbuConsole.print("Cropping images")
    for img in imgs:
        mid_h = img.height / 2
        mid_w = img.width / 2

        top = mid_h - h_split
        bottom = mid_h + h_split
        left = mid_w - w_split
        right = mid_w + w_split

        new_img = img.crop((left, top, right, bottom))
        if scale_imgs:
            new_img = new_img.resize(
                (int(new_img.width / 2), int(new_img.height / 2))
            )

        path = consts.GlobalConfig.galleria_path() / os.path.basename(
            str(img.filename)
        )

        JbuConsole.info(f"Writing: '{path}'")
        new_img.save(path)
