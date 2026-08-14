import sqlite3
from core.database import get_connection
from core.security import hash_password, verify_password
from core.exceptions import UserNotFoundError
from models.user import User
from utils.logger import get_logger

logger = get_logger(__name__)

def create_user(username, password, role):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        password_hash, salt = hash_password(password)
        
        cursor.execute(
            "INSERT INTO users (username, password_hash, salt, role) VALUES (?, ?, ?, ?)",
            (username, password_hash, salt, role)
        )
        conn.commit()
        logger.info(f"User {username} created successfully with role {role}.")
        return True
    except sqlite3.IntegrityError:
        logger.error(f"Failed to create user: {username} already exists.")
        return False
    finally:
        conn.close()

def authenticate_user(username, password):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise UserNotFoundError("User not found.")
        
    if verify_password(row['password_hash'], row['salt'], password):
        logger.info(f"User {username} authenticated successfully.")
        return User(id=row['id'], username=row['username'], role=row['role'])
    
    return None
