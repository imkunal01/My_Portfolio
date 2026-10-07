import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const GREETINGS = [
  { text: "Hello", lang: "EN" },
  { text: "नमस्ते", lang: "HI" },
  { text: "Bonjour", lang: "FR" },
  { text: "Designing The Future", lang: "DEV" },
  { text: "Kunal.", lang: "PORTFOLIO" },
];

const LandingAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  // Smooth counter progression (comfortable pace for effortless readability)
  useEffect(() => {
    const startTime = performance.now();
    const duration = 3600; // 3.6s total duration gives ~720ms per greeting

    let frameId;
    const updateProgress = (now) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);

      // Smooth natural easing
      const eased = Math.round(
        rawProgress < 0.5
          ? 2 * rawProgress * rawProgress * 100
          : (1 - Math.pow(-2 * rawProgress + 2, 2) / 2) * 100
      );

      setProgress(Math.min(eased, 100));

      if (rawProgress < 1) {
        frameId = requestAnimationFrame(updateProgress);
      } else {
        // Comfortable pause on the final "Kunal." greeting before curtains lift
        setTimeout(() => {
          setIsExiting(true);
        }, 550);
      }
    };

    frameId = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Cycle through greetings based on progress
  useEffect(() => {
    const index = Math.min(
      Math.floor((progress / 100) * GREETINGS.length),
      GREETINGS.length - 1
    );
    setGreetingIndex(index);
  }, [progress]);

  // Handle skip with Escape key
  const handleSkip = useCallback(() => {
    setIsExiting(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleSkip();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSkip]);

  const currentGreeting = GREETINGS[greetingIndex];

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden select-none"
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      {/* ─── 5-Column Cinematic Shutter Curtains (Staggered Lift Reveal) ─── */}
      <div className="absolute inset-0 flex pointer-events-none z-0">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ y: "0%" }}
            animate={isExiting ? { y: "-100%" } : { y: "0%" }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
              delay: isExiting ? i * 0.055 : 0,
            }}
            onAnimationComplete={() => {
              if (i === 4 && isExiting) {
                onComplete?.();
              }
            }}
            className="flex-1 h-full bg-[#06040d] border-r border-white/[0.03] last:border-r-0"
          />
        ))}
      </div>

      {/* ─── Animated Ambient Core Background ─── */}
      <motion.div
        animate={isExiting ? { opacity: 0, scale: 0.95 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 lg:p-12 text-white"
      >
        {/* Ambient Radial Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-pink-600/10 rounded-full blur-[140px] pointer-events-none" />

        {/* ─── Top HUD Status Bar ─── */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-mono tracking-widest text-white/40 uppercase">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            </span>
            <span>SYSTEM // INITIALIZING</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span>PORTFOLIO // 2026 EDITION</span>
          </div>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 hover:border-purple-500/40 text-white/50 hover:text-white transition-all cursor-pointer text-[10px]"
          >
            <span>SKIP</span>
            <span className="text-[9px] text-white/30">[ESC]</span>
          </button>
        </div>

        {/* ─── Center Stage: Cybernetic Portal & Kinetic Greetings ─── */}
        <div className="relative z-20 flex flex-col items-center justify-center my-auto">

          {/* Holographic Concentric Rings (Rotating) */}
          <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] pointer-events-none opacity-40">
            {/* Outer Rotating Ring */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
              viewBox="0 0 400 400"
              className="w-full h-full"
            >
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="1.2"
                strokeDasharray="12 18 4 18"
              />
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </motion.svg>

            {/* Inner Counter-Rotating Ring */}
            <motion.svg
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full scale-75"
            >
              <circle
                cx="200"
                cy="200"
                r="180"
                fill="none"
                stroke="#c084fc"
                strokeWidth="1"
                strokeDasharray="6 24"
                strokeOpacity="0.4"
              />
            </motion.svg>
          </div>

          {/* Morphing Greetings Text */}
          <div className="relative h-20 sm:h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGreeting.text}
                initial={{ y: 16, opacity: 0, filter: "blur(6px)", scale: 0.97 }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)", scale: 1 }}
                exit={{ y: -16, opacity: 0, filter: "blur(6px)", scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3 text-center"
              >
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-purple-400 shadow-[0_0_12px_#c084fc] inline-block" />
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]">
                  {currentGreeting.text}
                  {currentGreeting.text === "Kunal." && (
                    <span className="text-purple-400">.</span>
                  )}
                </h1>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Subtitle Tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-2 text-xs sm:text-sm font-mono tracking-widest text-white/50 uppercase"
          >
            {currentGreeting.lang === "PORTFOLIO" ? "WELCOME TO MY DIGITAL UNIVERSE" : `${currentGreeting.lang} // CRAFTING EXPERIENCES`}
          </motion.p>

          {/* ─── Neon Progress Bar & Numeric Counter ─── */}
          <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-[260px] sm:max-w-[320px]">
            {/* Progress Track */}
            <div className="relative w-full h-[3px] bg-white/[0.08] rounded-full overflow-hidden backdrop-blur-md">
              <motion.div
                className="h-full bg-gradient-to-r from-[#6366f1] via-[#a855f7] to-[#ec4899] rounded-full relative"
                style={{ width: `${progress}%` }}
                transition={{ ease: "linear" }}
              >
                {/* Glowing light bead at progress tip */}
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ec4899] blur-[0.5px]" />
              </motion.div>
            </div>

            {/* Numeric Percentage Readout */}
            <div className="flex items-center justify-between w-full font-mono text-[11px] sm:text-xs text-white/40 tracking-wider">
              <span>LOADING ASSETS</span>
              <span className="font-bold text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]">
                {String(progress).padStart(3, "0")}%
              </span>
            </div>
          </div>
        </div>

        {/* ─── Bottom HUD Footer ─── */}
        <div className="relative z-20 flex items-center justify-between text-[11px] font-mono tracking-widest text-white/40 uppercase">
          <div className="flex items-center gap-2">
            <span>FULL-STACK &bull; WEB3 &bull; ANDROID</span>
          </div>
          <div className="flex items-center gap-2">
            <span>INDIA // LATENCY 14ms</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingAnimation;