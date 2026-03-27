from geoalchemy2.elements import WKTElement

from magmek_backend.traffic.tr_models import SlVector


def to_wkt(vector: SlVector, has_z=False):
    if has_z:
        return WKTElement(f"POINT({vector.x} {vector.y} {vector.z})", srid=0)
    return WKTElement(f"POINT({vector.x} {vector.y})", srid=0)
