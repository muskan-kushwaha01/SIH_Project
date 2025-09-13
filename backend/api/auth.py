# backend/api/auth.py
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, field_validator
from pymongo import MongoClient
from datetime import datetime, timedelta
from passlib.hash import bcrypt
import jwt
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Environment variables
SECRET_KEY = os.environ.get("JWT_SECRET", "change_this_secret_in_prod")
MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "pig_farm_db")

# MongoDB connection with error handling
try:
    client = MongoClient(MONGO_URI)
    # Test the connection
    client.admin.command('ping')
    print("✅ Connected to MongoDB successfully!")
    db = client[DB_NAME]
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")
    raise

users_collection = db["users"]
results_collection = db["risk_results"]

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

class UserLogin(BaseModel):
    phone: str
    password: str


def create_token(phone: str):
    payload = {
        "phone": phone,
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def get_current_user(authorization: str | None = Header(None)):
    """Decode JWT and return user from DB"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError("Wrong auth scheme")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        phone = payload.get("phone")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = users_collection.find_one({"phone": phone}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


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

    token = create_token(user.phone)

    return {"message": "User signed up successfully", "token": token, "farmType": user.farmType}


@router.post("/signin")
def signin(user: UserLogin):
    existing_user = users_collection.find_one({"phone": user.phone})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not bcrypt.verify(user.password, existing_user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password")

    token = create_token(existing_user["phone"])

    return {
        "message": "Login successful",
        "name": existing_user["name"],
        "farmType": existing_user.get("farmType"),
        "token": token
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    """Return current logged-in user profile with risk status"""
    
    farm_type = current_user.get("farmType", "").lower()
    
    # Uses different collection names
    if "pig" in farm_type:
        risk_collection = db["risk_analysis_records"]  # ✅ Correct
    elif "poultry" in farm_type:
        risk_collection = db["poultry_risk_records"]   # ✅ Correct
    else:
        risk_collection = db["risk_analysis_records"]  # default
    
    has_result = risk_collection.find_one({"user_phone": current_user.get("phone")}) is not None
    
    return {
        "name": current_user.get("name"),
        "phone": current_user.get("phone"),
        "farmType": current_user.get("farmType"),
        "hasRiskResult": has_result
    }