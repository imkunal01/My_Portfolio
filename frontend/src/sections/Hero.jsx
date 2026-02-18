import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Copy, ChevronRight } from "lucide-react";
import { personalInfo } from "../data/portfolio";

/* ═══════════════════════ Stars Canvas ═══════════════════════ */
const StarsCanvas = () => {
  const canvasRef = useRef(null);

  const stars = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 220; i++) {
      arr.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.4 + 0.3,
        twinkleSpeed: Math.random() * 3 + 2,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseOpacity: Math.random() * 0.5 + 0.15,
      });
    }
    return arr;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (time) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      stars.forEach((s) => {
        const t = time / 1000;
        const opacity =
          s.baseOpacity +
          Math.sin(t * s.twinkleSpeed + s.twinkleOffset) *
            s.baseOpacity *
            0.6;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, opacity)})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [stars]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

/* ═══════════════════════ Horizon Glow ═══════════════════════ */
const HorizonGlow = () => (
  <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ zIndex: 2 }}>
    {/* Atmosphere glow – wide soft cyan/blue spread */}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: "140%",
        height: "420px",
        background:
          "radial-gradient(ellipse 70% 55% at 50% 100%, rgba(56,189,248,0.12) 0%, rgba(30,120,200,0.07) 30%, rgba(15,60,120,0.03) 55%, transparent 80%)",
      }}
    />

    {/* Bright horizon line */}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2"
      style={{
        width: "100%",
        maxWidth: "1200px",
        height: "280px",
      }}
    >
      <svg
        viewBox="0 0 1200 280"
        fill="none"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        {/* Outer soft glow */}
        <defs>
          <filter id="horizonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="horizonBlurWide" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <linearGradient id="horizonGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="rgba(120,180,255,0.3)" />
            <stop offset="40%" stopColor="rgba(200,220,255,0.8)" />
            <stop offset="50%" stopColor="rgba(255,255,255,1)" />
            <stop offset="60%" stopColor="rgba(200,220,255,0.8)" />
            <stop offset="85%" stopColor="rgba(120,180,255,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Wide atmospheric glow behind arc */}
        <ellipse
          cx="600"
          cy="320"
          rx="650"
          ry="180"
          fill="none"
          stroke="rgba(56,189,248,0.06)"
          strokeWidth="80"
          filter="url(#horizonBlurWide)"
        />

        {/* Main bright arc */}
        <ellipse
          cx="600"
          cy="310"
          rx="560"
          ry="130"
          fill="none"
          stroke="url(#horizonGrad)"
          strokeWidth="2"
          filter="url(#horizonBlur)"
        />

        {/* Core bright line (thinner, brighter) */}
        <ellipse
          cx="600"
          cy="310"
          rx="560"
          ry="130"
          fill="none"
          stroke="url(#horizonGrad)"
          strokeWidth="1"
        />
      </svg>
    </div>

    {/* Dark planet body (below horizon) */}
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-[50%] bg-[#050508]"
      style={{
        width: "140%",
        height: "120px",
      }}
    />
  </div>
);

/* ═══════════════════════ Shooting Stars ═══════════════════════ */
const ShootingStar = ({ delay }) => {
  const top = useMemo(() => Math.random() * 40 + 5, []);
  const left = useMemo(() => Math.random() * 60 + 10, []);

  return (
    <motion.div
      className="absolute w-[2px] h-[2px] bg-white rounded-full"
      style={{ top: `${top}%`, left: `${left}%`, zIndex: 1 }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 1, 0],
        x: [0, 120, 200],
        y: [0, 60, 100],
      }}
      transition={{
        duration: 1.2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 8 + 6,
        ease: "easeOut",
      }}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-[1px] bg-gradient-to-l from-white/60 to-transparent" />
    </motion.div>
  );
};

/* ═══════════════════════════ Hero ═══════════════════════════ */
const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, #0c1220 0%, #070b12 40%, #0a0a0a 100%)" }}
    >
      {/* ─── Stars ─── */}
      <StarsCanvas />

      {/* ─── Shooting Stars ─── */}
      <ShootingStar delay={2} />
      <ShootingStar delay={7} />
      <ShootingStar delay={13} />

      {/* ─── Subtle floating particles (tiny dots drifting) ─── */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`p-${i}`}
          className="absolute w-[2px] h-[2px] rounded-full bg-white/20"
          style={{
            top: `${20 + Math.random() * 50}%`,
            left: `${10 + Math.random() * 80}%`,
            zIndex: 1,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ─── Horizon ─── */}
      <HorizonGlow />

      {/* ═══════════ Content ═══════════ */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Upcoming badge */}
        <motion.a
          href="#projects"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2.5 mb-10 group cursor-pointer"
        >
          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white text-xs font-semibold tracking-wide">
            Upcoming
          </span>
          <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
            Nextnode is launching soon!
          </span>
          <ChevronRight
            size={14}
            className="text-white/40 group-hover:translate-x-0.5 transition-transform"
          />
        </motion.a>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-[3.5rem] lg:text-[4rem] font-display font-semibold leading-[1.15] tracking-[-0.02em]"
        >
          <span className="text-white">I help founders turn ideas</span>
          <br />
          <span className="text-white">into seamless </span>
          <span className="italic font-light text-white/70">
            digital experiences
          </span>
        </motion.h1>

        {/* Sub-line with avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-7 flex items-center justify-center gap-3 flex-wrap"
        >
          <span className="text-base md:text-lg text-white/50">
            Hello, I&apos;m {personalInfo.name}
          </span>
          {/* Avatar cluster */}
          <div className="flex -space-x-2">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${personalInfo.firstName}`}
              alt={personalInfo.name}
              className="w-9 h-9 rounded-full border-2 border-dark bg-[#111]"
            />
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${personalInfo.firstName}Dev`}
              alt=""
              className="w-9 h-9 rounded-full border-2 border-dark bg-[#111]"
            />
          </div>
          <span className="text-base md:text-lg text-white/50">
            a {personalInfo.title.split("&")[0].trim()}
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5"
        >
          {/* Let's Connect button */}
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 px-7 py-3 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.12] hover:border-white/[0.2] rounded-full text-white text-sm font-medium transition-all duration-300"
          >
            Let&apos;s Connect
            <span className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/15 flex items-center justify-center transition-colors">
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>

          {/* Email copy */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(personalInfo.email);
            }}
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/60 transition-colors group cursor-pointer"
          >
            <Copy
              size={14}
              className="group-hover:text-white/60 transition-colors"
            />
            {personalInfo.email}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
