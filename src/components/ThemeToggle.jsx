import React from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button className="navbar-toggle-button" onClick={toggleTheme}>
            {/* Icons for dark/light/neon mode toggle */}
            {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 3.325l-.707.707M5.38 5.38l-.707-.707M18.615 5.38l.707-.707M5.38 18.615l-.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
            ) : theme === 'light' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;