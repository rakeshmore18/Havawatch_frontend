import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Analytics = () => {
    // Simulated historical database
    const [logs] = useState([
        { id: "LOG-892", date: "2026-03-24", time: "08:15 AM", city: "Nashik", aqi: 156, cause: "Traffic Congestion", status: "Resolved" },
        { id: "LOG-891", date: "2026-03-23", time: "14:30 PM", city: "Mumbai", aqi: 210, cause: "Industrial Emissions", status: "Pending Action" },
        { id: "LOG-890", date: "2026-03-22", time: "19:00 PM", city: "Pune", aqi: 145, cause: "Construction Dust", status: "Resolved" },
        { id: "LOG-889", date: "2026-03-21", time: "07:45 AM", city: "Nagpur", aqi: 110, cause: "Biomass Burning", status: "Investigating" },
        { id: "LOG-888", date: "2026-03-20", time: "11:20 AM", city: "Nashik", aqi: 182, cause: "Industrial Leak", status: "Resolved" },
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = logs.filter(log => 
        log.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.cause.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-wrapper">
            <Sidebar />
            
            <main className="content">
                <header className="top-bar-premium" style={{ marginBottom: '30px' }}>
                    <div className="greeting-section">
                        <h1>Historical Analytics Log</h1>
                        <p>Review past anomalies and documented AI cause predictions.</p>
                    </div>
                    <button className="btn-live-sync" onClick={() => alert("Downloading CSV Report...")}>
                        Export Report
                    </button>
                </header>

                <div className="bento-card col-span-1" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0 }}>Anomaly Incident Records</h3>
                        <input 
                            type="text" 
                            placeholder="Search regions or sources..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', width: '250px' }}
                        />
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <th style={{ padding: '20px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Log ID</th>
                                    <th style={{ padding: '20px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Timestamp</th>
                                    <th style={{ padding: '20px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Sector</th>
                                    <th style={{ padding: '20px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Peak AQI</th>
                                    <th style={{ padding: '20px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>AI Diagnosis</th>
                                    <th style={{ padding: '20px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' }}>Resolution</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '20px 25px', fontFamily: 'monospace', color: '#94a3b8' }}>{log.id}</td>
                                        <td style={{ padding: '20px 25px', color: '#334155' }}><strong>{log.date}</strong> <br/><span style={{ fontSize: '0.85rem', color: '#64748b' }}>{log.time}</span></td>
                                        <td style={{ padding: '20px 25px', fontWeight: '700', color: '#0f172a' }}>{log.city}</td>
                                        <td style={{ padding: '20px 25px', color: log.aqi > 150 ? '#ef4444' : '#f59e0b', fontWeight: '800', fontSize: '1.2rem' }}>{log.aqi}</td>
                                        <td style={{ padding: '20px 25px', color: '#334155', fontWeight: '500' }}>{log.cause}</td>
                                        <td style={{ padding: '20px 25px' }}>
                                            <span style={{ 
                                                padding: '6px 14px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.85rem',
                                                fontWeight: '700',
                                                backgroundColor: log.status === 'Resolved' ? '#e0ece8' : '#fee2e2',
                                                color: log.status === 'Resolved' ? '#10b981' : '#ef4444'
                                            }}>
                                                {log.status === 'Resolved' ? '✓ Resolved' : '⚠ Action Needed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLogs.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontStyle: 'italic' }}>No records match your global query.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;