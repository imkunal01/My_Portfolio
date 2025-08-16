import React, { useEffect, useRef } from 'react';

const DecorativeElements = () => {
    const elementsRef = useRef([]);
    
    useEffect(() => {
        // Add animation classes with staggered delays
        elementsRef.current.forEach((el, index) => {
            if (el) {
                setTimeout(() => {
                    el.classList.add('animate-fadeIn');
                    el.style.opacity = 1;
                }, index * 200);
            }
        });
    }, []);
    
    return (
        <>
            {/* Decorative elements */}
            <div 
                className="plus-icon animate-float" 
                ref={el => elementsRef.current[0] = el}
                style={{ opacity: 0 }}
            >+</div>
            <div 
                className="circle-icon animate-pulse" 
                ref={el => elementsRef.current[1] = el}
                style={{ opacity: 0 }}
            ></div>
            <div 
                className="decorative-circle top-right" 
                ref={el => elementsRef.current[2] = el}
                style={{ opacity: 0 }}
            ></div>
            <div 
                className="decorative-circle bottom-left" 
                ref={el => elementsRef.current[3] = el}
                style={{ opacity: 0 }}
            ></div>
            <div 
                className="decorative-square" 
                ref={el => elementsRef.current[4] = el}
                style={{ opacity: 0 }}
            ></div>
            <div 
                className="decorative-dots" 
                ref={el => elementsRef.current[5] = el}
                style={{ opacity: 0 }}
            ></div>
        </>
    );
};

export default DecorativeElements;