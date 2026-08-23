import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, ChevronRight, FileText, X, Download } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import FloatingLines from "../components/FloatingLines";
import kunalImg from "../assets/Kunal.png";

/* ═══════════════════════ CV Modal ═══════════════════════ */
const CVModal = ({ isOpen, onClose }) => {
  const [cvUrl, setCvUrl] = useState("/KunalApproved5.pdf");

  useEffect(() => {
    if (isOpen) {
      fetch(`${import.meta.env.VITE_BACKEND_URL || ""}/api/settings/cv_url`)
        .then(res => res.json())
        .then(data => {
          if (data && data.value) setCvUrl(data.value);
        })
        .catch(err => console.error("Error fetching CV URL:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
              <FileText className="text-accent" size={18} />
              <span className="text-gray-800 dark:text-white/90 text-sm font-medium">Resume &mdash; {personalInfo.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                download="Resume.pdf"
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                title="Download / Open Resume"
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

import { useTheme } from "../components/ThemeContext";

/* ═══════════ Tech Stack Icons ═══════════ */
const getTechStack = (isDark) => [
  { name: "React", icon: "https://cdn.simpleicons.org/react/61DAFB" },
  { name: "Node.js", icon: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { name: "MongoDB", icon: "https://cdn.simpleicons.org/mongodb/47A248" },
  { name: "TypeScript", icon: "https://cdn.simpleicons.org/typescript/3178C6" },
  { name: "Next.js", icon: `https://cdn.simpleicons.org/nextdotjs/${isDark ? "FFFFFF" : "000000"}` },
  { name: "Android", icon: "https://cdn.simpleicons.org/android/3DDC84" },
];

/* ═══════════════════════════ Hero ═══════════════════════════ */
const Hero = () => {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isDark } = useTheme();
  const techStack = getTechStack(isDark);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a]"
      >
        {/* ─── FloatingLines Background ─── */}
        <FloatingLines
          linesGradient={["#6c63ff", "#8b83ff", "#a78bfa", "#c4b5fd"]}
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[4, 6, 4]}
          lineDistance={[6, 5, 4]}
          animationSpeed={0.8}
          interactive={true}
          bendRadius={5}
          bendStrength={-0.5}
          mouseDamping={0.05}
          parallax={true}
          parallaxStrength={0.15}
          mixBlendMode="normal"
        />

        {/* Light overlay to soften lines */}
        <div className="absolute inset-0 bg-white/70 dark:bg-[#0a0a0a]/30 pointer-events-none" style={{ zIndex: 1 }} />

        {/* ═══════════ Main Content ═══════════ */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-24 lg:pt-32 lg:pb-28">
          <div className="grid lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-center">
            {/* ─────── Left Column: Identity ─────── */}
            <div>
              {/* Upcoming badge */}
              <motion.a
                href="#projects"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 mb-7 group cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-md bg-accent text-white text-[11px] font-semibold tracking-wide uppercase">
                  New
                </span>
                <span className="text-sm text-gray-500 dark:text-white/60 group-hover:text-gray-700 dark:hover:text-white/80 transition-colors">
                  CreoLink is launching soon
                </span>
                <ChevronRight
                  size={13}
                  className="text-gray-400 dark:text-white/40 group-hover:translate-x-0.5 transition-transform"
                />
              </motion.a>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[3.75rem] font-display font-semibold leading-[1.12] tracking-[-0.025em]"
              >
                <span className="text-gray-900 dark:text-white">Designing the future,</span>
                <br />
                <span className="italic font-light text-gray-400 dark:text-white/40">
                  Coding the present.
                </span>
              </motion.h1>

              {/* One-liner bio */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mt-5 text-gray-500 dark:text-white/60 text-base md:text-[1.05rem] leading-relaxed max-w-xl"
              >
                CS student & Full-Stack developer specializing in the MERN stack,
                Web3, and Android — turning complex ideas into polished digital products.
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                {/* Let's Connect */}
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2.5 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-white/90 transition-colors"
                >
                  Let&apos;s Connect
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </a>

                {/* View CV */} 
                <button
                  onClick={() => setIsCVModalOpen(true)}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 rounded-full text-gray-700 dark:text-white/80 text-sm font-medium transition-all duration-200"
                >
                  <FileText size={14} className="text-accent" />
                  View CV
                </button>

                {/* Email */}
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors group cursor-pointer"
                  title="Copy email to clipboard"
                >
                  <Copy size={13} className={copied ? "text-emerald-500" : ""} />
                  <span className="hidden sm:inline">
                    {copied ? "Copied! ✓" : personalInfo.email}
                  </span>
                  <span className="sm:hidden">
                    {copied ? "Copied! ✓" : "Copy Email"}
                  </span>
                </button>
              </motion.div>

              {/* Social Icons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-5 flex items-center gap-3"
              >
                {[
                  {
                    name: "LinkedIn",
                    href: personalInfo.social.linkedin,
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    ),
                    color: "hover:text-[#0A66C2]",
                  },
                  {
                    name: "GitHub",
                    href: personalInfo.social.github,
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.111.82-.261.82-.579 0-.285-.01-1.04-.015-2.04-3.338.724-4.043-1.611-4.043-1.611-.546-1.386-1.333-1.755-1.333-1.755-1.09-.744.082-.729.082-.729 1.205.084 1.839 1.239 1.839 1.239 1.07 1.835 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.302 1.23A11.52 11.52 0 0112 6.81c1.02.004 2.047.138 3.006.405 2.292-1.552 3.298-1.23 3.298-1.23.655 1.653.243 2.874.12 3.176.77.84 1.234 1.91 1.234 3.22 0 4.609-2.807 5.624-5.48 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .321.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.373-12-12-12z" />
                      </svg>
                    ),
                    color: "hover:text-gray-900 dark:hover:text-white",
                  },
                ].map((social, i) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + i * 0.1, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.15, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 ${social.color} transition-colors duration-200`}
                    title={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </motion.div>

              {/* Tech stack row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-10 flex items-center gap-4"
              >
                <span className="text-[11px] text-gray-400 dark:text-white/40 uppercase tracking-widest font-medium shrink-0">
                  Stack
                </span>
                <div className="h-px flex-1 max-w-8 bg-gray-200 dark:bg-white/10" />
                <div className="flex items-center gap-3">
                  {techStack.map((t) => (
                    <img
                      key={t.name}
                      src={t.icon}
                      alt={t.name}
                      title={t.name}
                      className="w-5 h-5 opacity-50 hover:opacity-90 transition-opacity"
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ─────── Right Column: Profile Card ─────── */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mx-auto w-full max-w-[420px] lg:mx-0"
            >
              <div className="relative rounded-3xl border border-gray-200 dark:border-white/[0.06] bg-white/90 dark:bg-[#0a0a0a]/85 backdrop-blur-md overflow-hidden shadow-xl shadow-gray-200/60 dark:shadow-black/50">
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent" />

                <div className="relative p-6 md:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-[2px] bg-gradient-to-br from-accent via-purple-500 to-pink-500 shadow-lg shadow-accent/20 shrink-0">
                      <img
                        src={kunalImg}
                        alt={personalInfo.name}
                        className="w-full h-full rounded-2xl object-cover object-top bg-gray-50 dark:bg-white/[0.03]"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-gray-900 dark:text-white font-display font-bold text-xl leading-tight">
                        {personalInfo.name}
                      </h3>
                      <p className="text-gray-500 dark:text-white/55 text-sm mt-1 leading-relaxed">
                        Full-Stack Web & Android Developer
                      </p>
                      {personalInfo.available && (
                        <span className="inline-flex mt-3 items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-400/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold uppercase tracking-wide">
                            Open to Work
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { label: "Focus", value: "Full-Stack" },
                      { label: "Stack", value: "MERN" },
                      { label: "Also Into", value: "Web3 · Android" },
                      { label: "Location", value: "India 🇮🇳" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-xl border border-gray-200 dark:border-white/[0.06] bg-white/60 dark:bg-white/[0.03] p-3"
                      >
                        <div className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider font-medium">
                          {item.label}
                        </div>
                        <div className="text-[13px] text-gray-800 dark:text-white/85 font-semibold mt-1">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <div className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider font-medium mb-3">
                      Highlights
                    </div>
                    <div className="space-y-2.5">
                      {[
                        "Production e-commerce platforms (KripaConnect)",
                        "Real-time apps with Socket.io & WebRTC",
                        "Payment integrations (Razorpay, Stripe)",
                        "Docker, AWS & CI/CD pipelines",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 bg-gray-50 dark:bg-white/[0.03]"
                        >
                          <ChevronRight
                            size={13}
                            className="text-accent mt-0.5 shrink-0"
                          />
                          <span className="text-[13px] text-gray-600 dark:text-white/65 leading-snug">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade to blend into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#fafafa] dark:to-[#0a0a0a] pointer-events-none" style={{ zIndex: 2 }} />
      </section>

      {/* CV Modal */}
      <CVModal isOpen={isCVModalOpen} onClose={() => setIsCVModalOpen(false)} />
    </>
  );
};

export default Hero;
