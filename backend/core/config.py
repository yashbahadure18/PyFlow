import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = BASE_DIR / "data"
LOGS_DIR = BASE_DIR / "logs"
REPORTS_DIR = BASE_DIR / "reports"
BACKUPS_DIR = BASE_DIR / "backups"

# Ensure directories exist
for directory in [DATA_DIR, LOGS_DIR, REPORTS_DIR, BACKUPS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

DB_PATH = DATA_DIR / "pyflow.db"
LOG_FILE = LOGS_DIR / "pyflow.log"
