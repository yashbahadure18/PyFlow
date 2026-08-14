from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

@dataclass
class OrderItem:
    product_id: str
    quantity: int
    price: float
    id: Optional[int] = None
    order_id: Optional[int] = None

@dataclass
class Order:
    customer_id: int
    user_id: int
    total_amount: float
    items: List[OrderItem] = field(default_factory=list)
    id: Optional[int] = None
    order_date: Optional[datetime] = None
