import React from 'react';
import SocialIcons from '../../components/SocialIcons';
import DecorativeElements from '../../components/DecorativeElements';

const About = () => {
    return (
        <main className="main-content">
            <div className="text-content-container">
                <h1>About <span className="highlight-text">Me</span></h1>
                <p className="description-text">
                    I'm a passionate Computer Science student with a love for creating beautiful, functional web applications. My journey in web development started with curiosity and has evolved into a dedicated pursuit of excellence in both frontend and backend technologies.
                </p>
                
                <h2>My Skills</h2>
                <div className="skills-container">
                    <div className="skill-category">
                        <h3>Frontend</h3>
                        <ul>
                            <li>HTML5 & CSS3</li>
                            <li>JavaScript (ES6+)</li>
                            <li>React.js</li>
                            <li>Responsive Design</li>
                        </ul>
                    </div>
                    
                    <div className="skill-category">
                        <h3>Backend</h3>
                        <ul>
                            <li>Node.js</li>
                            <li>Express.js</li>
                            <li>MongoDB</li>
                            <li>RESTful APIs</li>
                        </ul>
                    </div>
                    
                    <div className="skill-category">
                        <h3>Tools & Others</h3>
                        <ul>
                            <li>Git & GitHub</li>
                            <li>VS Code</li>
                            <li>npm/yarn</li>
                            <li>Problem Solving</li>
                        </ul>
                    </div>
                </div>
                
                <h2>Education</h2>
                <p className="description-text">
                    Currently pursuing a Bachelor's degree in Computer Science, focusing on software development and web technologies.
                </p>
                
                <h2>Interests</h2>
                <p className="description-text">
                    When I'm not coding, I enjoy exploring new technologies, contributing to open-source projects, and continuously learning through online courses and tutorials.
                </p>
            </div>
            
           
        </main>
    );
};

export default About;