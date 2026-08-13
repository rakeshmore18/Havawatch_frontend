const axios = require('axios');

async function getPollutionPrediction(lat, lon) {
    const KEY = "59a8f55e80d1f1554a362b6bc12785f9";

    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`;

    try {
        const response = await axios.get(url);
        const p = response.data.list[0].components;

        const cleanData = {
            "PM2.5": p.pm2_5 || 0,
            "PM10": p.pm10 || 0,
            "NO2": p.no2 || 0,
            "SO2": p.so2 || 0,
            "CO": (p.co / 1000) || 0,
        };

        const predictionResponse = await axios.post(
            "http://localhost:5000/predict",
            cleanData
        );

        return {
            pollution_data: cleanData,
            predicted_cause: predictionResponse.data
        };

    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = { getPollutionPrediction };