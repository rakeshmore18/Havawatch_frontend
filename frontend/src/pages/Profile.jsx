import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../config';

const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ fullName: '', email: '', city: '' });
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (!token) {
            navigate('/auth');
        } else if (savedUser) {
            setUserData(JSON.parse(savedUser));
            // Fetch history from backend
            fetch(`${API_URL}/api/user/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setHistory(data);
            })
            .catch(err => console.error(err));
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
                        <h1>User Profile</h1>
                        <p>Manage your account and view your air pollution scan history.</p>
                    </div>
                    <button onClick={handleLogout} className="btn-live-sync" style={{ background: 'transparent', border: '2px solid #ef4444', color: '#ef4444', boxShadow: 'none' }}>
                        🚪 Logout
                    </button>
                </header>

                <div className="bento-grid">
                    {/* User Identity Card */}
                    <div className="bento-card col-span-2">
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>Profile Details</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
                                {userData.fullName ? userData.fullName.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.8rem', color: '#0f172a', margin: '0 0 5px 0' }}>{userData.fullName}</h2>
                                <span style={{ background: '#e0ece8', color: '#059669', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>Active User</span>
                            </div>
                        </div>
                    </div>

                    {/* Security Info Card */}
                    <div className="bento-card col-span-1">
                        <h3>🔐 Account Security</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Account Email</span>
                                <strong style={{ color: '#0f172a', wordBreak: 'break-all' }}>{userData.email}</strong>
                            </div>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#64748b' }}>Account Status</span>
                                <strong style={{ color: '#10b981' }}>Active</strong>
                            </div>
                        </div>
                    </div>

                    {/* Regional Settings Card */}
                    <div className="bento-card col-span-1">
                        <h3>📍 Your City</h3>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <div style={{ fontSize: '2.2rem', color: '#0f172a', fontWeight: '800' }}>{userData.city}</div>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '10px 0 0 0' }}>Your primary location for checking air pollution.</p>
                        </div>
                    </div>

                    {/* History Section Card */}
                    <div className="bento-card col-span-2">
                        <h3 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>📜 Location Scan History</h3>
                        {history.length === 0 ? (
                            <p style={{ color: '#64748b', marginTop: '15px' }}>No scans have been recorded yet. Visit the Dashboard to check your local air quality.</p>
                        ) : (
                            <div style={{ marginTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                                {history.map((record, index) => (
                                    <div key={index} style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong style={{ color: '#0f172a', display: 'block', marginBottom: '5px' }}>{record.city}</strong>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{new Date(record.date).toLocaleString()}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <strong style={{ color: '#ef4444', display: 'block', fontSize: '1.1rem' }}>Cause: {record.cause || 'Unknown'}</strong>
                                            <span style={{ fontSize: '0.9rem', color: '#f59e0b', fontWeight: '600' }}>AQI: {record.aqi}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;