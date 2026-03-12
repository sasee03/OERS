from sqlalchemy.orm import Session
from fastapi import status, HTTPException
from schemas.user_schema import UserCreate, UserLogin
from utils.jwt_handler import create_access_token
from utils.password import hash_password,verify_password
from repositories.user_repository import email_exists,username_exists,create_user,get_user_by_username

def register_user(db:Session ,data: UserCreate):
    if username_exists(db=db,username=data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username is already taken"
        )
    if email_exists(db=db,email=data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with the email already exists"
        )
    hashed= hash_password(data.password)
    user = create_user(
        db=db,
        username=data.username,
        email=data.email,
        hashed_password=hashed,
        role=data.role
    )
    return user

def login_user(db:Session,username:str,password:str):
    user = get_user_by_username(db=db,username=username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    token = create_access_token(data={"sub":str(user.id),"role":user.role.value})
    return token,user