import re
import os
import socket

from pathlib import Path
from jbutils import jbutils, JbuConsole
from tqdm import tqdm

from magmek_backend import consts


def switch_playlist(name: str) -> None:
    with socket.create_connection(("127.0.0.1", 1234)) as s:
        s.sendall(f"playlist.set {name}\n".encode())

def ytdlp_cmd(url: str, out_path: str | Path):
    return (
        f"poetry run yt-dlp -x "
        "--audio-format wav "
        "--remote-components ejs:github "
        "--js-runtimes node "
        "--cookies-from-browser chrome "
        f'-o "{out_path}.%(ext)s" '
        f'"{url}"'
    )


def parse_playlist(filepath: str):
    lines: list[str] = jbutils.read_file(filepath, as_lines=True, cast=list)

    playlist_name = jbutils.strip_ext(filepath)
    playlist_dir = consts.PLAYLIST_OUTPUT_DIR / playlist_name
    JbuConsole.info(f"Creating playlist: {playlist_dir}")
    if not playlist_dir.exists():
        os.makedirs(playlist_dir, exist_ok=True)

    for line in tqdm(lines):
        url, name = line.split("|")
        ws_re = re.compile(r"(?:\.|\s|\-|_|\\|\/|\.|:)+")
        name = ws_re.sub("_", name)
        out_path = playlist_dir / name
        JbuConsole.info(f"Downloading: {name}")
        cmd = ytdlp_cmd(url, out_path)

        jbutils.cmdx(cmd)


def download_playlists():
    paths = jbutils.list_paths(consts.PLAYLIST_DIR, rtn_abs=True)
    for path in paths:
        parse_playlist(path)
