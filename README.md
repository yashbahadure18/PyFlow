# PyFlow — Python-Based Mini ERP & Inventory Management System

A modular, full-stack business management web application built with a **React** frontend and a **Python Flask** backend, backed by **SQLite**.

## Features
- 🔐 **Authentication** — Secure login with SHA-256 salted password hashing and role-based access
- 📦 **Inventory Management** — Add, view, and track products with live stock levels
- 🛒 **Point of Sale** — A shopping cart interface to place orders and auto-deduct inventory
- 📊 **Sales Reports** — View full transaction history in a clean data table

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), HTML, Vanilla CSS |
| Backend | Python, Flask, Flask-CORS |
| Database | SQLite |
| Design | Glassmorphism, Inter font, dark mode |

## Project Structure
```
PyFlow/
├── backend/          # Python Flask API
│   ├── core/         # Database, config, security
│   ├── models/       # Data objects (User, Product, etc.)
│   ├── services/     # Business logic (auth, inventory, sales)
│   ├── utils/        # Decorators, logging, validators
│   └── server.py     # Flask REST API entry point
├── frontend/         # React application
│   └── src/
│       ├── App.jsx
│       ├── Login.jsx
│       ├── Dashboard.jsx
│       ├── Inventory.jsx
│       ├── Sales.jsx
│       └── Reports.jsx
└── main.py           # CLI interface (optional)
```

## How to Run

### 1. Start the Python Backend
```bash
cd backend
pip install -r requirements.txt
python server.py
```
The API will run on `http://localhost:5000`

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL shown (usually `http://localhost:5173`) in your browser.

### 3. Default Login
| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin123` |
