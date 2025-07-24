import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
import Chat from './pages/Chat';

const App = () => {
    const [theme, setTheme] = useState('dark');
    const [activeTab, setActiveTab] = useState('home');
    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme === 'dark') return 'light';
            if (prevTheme === 'light') return 'neon';
            return 'dark';
        });
    };
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
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

const AppContent = ({ theme, toggleTheme, activeTab, handleTabClick }) => {
    const location = useLocation();
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
