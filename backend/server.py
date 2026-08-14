from flask import Flask, request, jsonify
from flask_cors import CORS
from core.database import init_db, get_connection
from services.auth_service import authenticate_user, create_user
from services.inventory_service import get_all_products, add_product
from services.sales_service import create_order
from models.product import Product
from utils.decorators import AuthContext
import sqlite3

app = Flask(__name__)
CORS(app) # Allow cross-origin for React

@app.route('/api/init', methods=['POST'])
def init_system():
    init_db()
    create_user("admin", "admin123", "ADMIN")
    return jsonify({"message": "System initialized"})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:
        user = authenticate_user(username, password)
        if user:
            return jsonify({
                "success": True, 
                "user": {"id": user.id, "username": user.username, "role": user.role}
            })
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        AuthContext.current_user = type('obj', (object,), {'id': 1, 'username': 'api', 'role': 'ADMIN'})
        products = get_all_products()
        product_list = [
            {"id": p.id, "name": p.name, "category": p.category, "price": p.price, "stock": p.stock}
            for p in products
        ]
        return jsonify({"success": True, "products": product_list})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/products', methods=['POST'])
def create_product():
    try:
        AuthContext.current_user = type('obj', (object,), {'id': 1, 'username': 'api', 'role': 'ADMIN'})
        data = request.json
        p = Product(
            id=data['id'],
            name=data['name'],
            category=data.get('category'),
            price=float(data['price']),
            stock=int(data.get('stock', 0)),
            min_stock=int(data.get('min_stock', 0))
        )
        add_product(p)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/orders', methods=['POST'])
def place_order():
    try:
        AuthContext.current_user = type('obj', (object,), {'id': 1, 'username': 'api', 'role': 'ADMIN'})
        data = request.json
        items = data.get('items', [])
        
        # Ensure a default walk-in customer exists
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT OR IGNORE INTO customers (id, name, contact, email) VALUES (1, 'Walk-in Customer', '-', '-')")
        conn.commit()
        conn.close()
        
        order_id = create_order(customer_id=1, items=items)
        return jsonify({"success": True, "order_id": order_id})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/api/reports/sales', methods=['GET'])
def get_sales_report():
    try:
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
        
        sales_list = [{
            "id": s['id'],
            "date": s['order_date'],
            "amount": s['total_amount'],
            "processed_by": s['username'],
            "customer": s['customer_name'] or "Walk-in"
        } for s in sales]
        
        return jsonify({"success": True, "sales": sales_list})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

if __name__ == '__main__':
    init_db()
    create_user("admin", "admin123", "ADMIN")
    app.run(debug=True, port=5000)
