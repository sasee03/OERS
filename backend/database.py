from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker , declarative_base
import os
from dotenv import load_dotenv
from utils.config import settings
load_dotenv()

engine=create_engine(settings.DATABASE_URL)
sessionLocal = sessionmaker(autoflush=False, autocommit=False, bind = engine)
Base = declarative_base()

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()