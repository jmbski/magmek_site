"""Main server entrypoint for the MagMek common web server"""

from magmek_backend.fast import build_server
from magmek_backend.mm_io.mm_api import get_mm_router


def main() -> None:
    """Main function"""

    server = build_server([get_mm_router()], port=8050, socket="magmek-io")

    server.run()


if __name__ == "__main__":
    main()
