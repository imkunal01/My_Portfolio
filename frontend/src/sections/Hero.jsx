import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Copy, ChevronRight, FileText, X, Download } from "lucide-react";
import { personalInfo } from "../data/portfolio";
import FloatingLines from "../components/FloatingLines";
import kunalImg from "../assets/Kunal.png";

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
                    name: "Instagram",
                    href: personalInfo.social.instagram,
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
                      </svg>
                    ),
                    color: "hover:text-[#E4405F]",
                  },
                  {
                    name: "Threads",
                    href: personalInfo.social.threads,
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
                        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.781 3.632 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.343-.783-.964-1.416-1.796-1.838a6.7 6.7 0 01-.626 3.27c-.533 1.073-1.394 1.906-2.49 2.408-1.066.49-2.29.636-3.507.423-1.568-.275-2.866-1.09-3.653-2.295-.708-1.084-.984-2.42-.778-3.767.266-1.745 1.32-3.186 2.886-3.95 1.264-.617 2.81-.771 4.349-.435-.071-.972-.34-1.712-.818-2.217-.613-.646-1.546-.97-2.773-.964l-.025-.002c-1.65.04-2.824.636-3.585 1.824l-1.727-1.14c1.1-1.716 2.828-2.627 5.142-2.71l.16-.004c1.796-.012 3.253.49 4.331 1.491.967.898 1.567 2.146 1.78 3.696.726.186 1.389.459 1.978.825 1.192.74 2.085 1.81 2.584 3.094.767 1.975.752 4.703-1.374 6.784-1.79 1.753-4.028 2.526-7.049 2.548zm-.71-7.3c.632.111 1.316.056 1.932-.217.68-.303 1.196-.836 1.494-1.543a4.82 4.82 0 00.396-2.545c-1.07-.34-2.2-.367-3.216.042-.93.375-1.576 1.108-1.743 1.98-.124.654-.012 1.316.398 1.845.329.425.785.685 1.266.8l-.527-.362z" />
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
              className="mx-auto w-full max-w-[380px] lg:mx-0"
            >
              <div className="relative rounded-2xl border border-gray-200 dark:border-white/[0.06] bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/50">
                {/* Subtle top gradient accent */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

                <div className="p-6">
                  {/* Identity row */}
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-br from-accent via-purple-500 to-pink-500 shrink-0">
                      <img
                        src={kunalImg}
                        alt={personalInfo.name}
                        className="w-full h-full rounded-full object-cover object-top bg-gray-50 dark:bg-white/[0.03]"
                      />
                    </div>
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
