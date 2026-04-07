import pandas as pd
import numpy as np
import random

rows = 3000   # you can increase to 5000+

data = []

sources = ["Vehicular", "Industrial", "Biomass Burning", "Construction", "Natural"]

for _ in range(rows):

    source = random.choice(sources)

    if source == "Vehicular":
        pm25 = np.random.normal(100, 20)
        pm10 = np.random.normal(150, 25)
        no2 = np.random.normal(70, 15)
        so2 = np.random.normal(15, 5)
        co = np.random.normal(2.5, 0.5)

    elif source == "Industrial":
        pm25 = np.random.normal(90, 25)
        pm10 = np.random.normal(140, 30)
        no2 = np.random.normal(60, 15)
        so2 = np.random.normal(40, 10)
        co = np.random.normal(1.8, 0.4)

    elif source == "Biomass Burning":
        pm25 = np.random.normal(130, 30)
        pm10 = np.random.normal(170, 35)
        no2 = np.random.normal(35, 10)
        so2 = np.random.normal(10, 5)
        co = np.random.normal(3.5, 0.7)

    elif source == "Construction":
        pm25 = np.random.normal(80, 20)
        pm10 = np.random.normal(220, 40)
        no2 = np.random.normal(25, 10)
        so2 = np.random.normal(8, 3)
        co = np.random.normal(1.0, 0.3)

    else:  # Natural / Clean
        pm25 = np.random.normal(30, 10)
        pm10 = np.random.normal(50, 15)
        no2 = np.random.normal(15, 5)
        so2 = np.random.normal(5, 2)
        co = np.random.normal(0.5, 0.2)

    # Add randomness (real-world noise)
    pm25 = max(5, pm25)
    pm10 = max(10, pm10)
    no2 = max(5, no2)
    so2 = max(1, so2)
    co = max(0.1, co)

    data.append([pm25, pm10, no2, so2, co, source])

# Create DataFrame
df = pd.DataFrame(data, columns=[
    "PM2.5", "PM10", "NO2", "SO2", "CO", "Source_Label"
])

# Shuffle dataset
df = df.sample(frac=1).reset_index(drop=True)

# Save file
df.to_csv("synthetic_pollution_dataset.csv", index=False)

print("✅ Dataset Generated Successfully!")
print(df.head())