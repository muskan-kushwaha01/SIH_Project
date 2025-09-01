from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, field_validator
from pymongo import MongoClient
from datetime import datetime
from passlib.hash import bcrypt

# Router instead of app (to mount it in main.py)
router = APIRouter(prefix="/auth", tags=["Authentication"])

# MongoDB Setup
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["pig_farm_db"]
users_collection = db["users"]

# User Schema for Signup
class UserSignup(BaseModel):
    name: str
    phone: str
    email: str | None = None
    password: str
    farmType: str

    @field_validator("phone")
    @classmethod
    def phone_must_be_valid(cls, v: str) -> str:
        if not v.isdigit() or len(v) != 10:
            raise ValueError("Invalid phone number")
        return v

# User Schema for Signin
class UserLogin(BaseModel):
    phone: str
    password: str

@router.post("/signup")
def signup(user: UserSignup):
    if users_collection.find_one({"phone": user.phone}):
        raise HTTPException(status_code=400, detail="User with this phone number already exists")

    hashed_password = bcrypt.hash(user.password)

    user_data = {
        "name": user.name,
        "phone": user.phone,
        "email": user.email,
        "password": hashed_password,
        "farmType": user.farmType,
        "created_at": datetime.utcnow()
    }

    users_collection.insert_one(user_data)
    return {"message": "User signed up successfully"}

@router.post("/signin")
def signin(user: UserLogin):
    existing_user = users_collection.find_one({"phone": user.phone})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    return {"message": "Login successful", "name": existing_user["name"], "farmType": existing_user["farmType"]}
