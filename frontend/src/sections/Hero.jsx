import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  X,
  Download,
  MapPin,
  Code2,
  Package,
  GraduationCap,
  Briefcase,
  Folder,
  Target,
  Mail,
} from "lucide-react";
import { personalInfo } from "../data/portfolio";
import FloatingLines from "../components/FloatingLines";

/* ═══════════════════════ CV Modal ═══════════════════════ */
const CVModal = ({ isOpen, onClose }) => {
  const [cvUrl, setCvUrl] = useState("/KunalApproved5.pdf");

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/settings/cv_url`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.value) setCvUrl(data.value);
        })
        .catch((err) => console.error("Error fetching CV URL:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-[#111116] border border-gray-200 dark:border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#111116]/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <FileText size={17} />
              </div>
              <span className="text-gray-800 dark:text-white/90 text-sm font-semibold">
                Resume &mdash; {personalInfo.name}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                download="Resume.pdf"
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white text-xs font-medium"
                title="Download Resume"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* PDF Viewer */}
          <div className="w-full h-[calc(100%-54px)] bg-gray-50 dark:bg-white/[0.02]">
            <iframe
              src={`${cvUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full"
              title="Resume PDF"
              style={{ border: "none" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ═══════════════════ Tech Stack ═══════════════════ */
const heroTechStack = [
  {
    name: "React",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
  },
  {
    name: "Node.js",
    icon: "https://cdn.simpleicons.org/nodedotjs/339933",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.simpleicons.org/mongodb/47A248",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.simpleicons.org/typescript/3178C6",
  },
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.simpleicons.org/docker/2496ED",
  },
];

/* ═══════════════════════════ Hero Component ═══════════════════════════ */
const Hero = () => {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#07060e] text-white transition-colors duration-300"
      >
        {/* ─── Ambient FloatingLines Background ─── */}
        <FloatingLines
          linesGradient={["#4f46e5", "#7c3aed", "#9333ea", "#a855f7", "#c084fc"]}
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[4, 6, 4]}
          lineDistance={[6, 5, 4]}
          animationSpeed={0.7}
          interactive={true}
          bendRadius={5}
          bendStrength={-0.5}
          mouseDamping={0.05}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode="screen"
        />

        {/* Ambient Radial Glows matching design */}
        <div className="absolute top-1/4 left-1/10 w-[550px] h-[550px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

        {/* Soft dark vignette overlay */}
        <div
          className="absolute inset-0 bg-radial from-transparent via-[#07060e]/30 to-[#07060e]/70 pointer-events-none"
          style={{ zIndex: 1 }}
        />

        {/* ═══════════ Main Content Container ═══════════ */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 pb-16 lg:pt-36 lg:pb-20">
          
          {/* Two-Column Grid: Left editorial bio & Right floating cards */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
            
            {/* ─────── Left Column: Editorial Identity & CTAs ─────── */}
            <div>
              {/* Badges Bar */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex flex-wrap items-center gap-2.5 mb-7"
              >
                {/* Available for hire */}
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081e19]/90 border border-emerald-500/30 text-emerald-300 text-xs font-semibold backdrop-blur-xl shadow-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  Open to Work
                </span>

                {/* Launching project pill */}
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#141029]/90 hover:bg-[#1c163b]/90 border border-purple-500/30 text-purple-200 text-xs font-medium backdrop-blur-xl transition-all group shadow-sm hover:border-purple-400/50"
                >
                  <span className="text-xs">🚀</span>
                  <span>CreoLink launching soon</span>
                  <ArrowRight size={12} className="text-purple-300 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>

              {/* Large Editorial Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[4.2rem] font-display font-semibold leading-[1.1] tracking-[-0.03em]"
              >
                <span className="text-white">Designing the future,</span>
                <br />
                <span className="italic font-light bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#818cf8] bg-clip-text text-transparent">
                  Coding the present.
                </span>
              </motion.h1>

              {/* Minimal Bio */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-6 text-white/60 text-base md:text-[1.05rem] leading-relaxed max-w-xl font-normal"
              >
                CS student &amp; Full-Stack developer specializing in the MERN stack, Web3 ecosystems, and Android &mdash; crafting high-performance digital experiences.
              </motion.p>

              {/* Action Buttons Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-9 flex flex-wrap items-center gap-3.5"
              >
                {/* Primary Button */}
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-950 rounded-full text-sm font-semibold hover:bg-gray-100 shadow-[0_0_25px_rgba(255,255,255,0.18)] transition-all hover:gap-2.5 active:scale-95"
                >
                  <span>Let&apos;s Connect</span>
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* View CV Button */}
                <button
                  onClick={() => setIsCVModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-5 py-3 bg-[#120f26]/85 hover:bg-[#1b1638]/90 border border-purple-500/25 rounded-full text-white/90 text-sm font-medium backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all cursor-pointer active:scale-95"
                >
                  <FileText size={15} className="text-white/70 group-hover:text-white" />
                  <span>View CV</span>
                </button>

                {/* Email / Copy Button */}
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3 py-3 text-sm text-white/60 hover:text-white transition-colors cursor-pointer group"
                  title="Copy email to clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Mail size={15} className="text-white/50 group-hover:text-white transition-colors" />
                      <span className="text-xs sm:text-sm font-normal text-white/60 group-hover:text-white transition-colors">
                        {personalInfo.email}
                      </span>
                    </>
                  )}
                </button>
              </motion.div>

              {/* Tech Stack Icons Row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-9 flex flex-wrap items-center gap-3 sm:gap-3.5"
              >
                {heroTechStack.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex flex-col items-center justify-center gap-1.5 w-[60px] h-[60px] sm:w-[66px] sm:h-[66px] rounded-2xl bg-[#120f26]/85 border border-purple-500/25 backdrop-blur-2xl hover:border-purple-500/50 hover:bg-[#1a1538]/90 hover:-translate-y-1 transition-all duration-300 group shadow-[0_8px_25px_-5px_rgba(0,0,0,0.5)] cursor-pointer"
                    title={tech.name}
                  >
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain group-hover:scale-110 transition-transform"
                    />
                    <span className="text-[10px] sm:text-[11px] font-medium text-white/50 group-hover:text-white transition-colors">
                      {tech.name}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ─────── Right Column: 3 Floating Connected Cards ─────── */}
            <div className="relative w-full max-w-[440px] mx-auto lg:ml-auto flex flex-col gap-4 sm:gap-5">
              
              {/* Glowing cybernetic connection curve and node behind cards */}
              <div className="absolute -left-20 sm:-left-28 top-1/2 -translate-y-1/2 w-56 sm:w-72 h-56 sm:h-72 pointer-events-none hidden md:block z-0">
                <svg viewBox="0 0 280 280" fill="none" className="w-full h-full overflow-visible">
                  <path
                    d="M -30 180 C 40 180, 80 120, 160 95 C 200 82, 240 70, 280 65"
                    stroke="url(#lineNeonGradient)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-75"
                  />
                  <defs>
                    <linearGradient id="lineNeonGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
                      <stop offset="45%" stopColor="#a855f7" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#c084fc" stopOpacity="0.3" />
                    </linearGradient>
                    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Glowing purple node */}
                  <g filter="url(#neonGlow)">
                    <circle cx="105" cy="138" r="4.5" fill="#c084fc" />
                  </g>
                  <circle cx="105" cy="138" r="9" stroke="#a855f7" strokeWidth="1" strokeOpacity="0.6" className="animate-ping" />
                  <circle cx="105" cy="138" r="18" fill="#a855f7" fillOpacity="0.15" />
                </svg>
              </div>

              {/* Card 1: Currently Building (CreoLink) */}
              <motion.div
                initial={{ opacity: 0, x: 25, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative z-10 w-full max-w-[390px] lg:ml-auto rounded-[22px] p-5 sm:p-6 bg-[#120f26]/85 backdrop-blur-2xl border border-purple-500/25 shadow-[0_12px_40px_-8px_rgba(76,29,149,0.35),0_0_20px_0_rgba(147,51,234,0.12)] group hover:border-purple-500/50 hover:shadow-[0_16px_48px_-8px_rgba(76,29,149,0.5),0_0_30px_0_rgba(147,51,234,0.22)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all shrink-0">
                      <Folder size={22} className="stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-white/50 block">
                        Currently Building
                      </span>
                      <h3 className="text-lg font-bold text-white tracking-tight leading-snug mt-0.5">
                        CreoLink
                      </h3>
                      <span className="text-xs text-white/50 block mt-0.5">
                        E-commerce Platform
                      </span>
                    </div>
                  </div>
                  <a
                    href="#projects"
                    className="w-9 h-9 rounded-full bg-white/[0.06] hover:bg-white/[0.14] border border-white/10 hover:border-purple-500/40 flex items-center justify-center text-white/70 hover:text-white transition-all shadow-sm shrink-0"
                    title="View CreoLink"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>

              {/* Card 2: Focus (MERN • Next.js) */}
              <motion.div
                initial={{ opacity: 0, x: 35 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative z-10 w-full max-w-[360px] lg:ml-auto rounded-[20px] p-4 sm:p-5 bg-[#120f26]/85 backdrop-blur-2xl border border-purple-500/25 shadow-[0_12px_40px_-8px_rgba(76,29,149,0.35),0_0_20px_0_rgba(147,51,234,0.12)] group hover:border-purple-500/50 hover:shadow-[0_16px_48px_-8px_rgba(76,29,149,0.5),0_0_30px_0_rgba(147,51,234,0.22)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all shrink-0">
                      <Target size={20} className="stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-white/50 block">
                        Focus
                      </span>
                      <h4 className="text-[15px] font-bold text-white tracking-tight mt-0.5">
                        MERN &bull; Next.js
                      </h4>
                    </div>
                  </div>
                  <a
                    href="#skills"
                    className="text-white/40 hover:text-white p-2 transition-all group-hover:translate-x-1 shrink-0"
                  >
                    <ArrowRight size={16} />
                  </a>
                </div>
              </motion.div>

              {/* Card 3: Location (India) */}
              <motion.div
                initial={{ opacity: 0, x: 45, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative z-10 w-full max-w-[340px] lg:ml-auto rounded-[20px] p-4 sm:p-5 bg-[#120f26]/85 backdrop-blur-2xl border border-purple-500/25 shadow-[0_12px_40px_-8px_rgba(76,29,149,0.35),0_0_20px_0_rgba(147,51,234,0.12)] group hover:border-purple-500/50 hover:shadow-[0_16px_48px_-8px_rgba(76,29,149,0.5),0_0_30px_0_rgba(147,51,234,0.22)] transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all shrink-0">
                      <MapPin size={20} className="stroke-[1.8]" />
                    </div>
                    <div>
                      <span className="text-[11px] font-medium tracking-wide text-white/50 block">
                        Location
                      </span>
                      <h4 className="text-[15px] font-bold text-white tracking-tight mt-0.5">
                        India
                      </h4>
                    </div>
                  </div>
                  <div className="text-white/40 hover:text-white p-2 transition-all group-hover:translate-x-1 shrink-0">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* ═══════════ Bottom Stats Glass Banner ═══════════ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-14 lg:mt-16 w-full rounded-[22px] bg-[#120f26]/85 backdrop-blur-2xl border border-purple-500/25 shadow-[0_12px_40px_-8px_rgba(76,29,149,0.35),0_0_20px_0_rgba(147,51,234,0.12)] p-5 sm:p-6 lg:p-7"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 items-center">
              {/* Stat 1: 500+ DSA Solved */}
              <div className="flex items-center gap-4 sm:px-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Code2 size={22} className="stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    500+
                  </div>
                  <div className="text-xs text-white/50 font-medium mt-0.5">
                    DSA Solved
                  </div>
                </div>
              </div>

              {/* Stat 2: 3+ Projects */}
              <div className="flex items-center gap-4 sm:px-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Package size={22} className="stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    3+
                  </div>
                  <div className="text-xs text-white/50 font-medium mt-0.5">
                    Projects
                  </div>
                </div>
              </div>

              {/* Stat 3: 3rd Year B.Tech CSE */}
              <div className="flex items-center gap-4 sm:px-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <GraduationCap size={22} className="stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    3rd Year
                  </div>
                  <div className="text-xs text-white/50 font-medium mt-0.5">
                    B.Tech CSE (LPU)
                  </div>
                </div>
              </div>

              {/* Stat 4: Open To Opportunities */}
              <div className="flex items-center gap-4 sm:px-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Briefcase size={22} className="stroke-[1.8]" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Open
                  </div>
                  <div className="text-xs text-white/50 font-medium mt-0.5">
                    To Opportunities
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom soft gradient blend */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#07060e] pointer-events-none"
          style={{ zIndex: 2 }}
        />
      </section>

      {/* CV Modal */}
      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
    </>
  );
};

export default Hero;
