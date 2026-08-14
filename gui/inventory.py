import customtkinter as ctk
import tkinter as tk
from tkinter import ttk, messagebox
from services.inventory_service import get_all_products, add_product
from models.product import Product
from core.exceptions import PyFlowError

class InventoryFrame(ctk.CTkFrame):
    def __init__(self, parent):
        super().__init__(parent, fg_color="transparent")
        
        self.rowconfigure(1, weight=1)
        self.columnconfigure(0, weight=1)
        
        # Header
        header = ctk.CTkFrame(self, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", pady=(10, 10), padx=10)
        
        ctk.CTkLabel(header, text="Inventory Management", font=ctk.CTkFont(size=20, weight="bold")).pack(side="left")
        ctk.CTkButton(header, text="Refresh", command=self.load_data, width=100, height=32, corner_radius=6).pack(side="right", padx=10)
        ctk.CTkButton(header, text="+ Add Product", command=self.show_add_product_dialog, width=120, height=32, corner_radius=6, fg_color="#27AE60", hover_color="#1E8449").pack(side="right")
        
        self.style_treeview()
        
        # Table Frame
        table_frame = ctk.CTkFrame(self)
        table_frame.grid(row=1, column=0, sticky="nsew", padx=10, pady=(0, 10))
        table_frame.rowconfigure(0, weight=1)
        table_frame.columnconfigure(0, weight=1)
        
        columns = ("id", "name", "category", "price", "stock")
        self.tree = ttk.Treeview(table_frame, columns=columns, show="headings", style="Modern.Treeview")
        
        self.tree.heading("id", text="ID")
        self.tree.heading("name", text="Name")
        self.tree.heading("category", text="Category")
        self.tree.heading("price", text="Price")
        self.tree.heading("stock", text="Stock")
        
        self.tree.column("id", width=80)
        self.tree.column("name", width=200)
        self.tree.column("category", width=120)
        self.tree.column("price", width=80, anchor="e")
        self.tree.column("stock", width=80, anchor="e")
        
        self.tree.grid(row=0, column=0, sticky="nsew", padx=2, pady=2)
        
        # Scrollbar
        scrollbar = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)
        scrollbar.grid(row=0, column=1, sticky="ns")
        
        self.load_data()

    def style_treeview(self):
        # Apply a dark theme styling to the standard ttk Treeview to match CustomTkinter
        style = ttk.Style()
        style.theme_use("default")
        
        bg_color = "#2b2b2b"
        fg_color = "white"
        selected_bg = "#1f538d"
        
        style.configure("Modern.Treeview",
                        background=bg_color,
                        foreground=fg_color,
                        rowheight=30,
                        fieldbackground=bg_color,
                        borderwidth=0,
                        font=("Helvetica", 11))
                        
        style.map("Modern.Treeview", background=[("selected", selected_bg)])
        
        style.configure("Modern.Treeview.Heading",
                        background="#1f1f1f",
                        foreground=fg_color,
                        relief="flat",
                        font=("Helvetica", 12, "bold"))
                        
        style.map("Modern.Treeview.Heading", background=[("active", "#333333")])

    def load_data(self):
        for item in self.tree.get_children():
            self.tree.delete(item)
            
        try:
            products = get_all_products()
            for p in products:
                self.tree.insert("", "end", values=(p.id, p.name, p.category, f"${p.price:.2f}", p.stock))
        except PyFlowError as e:
            messagebox.showerror("Error", f"Failed to load products: {e}")
            
    def show_add_product_dialog(self):
        dialog = ctk.CTkToplevel(self)
        dialog.title("Add Product")
        dialog.geometry("350x400")
        dialog.transient(self.winfo_toplevel())
        dialog.grab_set()
        
        ctk.CTkLabel(dialog, text="New Product Details", font=ctk.CTkFont(size=18, weight="bold")).pack(pady=20)
        
        fields = [("ID", "id"), ("Name", "name"), ("Category", "cat"), ("Price", "price"), ("Stock", "stock"), ("Min Stock", "min")]
        entries = {}
        
        form_frame = ctk.CTkFrame(dialog, fg_color="transparent")
        form_frame.pack(fill="x", padx=20)
        
        for i, (label_text, key) in enumerate(fields):
            ctk.CTkLabel(form_frame, text=label_text).grid(row=i, column=0, pady=5, sticky="w")
            var = ctk.StringVar()
            ctk.CTkEntry(form_frame, textvariable=var, width=200).grid(row=i, column=1, padx=(10, 0), pady=5, sticky="e")
            entries[key] = var
            
        def save():
            try:
                p = Product(
                    id=entries["id"].get(),
                    name=entries["name"].get(),
                    category=entries["cat"].get(),
                    price=float(entries["price"].get()),
                    stock=int(entries["stock"].get()),
                    min_stock=int(entries["min"].get())
                )
                add_product(p)
                self.load_data()
                dialog.destroy()
                messagebox.showinfo("Success", "Product added successfully")
            except ValueError:
                messagebox.showerror("Error", "Price and Stock must be numbers")
            except PyFlowError as e:
                messagebox.showerror("Error", str(e))
                
        ctk.CTkButton(dialog, text="Save Product", command=save, corner_radius=8, width=200).pack(pady=25)
