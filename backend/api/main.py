"""from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
from pymongo import MongoClient
from datetime import datetime

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

# ------------------------
# MongoDB Setup
# ------------------------
MONGO_URI = "mongodb://localhost:27017"  
client = MongoClient(MONGO_URI)
db = client["pig_farm_db"]  # database
collection = db["risk_analysis_records"]  # collection (like table)

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


@app.post("/predict")
def predict_risk(data: FarmInput):
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

    # ------------------------
    # Save Input + Result in MongoDB
    # ------------------------
    record = data.dict()
    record.update({
        "prediction": result,
        "timestamp": datetime.utcnow()
    })
    collection.insert_one(record)

    return result"""

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import joblib
import pandas as pd
from pymongo import MongoClient
import os

app = FastAPI()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["poultry_db"]
collection = db["farms"]

# Load trained GBM model
model = joblib.load("poultry_gbm_model.pkl")

class Batch(BaseModel):
    birdType: str
    chickenType: Optional[str] = None
    count: int
    age: int
    ageUnit: str
    diseaseAffected: str
    vaccinations: List[str]

class FarmData(BaseModel):
    farmDetails: dict
    batches: List[Batch]

@app.post("/predict-risk")
def predict_risk(data: FarmData):
    # --- Save to MongoDB ---
    collection.insert_one(data.dict())

    # --- Prepare data for prediction ---
    row = {}
    fd = data.farmDetails
    row['farmSize'] = fd.get('farmSize')
    row['totalBirds'] = fd.get('totalBirds')
    row['nearbyFarms'] = 1 if fd.get('nearbyFarms')=='yes' else 0
    row['waterBodies'] = 1 if fd.get('waterBodies')=='yes' else 0
    row['properFencing'] = 1 if fd.get('properFencing')=='yes' else 0
    row['cleanDirtyZones'] = 1 if fd.get('cleanDirtyZones')=='yes' else 0
    row['visitorsPerDay'] = fd.get('visitorsPerDay')
    row['newFlocksWithoutQuarantine'] = 1 if fd.get('newFlocksWithoutQuarantine')=='yes' else 0

    batch_count = len(data.batches)
    if batch_count > 0:
        total_count = sum([b.count for b in data.batches])
        disease_sum = sum([1 if b.diseaseAffected=='yes' else 0 for b in data.batches])
        row['count'] = total_count
        row['age'] = sum([b.age for b in data.batches])/batch_count
        row['diseaseAffected'] = disease_sum
        row['birdType'] = 1 if data.batches[0].birdType=='Chicken' else 0
        row['chickenType'] = 1 if data.batches[0].chickenType=='Broilers' else 0
    else:
        row['count'] = 0
        row['age'] = 0
        row['diseaseAffected'] = 0
        row['birdType'] = 0
        row['chickenType'] = 0

    input_df = pd.DataFrame([row])
    pred = model.predict(input_df)[0]

    risk_mapping = {0: "Low", 1: "Medium", 2: "High"} # Adjust if needed
    risk_label = risk_mapping[pred]

    return {"risk_level": risk_label}
