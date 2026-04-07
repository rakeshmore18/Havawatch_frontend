import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MeasureAQ = () => {
    // Animation variants
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <div className="dashboard-wrapper">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <div className="logo">🌿 Hava<span>Watch</span></div>
                <nav>
                    <Link to="/">🏠 Home</Link>
                    <Link to="/dashboard">📊 Live Data</Link>
                    <Link to="/map">🗺️ Map</Link>
                    <Link to="/learn" className="active">📚 Learn</Link>
                    {localStorage.getItem('token') ? <Link to="/profile">👤 Profile</Link> : <Link to="/auth">🔐 Login</Link>}
                </nav>
            </aside>

            <main className="content" style={{ padding: '0', height: '100vh', overflowY: 'auto', backgroundColor: '#f4f7f6' }}>
                
                {/* 1. HERO SECTION */}
                <section style={{
                    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                    color: 'white',
                    padding: '80px 40px',
                    textAlign: 'center',
                    borderBottomLeftRadius: '30px',
                    borderBottomRightRadius: '30px',
                    boxShadow: '0 10px 30px rgba(52, 152, 219, 0.2)',
                    position: 'relative'
                }}>
                    <Link to="/learn" style={{ position: 'absolute', top: '20px', left: '30px', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontWeight: 'bold' }}>
                        ← Back to Learn Hub
                    </Link>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>Making the Invisible, Visible</h1>
                        <p style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto', opacity: 0.9 }}>
                            Air pollution is often invisible to the naked eye. Learn how the Air Quality Index (AQI) works and what our sensors are actually measuring in the atmosphere.
                        </p>
                    </motion.div>
                </section>

                <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                    
                    {/* 2. THE AQI SCALE EXPLAINED */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} style={{ marginBottom: '50px' }}>
                        <motion.h2 variants={fadeUp} style={{ marginBottom: '20px', color: '#2c3e50' }}>Understanding the AQI Scale</motion.h2>
                        <motion.p variants={fadeUp} style={{ color: '#666', marginBottom: '30px', fontSize: '1.1rem' }}>
                            Think of the AQI as a yardstick that runs from 0 to 500. The higher the AQI value, the greater the level of air pollution and the greater the health concern.
                        </motion.p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                            {/* AQI Blocks */}
                            <motion.div variants={fadeUp} style={{ background: '#00cc8d', color: 'white', padding: '20px', borderRadius: '15px' }}>
                                <h2 style={{ margin: 0 }}>0 - 50</h2>
                                <h3>Good</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Air quality is satisfactory, and air pollution poses little or no risk.</p>
                            </motion.div>
                            <motion.div variants={fadeUp} style={{ background: '#f1c40f', color: '#333', padding: '20px', borderRadius: '15px' }}>
                                <h2 style={{ margin: 0 }}>51 - 100</h2>
                                <h3>Moderate</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Acceptable, but there may be a risk for some people who are unusually sensitive.</p>
                            </motion.div>
                            <motion.div variants={fadeUp} style={{ background: '#f39c12', color: 'white', padding: '20px', borderRadius: '15px' }}>
                                <h2 style={{ margin: 0 }}>101 - 150</h2>
                                <h3>Unhealthy for Sensitive Groups</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>General public is less likely to be affected, but sensitive groups may experience health effects.</p>
                            </motion.div>
                            <motion.div variants={fadeUp} style={{ background: '#e74c3c', color: 'white', padding: '20px', borderRadius: '15px' }}>
                                <h2 style={{ margin: 0 }}>151 - 200</h2>
                                <h3>Unhealthy</h3>
                                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Some members of the general public may experience health effects; sensitive groups may experience more serious effects.</p>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* 3. THE CULPRITS (POLLUTANTS) */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ marginBottom: '50px' }}>
                        <motion.h2 variants={fadeUp} style={{ marginBottom: '20px', color: '#2c3e50' }}>The Primary Pollutants</motion.h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <motion.div variants={fadeUp} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ background: '#e8f4f8', color: '#3498db', padding: '20px', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    PM2.5
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>Fine Particulate Matter</h3>
                                    <p style={{ margin: 0, color: '#555' }}>Particles less than 2.5 micrometers in diameter. They are so small they can penetrate deeply into the lungs and enter the bloodstream. Primarily caused by vehicle exhaust, burning of fuels, and fires.</p>
                                </div>
                            </motion.div>

                            <motion.div variants={fadeUp} className="card" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ background: '#fcf3e8', color: '#e67e22', padding: '20px', borderRadius: '50%', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                    NO₂
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>Nitrogen Dioxide</h3>
                                    <p style={{ margin: 0, color: '#555' }}>A highly reactive gas that primarily gets in the air from the burning of fuel. It forms from emissions from cars, trucks and buses, power plants, and off-road equipment.</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>

                    {/* 4. HOW SENSORS WORK */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="card" style={{ background: '#fff', border: '1px solid #eee' }}>
                        <h2 style={{ marginBottom: '15px', color: '#2c3e50' }}>🔬 How Do HavaWatch Sensors Work?</h2>
                        <p style={{ color: '#555', lineHeight: '1.6' }}>
                            Our physical IoT monitoring stations use **Laser Scattering Technology**. A tiny fan pulls environmental air into a chamber where a laser beam is shining. When microscopic PM2.5 and PM10 particles cross the laser, the light scatters. 
                            <br/><br/>
                            A photo-detector measures this scattered light and an onboard microprocessor (like an ESP32) translates that light disruption into a precise particle count. This data is then instantly broadcast to our Node.js servers over Wi-Fi, passing through our AI engine to identify the source before appearing on your dashboard.
                        </p>
                        
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <Link to="/dashboard">
                                <button className="btn-primary-analyze">View Live Sensor Data</button>
                            </Link>
                        </div>
                    </motion.section>

                </div>
            </main>
        </div>
    );
};

export default MeasureAQ;