import React, { useState, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import Sidebar from '../components/Sidebar';
import { API_URL } from '../config';

const getAqiLabel = (aqi) => {
    if (aqi <= 50) return { text: 'Good', color: '#10b981' };
    if (aqi <= 100) return { text: 'Moderate', color: '#f59e0b' };
    if (aqi <= 150) return { text: 'Unhealthy (SG)', color: '#f97316' };
    if (aqi <= 200) return { text: 'Unhealthy', color: '#ef4444' };
    if (aqi <= 300) return { text: 'Very Unhealthy', color: '#7c3aed' };
    return { text: 'Hazardous', color: '#991b1b' };
};

const Analytics = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('login');
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API_URL}/api/user/history`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                setError('login');
                setLoading(false);
                return;
            }
            const data = await res.json();
            setHistory(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('fetch');
        } finally {
            setLoading(false);
        }
    };

    const filteredHistory = history.filter(h =>
        (h.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.cause || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats
    const totalScans = history.length;
    const avgAqi = totalScans > 0 ? Math.round(history.reduce((sum, h) => sum + (h.aqi || 0), 0) / totalScans) : 0;
    const worstEntry = history.reduce((worst, h) => (h.aqi || 0) > (worst.aqi || 0) ? h : worst, { aqi: 0 });
    const uniqueCities = [...new Set(history.map(h => h.city).filter(Boolean))].length;

    // Cause breakdown for doughnut
    const causeCount = {};
    history.forEach(h => {
        const cause = h.cause || 'Unknown';
        causeCount[cause] = (causeCount[cause] || 0) + 1;
    });
    const causeLabels = Object.keys(causeCount);
    const causeData = Object.values(causeCount);
    const causeColors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1', '#14b8a6'];

    // AQI trend line (last 20 entries, chronological)
    const trendEntries = [...history].reverse().slice(-20);
    const trendLabels = trendEntries.map((h, i) => {
        if (h.date) {
            const d = new Date(h.date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        return `#${i + 1}`;
    });
    const trendData = trendEntries.map(h => h.aqi || 0);

    const exportCSV = () => {
        if (history.length === 0) return alert("No data to export.");
        const headers = ['Date', 'City', 'AQI', 'Cause'];
        const rows = history.map(h => [
            h.date ? new Date(h.date).toLocaleString() : 'N/A',
            h.city || 'N/A',
            h.aqi || 0,
            h.cause || 'N/A'
        ]);
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `havawatch_history_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <Sidebar />
                <main className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '15px' }}>⏳</div>
                        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Loading your analytics...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (error === 'login') {
        return (
            <div className="dashboard-wrapper">
                <Sidebar />
                <main className="content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="bento-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '500px' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                        <h2 style={{ color: '#0f172a', marginBottom: '10px' }}>Authentication Required</h2>
                        <p style={{ color: '#64748b', marginBottom: '25px' }}>Please log in to view your personalized analytics and search history.</p>
                        <a href="/auth" className="btn-live-sync" style={{ textDecoration: 'none', display: 'inline-block' }}>Go to Login</a>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper">
            <Sidebar />

            <main className="content">
                {/* HEADER */}
                <header className="top-bar-premium" style={{ marginBottom: '30px' }}>
                    <div className="greeting-section">
                        <h1>📊 Your Analytics</h1>
                        <p>Personal air quality search history & insights</p>
                    </div>
                    <button className="btn-live-sync" onClick={exportCSV}>
                        📥 Export CSV
                    </button>
                </header>

                {/* STATS ROW */}
                <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '30px' }}>
                    <div className="bento-card" style={{ textAlign: 'center', padding: '25px' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Total Scans</p>
                        <h2 style={{ color: '#0f172a', fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>{totalScans}</h2>
                    </div>
                    <div className="bento-card" style={{ textAlign: 'center', padding: '25px' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Average AQI</p>
                        <h2 style={{ color: avgAqi > 100 ? '#ef4444' : '#10b981', fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>{avgAqi}</h2>
                    </div>
                    <div className="bento-card" style={{ textAlign: 'center', padding: '25px' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Worst Recorded</p>
                        <h2 style={{ color: '#ef4444', fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>{worstEntry.aqi || '—'}</h2>
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '4px' }}>{worstEntry.city || ''}</p>
                    </div>
                    <div className="bento-card" style={{ textAlign: 'center', padding: '25px' }}>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '8px' }}>Cities Explored</p>
                        <h2 style={{ color: '#3b82f6', fontSize: '2.5rem', margin: 0, fontWeight: '800' }}>{uniqueCities}</h2>
                    </div>
                </div>

                {/* CHARTS ROW */}
                {history.length > 0 && (
                    <div className="bento-grid" style={{ gridTemplateColumns: '2fr 1fr', marginBottom: '30px' }}>
                        {/* AQI Trend */}
                        <div className="bento-card" style={{ padding: '25px' }}>
                            <h3 style={{ marginBottom: '15px' }}>📈 AQI Trend (Last 20 Scans)</h3>
                            <div style={{ height: '250px' }}>
                                <Line
                                    data={{
                                        labels: trendLabels,
                                        datasets: [{
                                            label: 'AQI',
                                            data: trendData,
                                            borderColor: '#3b82f6',
                                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                            fill: true,
                                            tension: 0.4,
                                            pointRadius: 5,
                                            pointBackgroundColor: trendData.map(v => v > 150 ? '#ef4444' : v > 100 ? '#f59e0b' : '#10b981')
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { grid: { color: '#f1f5f9' }, min: 0 },
                                            x: { grid: { display: false }, ticks: { maxRotation: 45, font: { size: 10 } } }
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        {/* Cause Breakdown */}
                        <div className="bento-card" style={{ padding: '25px' }}>
                            <h3 style={{ marginBottom: '15px' }}>🧠 Cause Breakdown</h3>
                            <div style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                                <Doughnut
                                    data={{
                                        labels: causeLabels,
                                        datasets: [{
                                            data: causeData,
                                            backgroundColor: causeColors.slice(0, causeLabels.length),
                                            borderWidth: 0
                                        }]
                                    }}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'bottom',
                                                labels: { padding: 12, font: { size: 11 }, usePointStyle: true }
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* HISTORY TABLE */}
                <div className="bento-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                        <h3 style={{ margin: 0 }}>🕒 Search History ({filteredHistory.length} records)</h3>
                        <input
                            type="text"
                            placeholder="Filter by city or cause..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc', width: '250px', fontSize: '0.9rem' }}
                        />
                    </div>

                    {history.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 40px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📭</div>
                            <h3 style={{ color: '#0f172a', marginBottom: '8px' }}>No History Yet</h3>
                            <p style={{ color: '#94a3b8' }}>Start by syncing a city on the Dashboard. Your scans will appear here automatically.</p>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8fafc' }}>
                                        <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>#</th>
                                        <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Date & Time</th>
                                        <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>City</th>
                                        <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>AQI</th>
                                        <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>Status</th>
                                        <th style={{ padding: '18px 25px', color: '#64748b', fontWeight: '600', fontSize: '0.85rem' }}>AI Cause</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.map((h, idx) => {
                                        const aqiInfo = getAqiLabel(h.aqi || 0);
                                        const dateStr = h.date ? new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
                                        const timeStr = h.date ? new Date(h.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '';
                                        return (
                                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <td style={{ padding: '18px 25px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '0.85rem' }}>{filteredHistory.length - idx}</td>
                                                <td style={{ padding: '18px 25px' }}>
                                                    <strong style={{ color: '#334155' }}>{dateStr}</strong>
                                                    <br />
                                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{timeStr}</span>
                                                </td>
                                                <td style={{ padding: '18px 25px', fontWeight: '700', color: '#0f172a' }}>
                                                    📍 {h.city || 'Unknown'}
                                                </td>
                                                <td style={{ padding: '18px 25px' }}>
                                                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: aqiInfo.color }}>{h.aqi || 0}</span>
                                                </td>
                                                <td style={{ padding: '18px 25px' }}>
                                                    <span style={{
                                                        padding: '5px 14px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.8rem',
                                                        fontWeight: '700',
                                                        backgroundColor: aqiInfo.color + '15',
                                                        color: aqiInfo.color
                                                    }}>
                                                        {aqiInfo.text}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '18px 25px', color: '#475569', fontWeight: '500' }}>
                                                    {h.cause || 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredHistory.length === 0 && (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontStyle: 'italic' }}>No records match your filter.</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Analytics;