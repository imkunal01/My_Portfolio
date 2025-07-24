import React from 'react';
import SocialIcons from '../../components/SocialIcons';
import DecorativeElements from '../../components/DecorativeElements';

const Works = () => {
    const projects = [
        {
            id: 1,
            title: 'Portfolio Website',
            description: 'A responsive portfolio website built with React and modern CSS techniques.',
            technologies: ['React', 'CSS', 'Responsive Design'],
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
        },
        {
            id: 2,
            title: 'E-commerce Platform',
            description: 'A full-stack e-commerce application with user authentication and payment integration.',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
            image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80'
        },
        {
            id: 3,
            title: 'Weather App',
            description: 'A weather application that fetches real-time data from a weather API.',
            technologies: ['JavaScript', 'API Integration', 'CSS'],
            image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
        }
    ];

    return (
        <main className="main-content works-page">
            <div className="text-content-container">
                <h1>My <span className="highlight-text">Works</span></h1>
                <p className="description-text">
                    Here are some of the projects I've worked on. Each project represents a unique challenge and learning experience.
                </p>
                
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-image-container">
                                <img src={project.image} alt={project.title} />
                            </div>
                            <div className="project-details">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                                <div className="project-technologies">
                                    {project.technologies.map((tech, index) => (
                                        <span key={index} className="tech-tag">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Decorative Elements */}
            <DecorativeElements />
            
            {/* Social Icons */}
            <SocialIcons />
        </main>
    );
};

export default Works;