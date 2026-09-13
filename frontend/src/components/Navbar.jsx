import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const user = localStorage.getItem('user');
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [libraryOpen, setLibraryOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={`navbar-pro ${scrolled ? 'navbar-pro--scrolled' : ''}`}>
            <div className="navbar-pro__inner">
                {/* Brand */}
                <Link to="/" className="navbar-pro__brand">
                    <div className="brand-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor" opacity="0.9"/>
                            <circle cx="12" cy="9" r="2.5" fill="white"/>
                        </svg>
                    </div>
                    <span>Hava<strong>Watch</strong></span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="navbar-pro__links">
                    <Link
                        to="/dashboard"
                        className={`nav-pro-link ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/analytics"
                        className={`nav-pro-link ${isActive('/analytics') ? 'active' : ''}`}
                    >
                        Analytics
                    </Link>
                    <Link
                        to="/map"
                        className={`nav-pro-link ${isActive('/map') ? 'active' : ''}`}
                    >
                        Atlas Map
                    </Link>

                    {/* Library Dropdown */}
                    <div
                        className={`nav-pro-dropdown ${libraryOpen ? 'open' : ''}`}
                        onMouseEnter={() => setLibraryOpen(true)}
                        onMouseLeave={() => setLibraryOpen(false)}
                    >
                        <button className={`nav-pro-link dropdown-btn ${isActive('/learn') || isActive('/learn/measure') || isActive('/learn/improve') ? 'active' : ''}`}>
                            Library
                            <svg className="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </button>
                        <div className="nav-pro-dropdown__menu">
                            <div className="dropdown-menu-inner">
                                <Link to="/learn/measure" className="dropdown-pro-item">
                                    <div className="dpi-icon">📊</div>
                                    <div className="dpi-text">
                                        <strong>Analytics Guide</strong>
                                        <span>Master your data</span>
                                    </div>
                                </Link>
                                <Link to="/learn/improve" className="dropdown-pro-item">
                                    <div className="dpi-icon">❤️</div>
                                    <div className="dpi-text">
                                        <strong>Health Center</strong>
                                        <span>Wellness insights</span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA / Auth */}
                <div className="navbar-pro__actions">
                    {user ? (
                        <Link to="/profile" className="nav-pro-avatar-btn">
                            <div className="avatar-circle">
                                {JSON.parse(user)?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span>Profile</span>
                        </Link>
                    ) : (
                        <>
                            <Link to="/auth" className="nav-pro-ghost-btn">Sign In</Link>
                            <Link to="/auth" className="nav-pro-cta-btn">Get Started</Link>
                        </>
                    )}
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={`navbar-pro__hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>

            {/* Mobile Menu */}
            <div className={`navbar-pro__mobile-menu ${menuOpen ? 'open' : ''}`}>
                <Link to="/dashboard" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/analytics" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Analytics</Link>
                <Link to="/map" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Atlas Map</Link>
                <Link to="/learn/measure" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Analytics Guide</Link>
                <Link to="/learn/improve" className="mobile-nav-link" onClick={() => setMenuOpen(false)}>Health Center</Link>
                <div className="mobile-nav-divider"></div>
                {user ? (
                    <Link to="/profile" className="mobile-nav-cta" onClick={() => setMenuOpen(false)}>My Profile</Link>
                ) : (
                    <Link to="/auth" className="mobile-nav-cta" onClick={() => setMenuOpen(false)}>Sign In / Get Started</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;