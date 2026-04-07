import pickle
import pandas as pd

# Load files
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))
le = pickle.load(open("label_encoder.pkl", "rb"))

# Input data
data = {
    'PM2.5': 120,
    'PM10': 180,
    'NO2': 60,
    'SO2': 20,
    'CO': 1.5
}

df = pd.DataFrame([data])

# Feature engineering (SAME!)
df['PM_ratio'] = df['PM2.5'] / (df['PM10'] + 1)
df['NO2_SO2_ratio'] = df['NO2'] / (df['SO2'] + 1)
df['CO_NO2_ratio'] = df['CO'] / (df['NO2'] + 1)
df['Total_Pollution'] = df[['PM2.5','PM10','NO2','SO2','CO']].sum(axis=1)

def pollution_level(x):
    if x < 50:
        return 0
    elif x < 100:
        return 1
    else:
        return 2

df['Pollution_Level'] = pollution_level(df['PM2.5'].values[0])

# Scale
df_scaled = scaler.transform(df)

# Predict
pred = model.predict(df_scaled)
result = le.inverse_transform(pred)

print("Predicted Source:", result[0])