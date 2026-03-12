from sqlalchemy.orm import Session
from models.user_model import User

def get_user_by_username(db:Session, username:str):
    return db.query(User).filter(User.username==username).first()

def get_user_by_email(db:Session,email:str):
    return db.query(User).filter(User.email==email).first()

def get_user_by_id(db:Session,id:int):
    return db.query(User).filter(User.id==id).first()

def create_user(db:Session, username:str, email:str, hashed_password:str, role:str):
    user = User(
        username=username,
        email=email,
        hashed_password=hashed_password,
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def username_exists(db:Session, username:str):
    return db.query(User).filter(User.username==username).first() is not None

def email_exists(db:Session,email:str):
    return db.query(User).filter(User.email==email).first() is not None
