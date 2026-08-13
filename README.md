# 🌬️ HavaWatch — Air Quality Intelligence Platform

HavaWatch is a web app I built to detect the **source of air pollution** using machine learning. You type a city name (or let it auto-detect your location), and it tells you whether the pollution is coming from vehicles, industries, construction, or natural sources — along with live AQI data and a 30-hour history chart.

It's fully deployed on Vercel and backed by real sensor data from OpenWeatherMap and AQICN.

🌐 **Live:** [havawatch.vercel.app](https://havawatch.vercel.app)

---

## What it does

- Detects your city via GPS or IP, then fetches live AQI
- Uses a **Random Forest ML model** (94.2% accuracy) to predict the dominant pollution cause
- Shows a 30-hour AQI history chart
- Lets you dispatch alerts to local authorities
- Has a full user auth system (signup/login with JWT)
- Real-time IoT sensor streaming via Socket.IO
- Interactive world map with air quality markers

---

## How it's built

The project has three separate services:

- **Frontend** — React 18 + Vite (`./frontend/`)
- **Backend** — Node.js + Express API (`./backend/`)
- **ML Service** — Python Flask + FastAPI (`./ml_service/`)

All three are deployed independently on Vercel, with MongoDB Atlas as the database.

---

## Architecture

```
  ┌──────────────────────────────────────────────────────────────────────┐
  │                        USER BROWSER                                  │
  │                                                                      │
  │   ┌────────────────────────────────────────────────────────────┐    │
  │   │              React 18 + Vite  Frontend                      │    │
  │   │              havawatch.vercel.app                           │    │
  │   │                                                             │    │
  │   │  Pages: Home · Dashboard · Analytics · Map · Profile · Learn│    │
  │   │  Charts: Chart.js (AQI line, ML pie)                       │    │
  │   │  Map: Leaflet (global station markers)                      │    │
  │   │  Auth: JWT stored in localStorage                           │    │
  │   │  Real-time: Socket.IO client (live AQI updates)            │    │
  │   └──────────────┬──────────────────────────────┬──────────────┘    │
  │                  │ REST API                      │ IP Location        │
  └──────────────────┼───────────────────────────────┼────────────────────┘
                     │                               │
                     │                        ┌──────▼──────┐
                     │                        │  ipapi.co   │
                     │                        │ (Geo Locate)│
                     │                        └─────────────┘
                     │
  ┌──────────────────▼──────────────────────────────────────────────────┐
  │                  Node.js + Express  Backend                          │
  │                  havawatch-bk.vercel.app  · Port 5000               │
  │                                                                      │
  │  ┌──────────────┐  ┌─────────────────┐  ┌────────────────────────┐ │
  │  │  JWT Auth    │  │   REST Routes   │  │  Socket.IO Server      │ │
  │  │  Middleware  │  │  /api/signup    │  │  emits: liveAqiUpdate  │ │
  │  │  bcrypt hash │  │  /api/login     │  │  on: IoT sensor POST   │ │
  │  └──────┬───────┘  │  /api/analyze  │  └────────────────────────┘ │
  │         │           │  /api/predict  │                              │
  │         │           │  /api/alerts   │                              │
  │         │           └────────┬────────┘                             │
  └─────────┼────────────────────┼─────────────────────────────────────┘
            │                    │
    ┌───────▼──────┐    ┌────────┼────────────────────────────┐
    │ MongoDB Atlas│    │        │  External APIs              │
    │              │    │  ┌─────▼──────────┐                 │
    │  Users       │    │  │ AQICN / WAQI   │                 │
    │  Scan History│    │  │ (city AQI)     │                 │
    │  Alerts      │    │  └────────────────┘                 │
    └──────────────┘    │  ┌────────────────┐                 │
                        │  │ OpenWeatherMap │                 │
                        │  │ (lat/lon AQI + │                 │
                        │  │  30h history)  │                 │
                        │  └────────────────┘                 │
                        └─────────────────────────────────────┘
                                    │
                                    │ POST pollution data
                                    │
  ┌─────────────────────────────────▼───────────────────────────────────┐
  │               Python ML Service · havawatch-ml.vercel.app           │
  │                                                                      │
  │   ┌───────────────────────┐     ┌──────────────────────────────┐   │
  │   │  Flask  (/predict)    │     │  FastAPI (/api/predict)      │   │
  │   │  used by predict-latlon│    │  used by analyze + analyze-  │   │
  │   │  route                │     │  live-city routes            │   │
  │   └──────────┬────────────┘     └──────────────┬───────────────┘   │
  │              │                                  │                   │
  │              └──────────────┬───────────────────┘                   │
  │                             │                                       │
  │              ┌──────────────▼──────────────────┐                   │
  │              │     RandomForestClassifier       │                   │
  │              │     Input: PM2.5, PM10,          │                   │
  │              │            NO₂, SO₂, CO          │                   │
  │              │     Output: dominant_cause        │                   │
  │              │             confidence %          │                   │
  │              │             contribution dict     │                   │
  │              └─────────────────────────────────-┘                   │
  └──────────────────────────────────────────────────────────────────────┘
```

---

## Running locally

You'll need Node.js 18+, Python 3.9+, a MongoDB Atlas URI, and API keys for AQICN and OpenWeatherMap.

```bash
# Clone
git clone https://github.com/rakeshmore18/Havawatch_frontend.git
cd Havawatch_frontend

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd ml_service && pip install -r requirements.txt && cd ..

# Train the ML model (only needed once)
cd ml_service
python train_model.py

# Add your API keys in backend/server.js
# AQICN_TOKEN, OpenWeatherMap KEY, MongoDB URI

# Start everything
npm run dev
```

Then open **http://localhost:5173**.

---

## Project structure

```
├── frontend/        → React app (pages, components, charts)
├── backend/         → Express API, auth, Socket.IO, DB
├── ml_service/      → Flask + FastAPI ML servers, model files
└── package.json     → Runs all three services together
```

---

## ML model

The model is a `RandomForestClassifier` trained on a labeled dataset of pollution readings. It takes PM2.5, PM10, NO₂, SO₂, and CO as inputs (plus a few engineered ratio features) and classifies the dominant source.

- **Accuracy:** 94.2%
- **Classes:** Vehicular Emissions, Industrial, Natural, Construction
- **Served via:** Flask (`/predict`) and FastAPI (`/api/predict`)

---

## Deployment

Each service has its own `vercel.json` and deploys independently:

```bash
cd frontend   && vercel --prod
cd backend    && vercel --prod
cd ml_service && vercel --prod
```

> Make sure the `.pkl` model files are committed before deploying the ML service.

---

## Disclaimer

This app uses ML predictions and third-party sensor data, so results aren't always 100% accurate. Always follow official health guidelines for serious air quality concerns.

---

Made by Rakesh More · 2026
