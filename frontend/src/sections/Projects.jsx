import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { projects } from "../data/portfolio";

const Projects = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

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
          <span className="text-white">work</span>
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
          />
        ))}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, inView, isReversed }) => {
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
          <span className="text-sm font-mono text-white/30">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="w-8 h-px bg-white/20" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {project.category}
          </span>
          <span className="ml-auto px-3 py-1 text-xs font-mono text-white/40 border border-white/10 rounded-full">
            {project.quarter}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-3xl lg:text-4xl font-bold font-display text-white mb-4 group-hover:text-accent transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description Card */}
        <div
          onClick={() => navigate(`/project/${project.slug}`)}
          className="relative rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-pink-500/10 border border-accent/20 p-6 mb-6 cursor-pointer hover:border-accent/40 transition-all duration-300"
        >
          <p className="text-sm text-white/70 leading-relaxed pr-8">
            {project.description}
          </p>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
            <ArrowRight size={16} className="text-white/60 group-hover:text-accent transition-colors" />
          </div>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag.name}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50 bg-white/5 rounded-full border border-white/5 hover:border-white/15 transition-colors"
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
          className="relative rounded-2xl overflow-hidden cursor-pointer group/img bg-gradient-to-br from-accent/5 to-purple-500/5 border border-white/5 hover:border-white/15 transition-all duration-500"
        >
          {/* Project Screenshot / Placeholder */}
          <div className="aspect-[16/10] relative overflow-hidden">
            {project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#111] via-[#161616] to-[#111] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl font-bold font-display text-accent">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-white/20 uppercase tracking-wider">Preview</span>
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
      {index < projects.length - 1 && (
        <div className="hidden lg:block absolute left-1/2 -bottom-12 w-px h-12 bg-gradient-to-b from-white/10 to-transparent" />
      )}
    </motion.div>
  );
};

export default Projects;
