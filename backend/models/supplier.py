from dataclasses import dataclass
from typing import Optional

@dataclass
class Supplier:
    name: str
    id: Optional[int] = None
    contact: Optional[str] = None
