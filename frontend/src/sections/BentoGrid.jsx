import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Copy, Search, Clock, Zap, Globe2, ArrowRight } from "lucide-react";
import { allSkills, personalInfo } from "../data/portfolio";
import kunalImg from "../assets/Kunal.png";

/* ── Globe Component ── */
const Globe = () => (
  <div className="relative w-40 h-40 mx-auto">
    <div className="absolute -inset-2 rounded-full border border-cyan-500/10" />
    <div className="w-full h-full rounded-full relative overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,#0c1f3d,#0a0e1a_60%,#05080f)]">
      {[20, 35, 50, 65, 80].map((top) => (
        <div
          key={`lat-${top}`}
          className="absolute left-[10%] right-[10%] border-t border-cyan-400/[0.07]"
          style={{ top: `${top}%` }}
        />
      ))}
      {[30, 42, 54, 66].map((left) => (
        <div
          key={`lng-${left}`}
          className="absolute top-[10%] bottom-[10%] border-l border-cyan-400/[0.07]"
          style={{ left: `${left}%` }}
        />
      ))}
      <div
        className="absolute inset-[15%] rounded-full opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(56,189,248,0.5) 0.8px, transparent 0.8px)",
          backgroundSize: "7px 7px",
        }}
      />
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_25%_25%,rgba(56,189,248,0.12),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-cyan-500/10 to-transparent rounded-b-full" />
    </div>
    <div className="absolute -inset-4 rounded-full bg-cyan-500/[0.04] blur-xl pointer-events-none" />
  </div>
);

/* ── Inside Scoop Data ── */
const insideScoopCards = [
  {
    title: "API Gateway & Documentation",
    description: "Guides developers to integrate with the SaaS platform.",
  },
  {
    title: "User Onboarding Flow Design",
    description: "Step-by-step guides and interactive tutorials to help users.",
  },
  {
    title: "Payment System Architecture",
    description: "Handles recurring payments, upgrades, downgrades, and billing.",
  },
  {
    title: "Monitoring & Analytics Infrastructure",
    description: "Provides real-time insights into user behavior.",
  },
  {
    title: "Design System & UI Consistency",
    description: "Unified design assets, including typography and themes.",
  },
];

/* card style */
const card =
  "bento-card rounded-2xl bg-[#111] border border-white/5 overflow-hidden";

/* ════════════════════════════ Main Component ════════════════════════════ */
const BentoGrid = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="py-20 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {/* ─── Row 1 : 2 cards ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          {/* 1 ─ Collaboration Card (wider) */}
          <motion.div
            variants={item}
            className={`${card} lg:col-span-3 p-8 lg:p-10`}
          >
            {/* Profile photo with decorative arcs */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <svg
                  className="absolute -left-20 top-1/2 -translate-y-1/2"
                  width="70"
                  height="110"
                  viewBox="0 0 70 110"
                >
                  <path d="M60 8 Q8 55 60 102" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                  <path d="M52 18 Q8 55 52 92" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
                  <path d="M44 28 Q8 55 44 82" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
                </svg>
                <svg
                  className="absolute -right-20 top-1/2 -translate-y-1/2"
                  width="70"
                  height="110"
                  viewBox="0 0 70 110"
                >
                  <path d="M10 8 Q62 55 10 102" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                  <path d="M18 18 Q62 55 18 92" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
                  <path d="M26 28 Q62 55 26 82" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="none" />
                </svg>

                <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-accent via-purple-500 to-accent">
                  <img
                    src={kunalImg}
                    alt={personalInfo.name}
                    className="w-full h-full rounded-full object-cover object-top bg-[#111]"
                  />
                </div>
              </div>
            </div>

            <div className="text-center">
              <span className="section-label tracking-[0.25em]">
                Collaboration
              </span>
              <p className="text-white/80 text-lg lg:text-xl mt-3 font-light leading-relaxed max-w-md mx-auto">
                I prioritize client collaboration, fostering open communication
              </p>
            </div>
          </motion.div>

          {/* 2 ─ Tech Stack */}
          <motion.div
            variants={item}
            className={`${card} lg:col-span-2 p-6 flex flex-col`}
          >
            <div className="mb-5">
              <h3 className="text-xl font-display font-semibold text-white leading-snug">
                Passionate about cutting-edge
              </h3>
              <h3 className="text-xl font-display font-semibold text-accent leading-snug">
                technologies
              </h3>
            </div>

            <div className="relative overflow-hidden flex-1 flex flex-col justify-center gap-2.5">
              <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none" />

              {/* Row 1 */}
              <div className="flex animate-marquee whitespace-nowrap">
                {[...allSkills.slice(0, 10), ...allSkills.slice(0, 10)].map(
                  (sk, i) => (
                    <div
                      key={`a-${i}`}
                      className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0"
                    >
                      <img src={sk.icon} alt={sk.name} className="w-4 h-4" loading="lazy" />
                      <span className="text-[11px] text-white/60 font-medium">{sk.name}</span>
                    </div>
                  )
                )}
              </div>

              {/* Row 2 – reverse */}
              <div className="flex animate-marquee-reverse whitespace-nowrap">
                {[...allSkills.slice(10, 20), ...allSkills.slice(10, 20)].map(
                  (sk, i) => (
                    <div
                      key={`b-${i}`}
                      className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0"
                    >
                      <img src={sk.icon} alt={sk.name} className="w-4 h-4" loading="lazy" />
                      <span className="text-[11px] text-white/60 font-medium">{sk.name}</span>
                    </div>
                  )
                )}
              </div>

              {/* Row 3 – slower */}
              <div className="flex animate-marquee-slow whitespace-nowrap">
                {[...allSkills.slice(5, 15), ...allSkills.slice(5, 15)].map(
                  (sk, i) => (
                    <div
                      key={`c-${i}`}
                      className="flex items-center gap-2 px-3 py-1.5 mx-1 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0"
                    >
                      <img src={sk.icon} alt={sk.name} className="w-4 h-4" loading="lazy" />
                      <span className="text-[11px] text-white/60 font-medium">{sk.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Row 2 : 3 equal cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* 3 ─ Timezone + Globe */}
          <motion.div
            variants={item}
            className={`${card} flex flex-col`}
          >
            <div className="p-6">
              <h3 className="text-lg font-display font-semibold text-white leading-snug">
                I&apos;m very flexible with time
              </h3>
              <h3 className="text-lg font-display font-semibold text-accent leading-snug">
                zone communications
              </h3>

              <div className="flex items-center gap-2 mt-4">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                  <span className="text-sm">🇬🇧</span> UK
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-accent/15 border border-accent/25 text-xs text-accent font-semibold">
                  <span className="text-sm">🇮🇳</span> INDIA
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/50">
                  <span className="text-sm">🇺🇸</span> USA
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center px-6 pb-6">
              <Globe />
              <div className="text-center mt-4">
                <span className="text-[10px] tracking-[0.3em] text-white/25 uppercase block">
                  Remote
                </span>
                <p className="text-base font-display font-bold text-white mt-0.5 tracking-wide">
                  {personalInfo.location.toUpperCase()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4 ─ CTA — Let's work together */}
          <motion.div
            variants={item}
            className={`${card} p-8 flex flex-col items-center justify-center text-center`}
          >
            {/* Initials badge */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center text-white text-xl font-display font-bold shadow-lg shadow-accent/20">
                {personalInfo.firstName.charAt(0)}
                {personalInfo.lastName.charAt(0)}
              </div>
              {/* Subtle pulse ring */}
              <div className="absolute -inset-2 rounded-2xl border border-accent/20 animate-pulse" />
            </div>

            <h3 className="text-lg font-display font-medium text-white/80 leading-snug">
              Let&apos;s work together
            </h3>
            <p className="text-lg font-display font-medium text-white/80 leading-snug">
              on your next project
            </p>

            <a
              href={`mailto:${personalInfo.email}`}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-white/50 hover:text-white/80 hover:border-white/15 transition-all group"
            >
              <Copy size={14} className="group-hover:text-accent transition-colors" />
              <span className="truncate max-w-[200px]">{personalInfo.email}</span>
            </a>
          </motion.div>

          {/* 5 ─ Portfolio Preview — Built to Perform */}
          <motion.div
            variants={item}
            className={`${card} p-4 md:col-span-2 lg:col-span-1`}
          >
            <div className="rounded-xl bg-[#0a0a0a] border border-white/5 overflow-hidden h-full flex flex-col">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-white/5">
                <div className="w-2 h-2 rounded-full bg-white/15" />
                <div className="w-2 h-2 rounded-full bg-white/15" />
                <div className="w-2 h-2 rounded-full bg-white/15" />
                <div className="mx-auto px-6 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-white/25 font-mono">
                  {personalInfo.name.toLowerCase().replace(/\s/g, "")}.in
                </div>
              </div>
              {/* Content area */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[200px]">
                <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4">
                  <Search size={15} className="text-white/35" />
                </div>
                <h4 className="text-base font-display font-bold text-white">
                  Built to Perform.
                </h4>
                <p className="text-xs text-white/35 mt-1.5 text-center">
                  Websites that impact your business.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Row 3 : Full Width — Currently Building ─── */}
        <motion.div
          variants={item}
          className={`${card} p-6 lg:p-8`}
        >
          <div className="text-center mb-6">
            <span className="section-label tracking-[0.25em]">
              The Inside Scoop
            </span>
            <h3 className="text-xl lg:text-2xl font-display font-semibold text-white mt-2">
              Currently building a Saas Application
            </h3>
          </div>

          {/* Scrolling feature cards */}
          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#111] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#111] to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee-slow whitespace-nowrap hover:[animation-play-state:paused]">
              {[...insideScoopCards, ...insideScoopCards].map((card, i) => (
                <div
                  key={i}
                  className="shrink-0 w-56 mx-2 p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-colors"
                >
                  <h4 className="text-sm font-semibold text-white whitespace-normal leading-snug mb-2">
                    {card.title}
                  </h4>
                  <p className="text-xs text-white/35 whitespace-normal leading-relaxed">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default BentoGrid;
