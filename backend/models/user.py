from dataclasses import dataclass
from typing import Optional

@dataclass
class User:
    username: str
    role: str
    id: Optional[int] = None
