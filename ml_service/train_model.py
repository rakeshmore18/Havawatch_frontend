# ================================
# IMPORT LIBRARIES
# ================================
import pandas as pd
import numpy as np
import pickle

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# ================================
# LOAD DATASET
# ================================
df = pd.read_csv("demo.csv")

# ================================
# FEATURE SELECTION
# ================================
features = ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO']
target = 'Source_Label'

df = df[features + [target]]

# ================================
# HANDLE MISSING VALUES
# ================================
df = df.fillna(df.median(numeric_only=True))

# ================================
# FEATURE ENGINEERING
# ================================
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

df['Pollution_Level'] = df['PM2.5'].apply(pollution_level)

# ================================
# ENCODE TARGET
# ================================
le = LabelEncoder()
df[target] = le.fit_transform(df[target])

# ================================
# SPLIT DATA
# ================================
X = df.drop(columns=[target])
y = df[target]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ================================
# SCALING
# ================================
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# ================================
# TRAIN MODEL
# ================================
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    class_weight='balanced'
)

model.fit(X_train, y_train)

# ================================
# EVALUATION
# ================================
y_pred = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))

# ================================
# SAVE MODEL 🔥
# ================================
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("scaler.pkl", "wb") as f:
    pickle.dump(scaler, f)

with open("label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

print("\n✅ Model saved as model.pkl")
print("✅ Scaler saved as scaler.pkl")
print("✅ Label encoder saved as label_encoder.pkl")