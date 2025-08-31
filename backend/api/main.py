from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # import CORS
from pydantic import BaseModel
import joblib
import numpy as np
import os

model_path = os.path.join(os.path.dirname(__file__), '..', 'pig_risk_model.pkl')
model = joblib.load(model_path)

# Initialize FastAPI
app = FastAPI(title="Pig Farm Risk Analysis API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Input schema
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

@app.get("/")
def root():
    return {"message": "✅ Pig Farm Risk Analysis API is running"}

@app.post("/predict")
def predict_risk(data: FarmInput):
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

    pred = model.predict(features)[0]  # 0,1,2
    prob = model.predict_proba(features)[0]

    label_map = {0: "Low", 1: "Medium", 2: "High"}
    risk_level = label_map[pred]

    recommendations = {
        "Low": "✅ Your farm risk is low. Keep following good biosecurity practices.",
        "Medium": "⚠️ Medium risk. Improve fencing, quarantine new pigs, and limit visitors.",
        "High": "🚨 High risk! Immediate action needed: vaccinate, enforce hygiene zones, and reduce pig density."
    }

    return {
        "risk_level": risk_level,
        "confidence": {
            "Low": round(prob[0], 3),
            "Medium": round(prob[1], 3),
            "High": round(prob[2], 3)
        },
        "recommendation": recommendations[risk_level]
    }
