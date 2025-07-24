// src/components/Intro.js
import React, { useEffect, useState } from 'react';
import './Intro.css'; // Import the styles

const Intro = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const showTime = setTimeout(() => {
      setFadeOut(true); // Start fading out after 2.5s
    }, 2500);

    const removeTime = setTimeout(() => {
      onFinish(); // Remove intro after 3.5s
    }, 3500);

    return () => {
      clearTimeout(showTime);
      clearTimeout(removeTime);
    };
  }, [onFinish]);

  return (
    <div className={`intro-overlay ${fadeOut ? 'fade-out' : ''}`}>
      <h1 className="intro-name">Kunal D</h1>
    </div>
  );
};

export default Intro;
