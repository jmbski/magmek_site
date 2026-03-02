import os

from pathlib import Path

from jbutils import jbutils

from magmek_backend import consts


def save_char_map():
    jbutils.write_file(consts.CHAR_MAP_PATH, consts.CHAR_MAPPING)


def add_char_mapping(key: str | dict[str, str], value: str = "") -> None:
    if isinstance(key, dict):
        consts.CHAR_MAPPING.update(key)
    else:
        if value:
            consts.CHAR_MAPPING[key] = value
    save_char_map()


def set_char_mapping(data: dict[str, str]) -> dict[str, str]:
    consts.CHAR_MAPPING = data
    save_char_map()
    return data


def rem_char_mapping(keys: str | list[str]) -> None:
    def rem_char(key: str):
        if key in consts.CHAR_MAPPING:
            del consts.CHAR_MAPPING

    if isinstance(keys, list):
        for key in keys:
            rem_char(key)
    else:
        rem_char(keys)

    save_char_map()


def get_char_map(additional: dict[str, str] | None = None) -> dict[str, str]:
    char_map = consts.CHAR_MAPPING.copy()
    if additional:
        char_map.update(additional)
    return char_map


def save_ignored():
    jbutils.write_file(consts.IGNORED_CHARS_PATH, consts.IGNORED_CHARS)


def set_ignored(names: list[str]) -> list[str]:
    consts.IGNORED_CHARS = names
    save_ignored()
    return names


def add_ignored(names: list[str]) -> None:
    for name in names:
        if name not in consts.IGNORED_CHARS:
            consts.IGNORED_CHARS.append(name)
    save_ignored()


def rem_ignored(names: list[str]) -> None:
    for name in names:
        if name in consts.IGNORED_CHARS:
            consts.IGNORED_CHARS.remove(name)
            save_ignored()


def get_ignored(additional: list[str] | None) -> list[str]:
    additional = additional or []
    return list(set(consts.IGNORED_CHARS + additional))


def init_data() -> None:
    consts.CHAR_MAPPING = jbutils.read_file(consts.CHAR_MAP_PATH, cast=dict)
    consts.IGNORED_CHARS = jbutils.read_file(consts.IGNORED_CHARS_PATH, cast=list)


def embed_base_data(force: bool = False) -> None:
    dir_path = Path(__file__).parent.parent / "deployment" / "base_data"
    map_path = dir_path / "character_mapping.yaml"
    ignored_path = dir_path / "ignored_characters.yaml"

    if map_path.exists() and (force or not consts.CHAR_MAP_PATH.exists()):
        char_map = jbutils.read_file(map_path)
        jbutils.write_file(consts.CHAR_MAP_PATH, char_map)

    if ignored_path.exists() and (force or not consts.IGNORED_CHARS_PATH.exists()):
        ignored = jbutils.read_file(ignored_path)
        jbutils.write_file(consts.IGNORED_CHARS_PATH, ignored)

    init_data()
