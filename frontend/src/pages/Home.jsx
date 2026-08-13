import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { title: "Distributed Sensor Network", desc: "Our system integrates seamlessly with millions of OpenWeatherMap endpoints globally, ensuring spatial telemetry is never stale.", ping: "delay-1" },
        { title: "Machine Learning Core", desc: "A robust Python backend utilizes ensemble methods to match microscopic particulate data to historical offender profiles.", ping: "delay-2" },
        { title: "Human-Computer Adaptation", desc: "Complex environmental hazards are converted into simple, actionable GUI advice cards tailored to your respiratory tolerances.", ping: "" }
    ];

    return (
        <div className="home-page">
            <Navbar />

            {/* 1. HERO ULTRA SECTION (LIGHT THEME) */}
            <header className="hero-ultra">
                <div className="hero-bg-grid"></div>
                <div className="hero-glow"></div>

                <div className="hero-content">
                    <div className="hero-badge-ultra">
                        <span className="pulse-dot"></span> Live Model Accuracy: 94.2%
                    </div>

                    <h1 className="hero-title-ultra">
                        Predict the air <br />
                        before you <span>breathe it.</span>
                    </h1>

                    <p className="hero-desc-ultra">
                        HavaWatch uses spatial neural arrays to predict pollution sources in real-time.
                        Don't just track AQI. Understand what's causing it.
                    </p>

                    <div className="hero-actions-ultra">
                        <Link to="/auth" className="btn-glowing">Initiate Secure Access</Link>
                        <Link to="/map" className="btn-outline-dark">Explore Global Network</Link>
                    </div>
                </div>

                {/* Simulated Floating Mockup overlay */}
                <div className="hero-mockup-container">
                    <div className="hero-mockup">
                        <div className="mockup-header">
                            <div className="mockup-dot md-r"></div>
                            <div className="mockup-dot md-y"></div>
                            <div className="mockup-dot md-g"></div>
                        </div>
                        <div className="mockup-body">
                            <div className="mb-col">
                                <div className="mb-lbl">Particulate 2.5</div>
                                <div className="mb-val" style={{ color: '#ef4444' }}>148<span style={{ fontSize: '1rem' }}>µg</span></div>
                                <div className="mb-lbl" style={{ color: '#ef4444' }}>Critical Alert</div>
                            </div>
                            <div className="mb-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div className="mb-lbl">Source Prediction Matrix</div>
                                <div><span style={{ color: '#1e293b', fontWeight: 'bold' }}>84%</span> Traffic Congestion</div>
                                <div className="mb-bar"><div className="mb-fill" style={{ width: '84%', background: '#ef4444' }}></div></div>
                                <div style={{ marginTop: '10px' }}><span style={{ color: '#1e293b', fontWeight: 'bold' }}>12%</span> Industry</div>
                                <div className="mb-bar"><div className="mb-fill" style={{ width: '12%', background: '#f59e0b' }}></div></div>
                            </div>
                            <div className="mb-col">
                                <div className="mb-lbl">Node Ping</div>
                                <div className="mb-val" style={{ color: '#10b981' }}>24<span style={{ fontSize: '1rem' }}>ms</span></div>
                                <div className="mb-lbl">Secure</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 2. TRUST LOGOS STRIP */}
            <div className="trust-strip-light">
                <p>Infrastructure powered by modern engineering</p>
                <div className="trust-logos">
                    <div className="trust-logo-txt">OpenWeather</div>
                    <div className="trust-logo-txt">MongoDB Atlas</div>
                    <div className="trust-logo-txt">Python Data Science</div>
                    <div className="trust-logo-txt">React.js</div>
                </div>
            </div>

            {/* 3. HCI DRIVEN TABS FOR UX SIMPLICITY */}
            <section className="light-section" id="how-it-works">
                <div className="ds-container">
                    <div className="ds-header">
                        <h2>Architected for Clarity</h2>
                        <p>We apply strict HCI principles to reduce cognitive load. You don't need a PhD in climatology to understand complex atmospheric telemetry anymore.</p>
                    </div>

                    <div className="hci-grid">
                        {/* Interactive Text Blocks */}
                        <div className="hci-text-blocks">
                            {tabs.map((tab, index) => (
                                <div
                                    key={index}
                                    className={`hci-block ${activeTab === index ? 'active' : ''}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <h3>{tab.title}</h3>
                                    <p>{tab.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Interactive Visual Radar based on active tab */}
                        <div className="hci-visual">
                            <div className="radar-core"></div>
                            {activeTab === 0 && (
                                <>
                                    <div className="radar-ping"></div>
                                    <div className="radar-ping delay-1"></div>
                                    <div className="radar-ping delay-2"></div>
                                </>
                            )}
                            {activeTab === 1 && (
                                <h3 style={{ color: '#10b981', position: 'absolute', fontFamily: 'monospace', fontSize: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', padding: '10px 20px', borderRadius: '10px' }}>
                                    model.predict(X_test)
                                </h3>
                            )}
                            {activeTab === 2 && (
                                <div style={{ background: '#e0f2fe', padding: '20px', borderRadius: '15px', color: '#0369a1', border: '1px solid #7dd3fc', fontWeight: '700', zIndex: 10 }}>
                                    ✅ Safe to go outside.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. PERFORMANCE METRICS */}
            <section className="metrics-section">
                <div className="metrics-grid">
                    <div className="metric-item">
                        <h4>200<span>ms</span></h4>
                        <p>Inference Time</p>
                    </div>
                    <div className="metric-item">
                        <h4>1000<span>+</span></h4>
                        <p>Global Endpoints</p>
                    </div>
                    <div className="metric-item">
                        <h4>84<span>%</span></h4>
                        <p>Model Confidence</p>
                    </div>
                    <div className="metric-item">
                        <h4>0</h4>
                        <p>Carbon Impact</p>
                    </div>
                </div>
            </section>

            {/* 5. USE CASES (ENTERPRISE / PERSONAL) */}
            <section className="use-case-section">
                <div className="ds-container">
                    <div className="ds-header">
                        <h2>Scalable Intelligence</h2>
                    </div>
                    <div className="uc-grid">
                        <div className="uc-card">
                            <div className="uc-icon">🏙️</div>
                            <h3>Municipal Governance</h3>
                            <p>City planners use our API to detect real-time heavy industry leaks and automatically trigger traffic redirection protocols via smart-city integration.</p>
                        </div>
                        <div className="uc-card">
                            <div className="uc-icon">🏥</div>
                            <h3>Clinical Health</h3>
                            <p>Hospitals integrate our predictive matrix to prepare asthma wards ahead of incoming wind-carried smog blocks.</p>
                        </div>
                        <div className="uc-card">
                            <div className="uc-icon">🏠</div>
                            <h3>Personal Optimization</h3>
                            <p>Citizens sync our dashboard alerts to automate their smart home HEPA filtration speeds precisely when PM2.5 levels spike.</p>
                        </div>
                    </div>
                </div>
            </section>
            <div className="disclaimer-box" data-aos="fade-up">
                <span className="disclaimer-icon">⚠️</span>
                <p>
                    <strong>Disclaimer:</strong> HavaWatch uses machine learning models and third-party sensor data to provide pollution insights.
                    While we strive for high accuracy, the system may occasionally provide incorrect results or "false positives" due to sensor
                    calibration issues, data latency, or unpredictable environmental factors. Always follow local health authority guidelines.
                </p>
            </div>
            {/* 6. MEGA FOOTER (STAYS DARK FOR CONTRAST) */}
            <footer className="footer-mega">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h2>Hava<span>Watch</span></h2>
                        <p>The definitive source for predictive atmospheric telemetry and AI-driven mitigation strategies.</p>


                    </div>

                    <div className="f-menu">
                        <h4>Platform Elements</h4>
                        <ul>
                            <li><Link to="/dashboard">HavaWatch Workspace</Link></li>
                            <li><Link to="/map">Live Sensor Map</Link></li>
                            <li><Link to="/analytics">Anomaly Logs</Link></li>
                            <li><Link to="/auth">Authenticate User</Link></li>
                        </ul>
                    </div>

                    <div className="f-menu">
                        <h4>Developers</h4>
                        <ul>
                            <li><a href="#">Read Docs</a></li>
                            <li><a href="#">Python ML Repository</a></li>
                            <li><a href="#">API Endpoints</a></li>
                            <li><a href="#">NPM Packages</a></li>
                        </ul>
                    </div>

                    <div className="f-menu">
                        <h4>HavaWatch Legal</h4>
                        <ul>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Data Privacy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 HavaWatch Intelligent Systems. All rights guarded.</p>
                    <p>Designed with strictly enforced HCI heuristics.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;