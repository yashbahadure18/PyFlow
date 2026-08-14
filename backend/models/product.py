from dataclasses import dataclass
from typing import Optional

@dataclass
class Product:
    id: str
    name: str
    price: float
    stock: int = 0
    min_stock: int = 0
    category: Optional[str] = None
