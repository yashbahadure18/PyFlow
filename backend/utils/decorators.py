from functools import wraps
from core.exceptions import UnauthorizedError
from utils.logger import get_logger
from core.database import get_connection

logger = get_logger(__name__)

# Context placeholder for currently logged-in user
class AuthContext:
    current_user = None

def require_login(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not AuthContext.current_user:
            raise UnauthorizedError("You must be logged in to perform this action.")
        return func(*args, **kwargs)
    return wrapper

def require_role(roles):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            user = AuthContext.current_user
            if not user or user.role not in roles:
                raise UnauthorizedError(f"You do not have permission. Required roles: {roles}")
            return func(*args, **kwargs)
        return wrapper
    return decorator

def audit_log(action_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            user = AuthContext.current_user
            
            if user:
                try:
                    conn = get_connection()
                    cursor = conn.cursor()
                    cursor.execute(
                        "INSERT INTO audit_logs (user_id, action, details) VALUES (?, ?, ?)",
                        (user.id, action_name, f"Function {func.__name__} executed successfully")
                    )
                    conn.commit()
                    conn.close()
                except Exception as e:
                    logger.error(f"Failed to save audit log: {e}")
            
            return result
        return wrapper
    return decorator
