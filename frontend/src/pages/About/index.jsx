import React from 'react';
import SocialIcons from '../../components/SocialIcons';
import DecorativeElements from '../../components/DecorativeElements';
import ChintuAi from '../ChintuAi/Chintu.jsx'
const About = () => {
    return (
        <main className="main-content">
            <div className="text-content-container">
                <h1>About <span className="highlight-text">Me</span></h1>
                <p className="description-text">
                    Hi, I’m <span className="highlight-text">Kunal Dhangar</span> 👋, a Computer Science student and an aspiring Full-Stack Developer. 
                    My passion lies in building seamless digital experiences that blend <strong>creativity</strong> with <strong>problem-solving</strong>. 
                    I thrive on turning ideas into reality through clean, scalable, and user-friendly code.
                    <br />
                    <br />
                </p>

                <h2 >More Of Me :)</h2>
                <p className="description-text">
                    I specialize in crafting modern, responsive web applications and enjoy working across the 
                    <strong> full development stack</strong>. My journey started with simple HTML pages and 
                    gradually evolved into developing advanced applications using JavaScript frameworks, APIs, and databases.
                <br /></p>
                <ul className="details-list">
                    <li>✔️ Strong foundation in <strong>data structures & algorithms</strong></li>
                    <li>✔️ Experienced in both <strong>frontend</strong> and <strong>backend</strong> development</li>
                    <li>✔️ Hands-on with <strong>REST APIs</strong> and <strong>real-time applications</strong></li>
                    <li>✔️ Contributor to open-source and group projects</li>
                </ul>
                    <br />
                    <br />
                <h2>💻 Skills & Expertise</h2>
                <div className="skills-container">
                    <div className="skill-category">
                        <h3>Frontend</h3>
                        <ul>
                            <li>HTML5, CSS3, Tailwind, Sass</li>
                            <li>JavaScript (ES6+), TypeScript</li>
                            <li>React.js, Next.js</li>
                            <li>Responsive UI/UX Design</li>
                            <li>Framer Motion (animations)</li>
                        </ul>
                    </div>

                    <div className="skill-category">
                        <h3>Backend</h3>
                        <ul>
                            <li>Node.js, Express.js</li>
                            <li>MongoDB, MySQL</li>
                            <li>RESTful APIs & Authentication</li>
                            <li>WebSockets for real-time apps</li>
                        </ul>
                    </div>

                    <div className="skill-category">
                        <h3>Tools & Others</h3>
                        <ul>
                            <li>Git & GitHub</li>
                            <li>VS Code, Postman</li>
                            <li>Docker (basic)</li>
                            <li>Problem Solving (LeetCode/GFG)</li>
                            <li>Agile & Team Collaboration</li>
                        </ul>
                    </div>
                </div>

                <div className="act1">
                    <h2 className='headings'>🎓 Education</h2>
                <p className="description-text">
                    I’m currently pursuing a <strong>Bachelor’s degree in Computer Science</strong>, with a strong focus on:
                </p>
                <ul className="details-list">
                    <li>Software Engineering & Web Technologies</li>
                    <li>Operating Systems, Databases, and Networks</li>
                    <li>Digital Systems & Architecture</li>
                    <li>Mathematics for Computer Science</li>
                </ul>

                </div>
                <br />
                

                <div className="act1">
                <h2 className='headings'>🎯 Interests</h2>
                <p className="description-text">
                    Beyond coding, I love diving into <strong>system design</strong>, 
                    exploring <strong>AI integrations</strong>, and experimenting with <strong>creative UI/UX</strong>.  
                    I’m also passionate about:
                </p>
                <ul className="details-list">
                    <li>⚡ Competitive Programming & Hackathons</li>
                    <li>⚡ Open-source contributions</li>
                    <li>⚡ Reading about startups & tech innovations</li>
                    <li>⚡ Designing interactive portfolios and micro-projects</li>
                </ul>

                </div>
                <br />
                <div className="act1">
                <h2 className='headings'>🌍 Beyond Tech</h2>
                <p className="description-text">
                    When I’m not coding, you’ll find me exploring music, sketching new designs, binge-watching anime, or learning about geopolitics and business models. 
                    I believe in being a <strong>lifelong learner</strong> and continuously pushing my boundaries.
                </p>

                </div>
                <br />
                <div className="act1">
                <h2 className='headings'>📬 Let’s Connect</h2>
                <p className="description-text">
                    I’m always open to collaborations, exciting projects, and innovative ideas. 
                    Feel free to reach out via my social links below!

                    <br />
                    <br />
                    

                    
                </p>
                </div>
               
                
            </div>
        </main>
    );
};

export default About;
