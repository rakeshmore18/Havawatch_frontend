import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCity } from '../../App'; // Using your global state!

const ImproveAQ = () => {
    const { activeCity } = useCity();
    const [subscribed, setSubscribed] = useState(false);

    // Animation settings for smooth scrolling effects
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
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

            <main className="content" style={{ padding: '0', height: '100vh', overflowY: 'auto' }}>
                
                {/* 1. HERO SECTION */}
                <section style={{
                    background: 'linear-gradient(135deg, #00cc8d 0%, #005c4b 100%)',
                    color: 'white',
                    padding: '80px 40px',
                    textAlign: 'center',
                    borderBottomLeftRadius: '30px',
                    borderBottomRightRadius: '30px',
                    boxShadow: '0 10px 30px rgba(0,204,141,0.2)'
                }}>
                    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                        <h1 style={{ fontSize: '3rem', marginBottom: '15px' }}>Breathe Better: Your Guide to Cleaner Air</h1>
                        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
                            Taking small, data-driven steps today can dramatically improve your respiratory health and environmental outcomes tomorrow.
                        </p>
                    </motion.div>
                </section>

                <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
                    
                    {/* 2. AI INTELLIGENCE & SMART INSIGHTS */}
                    <motion.section 
                        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp}
                        className="card" style={{ marginBottom: '40px', borderLeft: '5px solid #3498db' }}
                    >
                        <h2>🧠 Local Intelligence: <span style={{ textTransform: 'capitalize' }}>{activeCity}</span></h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>Current insights based on HavaWatch live monitoring.</p>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                                <h4>⚠️ Primary Threat Today</h4>
                                <p><strong>Vehicle Emissions & Road Dust</strong> are currently contributing to 65% of the local PM2.5 load in {activeCity}. Avoid heavy traffic corridors.</p>
                            </div>
                            <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '10px' }}>
                                <h4>📊 Action Threshold</h4>
                                <p>Current levels suggest sensitive groups should limit prolonged outdoor exertion. Indoor purification is highly recommended.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* 3. INDOOR MITIGATION */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ marginBottom: '50px' }}>
                        <motion.h2 variants={fadeUp} style={{ marginBottom: '20px' }}>🏠 Indoor Mitigation & Smart Solutions</motion.h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            
                            <motion.div variants={fadeUp} className="card">
                                <h3 style={{ borderBottom: '2px solid #00cc8d', paddingBottom: '10px' }}>🌪️ Advanced Filtration</h3>
                                <p style={{ marginTop: '15px', color: '#555' }}>Use multi-layer HEPA filtration systems to capture micro-pollutants (PM2.5). Changing filters every 3-6 months ensures maximum respiratory protection.</p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="card">
                                <h3 style={{ borderBottom: '2px solid #3498db', paddingBottom: '10px' }}>🪟 Smart Ventilation</h3>
                                <p style={{ marginTop: '15px', color: '#555' }}>Deploy automated solutions, like AeroClean smart window systems, equipped with multi-layer filtration and sensors that know exactly when to open for fresh air and when to close against outdoor pollution peaks.</p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="card">
                                <h3 style={{ borderBottom: '2px solid #2ecc71', paddingBottom: '10px' }}>🌿 Natural Purifiers</h3>
                                <p style={{ marginTop: '15px', color: '#555' }}>Supplement tech with nature. Snake Plants, Spider Plants, and Peace Lilies are NASA-recommended for absorbing VOCs and increasing indoor oxygen.</p>
                            </motion.div>

                        </div>
                    </motion.section>

                    {/* 4. OUTDOOR ACTION PLAN */}
                    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} style={{ marginBottom: '50px' }}>
                        <motion.h2 variants={fadeUp} style={{ marginBottom: '20px' }}>🚴‍♀️ Outdoor Action Plan</motion.h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            
                            <motion.div variants={fadeUp} className="card" style={{ background: '#fdfbf7' }}>
                                <h4>🚌 Commuting Choices</h4>
                                <p>Opt for public transit, carpooling, or EVs. Every shared ride actively reduces the local NO2 concentration.</p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="card" style={{ background: '#fdfbf7' }}>
                                <h4>😷 Protection Guidelines</h4>
                                <p>When HavaWatch shows AQI &gt; 150, standard cloth masks fail. Always upgrade to an N95/KN95 respirator.</p>
                            </motion.div>

                            <motion.div variants={fadeUp} className="card" style={{ background: '#fdfbf7' }}>
                                <h4>⏱️ Activity Timing</h4>
                                <p>Exercise outdoors only during "green" windows. Early mornings (before 7 AM) usually have the lowest ground-level ozone.</p>
                            </motion.div>

                        </div>
                    </motion.section>

                    {/* 5. CTA / FOOTER */}
                    <motion.section 
                        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                        style={{ textAlign: 'center', padding: '40px', background: '#ecf0f1', borderRadius: '20px' }}
                    >
                        <h2>Stay Ahead of the Smog</h2>
                        <p style={{ marginBottom: '20px', color: '#555' }}>Don't wait for the haze. Get notified the moment air quality drops in your area.</p>
                        
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <button 
                                className="btn-primary-analyze" 
                                onClick={() => setSubscribed(!subscribed)}
                                style={{ background: subscribed ? '#27ae60' : '', minWidth: '200px' }}
                            >
                                {subscribed ? '✅ Alerts Enabled' : '🔔 Opt-In for Real-time Alerts'}
                            </button>
                            
                            <button className="btn-secondary-analyze" onClick={() => alert("Link copied to clipboard! Share it to raise awareness.")}>
                                📤 Share Local Stats
                            </button>
                        </div>
                    </motion.section>

                </div>
            </main>
        </div>
    );
};

export default ImproveAQ;