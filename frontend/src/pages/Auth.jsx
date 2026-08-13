import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
const Auth = () => {
    const navigate = useNavigate();

    // Toggle between Login and Sign Up modes
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [agreed, setAgreed] = useState(false);
    // Store what the user types in the boxes
    const [formData, setFormData] = useState({
        fullName: '',
        city: '',
        email: '',
        password: ''
    });

    // Store error messages from the backend
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Update state when user types
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // The Magic Function that talks to your Backend!
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page from refreshing
        setErrorMessage('');
        setIsLoading(true);

        // Decide which backend URL to hit based on the mode
        const endpoint = isLoginMode ? '/api/login' : '/api/signup';
        const url = `${API_URL}${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                if (isLoginMode) {
                    // 1. Save the secure token to the browser
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // 2. TELEPORT THE USER TO THE PROFILE PAGE!
                    navigate('/profile');

                } else {
                    // SIGNUP SUCCESS: Alert user and switch to login mode
                    alert("Account created successfully! Please log in.");
                    setIsLoginMode(true);
                }

            } else {
                // Backend sent an error (like "Email already exists")
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage('Cannot connect to server. Is your backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-split">
            {/* Left Visuel Side */}
            <div className="auth-visual">
                <div className="auth-visual-overlay"></div>
                <div className="auth-visual-content">
                    <h2>Track Your Local Air Quality.</h2>
                    <p>Sign in to check live air quality, track pollution causes, and stay healthy.</p>
                </div>
            </div>

            {/* Right Form Side */}
            <div className="auth-form-container">
                <Link to="/" style={{ position: 'absolute', top: '30px', right: '40px', fontWeight: '700', color: '#64748b', textDecoration: 'none' }}>
                    &larr; Back to Platform
                </Link>

                <h2>{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>
                <p className="subtitle">
                    {isLoginMode ? 'Enter your details to access your dashboard.' : 'Register to start tracking air pollution in your city.'}
                </p>

                {errorMessage && (
                    <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '500' }}>
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLoginMode && (
                        <>
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
                            </div>
                            <div className="input-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g. Mumbai, New York" />
                            </div>
                        </>
                    )}

                    <div className="input-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="user@domain.com" />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={isLoading} className="auth-submit-btn">
                        {isLoading ? 'Logging in...' : (isLoginMode ? 'Log In' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-switch">
                    {isLoginMode ? "Don't have access? " : "Already registered? "}
                    <button onClick={() => { setIsLoginMode(!isLoginMode); setErrorMessage(''); }}>
                        {isLoginMode ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;