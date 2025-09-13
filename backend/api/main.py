from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from pymongo import MongoClient
from datetime import datetime
from .auth import router as auth_router, get_current_user
import os

# ------------------------
# Load ML Models
# ------------------------
pig_model_path = os.path.join(os.path.dirname(__file__), '..', 'pig_risk_model.pkl')
pig_model = joblib.load(pig_model_path)

poultry_model_path = os.path.join(os.path.dirname(__file__), '..', 'poultry_risk_model.pkl')
poultry_model = joblib.load(poultry_model_path)

# ------------------------
# Initialize FastAPI
# ------------------------
app = FastAPI(title="Farm Risk Analysis API")

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
pig_risk_collection = db["risk_analysis_records"]    # ✅ Correct
poultry_risk_collection = db["poultry_risk_records"]

# ------------------------
# Input Schemas
# ------------------------
class PigFarmInput(BaseModel):
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


class PoultryFarmInput(BaseModel):
    Farm_Size_Acres: float
    Total_Birds: float
    Nearby_Farm_50m: int
    Water_Bodies_Nearby: int
    Proper_Fencing: int
    Clean_Dirty_Zones: int
    Avg_Visitors_Day: float
    Introduce_New_Flocks_Without_Quarantine: int
    Batch_Size: float
    Batch_Age_Weeks: float
    Previously_Infected: int
    Mareks: int
    Newcastle_ND: int
    ND_IB: int
    Gumboro_IBD: int
    ND_IBD_Booster: int
    Fowl_Pox: int
    AE: int
    Birds_Per_Acre: float
    Vacc_Coverage_Rate: float
    Missing_Vaccines_Count: int

# ------------------------
# Routes
# ------------------------
@app.get("/")
def root():
    return {"message": "✅ Farm Risk Analysis API is running"}

@app.get("/risk/status")
def check_risk_status(current_user: dict = Depends(get_current_user)):
    """Check if user already has a saved risk result"""
    farm_type = current_user.get("farmType", "").lower()
    
    if "pig" in farm_type:
        collection = pig_risk_collection
    elif "poultry" in farm_type:
        collection = poultry_risk_collection
    else:
        collection = pig_risk_collection  # default
        
    result = collection.find_one({"user_phone": current_user["phone"]})
    if result:
        return {"hasResult": True, "farmType": current_user.get("farmType")}
    return {"hasResult": False, "farmType": current_user.get("farmType")}

# ------------------------
# Pig Prediction Endpoint
# ------------------------
@app.post("/predict")
def predict_pig_risk(data: PigFarmInput, current_user: dict = Depends(get_current_user)):
    """Run pig risk prediction and save results"""
    
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

    pred = pig_model.predict(features)[0]
    prob = pig_model.predict_proba(features)[0]

    label_map = {0: "Low", 1: "Medium", 2: "High"}
    risk_level = label_map[pred]

    recommendations = {
        "Low": "✅ Your pig farm risk is low. Keep following good biosecurity practices.",
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

    pig_risk_collection.update_one(
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

# ------------------------
# Poultry Prediction Endpoint
# ------------------------
@app.post("/predict-risk")
def predict_poultry_risk(data: PoultryFarmInput, current_user: dict = Depends(get_current_user)):
    """Run poultry risk prediction and save results"""
    
    features = np.array([[
    data.Farm_Size_Acres,
    data.Total_Birds,
    data.Nearby_Farm_50m,
    data.Water_Bodies_Nearby,
    data.Proper_Fencing,
    data.Clean_Dirty_Zones,
    data.Avg_Visitors_Day,
    data.Introduce_New_Flocks_Without_Quarantine,
    data.Batch_Size,
    data.Batch_Age_Weeks,
    data.Previously_Infected,
    data.Mareks,
    data.Newcastle_ND,
    data.ND_IB,
    data.Gumboro_IBD,
    data.ND_IBD_Booster,
    data.Fowl_Pox,
    data.AE,
    data.Birds_Per_Acre,
    data.Vacc_Coverage_Rate,
    data.Missing_Vaccines_Count
]])


    pred = poultry_model.predict(features)[0]
    prob = poultry_model.predict_proba(features)[0]

    label_map = {0: "Low", 1: "Medium", 2: "High"}
    risk_level = label_map[pred]

    recommendations = {
        "Low": "✅ Your poultry farm risk is low. Continue good biosecurity practices.",
        "Medium": "⚠️ Medium risk. Improve fencing, limit wild bird contact, and monitor flock health.",
        "High": "🚨 High risk! Immediate action needed: enhance biosecurity, vaccinate, and separate sick birds."
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

    poultry_risk_collection.update_one(
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

# ------------------------
# Get Results
# ------------------------
@app.get("/risk/result")
def get_pig_risk_result(current_user: dict = Depends(get_current_user)):
    result = pig_risk_collection.find_one({"user_phone": current_user["phone"]}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="No pig risk analysis found for this user")
    return result

@app.get("/risk/poultry-result")
def get_poultry_risk_result(current_user: dict = Depends(get_current_user)):
    result = poultry_risk_collection.find_one({"user_phone": current_user["phone"]}, {"_id": 0})
    if not result:
        raise HTTPException(status_code=404, detail="No poultry risk analysis found for this user")
    return result
