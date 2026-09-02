from pathlib import Path

import platformdirs

from jbutils import JbuConsole
from ptpython import embed
from pydantic import BaseModel

from griffons_backend import consts, api, logs


def main() -> None:
    """Main function"""
    logs.setup_logging(consts.SERVER_APP_NAME)

    server = api.get_server()
    server.run()


if __name__ == "__main__":
    main()
