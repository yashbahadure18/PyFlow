import sys
from core.database import init_db
from services.auth_service import authenticate_user, create_user
from services.inventory_service import add_product, get_all_products
from services.report_service import generate_inventory_report, generate_sales_report
from models.product import Product
from utils.decorators import AuthContext
from utils.logger import get_logger
from core.exceptions import PyFlowError

logger = get_logger(__name__)

def print_menu(role):
    print("\n--- PyFlow Menu ---")
    if role in ['ADMIN', 'MANAGER']:
        print("1. Add Product")
        print("2. View All Products")
        print("3. Generate Inventory Report")
        print("4. Generate Sales Report")
    if role in ['ADMIN']:
        print("5. Create User")
    print("0. Logout/Exit")

def main():
    print("Welcome to PyFlow ERP")
    init_db()
    
    # Auto-create default admin if not exists
    create_user("admin", "admin123", "ADMIN")
    
    while True:
        print("\n--- Login ---")
        username = input("Username: ")
        password = input("Password: ")
        
        try:
            user = authenticate_user(username, password)
            if user:
                AuthContext.current_user = user
                print(f"Login successful! Welcome, {user.username} ({user.role})")
                
                while True:
                    print_menu(user.role)
                    choice = input("Enter choice: ")
                    
                    try:
                        if choice == '1' and user.role in ['ADMIN', 'MANAGER']:
                            p_id = input("Product ID: ")
                            name = input("Name: ")
                            cat = input("Category: ")
                            price = float(input("Price: "))
                            stock = int(input("Stock: "))
                            min_stock = int(input("Min Stock: "))
                            
                            p = Product(id=p_id, name=name, price=price, stock=stock, min_stock=min_stock, category=cat)
                            add_product(p)
                            print("Product added successfully.")
                            
                        elif choice == '2' and user.role in ['ADMIN', 'MANAGER']:
                            products = get_all_products()
                            print("\n--- Inventory ---")
                            for p in products:
                                print(f"{p.id} - {p.name} | Stock: {p.stock} | Price: {p.price}")
                                
                        elif choice == '3' and user.role in ['ADMIN', 'MANAGER']:
                            filepath = generate_inventory_report()
                            print(f"Inventory report saved to {filepath}")
                            
                        elif choice == '4' and user.role in ['ADMIN', 'MANAGER']:
                            filepath = generate_sales_report()
                            print(f"Sales report saved to {filepath}")
                            
                        elif choice == '5' and user.role == 'ADMIN':
                            u_name = input("New Username: ")
                            pwd = input("Password: ")
                            r = input("Role (ADMIN/MANAGER/EMPLOYEE): ").upper()
                            create_user(u_name, pwd, r)
                            print("User created successfully.")
                            
                        elif choice == '0':
                            print("Logging out...")
                            AuthContext.current_user = None
                            sys.exit(0)
                        else:
                            print("Invalid choice or unauthorized.")
                            
                    except PyFlowError as e:
                        print(f"Error: {e}")
                    except ValueError:
                        print("Invalid input. Please try again.")
            else:
                print("Invalid credentials.")
        except PyFlowError as e:
            print(f"Login failed: {e}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting PyFlow...")
        sys.exit(0)
