from dataclasses import dataclass
from typing import Optional

@dataclass
class Customer:
    name: str
    id: Optional[int] = None
    contact: Optional[str] = None
    email: Optional[str] = None
