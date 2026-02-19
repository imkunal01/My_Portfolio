import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  ChevronDown,
  LinkIcon,
  Star,
  Menu,
} from "lucide-react";
import { projects } from "../data/portfolio";

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const project = projects.find((p) => p.slug === slug);
  const [activeSection, setActiveSection] = useState("features");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sectionRefs = {
    features: useRef(null),
    techStack: useRef(null),
    challenges: useRef(null),
    outcome: useRef(null),
    screenshots: useRef(null),
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const offsets = Object.entries(sectionRefs).map(([key, ref]) => ({    
        key,
        top: ref.current?.getBoundingClientRect().top ?? Infinity,
      }));

      const active = offsets.reduce((closest, current) => {
        if (current.top <= 150 && current.top > closest.top) return current;
        if (closest.top > 150 && current.top <= 150) return current;
        if (closest.top > 150 && current.top < closest.top) return current;
        return closest;
      }, offsets[0]);

      if (active) setActiveSection(active.key);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (key) => {
    sectionRefs[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setSidebarOpen(false);
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display text-white mb-4">
            Project Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="text-accent hover:underline"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { key: "features", label: "Key Features" },
    { key: "techStack", label: "Tech Stack" },
    { key: "challenges", label: "Challenges & Learnings" },
    { key: "outcome", label: "Outcome" },
    ...(project.screenshots?.length > 0
      ? [{ key: "screenshots", label: "Screenshots" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Fixed Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Projects</span>
          </button>

          <span className="text-sm font-medium text-white/80 font-display">
            {project.title}
          </span>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-white/5 text-white/60 hover:text-white"
          >
            <Menu size={16} />
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background project image (blurred) */}
        {project.image && (
          <div className="fixed inset-0 z-0 opacity-5">
            <img
              src={project.image}
              alt=""
              className="w-full h-full object-cover blur-3xl"
            />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          {/* Quarter badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              {project.quarter}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white mb-6 leading-tight">
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-white/60 max-w-3xl leading-relaxed mb-8">
            {project.longDescription}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50 bg-white/5 rounded-full border border-white/5"
              >
                <img src={tag.icon} alt={tag.name} className="w-3.5 h-3.5" />
                {tag.name}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
              >
                <Github size={16} />
                Star on GitHub
              </a>
            )}
            {project.link && project.link !== "#" && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Check it out
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Project Screenshots Hero */}
      {project.screenshots && project.screenshots.length > 0 && (
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {project.screenshots.slice(0, 2).map((screenshot, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-white/5 bg-[#111]"
              >
                <img
                  src={screenshot}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full h-auto object-cover"
                />
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Main preview when no screenshots */}
      {(!project.screenshots || project.screenshots.length === 0) && project.image && (
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/5 bg-[#111]"
          >
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </section>
      )}

      {/* Content Section with Sidebar */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto pb-20 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="space-y-16">
            {/* Key Features */}
            <div ref={sectionRefs.features}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mb-8">
                  Key Features
                </h2>
                <div className="rounded-2xl border border-white/5 bg-[#111] overflow-hidden divide-y divide-white/5">
                  {project.features.map((feature, i) => (
                    <FeatureAccordion key={i} feature={feature} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Tech Stack */}
            <div ref={sectionRefs.techStack}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mb-8">
                  Tech Stack
                </h2>
                <ul className="space-y-4">
                  {project.techStack.map((tech, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                      <div>
                        <a
                          href={tech.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline font-medium"
                        >
                          {tech.name}
                        </a>
                        <span className="text-white/50"> – {tech.description}</span>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Challenges & Learnings */}
            <div ref={sectionRefs.challenges}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mb-8">
                  Challenges & Learnings
                </h2>
                <div className="space-y-6">
                  {project.challenges.map((challenge, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="rounded-2xl bg-[#111] border border-white/5 p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2 font-display">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed">
                        {challenge.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Outcome */}
            <div ref={sectionRefs.outcome}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mb-6">
                  Outcome
                </h2>
                <div className="rounded-2xl bg-gradient-to-br from-accent/5 to-purple-500/5 border border-accent/10 p-8">
                  <p className="text-base text-white/70 leading-relaxed">
                    {project.outcome}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* More Screenshots */}
            {project.screenshots && project.screenshots.length > 2 && (
              <div ref={sectionRefs.screenshots}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl lg:text-3xl font-bold font-display text-white mb-8">
                    Screenshots
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.screenshots.slice(2).map((screenshot, i) => (
                      <div
                        key={i}
                        className="rounded-2xl overflow-hidden border border-white/5 bg-[#111]"
                      >
                        <img
                          src={screenshot}
                          alt={`${project.title} screenshot ${i + 3}`}
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </div>

          {/* Sidebar - On this page */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-white/5 bg-[#111] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Menu size={14} className="text-white/40" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    On this page
                  </span>
                </div>
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => scrollToSection(item.key)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        activeSection === item.key
                          ? "text-white bg-accent/10 border-l-2 border-accent font-medium"
                          : "text-white/40 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Links */}
              <div className="mt-4 rounded-2xl border border-white/5 bg-[#111] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 block">
                  Links
                </span>
                <div className="space-y-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <Github size={14} />
                      GitHub Repository
                    </a>
                  )}
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <ArrowUpRight size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-dark border-l border-white/5 p-6 lg:hidden"
            >
              <div className="flex items-center gap-2 mb-6">
                <Menu size={14} className="text-white/40" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  On this page
                </span>
              </div>
              <nav className="space-y-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => scrollToSection(item.key)}
                    className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                      activeSection === item.key
                        ? "text-white bg-accent/10 border-l-2 border-accent font-medium"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Quick Links in mobile */}
              <div className="mt-6 pt-6 border-t border-white/5">
                <span className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3 block">
                  Links
                </span>
                <div className="space-y-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <Github size={14} />
                      GitHub Repository
                    </a>
                  )}
                  {project.link && project.link !== "#" && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                      <ArrowUpRight size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigate other projects */}
      <section className="px-6 lg:px-8 max-w-7xl mx-auto pb-20">
        <ProjectNavigation currentSlug={slug} />
      </section>
    </div>
  );
};

/* ===== Feature Accordion ===== */
const FeatureAccordion = ({ feature }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="group/accordion">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            size={16}
            className={`text-white/30 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <span className="text-sm font-medium text-white/80">
            {feature.title}
          </span>
        </div>
        <LinkIcon size={14} className="text-white/20" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 pl-12 text-sm text-white/50 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===== Project Navigation ===== */
const ProjectNavigation = ({ currentSlug }) => {
  const navigate = useNavigate();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="border-t border-white/5 pt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {prevProject ? (
          <button
            onClick={() => {
              navigate(`/project/${prevProject.slug}`);
              window.scrollTo(0, 0);
            }}
            className="group flex items-center gap-3 text-left"
          >
            <ArrowLeft
              size={16}
              className="text-white/40 group-hover:text-accent transition-colors"
            />
            <div>
              <span className="block text-xs text-white/30 uppercase tracking-wider mb-1">
                Previous
              </span>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors max-w-[150px] sm:max-w-[200px] truncate block">
                {prevProject.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-xs uppercase tracking-wider text-white/40 hover:text-white border border-white/10 rounded-lg hover:border-white/20 transition-all"
        >
          All Projects
        </button>

        {nextProject ? (
          <button
            onClick={() => {
              navigate(`/project/${nextProject.slug}`);
              window.scrollTo(0, 0);
            }}
            className="group flex items-center gap-3 text-right"
          >
            <div>
              <span className="block text-xs text-white/30 uppercase tracking-wider mb-1">
                Next
              </span>
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors max-w-[150px] sm:max-w-[200px] truncate block">
                {nextProject.title}
              </span>
            </div>
            <ArrowUpRight
              size={16}
              className="text-white/40 group-hover:text-accent transition-colors"
            />
          </button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
