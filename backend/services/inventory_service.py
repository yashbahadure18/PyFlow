from core.database import get_connection
from core.exceptions import ProductNotFoundError, DuplicateProductError
from models.product import Product
from utils.decorators import require_login, require_role, audit_log, AuthContext
from utils.logger import get_logger
import sqlite3

logger = get_logger(__name__)

@require_login
@require_role(['ADMIN', 'MANAGER'])
@audit_log("ADD_PRODUCT")
def add_product(product: Product):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO products (id, name, category, price, stock, min_stock) VALUES (?, ?, ?, ?, ?, ?)",
            (product.id, product.name, product.category, product.price, product.stock, product.min_stock)
        )
        conn.commit()
        logger.info(f"Product {product.name} ({product.id}) added.")
        return True
    except sqlite3.IntegrityError:
        raise DuplicateProductError(f"Product with ID {product.id} already exists.")
    finally:
        conn.close()

@require_login
def get_product(product_id: str) -> Product:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise ProductNotFoundError(f"Product {product_id} not found.")
        
    return Product(
        id=row['id'], name=row['name'], category=row['category'],
        price=row['price'], stock=row['stock'], min_stock=row['min_stock']
    )

@require_login
@require_role(['ADMIN', 'MANAGER'])
def update_stock(product_id: str, quantity_change: int, action: str = "MANUAL_UPDATE"):
    conn = get_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute("SELECT stock FROM products WHERE id = ?", (product_id,))
        row = cursor.fetchone()
        
        if not row:
            raise ProductNotFoundError(f"Product {product_id} not found.")
            
        previous_stock = row['stock']
        new_stock = previous_stock + quantity_change
        
        if new_stock < 0:
            raise ValueError(f"Stock cannot be negative for product {product_id}.")
            
        cursor.execute("UPDATE products SET stock = ? WHERE id = ?", (new_stock, product_id))
        
        # Record transaction
        user_id = AuthContext.current_user.id if AuthContext.current_user else None
        cursor.execute(
            "INSERT INTO transactions (user_id, product_id, action, quantity, previous_stock, new_stock) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, product_id, action, abs(quantity_change), previous_stock, new_stock)
        )
        
        conn.commit()
        logger.info(f"Stock for {product_id} updated from {previous_stock} to {new_stock}. Action: {action}")
        return True
    finally:
        conn.close()

@require_login
def get_all_products():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    rows = cursor.fetchall()
    conn.close()
    
    return [Product(
        id=r['id'], name=r['name'], category=r['category'],
        price=r['price'], stock=r['stock'], min_stock=r['min_stock']
    ) for r in rows]
