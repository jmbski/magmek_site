from typing import Any, Dict
from pydantic import model_validator

from magmek_backend.models import MMBaseModel

ApiDict = Dict[Any, Any]
StrDict = Dict[str, str]


class AddMappingRequest(MMBaseModel):
    mapping: dict = {}
    key: str = ""
    value: str = ""


class SetMappingRequest(MMBaseModel):
    mapping: dict = {}


class RemMappingRequest(MMBaseModel):
    keys: list[str] = []


class UpdateIgnoredRequest(MMBaseModel):
    keys: list[str] = []


class CleanLogRequest(MMBaseModel):
    lines: list[str] = []
    event_category: str = ""
    title: str = ""


class UnmappedLinesRequest(MMBaseModel):
    lines: list[str] = []
