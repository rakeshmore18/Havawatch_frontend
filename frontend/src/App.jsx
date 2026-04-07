import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ... your existing imports
import LearnHub from './pages/learn/LearnHub';
import MeasureAQ from './pages/learn/MeasureAQ';
import ImproveAQ from './pages/learn/ImproveAQ';
// Import CSS
import './assets/css/style.css';
import './assets/css/auth.css';
import './assets/css/dashboard.css';

// Import Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Analytics from './pages/Analytics'; 
import Profile from './pages/Profile'; 
import MapPage from "./pages/Map";// ==========================================
export const UserCityContext = createContext();

// Custom hook so you don't have to import useContext everywhere
export const useCity = () => useContext(UserCityContext);

function App() {
  // 2. Set up the central state (default to 'nashik')
  const [activeCity, setActiveCity] = useState('nashik');

  // 3. On load, check if user is signed in and has a preferred city
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.city) {
          // Keep it lowercase to match your database simulation keys
          setActiveCity(parsedUser.city.toLowerCase()); 
        }
      } catch (error) {
        console.error("Error reading user city:", error);
      }
    }
  }, []);

  // Function to change the city globally
  const updateCity = (newCity) => {
    setActiveCity(newCity.toLowerCase());
  };

  return (
    // 4. Wrap the entire Router in the Context Provider
    <UserCityContext.Provider value={{ activeCity, updateCity }}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<MapPage />} />   
          <Route path="/learn" element={<LearnHub />} />
    <Route path="/learn/measure" element={<MeasureAQ />} />
    <Route path="/learn/improve" element={<ImproveAQ />} />   
        </Routes>
      </Router>
    </UserCityContext.Provider>
  );
}

export default App;