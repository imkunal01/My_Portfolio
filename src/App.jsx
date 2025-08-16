import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';
import Particles from './components/Particles/Particles.jsx'
import ScrollToTop from './components/ScrollToTop';
// import TypingAnimation from './components/TypingAnimation/index.jsx'
// import PageTransition from './components/PageTransition';
import CustomCursor from './components/CustomCursor';
// import Loading from './components/LoadingSpinner/index.jsx'
import Intro from './components/Intro/Intro.jsx'
// Pages
import Home from './pages/Home';
import About from './pages/About';
import Works from './pages/Works';
// import Chat from './pages/Chat';

const App = () => {
    const [theme, setTheme] = useState('dark');
    const [activeTab, setActiveTab] = useState('home');
    const [loading, setLoading] = useState(true);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            if (prevTheme === 'dark') return 'light';
            if (prevTheme === 'light') return 'neon';
            return 'dark';
        });
    };

    useEffect(() => {
        document.body.className = `${theme}-theme`;
    }, [theme]);

    // useEffect(() => {
    //     // Simulate loading (replace with real loading logic if needed)
    //     const timer = setTimeout(() => setLoading(false), 1500);
    //     return () => clearTimeout(timer);
    // }, []);

    // if (loading) {
    //     return <Loading />;
    // }

    return (
        <Router>
            <Intro/>
            <div className={`app-container ${theme}-theme`}>
                <Routes>
                    <Route path="/*" element={
                        <AppContent
                            theme={theme}
                            toggleTheme={toggleTheme}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                        />
                    } />
                </Routes>
            </div>
        </Router>
    );
};

const AppContent = ({ theme, toggleTheme, activeTab, setActiveTab }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const sections = ['home', 'about', 'works', 'chat'];
    
    // Handle initial route on component mount
    useEffect(() => {
        const path = location.pathname.substring(1) || 'home';
        if (sections.includes(path)) {
            setActiveTab(path);
            const el = document.getElementById(path);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        setActiveTab(id);

                        const newPath = id === 'home' ? '/' : `/${id}`;
                        if (location.pathname !== newPath) {
                            navigate(newPath, { replace: true });
                        }
                    }
                });
            },
            { threshold: 0.6 }
        );

        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [navigate, location.pathname, setActiveTab, sections]);

    return (
        <>
            {/* Custom cursor */}
            <CustomCursor theme={theme} />
            
            {/* Full screen background Particles */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
            }}>
                <Particles
                    particleColors={['#0089e4ff', '#ffffff','#ff0000ff']}
                    particleCount={300}
                    particleSpread={10}
                    speed={0.2}
                    particleBaseSize={100}
                    moveParticlesOnHover={false}
                    alphaParticles={false}
                    disableRotation={true}
                />
            </div>

            <Navbar
                theme={theme}
                toggleTheme={toggleTheme}
                activeTab={activeTab}
                handleTabClick={(tabId) => {
                    const el = document.getElementById(tabId);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setActiveTab(tabId);
                    const newPath = tabId === 'home' ? '/' : `/${tabId}`;
                    navigate(newPath, { replace: true });
                }}
            />
            
            <ScrollToTop />
            
            <main className="page-content">
                <section id="home" className="page-section">
                    <Home />
                </section>
                <section id="about" className="page-section">
                    <About />
                </section>
                <section id="works" className="page-section">
                    <Works />
                </section>
            </main>
        </>
    );
};

export default App;
