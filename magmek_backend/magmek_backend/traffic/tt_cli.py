import argparse
import sys
import uuid

from datetime import datetime, date

import argcomplete

from jbutils import jbutils, JbuConsole
from ptpython import embed
from sqlalchemy import select, desc

from magmek_backend.traffic.sql_conn import get_db, SessionLocal
from magmek_backend.traffic.tr_models import (
    Avatar,
    AvatarSnapshot,
    Sim,
    SimSnapshot,
    SlVector,
)
from magmek_backend.traffic.entities import (
    DbAvatar,
    DbAvatarSnapshot,
    DbSim,
    DbSimSnapshot,
)

DEF_START_DATE = datetime.fromtimestamp(1773979200)  # March 20 2026 00:00:00
DEF_END_DATE = datetime.fromtimestamp(1774584000)  # March 27 2026 00:00:00

parser = argparse.ArgumentParser()

parser.add_argument(
    "--interactive",
    "-i",
    action="store_true",
    help="Run CLI tool in interactive/REPL mode",
)

subparsers = parser.add_subparsers(dest="action")

data_parser = subparsers.add_parser("data-gen")

data_parser.add_argument(
    "--sim-name",
    "-n",
    default="FakeDataTestSim",
    help="Name of the sim to generate data for",
)
data_parser.add_argument("--start-date", "-s", default=DEF_START_DATE)
data_parser.add_argument("--end-date", "-e", default=DEF_END_DATE)
data_parser.add_argument(
    "--interval", "-I", type=int, default=60, help="Time interval to add data"
)

args = parser.parse_args()


def db_test():
    db = next(get_db())

    test = DbAvatar(
        id=uuid.uuid4(), name="Test Avatar Name", birth_date=date.today()
    )

    db.add(test)

    try:
        JbuConsole.print(test)
        JbuConsole.print(test.id)
    except Exception as e:
        print(e)
        print("oops!")

    db.close()
    return test


def main() -> None:
    """Main function"""

    if args.interactive:
        sys.exit(
            embed(
                globals=globals(), locals=locals(), history_filename="tt_cli.hist"
            )
        )


if __name__ == "__main__":
    main()
