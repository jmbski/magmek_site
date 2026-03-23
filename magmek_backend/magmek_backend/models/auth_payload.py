from dataclasses import dataclass


@dataclass(frozen=True)
class SlAuthInitPayload:
    """Parsed payload for the SL auth init request."""

    owner_key: str
    object_key: str
    ts: int
    nonce: str
    sig: str
    purpose: str = "hud"
