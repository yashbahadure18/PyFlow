from core.database import get_connection
from core.config import REPORTS_DIR
from utils.decorators import require_login, require_role
from datetime import datetime
import csv
import os

@require_login
@require_role(['ADMIN', 'MANAGER'])
def generate_inventory_report():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM products")
    products = cursor.fetchall()
    conn.close()
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = REPORTS_DIR / f"inventory_report_{timestamp}.csv"
    
    with open(filepath, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['ID', 'Name', 'Category', 'Price', 'Stock', 'Min Stock', 'Status'])
        
        for p in products:
            status = 'OUT OF STOCK' if p['stock'] == 0 else ('LOW STOCK' if p['stock'] <= p['min_stock'] else 'OK')
            writer.writerow([p['id'], p['name'], p['category'], p['price'], p['stock'], p['min_stock'], status])
            
    return filepath

@require_login
@require_role(['ADMIN', 'MANAGER'])
def generate_sales_report():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT o.id, o.order_date, o.total_amount, u.username, c.name as customer_name
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LEFT JOIN customers c ON o.customer_id = c.id
        ORDER BY o.order_date DESC
    ''')
    sales = cursor.fetchall()
    conn.close()
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filepath = REPORTS_DIR / f"sales_report_{timestamp}.csv"
    
    with open(filepath, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Order ID', 'Date', 'Amount', 'Processed By', 'Customer Name'])
        
        for s in sales:
            writer.writerow([s['id'], s['order_date'], s['total_amount'], s['username'], s['customer_name']])
            
    return filepath
