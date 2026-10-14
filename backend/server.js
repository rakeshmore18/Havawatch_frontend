const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('./models/User');

const app = express();

const ML_URL = process.env.NODE_ENV === 'production' ? 'https://havawatch-ml.vercel.app' : 'http://127.0.0.1:8001';

// Middleware
app.use(express.json());
const allowedOrigins = ["https://havawatch.vercel.app", "http://localhost:5173", "http://127.0.0.1:5173"];
app.use(cors({ origin: allowedOrigins }));

// ==========================================
// REAL-TIME SOCKET.IO SETUP
// ==========================================
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "https://havawatch.vercel.app" } // Connects to your Vite React frontend
});

// Secret key for JWT
const JWT_SECRET = "havawatch_super_secret_key_2026";

// ==========================================
// MONGODB CONNECTION
// ==========================================
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://mahiresahil_db_user:rakesh_more@cluster0.lvkazyy.mongodb.net/havawatch?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully"))
    .catch(err => console.log("❌ MongoDB Connection Error: ", err));

// ==========================================
// ALERT SCHEMA & MODEL
// ==========================================
const alertSchema = new mongoose.Schema({
    city: String,
    cause: String,
    aqiValue: Number,
    authority: String,
    timestamp: { type: Date, default: Date.now }
});
const Alert = mongoose.model('Alert', alertSchema);

// ==========================================
// 1. AUTHENTICATION ROUTES
// ==========================================
app.post('/api/signup', async (req, res) => {
    try {
        const { fullName, city, email, password } = req.body;

        // --- Input presence check ---
        if (!fullName || !city || !email || !password) {
            return res.status(400).json({ message: "All fields (fullName, city, email, password) are required." });
        }

        // --- Password strength: min 8 chars, 1 uppercase, 1 digit, 1 special character ---
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_#\-]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters and include at least 1 uppercase letter, 1 number, and 1 special character (@$!%*?&_#-)."
            });
        }

        let existingUser = await User.findOne({ email: email.toLowerCase().trim() });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ fullName, city, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        // Return Mongoose validation error messages to the client
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages.join(' | ') });
        }
        console.error("Signup Error:", error.message);
        res.status(500).json({ message: "Server error during signup." });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials." });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

        const token = jwt.sign({ userId: user._id, city: user.city }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token,
            user: { fullName: user.fullName, city: user.city, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

// ==========================================
// 2. NEW: LIVE AQICN + AI ANALYSIS ROUTE (For Dashboard UI)
// ==========================================

// ==========================================
// STATION SEARCH ROUTE (AQICN → Nominatim fallback)
// ==========================================
app.get('/api/search-stations', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) return res.status(400).json({ error: 'Query too short.' });

        const AQICN_TOKEN = "669ee00d81d1573b034d4a135a34b6a012475a4c";
        let stations = [];

        // --- Try AQICN search first ---
        try {
            const aqiUrl = `https://api.waqi.info/search/?token=${AQICN_TOKEN}&keyword=${encodeURIComponent(q)}`;
            const aqiRes = await axios.get(aqiUrl);
            if (aqiRes.data.status === 'ok' && Array.isArray(aqiRes.data.data)) {
                stations = aqiRes.data.data
                    .filter(s => s.station && s.station.geo)
                    .slice(0, 8)
                    .map(s => ({
                        uid: s.uid,
                        name: s.station.name,
                        aqi: (s.aqi && s.aqi !== '-') ? (parseInt(s.aqi) || 0) : 0,
                        country: s.station.country || '',
                        lat: s.station.geo[0],
                        lon: s.station.geo[1],
                    }));
            } else {
                console.warn('AQICN search failed:', aqiRes.data);
            }
        } catch (aqiErr) {
            console.warn('AQICN search error, falling back to Nominatim:', aqiErr.message);
        }

        // --- Fallback: Nominatim geocoding if AQICN gave nothing ---
        if (stations.length === 0) {
            const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=6&addressdetails=1`;
            const nomRes = await axios.get(nomUrl, {
                headers: { 'User-Agent': 'HavaWatch-AQI-App/1.0', 'Accept-Language': 'en' }
            });

            stations = nomRes.data
                .filter(p => p.lat && p.lon)
                .slice(0, 6)
                .map((p, i) => {
                    // Extract country code from address details
                    const cc = (p.address && p.address.country_code)
                        ? p.address.country_code.toUpperCase()
                        : '';
                    const parts = p.display_name.split(',');
                    const label = parts.slice(0, 2).join(',').trim();
                    return {
                        uid: i,
                        name: label,
                        aqi: 0,          // no AQI available from geocoder
                        country: cc,
                        lat: Number(p.lat),
                        lon: Number(p.lon),
                    };
                });
        }

        res.json({ stations });
    } catch (error) {
        console.error('Station Search Error:', error.message);
        res.status(500).json({ error: 'Failed to search stations.' });
    }
});

app.post('/api/analyze-live-city', async (req, res) => {

    try {
        const { city } = req.body;

        // 🛑 PASTE YOUR AQICN TOKEN HERE 🛑
        const AQICN_TOKEN = "669ee00d81d1573b034d4a135a34b6a012475a4c";

        // Fetch live data from AQICN
        const waqiUrl = `https://api.waqi.info/feed/${city}/?token=${AQICN_TOKEN}`;
        const waqiResponse = await axios.get(waqiUrl);
        const aqiData = waqiResponse.data;


        if (aqiData.status !== "ok") {
            return res.status(404).json({ error: "City station not found or offline." });
        }

        // Extract pollutants (Fallback to 0 if sensor is missing)
        const iaqi = aqiData.data.iaqi;
        const modelInput = {
            pm25: iaqi.pm25 ? iaqi.pm25.v : 0,
            pm10: iaqi.pm10 ? iaqi.pm10.v : 0,
            no2: iaqi.no2 ? iaqi.no2.v : 0,
            so2: iaqi.so2 ? iaqi.so2.v : 0,
            co: iaqi.co ? iaqi.co.v : 0,
            o3: iaqi.o3 ? iaqi.o3.v : 0,
            hour: new Date().getHours()
        };

        // Send to Python AI
        const pythonResponse = await axios.post(`${ML_URL}/api/predict`, modelInput);
        const aiResult = pythonResponse.data;

        // Return combined data to React
        res.json({
            success: true,
            city_name: aqiData.data.city.name,
            live_aqi: aqiData.data.aqi,
            pollutants: modelInput,
            ai_analysis: aiResult
        });

    } catch (error) {
        console.error("Live Analysis Error:", error.message);
        res.status(500).json({ error: "Failed to fetch live data or connect to AI." });
    }
});

// ==========================================
// 3. MANUAL AI ANALYSIS ROUTE (For Manual Tester Card)
// ==========================================
app.post('/api/analyze', async (req, res) => {
    try {
        const { pm25, pm10, no2, so2, co, o3, hour } = req.body;

        // Send data to Python API
        const response = await axios.post(`${ML_URL}/api/predict`, {
            pm25, pm10, no2, so2, co, o3, hour
        });

        const mlResult = response.data;

        // Rule-Based Explainability
        let explanation = "General pollution increase detected.";
        if (pm25 > 80 && no2 > 50) {
            explanation = "High levels of PM2.5 and NO2 indicate heavy vehicular emissions.";
        } else if (pm10 > 100) {
            explanation = "Elevated PM10 levels suggest significant construction dust or road debris.";
        } else if (so2 > 15) {
            explanation = "Increased SO2 levels often correlate with industrial output.";
        }

        res.json({ ...mlResult, explanation });

    } catch (error) {
        console.error("Manual AI Service Error:", error.message);
        res.status(500).json({ error: "Could not connect to AI prediction service." });
    }
});

// ==========================================
// NEW: LAT/LON AUTO-LOCATION ROUTE
// ==========================================
app.post('/api/predict-latlon', async (req, res) => {
    try {
        const { lat, lon } = req.body;

        // Fetch Live OpenWeatherMap Pollution Data
        const KEY = "59a8f55e80d1f1554a362b6bc12785f9";
        const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${KEY}`;
        const response = await axios.get(url);

        let cityName = "Unknown Location";
        try {
            const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${KEY}`;
            const geoRes = await axios.get(geoUrl);
            if (geoRes.data && geoRes.data.length > 0) {
                cityName = geoRes.data[0].name;
            }
        } catch (geoErr) {
            console.error("Geocoding error:", geoErr.message);
        }

        if (!response.data || !response.data.list || response.data.list.length === 0) {
            return res.status(404).json({ error: "Could not retrieve pollution data for this location." });
        }

        const p = response.data.list[0].components;

        // Clean data for Python API
        const cleanData = {
            "PM2.5": p.pm2_5 || 0,
            "PM10": p.pm10 || 0,
            "NO2": p.no2 || 0,
            "SO2": p.so2 || 0,
            "CO": (p.co / 1000) || 0
        };

        // Send to Python AI
        const predictionResponse = await axios.post(
            `${ML_URL}/predict`,
            cleanData
        );

        // Fetch Historical Data (Last 30 hours for the trajectory chart)
        const end = Math.floor(Date.now() / 1000);
        const start = end - (30 * 60 * 60); // 30 hours ago
        const historyUrl = `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${start}&end=${end}&appid=${KEY}`;

        let history = [];
        try {
            const historyResponse = await axios.get(historyUrl);
            if (historyResponse.data && historyResponse.data.list) {
                // Return the last 30 hours of data
                history = historyResponse.data.list.slice(-30).map(item => ({
                    dt: item.dt,
                    aqi: item.main.aqi,
                    components: item.components
                }));
            }
        } catch (hErr) {
            console.error("History fetch error:", hErr.message);
        }

        res.json({
            success: true,
            city_name: cityName,
            pollution_data: cleanData,
            live_aqi: response.data.list[0].main.aqi || 2, // fallback
            predicted_cause: predictionResponse.data,
            history: history
        });


    } catch (error) {
        console.error("Predict Lat/Lon Error:", error.message);
        res.status(500).json({ error: "Failed to connect to ML service or Weather API." });
    }
});

// ==========================================
// 4. DISPATCH ALERT ROUTE
// ==========================================
app.post('/api/alerts/send', async (req, res) => {
    try {
        const { city, cause, level, authority } = req.body;

        console.log(`📢 DISPATCHING ALERT: ${authority} notified about ${cause} in ${city}`);

        const newAlert = new Alert({
            city,
            cause,
            aqiValue: level,
            authority
        });
        await newAlert.save();

        res.json({ success: true, message: `Alert dispatched to ${authority}` });
    } catch (error) {
        res.status(500).json({ error: "Failed to dispatch alert." });
    }
});

// ==========================================
// 5. HARDWARE IOT SENSOR ROUTE (Optional for Physical Devices)
// ==========================================
app.post('/api/sensor-data', async (req, res) => {
    const incomingData = req.body;

    try {
        const pythonResponse = await axios.post(`${ML_URL}/api/predict`, incomingData);
        const prediction = pythonResponse.data;

        const enrichedData = {
            ...incomingData,
            ...prediction
        };

        io.emit('liveAqiUpdate', enrichedData);
        res.status(200).send("Data processed and broadcasted to dashboard");
    } catch (error) {
        console.error("Hardware Sensor Error:", error.message);
        res.status(500).send("Processing failed");
    }
});

// ==========================================
// 6. USER HISTORY ROUTES (For Profile Section)
// ==========================================

// Helper middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/user/history', authenticateToken, async (req, res) => {
    try {
        const { cause, aqi, city } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.history.push({ cause, aqi, city });
        await user.save();

        res.status(200).json({ success: true, message: 'History saved successfully' });
    } catch (error) {
        console.error("Save History Error:", error.message);
        res.status(500).json({ error: 'Server error saving history' });
    }
});

app.get('/api/user/history', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Return latest history first
        res.status(200).json(user.history.sort((a, b) => b.date - a.date));
    } catch (error) {
        console.error("Get History Error:", error.message);
        res.status(500).json({ error: 'Server error retrieving history' });
    }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`🚀 HavaWatch Backend Server running on http://localhost:${PORT}`);
});