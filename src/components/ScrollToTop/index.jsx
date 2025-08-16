import React, { useState, useEffect } from 'react';
import './ScrollToTop.css';
import upward from '../../assets/images/upward.png';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
            <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="scroll-button animate-pulse"
            >
                <img
                    src={upward}
                    alt="Scroll to top"
                    className="scroll-icon"
                />
            </button>
        </div>
    );
};

export default ScrollToTop;
