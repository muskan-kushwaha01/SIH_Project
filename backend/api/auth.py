# backend/api/auth.py
from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel, field_validator
from datetime import datetime, timedelta
from passlib.hash import bcrypt
import jwt
import os
from dotenv import load_dotenv
from .db import db  # ✅ central DB

router = APIRouter(prefix="/auth", tags=["Authentication"])

load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET", "change_this_secret_in_prod")

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
    payload = {"phone": phone, "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


async def get_current_user(authorization: str | None = Header(None)):
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

    user = await users_collection.find_one({"phone": phone}, {"password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
@router.post("/signin")
async def signin(user: UserLogin):
    existing_user = await users_collection.find_one({"phone": user.phone})
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


@router.post("/signup")
async def signup(user: UserSignup):
    try:
        # Check if user already exists
        existing_user = await users_collection.find_one({"phone": user.phone})
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this phone number already exists")

        # Hash password
        hashed_password = bcrypt.hash(user.password)

        # Create user document
        user_data = {
            "name": user.name.strip(),
            "phone": user.phone,
            "email": user.email.strip() if user.email else None,
            "password": hashed_password,
            "farmType": user.farmType,
            "created_at": datetime.utcnow()
        }

        # Insert user
        result = await users_collection.insert_one(user_data)
        
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="Failed to create user")

        # Generate token
        token = create_token(user.phone)

        return {
            "message": "User signed up successfully", 
            "token": token, 
            "farmType": user.farmType
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during signup")

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    farm_type = current_user.get("farmType", "").lower()

    if "pig" in farm_type:
        risk_collection = db["risk_analysis_records"]
    elif "poultry" in farm_type:
        risk_collection = db["poultry_risk_records"]
    else:
        risk_collection = db["risk_analysis_records"]

    has_result = await risk_collection.find_one({"user_phone": current_user.get("phone")}) is not None

    return {
        "name": current_user.get("name"),
        "phone": current_user.get("phone"),
        "farmType": current_user.get("farmType"),
        "hasRiskResult": has_result
    }
