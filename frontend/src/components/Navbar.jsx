import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const user = localStorage.getItem('user');

    return (
        <nav className="navbar-premium">
            <Link to="/" className="nav-brand">
                Hava<span>Watch</span>
            </Link>

            <div className="nav-links">
                <Link to="/dashboard" className="nav-item">Dashboard</Link>
                <Link to="/map" className="nav-item">Atlas Map</Link>
                
                {/* Premium Animated Dropdown */}
                <div className="nav-dropdown-premium">
                    <span className="nav-item dropdown-trigger">
                        📚 Library <span className="chevron"></span>
                    </span>
                    <div className="nav-dropdown-menu-premium">
                        <Link to="/learn/measure">
                            <div className="dropdown-icon">📊</div>
                            <div className="dropdown-text">
                                <strong>Analytics Guide</strong>
                                <span>Master your data</span>
                            </div>
                        </Link>
                        <Link to="/learn/improve">
                            <div className="dropdown-icon">❤️</div>
                            <div className="dropdown-text">
                                <strong>Health Center</strong>
                                <span>Wellness insights</span>
                            </div>
                        </Link>
                    </div>
                </div>
                
                {user ? (
                    <Link to="/profile" className="nav-btn primary">Profile</Link>
                ) : (
                    <Link to="/auth" className="nav-btn primary">Portal Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;