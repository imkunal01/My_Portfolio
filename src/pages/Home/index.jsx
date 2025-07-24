import React from 'react';
import SocialIcons from '../../components/SocialIcons';
import DecorativeElements from '../../components/DecorativeElements';
import kunnucut from '../../assets/kunnucut.png';
const Home = () => {
    return (
        <main className="main-content">
            {/* Left Section - Image Card */}
            <div className="image-card-container">
                <div className="image-card-wrapper">
                    <img src= {kunnucut} alt="kunnucut" />
                </div>
            </div>

            {/* Middle Section - Text Content */}
            <div className="text-content-container">
                <p>Know me</p>
                <h1>
                    I'm <span className="text-white-span">Kunal D,</span><br />
                    a <span className="highlight-text">Creative</span> engineer
                </h1>
                <p className="description-text">
                    I'm a <span className="font-semibold-white">Computer Science</span> student and an creative <span className="font-semibold-white">Web developer</span> learning by building real-world projects.
                    Curious, consistent, and always working to get better.
                    I enjoy creating clean, responsive, and functional web apps using Frontend technologies <span className="font-semibold-white">HTML, CSS, JavaScript, and React.</span> Backend <span className="font-semibold-white">Node.js, Express, and MongoDB</span> to strengthen my backend skills.
                    This site is part of my journey
                </p>
                <p className="thanks-text">
                    — Thanks for stopping by :)
                </p>
            </div>
            
            {/* Decorative Elements */}
            <DecorativeElements />
            
            {/* Social Icons */}
            <SocialIcons />
        </main>
    );
};

export default Home;