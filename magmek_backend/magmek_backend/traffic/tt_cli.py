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

    test_data = Sim(
        sim_name="Test Sim 42",
        grid_name="Test Grid",
        sim_pos=SlVector(x=5, y=20, z=0),
    )

    test_ntt = DbSim(
        sim_name=test_data.sim_name,
        grid_name=test_data.grid_name,
        sim_pos=test_data.sim_pos,
    )

    db.add(test_ntt)

    try:
        JbuConsole.print(test_ntt)
    except Exception as e:
        print(e)
        print("oops!")

    db.close()
    return test_ntt


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
