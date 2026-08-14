from core.database import get_connection
from core.exceptions import ProductNotFoundError, InsufficientStockError
from models.order import Order, OrderItem
from services.inventory_service import update_stock
from utils.decorators import require_login, require_role, audit_log, AuthContext
from utils.logger import get_logger
import sqlite3

logger = get_logger(__name__)

@require_login
@require_role(['ADMIN', 'MANAGER', 'EMPLOYEE'])
@audit_log("CREATE_ORDER")
def create_order(customer_id: int, items: list[dict]):
    """
    items should be a list of dictionaries: [{'product_id': 'P1', 'quantity': 2}, ...]
    """
    conn = get_connection()
    cursor = conn.cursor()
    
    total_amount = 0.0
    processed_items = []
    
    try:
        # Check stock and calculate total first (fail fast)
        for item in items:
            cursor.execute("SELECT price, stock, name FROM products WHERE id = ?", (item['product_id'],))
            row = cursor.fetchone()
            
            if not row:
                raise ProductNotFoundError(f"Product {item['product_id']} not found.")
                
            if row['stock'] < item['quantity']:
                raise InsufficientStockError(f"Not enough stock for {row['name']}. Available: {row['stock']}")
                
            price = row['price']
            total_amount += price * item['quantity']
            processed_items.append({
                'product_id': item['product_id'],
                'quantity': item['quantity'],
                'price': price
            })
        
        user_id = AuthContext.current_user.id if AuthContext.current_user else None
        
        # Create order record
        cursor.execute(
            "INSERT INTO orders (customer_id, user_id, total_amount) VALUES (?, ?, ?)",
            (customer_id, user_id, total_amount)
        )
        order_id = cursor.lastrowid
        
        # Process items and deduct stock
        for item in processed_items:
            cursor.execute(
                "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                (order_id, item['product_id'], item['quantity'], item['price'])
            )
            
            # Update stock in inventory
            update_stock(item['product_id'], -item['quantity'], action="SALE")
            
        conn.commit()
        logger.info(f"Order #{order_id} created successfully for total {total_amount}")
        return order_id
        
    except Exception as e:
        conn.rollback()
        logger.error(f"Failed to create order: {e}")
        raise e
    finally:
        conn.close()
