class PyFlowError(Exception):
    """Base exception for PyFlow"""
    pass

class ProductNotFoundError(PyFlowError):
    pass

class InsufficientStockError(PyFlowError):
    pass

class UnauthorizedError(PyFlowError):
    pass

class InvalidQuantityError(PyFlowError):
    pass

class DuplicateProductError(PyFlowError):
    pass

class UserNotFoundError(PyFlowError):
    pass
