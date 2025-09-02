from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
from pymongo import MongoClient
from datetime import datetime
from .auth import router as auth_router, get_current_user

# ------------------------
# Load ML Model
# ------------------------
model_path = os.path.join(os.path.dirname(__file__), '..', 'pig_risk_model.pkl')
model = joblib.load(model_path)

# ------------------------
# Initialize FastAPI
# ------------------------
app = FastAPI(title="Pig Farm Risk Analysis API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# ------------------------
# MongoDB Setup
# ------------------------
MONGO_URI = "mongodb://localhost:27017"
client = MongoClient(MONGO_URI)
db = client["pig_farm_db"]
risk_collection = db["risk_analysis_records"]

# ------------------------
# Input Schema
# ------------------------
class FarmInput(BaseModel):
    Farm_Size_Acres_Norm: float
    Total_Pigs_Norm: float
    Nearby_Farm_50m: int
    Proper_Fencing: int
    Clean_Dirty_Zones: int
    Avg_Visitors_Day_Norm: float
    Introduce_Without_Quarantine: int
    Separate_Spaces: int
    Batch_Age_Weeks_Norm: float
    Previously_Infected: int
    Vacc_Coverage_Rate: float
    Pig_Density_Norm: float


# ------------------------
# Routes
# ------------------------
@app.get("/")
def root():
    return {"message": "✅ Pig Farm Risk Analysis API is running"}


@app.get("/risk/status")
def check_risk_status(current_user: dict = Depends(get_current_user)):
    """Check if user already has a saved risk result"""
    result = risk_collection.find_one({"user_phone": current_user["phone"]})
    if result:
        return {"hasResult": True, "farmType": current_user.get("farmType")}
    return {"hasResult": False, "farmType": current_user.get("farmType")}


@app.post("/predict")
def predict_risk(data: FarmInput, current_user: dict = Depends(get_current_user)):
    """Run risk prediction and save results for logged-in user"""

    # Convert input to features
    features = np.array([[ 
        data.Farm_Size_Acres_Norm,
        data.Total_Pigs_Norm,
        data.Nearby_Farm_50m,
        data.Proper_Fencing,
        data.Clean_Dirty_Zones,
        data.Avg_Visitors_Day_Norm,
        data.Introduce_Without_Quarantine,
        data.Separate_Spaces,
        data.Batch_Age_Weeks_Norm,
        data.Previously_Infected,
        data.Vacc_Coverage_Rate,
        data.Pig_Density_Norm
    ]])

    # Predict
    pred = model.predict(features)[0]
    prob = model.predict_proba(features)[0]

    label_map = {0: "Low", 1: "Medium", 2: "High"}
    risk_level = label_map[pred]

    recommendations = {
        "Low": "✅ Your farm risk is low. Keep following good biosecurity practices.",
        "Medium": "⚠️ Medium risk. Improve fencing, quarantine new pigs, and limit visitors.",
        "High": "🚨 High risk! Immediate action needed: vaccinate, enforce hygiene zones, and reduce pig density."
    }

    result = {
        "risk_level": risk_level,
        "confidence": {
            "Low": round(prob[0], 3),
            "Medium": round(prob[1], 3),
            "High": round(prob[2], 3)
        },
        "recommendation": recommendations[risk_level]
    }

    # Save Input + Result in MongoDB (overwrite if exists)
    risk_collection.update_one(
        {"user_phone": current_user["phone"]},
        {
            "$set": {
                "user_phone": current_user["phone"],
                "farmType": current_user.get("farmType"),
                "input": data.dict(),
                "prediction": result,
                "timestamp": datetime.utcnow()
            }
        },
        upsert=True
    )

    return result


@app.get("/risk/result")
def get_risk_result(current_user: dict = Depends(get_current_user)):
    """Fetch last saved risk result for logged-in user"""
    result = risk_collection.find_one({"user_phone": current_user["phone"]}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="No risk analysis found for this user")
    return result
