import customtkinter as ctk
from core.database import init_db
from services.auth_service import create_user
from gui.login import LoginFrame
from gui.dashboard import DashboardFrame

class PyFlowApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Set theme and color
        ctk.set_appearance_mode("dark")
        ctk.set_default_color_theme("blue")
        
        self.title("PyFlow ERP - Modern Edition")
        self.geometry("900x600")
        self.minsize(800, 500)
        
        # Initialize backend
        init_db()
        create_user("admin", "admin123", "ADMIN")
        
        self.current_frame = None
        self.show_login()
        
    def show_login(self):
        if self.current_frame:
            self.current_frame.destroy()
        self.current_frame = LoginFrame(self, on_login_success=self.show_dashboard)
        self.current_frame.pack(expand=True, fill="both")
        
    def show_dashboard(self):
        if self.current_frame:
            self.current_frame.destroy()
        self.current_frame = DashboardFrame(self, on_logout=self.show_login)
        self.current_frame.pack(expand=True, fill="both")

if __name__ == "__main__":
    app = PyFlowApp()
    app.mainloop()
