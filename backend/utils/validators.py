import re
from core.exceptions import InvalidQuantityError

def validate_email(email: str) -> bool:
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

def validate_positive_quantity(quantity: int) -> int:
    try:
        qty = int(quantity)
        if qty <= 0:
            raise InvalidQuantityError("Quantity must be a positive integer.")
        return qty
    except ValueError:
        raise InvalidQuantityError("Quantity must be an integer.")
