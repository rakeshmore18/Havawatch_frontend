<div align="center">

<h1>🌬️ HavaWatch</h1>
<p><strong>AI-Powered Air Quality Intelligence Platform</strong></p>

<p>
  <img src="https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/ML%20Accuracy-94.2%25-blue?style=flat-square" alt="ML Accuracy" />
  <img src="https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Python-informational?style=flat-square" alt="Stack" />
</p>

<p>
  <a href="https://havawatch.vercel.app" target="_blank"><strong>🌐 Live Demo</strong></a> &nbsp;|&nbsp;
  <a href="./frontend/"><strong>⚛️ Frontend</strong></a> &nbsp;|&nbsp;
  <a href="./backend/"><strong>🖥️ Backend</strong></a> &nbsp;|&nbsp;
  <a href="./ml_service/"><strong>🧠 ML Service</strong></a>
</p>

</div>

---

HavaWatch is a full-stack Air Quality platform that uses a **Random Forest ML model** to detect the dominant source of air pollution (Vehicular, Industrial, Natural, Construction) in real time. It integrates live sensor data from global APIs, shows historical AQI charts, and dispatches authority alerts — all deployed on Vercel.

---

## ✨ Key Features

- 🤖 **AI Pollution Source Detection** — identifies dominant cause with confidence scores
- 📍 **GPS Auto-Sync** — detects your location via IP and fetches live AQI
- 🔍 **City Search** — search any city worldwide for live AQI + ML analysis
- 📈 **30-Hour AQI Chart** — historical trajectory from OpenWeatherMap
- 🚨 **Alert Dispatch** — sends pollution alerts to authorities (stored in MongoDB)
- 🔐 **JWT Auth** — secure signup/login with bcrypt password hashing
- 🗺️ **Interactive Map** — Leaflet-powered global air quality atlas
- ⚡ **Real-Time Streaming** — Socket.IO for live IoT sensor data

---

## 🏗️ Architecture Overview

```
Browser (React) ──→ Node.js Backend ──→ Python ML Service
                         │                   │
                    MongoDB Atlas       RandomForest Model
                         │
              External APIs (AQICN, OpenWeatherMap, ipapi.co)
```

| Service | URL |
|---|---|
| 🌐 Frontend | [havawatch.vercel.app](https://havawatch.vercel.app) |
| 🖥️ Backend API | [havawatch-bk.vercel.app](https://havawatch-bk.vercel.app) |
| 🧠 ML Service | [havawatch-ml.vercel.app](https://havawatch-ml.vercel.app) |

---

## 📁 Project Structure

```
AQI/
├── frontend/          ← React 18 + Vite SPA
├── backend/           ← Node.js + Express API
├── ml_service/        ← Python ML (Flask + FastAPI)
└── package.json       ← Root orchestrator
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+, Python 3.9+, MongoDB Atlas account
- [AQICN API token](https://aqicn.org/data-platform/token/)
- [OpenWeatherMap API key](https://openweathermap.org/api)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/havawatch.git
cd havawatch

# 2. Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
cd ml_service && pip install -r requirements.txt && cd ..

# 3. Train the ML model (first time only)
cd ml_service && python train_model.py

# 4. Add your API keys in backend/server.js
#    AQICN_TOKEN, OpenWeatherMap KEY, MongoDB URI

# 5. Run all services
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/signup` | Register a new user |
| `POST` | `/api/login` | Login → returns JWT |
| `POST` | `/api/analyze-live-city` | Live AQI + ML analysis by city name |
| `POST` | `/api/predict-latlon` | AQI + 30h history by coordinates |
| `POST` | `/api/alerts/send` | Dispatch a pollution alert |
| `POST/GET` | `/api/user/history` *(JWT)* | Save / retrieve scan history |

---

## 🧠 ML Model

- **Algorithm:** RandomForestClassifier (scikit-learn)
- **Accuracy:** 94.2%
- **Inputs:** PM2.5, PM10, NO₂, SO₂, CO + engineered ratios
- **Output classes:** Vehicular Emissions · Industrial · Natural · Construction

---

## ☁️ Deployment

Each service deploys independently to Vercel:

```bash
cd frontend  && vercel --prod
cd backend   && vercel --prod
cd ml_service && vercel --prod
```

> **Note:** Commit `.pkl` model files before deploying the ML service.

---

## 📜 Disclaimer

HavaWatch uses ML models and third-party sensor data. Results may occasionally be inaccurate due to sensor calibration or data latency. **Always follow local health authority guidelines.**

---

<div align="center">
  <p>Made with ❤️ by the HavaWatch Team · © 2026 HavaWatch Intelligent Systems</p>
</div>
