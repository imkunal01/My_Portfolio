import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles.css';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Chat from './pages/Chat';

// Main App component
const App = () => {
    // State for theme (dark/light/neon)
    const [theme, setTheme] = useState('dark');
    // State for active tab
    const [activeTab, setActiveTab] = useState('home');

    // Toggle theme function
    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme === 'dark') return 'light';
            if (prevTheme === 'light') return 'neon';
            return 'dark';
        });
    };

    // Handle tab click
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Apply theme class to body
    useEffect(() => {
        document.body.className = `${theme}-theme`;
    }, [theme]);

    return (
        <Router>
            <div className={`app-container ${theme}-theme`}>
                <AppContent 
                    theme={theme} 
                    toggleTheme={toggleTheme} 
                    activeTab={activeTab} 
                    handleTabClick={handleTabClick} 
                />
            </div>
        </Router>
    );
};

// This component handles route changes and updates the active tab
const AppContent = ({ theme, toggleTheme, activeTab, handleTabClick }) => {
    const location = useLocation();
    
    // Update active tab based on current route
    useEffect(() => {
        const path = location.pathname;
        if (path === '/') {
            handleTabClick('home');
        } else if (path === '/about') {
            handleTabClick('about');
        } else if (path === '/works') {
            handleTabClick('works');
        } else if (path === '/chat') {
            handleTabClick('chat');
        }
    }, [location, handleTabClick]);
    
    return (
        <>
            <Navbar 
                theme={theme} 
                toggleTheme={toggleTheme} 
                activeTab={activeTab} 
                handleTabClick={handleTabClick} 
            />
            
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/works" element={<Works />} />
                <Route path="/chat" element={<Chat />} />
            </Routes>
        </>
    );
};

export default App;
