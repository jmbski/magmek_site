"""Configurator for BSD Backend"""

from dataclasses import dataclass
from pathlib import Path
from typing import Any

import platformdirs

from jbutils import Configurator
from jbutils.types import DataPath

CFG_DIR = Path(platformdirs.user_config_dir("griffons-backend"))
CFG_DIR.mkdir(exist_ok=True, parents=True)


@dataclass
class GriffonsConfigurator(Configurator):

    def cfg_get(self, key: DataPath, default: Any = None) -> Any:
        if isinstance(key, str):
            key = f"config.{key}"
        elif isinstance(key, list):
            key = ["config"] + key
        return super().get(key, default)

    @property
    def debug(self) -> bool:
        return self.cfg_get("debug", False)

    @property
    def use_rich_handler(self) -> bool:
        return self.cfg_get("use_rich_handler", False)


CONFIG = GriffonsConfigurator(
    app_name="griffons-backend", cfg_dir=str(CFG_DIR.resolve()), author="magmek"
)
