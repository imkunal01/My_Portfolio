import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects as staticProjects } from "../data/portfolio";
import { useState, useEffect } from "react";
import axios from "axios";
import { optimizeCloudinaryUrl } from "../utils/imageOptimization";

const API = import.meta.env.VITE_BACKEND_URL || "";

const resolveProjectImage = (project) => {
  if (project?.imageOptimized) return project.imageOptimized;
  if (!project?.image) return "";
  if (project.image.startsWith('/uploads')) return `${API}${project.image}`;
  return optimizeCloudinaryUrl(project.image, { width: 960, height: 600, crop: "fill" });
};

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [projects, setProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get(`${API}/api/projects`);
        // Map _id to id for consistency
        const mappedProjects = data
          .map((project) => ({
            ...project,
            id: project._id || project.id,
          }))
          .sort((a, b) => {
            const aPriority = Number.isFinite(Number(a.priority)) ? Number(a.priority) : 0;
            const bPriority = Number.isFinite(Number(b.priority)) ? Number(b.priority) : 0;
            if (aPriority !== bPriority) return aPriority - bPriority;
            return 0;
          });
        setProjects(mappedProjects);
      } catch (error) {
        console.log("Failed to fetch projects from API, using static data");
        // Keep using static projects as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 dark:text-white/40 text-sm">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="section-label">Case Studies</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
          <span className="gradient-text">Curated</span>{" "}
          <span className="text-gray-900 dark:text-white">work</span>
        </h2>
      </motion.div>

      {/* Projects Grid */}
      <div className="space-y-24">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            inView={inView}
            isReversed={index % 2 !== 0}
            totalProjects={projects.length}
          />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, inView, isReversed, totalProjects }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`group relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start ${
        isReversed ? "lg:direction-rtl" : ""
      }`}
    >
      {/* Left Side - Info */}
      <div
        className={`flex flex-col justify-start ${
          isReversed ? "lg:order-2 lg:direction-ltr" : "lg:order-1"
        }`}
      >
        {/* Meta row */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-mono text-gray-400 dark:text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="w-8 h-px bg-gray-300 dark:bg-white/25" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {project.category}
          </span>
          <span className="ml-auto px-3 py-1 text-xs font-mono text-gray-400 dark:text-white/40 border border-gray-200 dark:border-white/[0.06] rounded-full">
            {project.quarter}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 dark:text-white mb-4 group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description Card */}
        <div
          onClick={() => navigate(`/project/${project.slug}`)}
          className="relative rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 p-6 mb-6 cursor-pointer hover:border-accent/40 transition-all duration-300"
        >
          <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed pr-8">
            {project.description}
          </p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
            <ArrowRight size={16} className="text-gray-400 dark:text-white/40 group-hover:text-accent transition-colors" />
          </div>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag, tagIdx) => (
            <span
              key={tagIdx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/60 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-colors"
            >
              <img src={tag.icon} alt={tag.name} className="w-3.5 h-3.5" />
              {tag.name}
            </span>
          ))}
        </div>
      </div>

      {/* Right Side - Project Preview */}
      <div
        className={`${isReversed ? "lg:order-1 lg:direction-ltr" : "lg:order-2"}`}
      >
        <div
          onClick={() => navigate(`/project/${project.slug}`)}
          className="relative rounded-2xl overflow-hidden cursor-pointer group/img bg-gradient-to-br from-accent/5 to-purple-500/5 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all duration-500"
        >
          {/* Project Screenshot / Placeholder */}
          <div className="aspect-[16/10] relative overflow-hidden">
            {project.image ? (
              <img
                src={resolveProjectImage(project)}
                alt={project.title}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold font-display text-accent">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider">Preview</span>
                </div>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6">
              <span className="text-sm text-white/80 font-medium flex items-center gap-2">
                View Project <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline connector */}
      {index < totalProjects - 1 && (
        <div className="hidden lg:block absolute left-1/2 -bottom-12 w-px h-12 bg-gradient-to-b from-white/10 to-transparent" />
      )}
    </motion.div>
  );
};

export default Projects;
