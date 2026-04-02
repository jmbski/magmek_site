from pydantic import BaseModel


class UpdateServerRequest(BaseModel):
    http_in_url: str
    product_name: str
