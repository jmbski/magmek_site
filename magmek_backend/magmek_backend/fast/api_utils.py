import logging


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)
