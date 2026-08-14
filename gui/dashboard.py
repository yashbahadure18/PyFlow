import customtkinter as ctk
from tkinter import messagebox
from utils.decorators import AuthContext
from gui.inventory import InventoryFrame
from services.report_service import generate_inventory_report, generate_sales_report
from core.exceptions import PyFlowError

class DashboardFrame(ctk.CTkFrame):
    def __init__(self, parent, on_logout):
        super().__init__(parent, fg_color="transparent")
        self.on_logout = on_logout
        
        # Setup grid layout
        self.rowconfigure(0, weight=1)
        self.columnconfigure(1, weight=1)
        
        self._build_sidebar()
        
        # Content Area
        self.content_frame = ctk.CTkFrame(self, corner_radius=10)
        self.content_frame.grid(row=0, column=1, sticky="nsew", padx=(10, 20), pady=20)
        
        self._show_welcome()

    def _build_sidebar(self):
        sidebar = ctk.CTkFrame(self, width=200, corner_radius=0)
        sidebar.grid(row=0, column=0, sticky="nsew")
        sidebar.grid_propagate(False)
        
        # Header
        user = AuthContext.current_user
        ctk.CTkLabel(sidebar, text="PyFlow ERP", font=ctk.CTkFont(size=20, weight="bold")).pack(pady=(20, 5))
        ctk.CTkLabel(sidebar, text=f"Welcome, {user.username}", font=ctk.CTkFont(size=14)).pack(pady=(0, 2))
        ctk.CTkLabel(sidebar, text=f"Role: {user.role}", font=ctk.CTkFont(size=12), text_color="gray").pack(pady=(0, 30))
        
        # Navigation Buttons
        btn_kwargs = {"width": 180, "height": 40, "corner_radius": 8, "anchor": "w", "font": ctk.CTkFont(size=14)}
        
        if user.role in ['ADMIN', 'MANAGER']:
            ctk.CTkButton(sidebar, text="  Inventory", command=self.show_inventory, **btn_kwargs).pack(pady=5)
            ctk.CTkButton(sidebar, text="  Sales Report", command=self.run_sales_report, **btn_kwargs).pack(pady=5)
            ctk.CTkButton(sidebar, text="  Inv. Report", command=self.run_inventory_report, **btn_kwargs).pack(pady=5)
            
        # Logout at bottom
        ctk.CTkButton(sidebar, text="  Logout", command=self.logout, fg_color="#C0392B", hover_color="#922B21", **btn_kwargs).pack(side="bottom", pady=20)

    def clear_content(self):
        for widget in self.content_frame.winfo_children():
            widget.destroy()

    def _show_welcome(self):
        self.clear_content()
        ctk.CTkLabel(self.content_frame, text="Select an option from the sidebar to begin.", font=ctk.CTkFont(size=16)).place(relx=0.5, rely=0.5, anchor="center")
        
    def show_inventory(self):
        self.clear_content()
        InventoryFrame(self.content_frame).pack(expand=True, fill="both")
        
    def run_sales_report(self):
        try:
            filepath = generate_sales_report()
            messagebox.showinfo("Success", f"Sales report generated at:\n{filepath}")
        except PyFlowError as e:
            messagebox.showerror("Error", str(e))
            
    def run_inventory_report(self):
        try:
            filepath = generate_inventory_report()
            messagebox.showinfo("Success", f"Inventory report generated at:\n{filepath}")
        except PyFlowError as e:
            messagebox.showerror("Error", str(e))
            
    def logout(self):
        AuthContext.current_user = None
        self.on_logout()
