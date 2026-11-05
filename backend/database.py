from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

# Permanent location for application data
APP_DATA_DIR = os.path.join(
    os.environ["APPDATA"],
    "TuitionManager"
)

# Create the folder if it doesn't exist
os.makedirs(APP_DATA_DIR, exist_ok=True)

# Permanent SQLite database
DATABASE_PATH = os.path.join(
    APP_DATA_DIR,
    "tuition.db"
)

DATABASE_URL = f"sqlite:///{DATABASE_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()