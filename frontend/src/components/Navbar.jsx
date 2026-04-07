import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar-premium">
            <Link to="/" className="nav-brand">
                Hava<span>Watch</span>
            </Link>

            <div className="nav-links">
                <Link to="/dashboard" className="nav-item">Dashboard</Link>
                <Link to="/map" className="nav-item">Atlas Map</Link>
                <Link to="/analytics" className="nav-item">Analytics</Link>
                
                <Link to="/auth" className="nav-btn primary">Portal Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;