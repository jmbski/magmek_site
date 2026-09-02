from pathlib import Path

import platformdirs

from jbutils import JbuConsole
from ptpython import embed
from pydantic import BaseModel

from griffons_backend import calendar, api


def main() -> None:
    """Main function"""

    server = api.get_server()
    server.run()


if __name__ == "__main__":
    main()
