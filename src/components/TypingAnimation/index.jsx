import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

const TypingAnimation = ({ text, speed = 100, className = '', onComplete = () => {} }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            
            return () => clearTimeout(timeout);
        } else if (!isComplete) {
            setIsComplete(true);
            onComplete();
        }
    }, [currentIndex, text, speed, isComplete, onComplete]);

    return (
        <span className={`typing-animation ${className}`}>
            {displayText}
            <span className="typing-cursor"></span>
        </span>
    );
};

export default TypingAnimation;