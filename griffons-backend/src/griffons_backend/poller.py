import argparse
import threading
import time


from argcomplete import autocomplete

from griffons_backend import calendar, logs, consts
from griffons_backend.database import conn


class DbPoller:

    def __init__(self, interval: float = 30) -> None:
        self.interval = interval
        conn.ensure_database()

    def run(self) -> None:

        def worker() -> None:
            while True:
                calendar.poll_calendar()
                print("Polled calendar API")
                time.sleep(self.interval)

        self.thread = threading.Thread(target=worker, daemon=True)
        self.thread.start()


def get_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)

    parser.add_argument(
        "--interval",
        "-i",
        type=float,
        default=30,
        help="Rate in seconds at which the poller will query the Calendar API and update the database.",
    )
    autocomplete(parser)
    return parser.parse_args()


def main() -> None:
    """Main function"""

    args = get_args()
    logs.setup_logging(consts.POLLER_APP_NAME)
    poller = DbPoller(args.interval)
    poller.run()
    stop_event = threading.Event()
    try:
        stop_event.wait()  # Block until killed
    except KeyboardInterrupt:
        print("Poller shutting down...")


if __name__ == "__main__":
    main()
