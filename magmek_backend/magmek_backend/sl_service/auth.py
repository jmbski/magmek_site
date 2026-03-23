import base64
import hashlib
import hmac
import json
import logging
import os
import secrets
import time
from dataclasses import dataclass

import redis
from flask import Flask, Response, redirect, request, session
from flask_cors import CORS
from jbutils import jbutils
from redis import Redis
from werkzeug.middleware.proxy_fix import ProxyFix

from magmek_backend import consts, server_utils
from magmek_backend.models import SlAuthInitPayload


def get_auth_api(app: Flask | None = None) -> Flask:
    if app is None:
        app = Flask(__name__)
        app.wsgi_app = ProxyFix(
            app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1
        )
        CORS(app)  # This allows all origins, methods, and headers for all routes

    api_url = consts.BASE_URL + "/auth"
    # Flask session signing key (browser session cookie).
    # In prod: set this to a long random value via env var.
    app.secret_key = os.environ.get("FLASK_SECRET_KEY", "dev-only-change-me")

    @app.post(f"{api_url}/init")
    def sl_auth_init() -> Response:
        """HUD -> server handshake to mint a one-time login code.

        Expected JSON:
        {
            "owner_key": "<uuid>",
            "object_key": "<uuid>",
            "ts": 1730000000,
            "nonce": "<random>",
            "sig": "<base64url(hmac_sha256)>",
            "purpose": "hud"
        }
        """
        data = request.get_json(silent=True) or {}

        try:
            p = SlAuthInitPayload(
                owner_key=str(data["owner_key"]),
                object_key=str(data["object_key"]),
                ts=int(data["ts"]),
                nonce=str(data["nonce"]),
                sig=str(data["sig"]),
                purpose=str(data.get("purpose", "hud")),
            )
        except (KeyError, ValueError, TypeError):
            return Response("bad request", 400)

        now = int(time.time())
        if abs(now - p.ts) > consts.AUTH_TS_SKEW_SECONDS:
            return Response("timestamp out of range", 401)

        if server_utils.reject_if_replay(p.owner_key, p.nonce):
            return Response("replay detected", 401)

        server_utils.get_logger().info("Checking signature")
        if not server_utils.verify_sig(p):
            return Response("invalid signature", 401)

        login_code = server_utils.mint_login_code(
            p.owner_key, p.object_key, p.purpose
        )
        server_utils.get_logger().info(f"Code: {login_code}")
        resp = {
            "login_code": login_code,
            "expires_in": consts.LOGIN_CODE_TTL_SECONDS,
        }
        return Response(json.dumps(resp), 200, mimetype="application/json")

    @app.get(f"{api_url}/hud")
    def hud_consume() -> Response:
        """Browser (media prim) consumes a one-time code and gets a normal session."""
        code = request.args.get("code", "").strip()
        if not code:
            return Response("missing code", 400)

        key = f"sl:login_code:{code}"
        raw = consts.rdb.get(key)
        if not raw:
            return Response("invalid or expired code", 401)

        payload = json.loads(raw)  # type: ignore

        # Single-use enforcement: atomic enough for most cases, but if you want strict,
        # use a Lua script. This is usually fine given short TTL + low contention.
        if payload.get("used") is True:
            return Response("code already used", 401)

        payload["used"] = True
        consts.rdb.set(
            name=key, value=json.dumps(payload), ex=consts.LOGIN_CODE_TTL_SECONDS
        )

        # Create a normal web session for Angular/API calls.
        session["sl_owner_key"] = payload["owner_key"]
        session["sl_object_key"] = payload["object_key"]
        session["sl_purpose"] = payload.get("purpose", "hud")
        session["authenticated_at"] = int(time.time())

        # Redirect to your actual app route (Angular entry point).
        return redirect("https://www.aetherglow-rpg.com/hud/")  # type: ignore

    @app.get(f"{api_url}/me")
    def me() -> Response:
        """Example authenticated endpoint for the web app."""
        owner_key = session.get("sl_owner_key")
        if not owner_key:
            return Response("not authenticated", 401)

        resp = {
            "owner_key": owner_key,
            "object_key": session.get("sl_object_key"),
            "purpose": session.get("sl_purpose"),
            "authenticated_at": session.get("authenticated_at"),
        }
        return Response(json.dumps(resp), 200, mimetype="application/json")

    return app
