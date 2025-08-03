import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', theme = 'auto' }) => {
    // Size classes
    const sizeClass = {
        small: 'spinner-small',
        medium: 'spinner-medium',
        large: 'spinner-large'
    }[size] || 'spinner-medium';
    
    // Theme class (auto will use the current theme from parent elements)
    const themeClass = theme !== 'auto' ? `spinner-${theme}` : '';
    
    return (
        <div className={`loading-spinner-container ${sizeClass} ${themeClass}`}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring-inner"></div>
            <div className="spinner-pulse"></div>
        </div>
    );
};

export default LoadingSpinner;