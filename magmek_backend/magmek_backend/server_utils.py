import base64
import hashlib
import hmac
import json
import os
import secrets
import time
import logging

from flask import Request
from redis import Redis

from magmek_backend import consts
from magmek_backend.models import SlAuthInitPayload


def get_logger(name: str = "gunicorn.error") -> logging.Logger:
    return logging.getLogger(name)


def get_data(request: Request) -> dict:
    match request.method:
        case "GET":
            return dict(request.args)
        case _:
            return request.json


def b64url(data: bytes) -> str:
    """Return base64url without padding."""
    return base64.urlsafe_b64encode(data).decode("ascii").rstrip("=")


def canonical_string(p: SlAuthInitPayload) -> str:
    """Create a canonical string for signing/verifying."""
    # Keep this EXACTLY the same between LSL and Python.
    return f"{p.owner_key}|{p.object_key}|{p.ts}|{p.nonce}|{p.purpose}"


def verify_sig(p: SlAuthInitPayload) -> bool:
    """Verify the provided signature using HMAC-SHA256."""
    get_logger().info(f"Has shared secret: {consts.SL_SHARED_SECRET}")
    if not consts.SL_SHARED_SECRET:
        return False

    msg = canonical_string(p).encode("utf-8")
    mac = hmac.new(
        consts.SL_SHARED_SECRET.encode("utf-8"), msg, hashlib.sha256
    ).digest()
    expected = b64url(mac)

    # Use constant-time compare to avoid timing leaks.
    get_logger().info(f"Expected: {expected}, sig: {p.sig}")
    return hmac.compare_digest(expected, p.sig)


def reject_if_replay(owner_key: str, nonce: str) -> bool:
    """Return True if nonce was already used (replay)."""
    # Keyed by owner so two different users can reuse the same random nonce safely.
    key = f"sl:nonce:{owner_key}:{nonce}"
    # SETNX: only sets if not exists. If it already exists -> replay.
    was_set = consts.rdb.set(
        name=key, value="1", nx=True, ex=consts.NONCE_TTL_SECONDS
    )
    return was_set is None


def mint_login_code(owner_key: str, object_key: str, purpose: str) -> str:
    """Create a single-use login code stored in Redis with a short TTL."""
    code = secrets.token_urlsafe(32)  # ~256 bits
    key = f"sl:login_code:{code}"

    payload = {
        "owner_key": owner_key,
        "object_key": object_key,
        "purpose": purpose,
        "issued_at": int(time.time()),
        "used": False,
    }

    get_logger().info(f"Payload: {payload}")
    consts.rdb.set(
        name=key, value=json.dumps(payload), ex=consts.LOGIN_CODE_TTL_SECONDS
    )
    return code
