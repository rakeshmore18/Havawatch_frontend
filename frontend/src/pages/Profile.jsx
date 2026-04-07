import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ fullName: '', email: '', city: '' });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!token) {
            navigate('/auth');
        } else if (savedUser) {
            setUserData(JSON.parse(savedUser));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <main className="content">
                <header className="top-bar-premium" style={{ marginBottom: '20px' }}>
                    <div className="greeting-section">
                        <h1>Platform Identity</h1>
                        <p>Manage your telemetry preferences and secure access.</p>
                    </div>
                    <button onClick={handleLogout} className="btn-live-sync" style={{ background: 'transparent', border: '2px solid #ef4444', color: '#ef4444', boxShadow: 'none' }}>
                        Disconnect Session
                    </button>
                </header>

                <div className="bento-grid">
                    {/* User Identity Card */}
                    <div className="bento-card col-span-2">
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>Identity Overview</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                                {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 5px 0' }}>{userData.fullName}</h2>
                                <span style={{ background: '#e0ece8', color: '#059669', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Active Node Administrator</span>
                            </div>
                        </div>
                    </div>

                    {/* Regional Settings Card */}
                    <div className="bento-card col-span-1">
                        <h3>📍 Primary Sector</h3>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <div style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '800' }}>{userData.city}</div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '10px 0 0 0' }}>Your default geographic lock for automated data synchronization.</p>
                        </div>
                    </div>

                    {/* Security Info Card */}
                    <div className="bento-card col-span-1">
                        <h3>🔐 Access Protocols</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Account Email</span>
                                <strong style={{ color: '#0f172a' }}>{userData.email}</strong>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#64748b' }}>Network State</span>
                                <strong style={{ color: '#10b981' }}>Secured</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;