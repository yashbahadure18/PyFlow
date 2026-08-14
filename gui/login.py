import customtkinter as ctk
from tkinter import messagebox
from services.auth_service import authenticate_user
from core.exceptions import PyFlowError
from utils.decorators import AuthContext

class LoginFrame(ctk.CTkFrame):
    def __init__(self, parent, on_login_success):
        super().__init__(parent, fg_color="transparent")
        self.on_login_success = on_login_success
        
        self._build_ui()
        
    def _build_ui(self):
        # Center card
        card = ctk.CTkFrame(self, width=400, height=350, corner_radius=15)
        card.place(relx=0.5, rely=0.5, anchor="center")
        card.pack_propagate(False)
        
        # Title
        ctk.CTkLabel(card, text="PyFlow ERP", font=ctk.CTkFont(size=24, weight="bold")).pack(pady=(40, 30))
        
        # Username
        self.username_var = ctk.StringVar()
        ctk.CTkEntry(card, textvariable=self.username_var, placeholder_text="Username", width=250, height=40, font=("Helvetica", 14)).pack(pady=(0, 15))
        
        # Password
        self.password_var = ctk.StringVar()
        ctk.CTkEntry(card, textvariable=self.password_var, placeholder_text="Password", show="*", width=250, height=40, font=("Helvetica", 14)).pack(pady=(0, 30))
        
        # Login Button
        ctk.CTkButton(card, text="Login", command=self.handle_login, width=250, height=40, font=("Helvetica", 15, "bold"), corner_radius=8).pack()
        
    def handle_login(self):
        username = self.username_var.get()
        password = self.password_var.get()
        
        if not username or not password:
            messagebox.showerror("Error", "Please enter both username and password")
            return
            
        try:
            user = authenticate_user(username, password)
            if user:
                AuthContext.current_user = user
                self.on_login_success()
            else:
                messagebox.showerror("Error", "Invalid credentials")
        except PyFlowError as e:
            messagebox.showerror("Error", str(e))
