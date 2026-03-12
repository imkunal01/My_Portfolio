import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Github,
  Linkedin,
  ArrowUpRight,
  Briefcase,
  MapPin,
  Mail,
  Code2,
  Sparkles,
  Award,
  X,
  Download,
  ExternalLink,
} from "lucide-react";
import { personalInfo, experience, certificates } from "../data/portfolio";
import kunalImg from "../assets/Kunal.png";

/* ═══════════════════════ Certificate Modal ═══════════════════════ */
const CertificateModal = ({ cert, isOpen, onClose }) => {
  if (!isOpen || !cert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 dark:border-white/[0.06] bg-white/95 dark:bg-[#111]/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Award className="text-accent" size={18} />
              <span className="text-gray-800 dark:text-white/90 text-sm font-medium">
                {cert.title} &mdash; {cert.issuer}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={cert.pdfUrl}
                download
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                title="Download Certificate"
              >
                <Download size={16} />
              </a>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="w-full h-[calc(100%-52px)] bg-gray-50 dark:bg-white/[0.03]">
            <iframe
              src={`${cert.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full"
              title={`${cert.title} Certificate`}
              style={{ border: "none" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const cardBase =
  "bento-card rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-6 h-full shadow-sm";

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [selectedCert, setSelectedCert] = useState(null);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay },
  });

  return (
    <section
      id="about"
      className="py-20 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="section-label">Know About Me</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
          <span className="gradient-text">Full-Stack Developer</span>
          <br />
          <span className="text-gray-500 dark:text-white/60 text-2xl md:text-3xl lg:text-4xl">
            and a little bit of everything
          </span>
        </h2>
      </motion.div>

      {/* ─── Bento Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-auto">
        {/* ── 1. Photo Card (tall, spans 1 col on lg) ── */}
        <motion.div {...fadeUp(0.1)} className="md:col-span-1 lg:row-span-2">
          <div className={`${cardBase} flex flex-col items-center justify-center gap-4 !p-4`}>
            <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden">
              <img
                src={kunalImg}
                alt="Kunal Dhangar"
                className="w-full h-full object-cover object-top"
              />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent" />
            </div>
            <div className="text-center w-full">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display">
                {personalInfo.name}
              </h3>
              <p className="text-xs text-accent mt-1">{personalInfo.title}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-gray-400 dark:text-white/40 text-xs">
                <MapPin size={12} />
                {personalInfo.location}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Bio Card (wide) ── */}
        <motion.div {...fadeUp(0.15)} className="md:col-span-1 lg:col-span-2">
          <div className={cardBase}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-accent" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                About
              </h3>
            </div>
            <div className="space-y-3">
              {personalInfo.bio.map((para, i) => (
                <p
                  key={i}
                  className="text-sm lg:text-base text-gray-500 dark:text-white/60 leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 3. Quick Stats Card ── */}
        <motion.div {...fadeUp(0.2)} className="md:col-span-1 lg:col-span-1">
          <div className={cardBase}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-4">
              Quick Info
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                <div className="text-xl font-bold text-accent">CS</div>
                <div className="text-[10px] text-gray-400 dark:text-white/40 mt-1">Student</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                <div className="text-xl font-bold text-gray-900 dark:text-white">Web3</div>
                <div className="text-[10px] text-gray-400 dark:text-white/40 mt-1">Enthusiast</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  <Code2 size={22} className="mx-auto" />
                </div>
                <div className="text-[10px] text-gray-400 dark:text-white/40 mt-1">Full Stack</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                <div className="text-xl font-bold text-green-500">✓</div>
                <div className="text-[10px] text-gray-400 dark:text-white/40 mt-1">Available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 4. Social Links Card ── */}
        <motion.div {...fadeUp(0.25)} className="md:col-span-1 lg:col-span-1">
          <div className={cardBase}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-4">
              Connect
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium group"
              >
                <Linkedin size={18} />
                LinkedIn
                <ArrowUpRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <a
                href={personalInfo.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium group"
              >
                <Github size={18} />
                GitHub
                <ArrowUpRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
              <a
                href={personalInfo.social.email}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all text-sm font-medium group"
              >
                <Mail size={18} />
                Email
                <ArrowUpRight
                  size={14}
                  className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── 5. Experience Card (wide) ── */}
        <motion.div {...fadeUp(0.3)} className="md:col-span-2 lg:col-span-2">
          <div className={cardBase}>
            <div className="flex items-center gap-2 mb-5">
              <Briefcase size={16} className="text-accent" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                Experience
              </h3>
            </div>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-4 border-l-2 border-accent/20"
                >
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {exp.role}
                  </h4>
                  <p className="text-xs text-accent mt-0.5">{exp.company}</p>
                  <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">{exp.period}</p>
                  <p className="text-xs text-gray-500 dark:text-white/60 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── 6. Certificates Card (full width) ── */}
        <motion.div {...fadeUp(0.35)} className="md:col-span-2 lg:col-span-4">
          <div className={cardBase}>
            <div className="flex items-center gap-2 mb-6">
              <Award size={16} className="text-accent" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                Certificates
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <button
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className="group relative text-left p-5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                >
                  {/* Accent top bar */}
                  <div
                    className="absolute top-0 left-4 right-4 h-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: cert.color }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {cert.title}
                      </h4>
                      <p className="text-xs mt-1 font-medium" style={{ color: cert.color }}>
                        {cert.issuer}
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-white/40 mt-1.5">
                        {cert.period}
                      </p>
                    </div>
                    <div className="flex-shrink-0 p-2 rounded-lg bg-gray-100 dark:bg-white/[0.05] group-hover:bg-gray-200 dark:group-hover:bg-white/[0.08] transition-colors">
                      <ExternalLink size={14} className="text-gray-400 dark:text-white/40 group-hover:text-accent transition-colors" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-white/30 group-hover:text-accent/70 transition-colors">
                    <Award size={11} />
                    <span>Click to view certificate</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        cert={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </section>
  );
};

export default About;
