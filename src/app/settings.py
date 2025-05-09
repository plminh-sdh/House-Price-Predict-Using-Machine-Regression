"""Application Settings Module"""

import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env.development"
if not env_path.exists():
    env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_TTL_HOURS = float(os.getenv("JWT_TTL_HOURS", 1))
JWT_CLIENT_ID = os.getenv("JWT_CLIENT_ID")
JWT_AUTHORITY = os.getenv("JWT_AUTHORITY")

# Database Setting
def get_connection_string() -> str:
    """Get the connection string for the database"""
    engine = os.environ.get("SQL_ENGINE")
    
    if engine.startswith("mssql+pyodbc"):
        dbhost = os.environ.get("SQL_HOST")
        dbname = os.environ.get("SQL_DB")
        driver = os.environ.get("SQL_DRIVER", "ODBC Driver 17 for SQL Server")
        return f"{engine}://@{dbhost}/{dbname}?Trusted_Connection=yes&driver={driver}"

    # Fallback: standard connection string
    dbhost = os.environ.get("SQL_HOST")
    username = os.environ.get("SQL_USER")
    password = os.environ.get("SQL_PASSWORD")
    dbname = os.environ.get("SQL_DB")
    return f"{engine}://{username}:{password}@{dbhost}/{dbname}"

SQLALCHEMY_DATABASE_URL = get_connection_string()


# Other Settings
ADMIN_DEFAULT_PASSWORD = os.environ.get("DEFAULT_PASSWORD")