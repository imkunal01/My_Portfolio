import React from "react";
import SocialIcons from "../../components/SocialIcons";
import DecorativeElements from "../../components/DecorativeElements";
import kaagaj_ai from '../../assets/images/kagaj.png';
import agriglance from '../../assets/images/farmers.png';
import McD from '../../assets/images/mcd.png';
const Works = () => {
  const projects = [
    {
      id: 1,
      title: "Scenoxis A Agency Portfolio Website",
      description:
      "A responsive portfolio website built with React and modern CSS techniques.",
      technologies: ["React", "CSS", "Responsive Design"],
      link: " https://scenoxis-collective.vercel.app/",
      image:
        "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
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
      title: "AgriGlance",
      description:
        "An application that predicts the expected yield by doing some precalculations and considering different factors.",
      technologies: [
        "html",
        "JavaScript",
        "API Integration",
        "CSS",
        "Responsive Design",
        "php",
      ],
      link: "https://agriglance.ct.ws/",
      image:
        agriglance,
    },
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
