# PyFlow - Python-Based Mini ERP & Inventory Management System

PyFlow is a modular business management system built with Python and SQLite. It handles inventory, sales, authentication, and reporting in a single application.

## Features
- **Role-Based Access Control**: Admin, Manager, Employee roles.
- **Inventory Management**: Track stock, add products, handle stock-in and stock-out.
- **Sales & Orders**: Create orders, auto-deduct stock.
- **Audit Logging**: All important actions are logged.
- **Reporting**: Generate CSV reports for sales and inventory.

## Technology Stack
- Core Python (OOP, Decorators, Generators, Dataclasses)
- SQLite (for persistent data)
- Standard libraries (`hashlib`, `logging`, `csv`)

## Project Structure
- `core/`: Core settings, database, security, and custom exceptions.
- `models/`: Plain Python objects representing data entities.
- `services/`: Business logic and database interactions.
- `utils/`: Reusable decorators, validators, and logging.

## How to Run
1. Navigate to the project root: `cd C:\Users\ASUS\.gemini\antigravity\scratch\PyFlow`
2. Run `python main.py`.
3. Default login is `admin` / `admin123`.

## Architecture Decisions
- **OOP**: Used to structure models (Product, User, Order).
- **Decorators**: `@require_login` and `@require_role` used to cleanly secure service layer functions.
- **SQLite**: Used instead of Python dicts to demonstrate persistent data handling.
