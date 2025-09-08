import React from "react";
import SocialIcons from "../../components/SocialIcons";
import DecorativeElements from "../../components/DecorativeElements";
import kaagaj_ai from '../../assets/images/kagaj.png';
import agriglance from '../../assets/images/farmers.png';
import McD from '../../assets/images/mcd.png';
import Algopic from '../../assets/images/algo.png'
import FloodImg from '../../assets/images/flood.jpg'
import Scenoxis from '../../assets/images/sceno.png'
const Works = () => {
  const projects = [
    {
      id: 1,
      title: "Scenoxis A Agency Portfolio Website",
      description:
      "A responsive portfolio website built with React and modern CSS techniques.",
      technologies: ["HTML%", "CSS","JS", "Responsive Design"],
      link: "https://imkunal01.github.io/Scenoxis/",
      image:
        Scenoxis,
    },
    {
      id: 2,
      title: "McDonald's India Clone",
      description:
        "A full stack Application replicating McD india's outlet website",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      link: "https://petv-88-g8qr.vercel.app/",
      image:
        McD,
    },
    {
      id: 3,
      title: "Kaagaj AI",
      description:
        "An application that Tracks your mood by analysing your text patterns and suggests you a better soln for your problems ",
      technologies: [
        "html",
        "JavaScript",
        "API Integration",
        "CSS",
        "Responsive Design",
        "php",
      ],
      link: "https://agriglance.ct.ws/",
      image:kaagaj_ai ,
    },
    {
      id: 4,
      title: "Inovxis- A Free and Easy Invoice Generator Tool",
      description:
        "This Tool generates invoice for you within very easy steps just fill out the necessary details and just download it.",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      link: "https://invoxis-invoice-generator.vercel.app/",
      image:
        agriglance,
    }
    ,{
      id: 5,
      title: "AlgoVisualiser",
      description:
        "An application that Shows visual represation of Data Non linear Data Structures .",
      technologies: [
        "html",
        "JavaScript",
        "API Integration",
        "CSS",
        "Responsive Design",
        
      ],
      link: "https://imkunal01.github.io/AlgoGlimpse/",
      image: Algopic,
    }
    ,{
      id: 6,
      title: "Flood Mangment Static Website",
      description:
        "A website providing information about how to prepare when flood like natural disaster occurs some.{The very first website that i have created in my first sem of collage}",
      technologies: [
        "html",
        "JavaScript",
        "CSS",
        "Responsive Design",
        
      ],
      link: "https://imkunal01.github.io/FloodManagment/",
      image: FloodImg,
    }
  ];

  return (
    <main className="main-content works-page">
      <div className="text-content-container">
        <h1>
          My <span className="highlight-text">Works</span>
        </h1>
        <p className="description-text">
          Here are some of the projects I've worked on. Each project represents
          a unique challenge and learning experience.
        </p>

        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image-container">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-details">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <div>
                    {project.link && (<a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">View Project</a>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <DecorativeElements />
    </main>
  );
};

export default Works;
