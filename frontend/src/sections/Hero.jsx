import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, ChevronRight, FileText, X, Download } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import FloatingLines from "../components/FloatingLines";

/* ═══════════════════════ CV Modal ═══════════════════════ */
const CVModal = ({ isOpen, onClose }) => {
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
                href="/KunalApproved5.pdf"
                download="Kunal_Dhangar_Resume.pdf"
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                title="Download Resume"
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
              src="/KunalApproved5.pdf#toolbar=1&navpanes=0&scrollbar=1"
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
  const { isDark } = useTheme();
  const techStack = getTechStack(isDark);

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
                  onClick={() => navigator.clipboard.writeText(personalInfo.email)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors group cursor-pointer"
                >
                  <Copy size={13} />
                  <span className="hidden sm:inline">{personalInfo.email}</span>
                  <span className="sm:hidden">Copy Email</span>
                </button>
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
              className="mx-auto w-full max-w-[380px] lg:mx-0"
            >
              <div className="relative rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/50">
                {/* Subtle top gradient accent */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                <div className="p-6">
                  {/* Identity row */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${personalInfo.firstName}`}
                      alt={personalInfo.name}
                      className="w-11 h-11 rounded-full border-2 border-gray-200 dark:border-white/[0.06] bg-gray-50 dark:bg-white/[0.03] shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-[15px] leading-tight truncate">
                        {personalInfo.name}
                      </h3>
                      <p className="text-gray-400 dark:text-white/40 text-xs mt-0.5 truncate">
                        {personalInfo.title}
                      </p>
                    </div>
                    {personalInfo.available && (
                      <span className="ml-auto shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-600 text-[10px] font-semibold uppercase tracking-wide">
                          Open
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 dark:bg-white/5 -mx-6 mb-5" />

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {[
                      { label: "Focus", value: "Full-Stack" },
                      { label: "Stack", value: "MERN" },
                      { label: "Also Into", value: "Web3 · Android" },
                      { label: "Location", value: "India 🇮🇳" },
                    ].map((item) => (
                      <div key={item.label} className="space-y-1">
                        <div className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider font-medium">
                          {item.label}
                        </div>
                        <div className="text-[13px] text-gray-700 dark:text-white/80 font-medium">
                          {item.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gray-100 dark:bg-white/5 -mx-6 mb-5" />

                  {/* Highlights */}
                  <div className="space-y-2.5">
                    <div className="text-[10px] text-gray-400 dark:text-white/40 uppercase tracking-wider font-medium">
                      Highlights
                    </div>
                    {[
                      "Production e-commerce platforms (KripaConnect)",
                      "Real-time apps with Socket.io & WebRTC",
                      "Payment integrations (Razorpay, Stripe)",
                      "Docker, AWS & CI/CD pipelines",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <ChevronRight
                          size={12}
                          className="text-accent/60 mt-0.5 shrink-0"
                        />
                        <span className="text-[13px] text-gray-500 dark:text-white/60 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
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
