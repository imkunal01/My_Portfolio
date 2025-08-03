import React, { useState, useEffect } from 'react';
import './TypingAnimation.css';

const TypingAnimation = ({
  text,
  speed = 300,
  pause = 3000, // pause between loops
  className = '',
  onComplete = () => {},
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout;

    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
    } else {
      onComplete(); // optional external callback
      timeout = setTimeout(() => {
        setDisplayText('');
        setCurrentIndex(0);
      }, pause); // wait before restarting
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, pause, onComplete]);

  return (
    <span className={`typing-animation ${className}`}>
      {displayText}
      <span className="typing-cursor"></span>
    </span>
  );
};

export default TypingAnimation;
