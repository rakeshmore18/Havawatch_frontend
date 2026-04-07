from flask import Flask, request, jsonify
import pickle
import pandas as pd

app = Flask(__name__)

# Load model files
model = pickle.load(open("model.pkl", "rb"))
scaler = pickle.load(open("scaler.pkl", "rb"))
le = pickle.load(open("label_encoder.pkl", "rb"))

def pollution_level(x):
    if x < 50:
        return 0
    elif x < 100:
        return 1
    else:
        return 2

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    df = pd.DataFrame([data])

    # SAME FEATURE ENGINEERING
    df['PM_ratio'] = df['PM2.5'] / (df['PM10'] + 1)
    df['NO2_SO2_ratio'] = df['NO2'] / (df['SO2'] + 1)
    df['CO_NO2_ratio'] = df['CO'] / (df['NO2'] + 1)
    df['Total_Pollution'] = df[['PM2.5','PM10','NO2','SO2','CO']].sum(axis=1)
    df['Pollution_Level'] = pollution_level(df['PM2.5'].values[0])

    # Scale
    df_scaled = scaler.transform(df)

    # Predict
    pred = model.predict(df_scaled)
    result = le.inverse_transform(pred)

    return jsonify({"source": result[0]})

if __name__ == "__main__":
    app.run(debug=True, port=8001)