import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MapComponent from '../components/Map';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../config';

const MapPage = () => {
    const [mapData, setMapData] = useState({});
    const [loading, setLoading] = useState(true);

    const citiesToTrack = ['mumbai', 'pune', 'nashik', 'nagpur', 'delhi', 'bangalore'];

    useEffect(() => {
        const fetchAllCities = async () => {
            setLoading(true);
            const newData = {};

            for (const city of citiesToTrack) {
                try {
                    const response = await fetch(`${API_URL}/api/analyze-live-city`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ city })
                    });
                    
                    const result = await response.json();
                    if (!result.error) {
                        newData[city] = {
                            aqi: result.live_aqi,
                            pm25: result.pollutants.pm25,
                            no2: result.pollutants.no2,
                            cause: result.ai_analysis.dominant_cause
                        };
                    }
                } catch (error) {
                    console.error(`Failed to fetch ${city}`);
                }
            }
            
            setMapData(newData);
            setLoading(false);
        };

        fetchAllCities();
    }, []);

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <main className="content" style={{ display: 'flex', flexDirection: 'column' }}>
                <header className="top-bar-premium" style={{ marginBottom: '30px' }}>
                    <div className="greeting-section">
                        <h1>Macro Environment Atlas</h1>
                        <p>Real-time geospatial plotting of major API nodes.</p>
                    </div>
                    {loading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', fontWeight: '600' }}>
                            <span className="pulse-dot"></span> Fetching Node Telemetry
                        </div>
                    )}
                </header>

                <div className="bento-card" style={{ flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column', padding: '15px' }}>
                    <div style={{ flex: 1, borderRadius: '15px', overflow: 'hidden' }}>
                        <MapComponent data={mapData} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MapPage;