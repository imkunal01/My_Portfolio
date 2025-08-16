import React, { useState, useEffect } from 'react';
import './PageTransition.css';

const PageTransition = ({ children, location }) => {
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('fadeIn');
    
    useEffect(() => {
        if (location !== displayLocation) {
            setTransitionStage('fadeOut');
        }
    }, [location, displayLocation]);
    
    const handleAnimationEnd = () => {
        if (transitionStage === 'fadeOut') {
            setTransitionStage('fadeIn');
            setDisplayLocation(location);
        }
    };
    
    return (
        <div 
            className={`page-transition ${transitionStage}`}
            onAnimationEnd={handleAnimationEnd}
        >
            {children}
        </div>
    );
};

export default PageTransition;