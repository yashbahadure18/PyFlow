import hashlib
import os

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    """Hash a password using SHA-256 with a salt."""
    if salt is None:
        salt = os.urandom(16).hex()
    
    hash_obj = hashlib.sha256((salt + password).encode())
    return hash_obj.hexdigest(), salt

def verify_password(stored_hash: str, salt: str, provided_password: str) -> bool:
    """Verify a provided password against the stored hash and salt."""
    hash_obj = hashlib.sha256((salt + provided_password).encode())
    return hash_obj.hexdigest() == stored_hash
