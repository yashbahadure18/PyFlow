from dataclasses import dataclass
from typing import Optional
from datetime import datetime

@dataclass
class Transaction:
    user_id: int
    product_id: str
    action: str
    quantity: int
    previous_stock: int
    new_stock: int
    id: Optional[int] = None
    timestamp: Optional[datetime] = None
