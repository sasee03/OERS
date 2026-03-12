from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Literal
from datetime import datetime

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str
    role:Literal["admin", "student"]

class UserLogin(BaseModel):
    username:str
    password:str

class UserResponse(BaseModel):
    id:int
    username:str
    email:EmailStr  
    role:str
    model_config=ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token:str
    token_type:str="bearer"
    user:UserResponse


class MessageResponse(BaseModel):
    message: str