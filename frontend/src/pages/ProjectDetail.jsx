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
import { projects as staticProjects } from "../data/portfolio";
import axios from "axios";
import { optimizeCloudinaryUrl } from "../utils/imageOptimization";

const API = import.meta.env.VITE_BACKEND_URL || "";

const resolveImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith('/uploads')) return `${API}${url}`;
  return optimizeCloudinaryUrl(url);
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [allProjects, setAllProjects] = useState(staticProjects);
  const [loading, setLoading] = useState(true);
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
    
    const fetchData = async () => {
      try {
        // Fetch all projects for navigation
        const allProjectsRes = await axios.get(`${API}/api/projects`);
        const mappedProjects = allProjectsRes.data.map((p) => ({
          ...p,
          id: p._id || p.id,
        }));
        setAllProjects(mappedProjects);
        
        // Fetch current project
        const { data } = await axios.get(`${API}/api/projects/${slug}`);
        setProject(data);
      } catch (error) {
        console.log("Failed to fetch project from API, using static data");
        const staticProject = staticProjects.find((p) => p.slug === slug);
        setProject(staticProject);
        setAllProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 dark:text-white/40 text-sm">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold font-display text-gray-900 dark:text-white mb-4">
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

  const heroImage = resolveImageUrl(
    project.imageHero || optimizeCloudinaryUrl(project.imageOptimized || project.image, { width: 1600, height: 1000, crop: "limit" })
  );
  const backdropImage = resolveImageUrl(
    project.imageBackdrop || optimizeCloudinaryUrl(project.imageOptimized || project.image, { width: 1200, height: 1200, crop: "fill" })
  );
  const screenshotList = (project.screenshotsOptimized && project.screenshotsOptimized.length > 0)
    ? project.screenshotsOptimized
    : project.screenshots;

  return (
    <div className="min-h-screen bg-dark">
      {/* Fixed Top Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Projects</span>
          </button>

          <span className="text-sm font-medium text-gray-700 dark:text-white/80 font-display">
            {project.title}
          </span>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white"
          >
            <Menu size={16} />
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-24 pb-12 lg:pt-32 lg:pb-16 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background project image (blurred) */}
        {backdropImage && (
          <div className="fixed inset-0 z-0 opacity-5">
            <img
              src={backdropImage}
              alt=""
              className="w-full h-full object-cover blur-3xl"
              loading="eager"
              decoding="async"
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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-gray-900 dark:text-white mb-6 leading-tight">
            {project.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-500 dark:text-white/60 max-w-3xl leading-relaxed mb-8">
            {project.longDescription}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-white/60 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/[0.06]"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-semibold hover:bg-gray-800 dark:hover:bg-white/90 transition-colors"
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white text-sm font-semibold hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
              >
                Check it out
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </motion.div>
      </section>

      {/* Project Screenshots Hero */}
      {screenshotList && screenshotList.length > 0 && (
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {screenshotList.slice(0, 2).map((screenshot, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111]"
              >
                <img
                  src={resolveImageUrl(screenshot)}
                  alt={`${project.title} screenshot ${i + 1}`}
                  className="w-full h-auto object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Main preview when no screenshots */}
      {(!screenshotList || screenshotList.length === 0) && heroImage && (
        <section className="px-6 lg:px-8 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111]"
          >
            <img
              src={heroImage}
              alt={project.title}
              className="w-full h-auto object-cover"
              loading="eager"
              decoding="async"
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
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 dark:text-white mb-8">
                  Key Features
                </h2>
                <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111] overflow-hidden divide-y divide-gray-200 dark:divide-white/5">
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
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 dark:text-white mb-8">
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
                        <span className="text-gray-500 dark:text-white/60"> – {tech.description}</span>
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
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 dark:text-white mb-8">
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
                      className="rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-6"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-display">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">
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
                <h2 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 dark:text-white mb-6">
                  Outcome
                </h2>
                <div className="rounded-2xl bg-gradient-to-br from-accent/5 to-purple-500/5 border border-accent/10 p-8">
                  <p className="text-base text-gray-600 dark:text-white/70 leading-relaxed">
                    {project.outcome}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* More Screenshots */}
            {screenshotList && screenshotList.length > 2 && (
              <div ref={sectionRefs.screenshots}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl lg:text-3xl font-bold font-display text-gray-900 dark:text-white mb-8">
                    Screenshots
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {screenshotList.slice(2).map((screenshot, i) => (
                      <div
                        key={i}
                        className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111]"
                      >
                        <img
                          src={resolveImageUrl(screenshot)}
                          alt={`${project.title} screenshot ${i + 3}`}
                          className="w-full h-auto object-cover"
                          loading="lazy"
                          decoding="async"
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
              <div className="rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Menu size={14} className="text-gray-400 dark:text-white/40" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
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
                          ? "text-gray-900 dark:text-white bg-accent/10 border-l-2 border-accent font-medium"
                          : "text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5 border-l-2 border-transparent"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Links */}
              <div className="mt-4 rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white dark:bg-[#111] p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-3 block">
                  Links
                </span>
                <div className="space-y-2">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
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
              className="fixed inset-0 z-40 bg-black/30 dark:bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-dark border-l border-gray-200 dark:border-white/[0.06] p-6 lg:hidden"
            >
              <div className="flex items-center gap-2 mb-6">
                <Menu size={14} className="text-gray-400 dark:text-white/40" />
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
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
                        ? "text-gray-900 dark:text-white bg-accent/10 border-l-2 border-accent font-medium"
                        : "text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-100 dark:hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Quick Links in mobile */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/[0.06]">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-3 block">
                  Links
                </span>
                <div className="space-y-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                      className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
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
        <ProjectNavigation currentSlug={slug} projects={allProjects} />
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
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            size={16}
            className={`text-gray-400 dark:text-white/40 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-white/80">
            {feature.title}
          </span>
        </div>
        <LinkIcon size={14} className="text-gray-300 dark:text-white/25" />
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
            <p className="px-5 pb-5 pl-12 text-sm text-gray-500 dark:text-white/60 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===== Project Navigation ===== */
const ProjectNavigation = ({ currentSlug, projects }) => {
  const navigate = useNavigate();
  const currentIndex = projects.findIndex((p) => p.slug === currentSlug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <div className="border-t border-gray-200 dark:border-white/[0.06] pt-12">
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
              className="text-gray-400 dark:text-white/40 group-hover:text-accent transition-colors"
            />
            <div>
              <span className="block text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1">
                Previous
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white dark:hover:text-white transition-colors max-w-[150px] sm:max-w-[200px] truncate block">
                {prevProject.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 text-xs uppercase tracking-wider text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-white/10 rounded-lg hover:border-gray-300 dark:hover:border-white/10 transition-all"
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
              <span className="block text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider mb-1">
                Next
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white dark:hover:text-white transition-colors max-w-[150px] sm:max-w-[200px] truncate block">
                {nextProject.title}
              </span>
            </div>
            <ArrowUpRight
              size={16}
              className="text-gray-400 dark:text-white/40 group-hover:text-accent transition-colors"
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
