import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = ({ theme }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(true);
    const [clicked, setClicked] = useState(false);
    const [linkHovered, setLinkHovered] = useState(false);
    
    useEffect(() => {
        // Only show custom cursor on desktop devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) return;
        
        const addEventListeners = () => {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseenter', onMouseEnter);
            document.addEventListener('mouseleave', onMouseLeave);
            document.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mouseup', onMouseUp);
        };
        
        const removeEventListeners = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', onMouseEnter);
            document.removeEventListener('mouseleave', onMouseLeave);
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mouseup', onMouseUp);
        };
        
        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
            
            // Check if hovering over a link or button
            const target = e.target;
            const isLink = target.tagName.toLowerCase() === 'a' || 
                          target.tagName.toLowerCase() === 'button' ||
                          target.closest('a') ||
                          target.closest('button') ||
                          target.classList.contains('navbar-link') ||
                          target.classList.contains('social-icon-link');
            
            setLinkHovered(isLink);
        };
        
        const onMouseEnter = () => setHidden(false);
        const onMouseLeave = () => setHidden(true);
        const onMouseDown = () => setClicked(true);
        const onMouseUp = () => setClicked(false);
        
        addEventListeners();
        setHidden(false);
        
        return () => removeEventListeners();
    }, []);
    
    if (hidden) return null;
    
    return (
        <>
            <div 
                className={`cursor-dot ${theme}-theme ${clicked ? 'cursor-clicked' : ''} ${linkHovered ? 'cursor-link-hovered' : ''}`}
                style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px` 
                }}
            />
            <div 
                className={`cursor-ring ${theme}-theme ${clicked ? 'cursor-clicked' : ''} ${linkHovered ? 'cursor-link-hovered' : ''}`}
                style={{ 
                    left: `${position.x}px`, 
                    top: `${position.y}px` 
                }}
            />
        </>
    );
};

export default CustomCursor;