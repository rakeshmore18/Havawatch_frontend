import React from 'react';
import { Link } from 'react-router-dom';

const LearnHub = () => {
    return (
        <div className="dashboard-wrapper">
            {/* Standard Sidebar */}
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

            
        </div>
    );
};

export default LearnHub;