import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MapPage = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div className="havawatch-theme" style={{ background: '#f8fafc', minHeight: '100vh' }}>
            <main className="main-content" style={{ padding: '30px 0' }}>
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    
                    {/* Header Section */}
                    <header className="page-header" data-aos="fade-down" style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '20px' 
                    }}>
                        <div className="title-area">
                            <h2 style={{ color: '#002d62', margin: 0, fontSize: '1.8rem' }}>National Air Quality Map</h2>
                            <p style={{ color: '#64748b', margin: '5px 0 0' }}>Real-time visual distribution of AQI across India.</p>
                        </div>
                        <div className="header-actions">
                             <Link to="/" className="btn-secondary" style={{ 
                                 padding: '10px 20px', 
                                 borderRadius: '30px', 
                                 textDecoration: 'none',
                                 fontSize: '14px',
                                 background: '#ffffff',
                                 border: '1px solid #e2e8f0',
                                 color: '#475569',
                                 fontWeight: '600'
                             }}>
                                ← Back to Home
                             </Link>
                        </div>
                    </header> 

                    {/* Themed Map Card */}
                    <div className="card map-viz-card" data-aos="zoom-in" data-aos-delay="100" style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                        border: '1px solid #f1f5f9'
                    }}>
                        
                        {/* THE CROPPER CONTAINER */}
                        <div className="map-window" style={{ 
                            width: '100%', 
                            height: '75vh', 
                            borderRadius: '12px', 
                            overflow: 'hidden', /* This hides the parts of the iframe that stick out */
                            border: '1px solid #e2e8f0',
                            position: 'relative'
                        }}>
                            {/* THE IFRAME WITH OFFSETS */}
                            <iframe 
                                src="https://aqicn.org/map/india/" 
                                style={{ 
                                    width: '100%', 
                                    height: 'calc(100% + 120px)', /* Make it taller to compensate for the crop */
                                    border: 'none',
                                    position: 'absolute',
                                    top: '-100px' /* This "pushes" the blue bar UP and out of view */
                                }}
                                title="Clean Air Quality Map"
                                loading="lazy"
                            ></iframe>
                        </div>

                        <div className="map-footer-info" style={{ 
                            marginTop: '15px', 
                            padding: '10px 15px', 
                            background: '#f0fdf4', 
                            borderRadius: '8px',
                            fontSize: '13px',
                            color: '#166534'
                        }}>
                            <p style={{ margin: 0 }}>💡 <strong>Note:</strong> This map shows live data from global monitoring stations. Scroll to zoom into specific regions.</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default MapPage;