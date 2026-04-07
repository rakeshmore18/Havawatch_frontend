import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="sidebar">
            <div className="logo">Hava<span>Watch</span></div>
            <nav style={{ flex: 1 }}>
                <Link to="/">🏠 Home</Link>
                <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>📊 Workspace</Link>
                <Link to="/map" className={location.pathname === '/map' ? 'active' : ''}>🗺️ Atlas Map</Link>
                <Link to="/analytics" className={location.pathname === '/analytics' ? 'active' : ''}>📈 Analytics</Link>
                
                <div className="sidebar-accordion">
                    <div className="accordion-trigger">
                        <span style={{ display: 'flex', alignItems: 'center' }}>📚 Library</span>
                    </div>
                    <div className="accordion-menu">
                        <Link to="/learn/measure">Analytics Guide</Link>
                        <Link to="/learn/improve">Health Center</Link>
                    </div>
                </div>
            </nav>
            <nav style={{ marginTop: 'auto' }}>
                {localStorage.getItem('token') ? (
                    <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>👤 Account</Link>
                ) : (
                    <Link to="/auth">🔐 Portal</Link>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;