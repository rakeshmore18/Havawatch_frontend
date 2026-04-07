from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

# Initialize FastAPI app [cite: 24]
app = FastAPI(title="HavaWatch ML Service")

# Load the trained model 
try:
    model = joblib.load("pollution_model.pkl")
    print("✅ Model loaded successfully.")
except:
    print("❌ Error: pollution_model.pkl not found. Run train_model.py first.")

# Define the input data structure using Pydantic
class PollutionInput(BaseModel):
    pm25: float
    pm10: float
    no2: float
    so2: float
    co: float
    o3: float
    hour: int

@app.post("/predict")
def predict_cause(data: PollutionInput):
    # Convert input data to a numpy array for the model
    features = np.array([[
        data.pm25, data.pm10, data.no2, 
        data.so2, data.co, data.o3, data.hour
    ]])
    
    # Get the probabilities for each pollution cause 
    probabilities = model.predict_proba(features)[0]
    classes = model.classes_
    
    # Identify the dominant cause and the confidence score
    dominant_index = np.argmax(probabilities)
    dominant_cause = classes[dominant_index]
    confidence = round(probabilities[dominant_index] * 100, 2)

    # Create a dictionary of all contributions for the Pie Chart 
    contribution = {cls: round(prob * 100, 2) for cls, prob in zip(classes, probabilities)}

    return {
        "dominant_cause": dominant_cause,
        "confidence": confidence,
        "contribution": contribution
    }

# To run this: uvicorn ml_api:app --reload