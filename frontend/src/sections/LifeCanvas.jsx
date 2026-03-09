import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Sparkles,
  Pen,
  MessageSquare,
  Film,
  ListChecks,
  Heart,
  Quote,
  BookOpen,
  MapPin,
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";

/* ─── floating emoji component ─── */
const FloatingEmoji = ({ emoji, className, delay = 0 }) => (
  <motion.span
    className={`absolute text-2xl sm:text-3xl select-none pointer-events-none ${className}`}
    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
    transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  >
    {emoji}
  </motion.span>
);

/* ════════════════════ Main Section ════════════════════ */
const LifeCanvas = () => {
  const { isDark } = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const d = isDark;

  return (
    <section
      id="life"
      ref={(el) => {
        sectionRef.current = el;
        ref(el);
      }}
      className={`relative py-24 lg:py-36 overflow-hidden ${
        d ? "bg-[#0a0a0a]" : "bg-[#fafafa]"
      }`}
    >
      {/* ── parallax bg decorations ── */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full"
          style={{
            background: d
              ? "radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)"
              : "radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full"
          style={{
            background: d
              ? "radial-gradient(circle, rgba(244,63,94,0.06), transparent 70%)"
              : "radial-gradient(circle, rgba(244,63,94,0.04), transparent 70%)",
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{
            background: d
              ? "radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)"
              : "radial-gradient(circle, rgba(16,185,129,0.04), transparent 70%)",
          }}
        />
      </motion.div>

      {/* floating emojis (hidden on small screens) */}
      <div className="hidden lg:block">
        <FloatingEmoji emoji="📖" className="top-20 left-[8%] opacity-20" delay={0} />
        <FloatingEmoji emoji="🎬" className="top-32 right-[10%] opacity-15" delay={1.5} />
        <FloatingEmoji emoji="✈️" className="bottom-28 left-[15%] opacity-15" delay={0.8} />
        <FloatingEmoji emoji="💜" className="bottom-36 right-[12%] opacity-20" delay={2} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="flex items-center justify-center gap-2 mb-5">
            <Sparkles size={14} className="text-accent" />
            <span className="section-label">Beyond the Code</span>
            <Sparkles size={14} className="text-accent" />
          </div>

          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-[-0.025em] leading-tight ${
              d ? "text-white" : "text-gray-900"
            }`}
          >
            A Glimpse Into{" "}
            <span className="gradient-text-accent">My World</span>
          </h2>

          <p
            className={`mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed ${
              d ? "text-white/50" : "text-gray-500"
            }`}
          >
            Code is what I do — but life is so much more. Explore the things
            that inspire me, the stories I write, and the dreams I chase.
          </p>

          <div className="flex items-center justify-center gap-2 mt-6">
            <div className={`h-px w-12 ${d ? "bg-white/10" : "bg-gray-200"}`} />
            <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            <div className={`h-px w-12 ${d ? "bg-white/10" : "bg-gray-200"}`} />
          </div>
        </motion.div>

        {/* ════════════ ASYMMETRIC BENTO GRID ════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 auto-rows-auto">

          {/* ─── BLOG — tall left column, 5 cols ─── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 lg:row-span-2"
          >
            <Link to="/blog" className="group relative block h-full">
              <div
                className={`relative h-full rounded-3xl border overflow-hidden transition-all duration-500 ${
                  d
                    ? "bg-[#111]/80 border-white/[0.06] hover:border-violet-500/30"
                    : "bg-white/80 border-gray-200 hover:border-violet-400/40"
                } backdrop-blur-sm`}
                style={{ minHeight: 460 }}
              >
                {/* gradient wash */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: d
                      ? "linear-gradient(160deg, rgba(139,92,246,0.08) 0%, transparent 60%)"
                      : "linear-gradient(160deg, rgba(139,92,246,0.06) 0%, transparent 60%)",
                  }}
                />

                {/* top accent bar */}
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* big background emoji */}
                <motion.div
                  className="absolute -bottom-4 -right-4 text-[140px] leading-none select-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
                  animate={{ rotate: [0, 3, -3, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                >
                  ✍️
                </motion.div>

                {/* faux "notebook lines" */}
                <div className="absolute top-24 left-8 right-8 space-y-5 opacity-[0.03]">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className={`h-px ${d ? "bg-white" : "bg-gray-900"}`} />
                  ))}
                </div>

                {/* content */}
                <div className="relative z-10 p-7 sm:p-9 flex flex-col h-full">
                  {/* badge */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600 shadow-lg shadow-violet-500/25">
                      <Pen size={18} className="text-white" />
                    </div>
                    <div
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        d
                          ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                          : "bg-violet-50 text-violet-600 border border-violet-200"
                      }`}
                    >
                      Featured
                    </div>
                  </div>

                  {/* title area — pushed to center */}
                  <div className="flex-1 flex flex-col justify-center">
                    <h3
                      className={`text-2xl sm:text-3xl font-display font-bold leading-snug mb-2 ${
                        d ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Blog
                    </h3>
                    <p
                      className={`text-xs font-semibold tracking-widest uppercase mb-4 ${
                        d ? "text-violet-400" : "text-violet-600"
                      }`}
                    >
                      Stories & Thoughts
                    </p>
                    <p
                      className={`text-sm sm:text-base leading-relaxed max-w-sm ${
                        d ? "text-white/45" : "text-gray-500"
                      }`}
                    >
                      Where I pour out raw ideas, lessons from the trenches, and
                      deep dives into the things that keep me up at night.
                    </p>

                    {/* quote decoration */}
                    <div className={`mt-6 flex items-start gap-3 p-4 rounded-xl ${
                      d ? "bg-white/[0.03] border border-white/[0.05]" : "bg-gray-50 border border-gray-100"
                    }`}>
                      <Quote size={16} className={`mt-0.5 shrink-0 ${d ? "text-violet-400/60" : "text-violet-400"}`} />
                      <p className={`text-xs italic leading-relaxed ${d ? "text-white/35" : "text-gray-400"}`}>
                        "Writing is thinking. To write well is to think clearly."
                      </p>
                    </div>
                  </div>

                  {/* cta */}
                  <div className="mt-6">
                    <span
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${
                        d
                          ? "text-violet-400/70 group-hover:text-violet-300"
                          : "text-violet-500/70 group-hover:text-violet-600"
                      } transition-colors duration-300`}
                    >
                      Read my stories
                      <ArrowUpRight
                        size={15}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ─── GUESTBOOK — top right, 7 cols ─── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <Link to="/guestbook" className="group relative block h-full">
              <div
                className={`relative h-full rounded-3xl border overflow-hidden transition-all duration-500 ${
                  d
                    ? "bg-[#111]/80 border-white/[0.06] hover:border-rose-500/30"
                    : "bg-white/80 border-gray-200 hover:border-rose-300/50"
                } backdrop-blur-sm`}
                style={{ minHeight: 220 }}
              >
                {/* gradient wash */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: d
                      ? "linear-gradient(135deg, rgba(244,63,94,0.06) 0%, transparent 50%)"
                      : "linear-gradient(135deg, rgba(244,63,94,0.04) 0%, transparent 50%)",
                  }}
                />

                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* scattered hearts bg */}
                <div className="absolute inset-0 overflow-hidden">
                  {[
                    { top: "15%", left: "70%", size: 20, rotate: 15, opacity: 0.04 },
                    { top: "60%", left: "85%", size: 28, rotate: -20, opacity: 0.03 },
                    { top: "25%", left: "90%", size: 16, rotate: 30, opacity: 0.05 },
                    { top: "70%", left: "60%", size: 22, rotate: -10, opacity: 0.03 },
                  ].map((h, i) => (
                    <Heart
                      key={i}
                      size={h.size}
                      className={d ? "text-white" : "text-rose-900"}
                      style={{
                        position: "absolute",
                        top: h.top,
                        left: h.left,
                        opacity: h.opacity,
                        transform: `rotate(${h.rotate}deg)`,
                      }}
                      strokeWidth={1}
                    />
                  ))}
                </div>

                {/* content */}
                <div className="relative z-10 p-7 sm:p-8 flex items-center gap-6 h-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 shadow-lg shadow-rose-500/25">
                        <MessageSquare size={18} className="text-white" />
                      </div>
                      <span className="text-2xl select-none">💌</span>
                    </div>
                    <h3
                      className={`text-xl sm:text-2xl font-display font-bold mb-1 ${
                        d ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Guestbook
                    </h3>
                    <p
                      className={`text-xs font-semibold tracking-widest uppercase mb-3 ${
                        d ? "text-rose-400" : "text-rose-600"
                      }`}
                    >
                      Leave Your Mark
                    </p>
                    <p
                      className={`text-sm leading-relaxed max-w-md ${
                        d ? "text-white/45" : "text-gray-500"
                      }`}
                    >
                      A little corner for visitors to say hi, share a thought, or
                      leave some love. Your words mean the world to me.
                    </p>
                  </div>

                  {/* decorative message bubbles */}
                  <div className="hidden sm:flex flex-col gap-2.5 shrink-0 w-44">
                    {[
                      { text: "Amazing portfolio! 🔥", align: "self-end" },
                      { text: "Love your work, Kunal!", align: "self-start" },
                      { text: "Inspiring stuff ✨", align: "self-end" },
                    ].map((msg, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                        className={`px-3 py-1.5 rounded-xl text-[10px] ${msg.align} ${
                          d
                            ? "bg-white/[0.04] text-white/30 border border-white/[0.06]"
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}
                      >
                        {msg.text}
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* cta floating bottom-right */}
                <div className="absolute bottom-5 right-7 z-10">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                      d
                        ? "text-rose-400/60 group-hover:text-rose-300"
                        : "text-rose-400 group-hover:text-rose-600"
                    } transition-colors duration-300`}
                  >
                    Sign the book
                    <ArrowUpRight
                      size={13}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                    />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ─── RECOMMENDATIONS — bottom-middle, 4 cols ─── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4"
          >
            <Link to="/recommendations" className="group relative block h-full">
              <div
                className={`relative h-full rounded-3xl border overflow-hidden transition-all duration-500 ${
                  d
                    ? "bg-[#111]/80 border-white/[0.06] hover:border-amber-500/30"
                    : "bg-white/80 border-gray-200 hover:border-amber-300/50"
                } backdrop-blur-sm`}
                style={{ minHeight: 220 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: d
                      ? "linear-gradient(160deg, rgba(245,158,11,0.07) 0%, transparent 60%)"
                      : "linear-gradient(160deg, rgba(245,158,11,0.05) 0%, transparent 60%)",
                  }}
                />

                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* shelves / cinema reels deco */}
                <div className="absolute bottom-0 right-0 w-1/2 h-full opacity-[0.03]">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`absolute right-4 h-px ${d ? "bg-white" : "bg-gray-900"}`}
                      style={{
                        bottom: `${15 + i * 18}%`,
                        width: `${60 - i * 8}%`,
                      }}
                    />
                  ))}
                </div>

                {/* big emoji */}
                <motion.div
                  className="absolute -bottom-2 -right-2 text-[100px] leading-none select-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
                  animate={{ rotate: [0, -4, 4, 0] }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                >
                  🎬
                </motion.div>

                <div className="relative z-10 p-7 sm:p-8 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-amber-500/25">
                      <Film size={18} className="text-white" />
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-display font-bold mb-1 ${
                      d ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Recommendations
                  </h3>
                  <p
                    className={`text-xs font-semibold tracking-widest uppercase mb-3 ${
                      d ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    My Curated Picks
                  </p>
                  <p
                    className={`text-sm leading-relaxed flex-1 ${
                      d ? "text-white/45" : "text-gray-500"
                    }`}
                  >
                    Movies, series, anime & books that shaped my perspective —
                    handpicked for you.
                  </p>

                  {/* little tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {["🎬 Movies", "📺 Series", "⚡ Anime", "📚 Books"].map((t) => (
                      <span
                        key={t}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                          d
                            ? "bg-white/[0.04] text-white/30 border border-white/[0.06]"
                            : "bg-gray-50 text-gray-400 border border-gray-100"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        d
                          ? "text-amber-400/60 group-hover:text-amber-300"
                          : "text-amber-500 group-hover:text-amber-600"
                      } transition-colors duration-300`}
                    >
                      See my picks
                      <ArrowUpRight
                        size={13}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* ─── BUCKET LIST — bottom right, 3 cols ─── */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3"
          >
            <Link to="/bucket-list" className="group relative block h-full">
              <div
                className={`relative h-full rounded-3xl border overflow-hidden transition-all duration-500 ${
                  d
                    ? "bg-[#111]/80 border-white/[0.06] hover:border-emerald-500/30"
                    : "bg-white/80 border-gray-200 hover:border-emerald-300/50"
                } backdrop-blur-sm`}
                style={{ minHeight: 220 }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: d
                      ? "linear-gradient(160deg, rgba(16,185,129,0.07) 0%, transparent 60%)"
                      : "linear-gradient(160deg, rgba(16,185,129,0.05) 0%, transparent 60%)",
                  }}
                />

                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

                {/* dot grid background */}
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: d
                      ? "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)"
                      : "radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />

                {/* big emoji */}
                <motion.div
                  className="absolute -bottom-2 -right-2 text-[90px] leading-none select-none opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-700"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  🌍
                </motion.div>

                <div className="relative z-10 p-7 sm:p-8 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 shadow-lg shadow-emerald-500/25">
                      <ListChecks size={18} className="text-white" />
                    </div>
                  </div>

                  <h3
                    className={`text-xl font-display font-bold mb-1 ${
                      d ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Bucket List
                  </h3>
                  <p
                    className={`text-xs font-semibold tracking-widest uppercase mb-3 ${
                      d ? "text-emerald-400" : "text-emerald-600"
                    }`}
                  >
                    Dreams & Adventures
                  </p>
                  <p
                    className={`text-sm leading-relaxed flex-1 ${
                      d ? "text-white/45" : "text-gray-500"
                    }`}
                  >
                    Everything I want to do, see, and experience — tracked live as
                    I tick them off.
                  </p>

                  {/* mini progress vibe */}
                  <div className="mt-4 space-y-2">
                    {[
                      { label: "Travel", pct: 30 },
                      { label: "Adventure", pct: 45 },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] ${d ? "text-white/30" : "text-gray-400"}`}>
                            {bar.label}
                          </span>
                          <span className={`text-[10px] ${d ? "text-white/20" : "text-gray-300"}`}>
                            {bar.pct}%
                          </span>
                        </div>
                        <div
                          className={`h-1 rounded-full overflow-hidden ${
                            d ? "bg-white/[0.06]" : "bg-gray-100"
                          }`}
                        >
                          <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
                        d
                          ? "text-emerald-400/60 group-hover:text-emerald-300"
                          : "text-emerald-500 group-hover:text-emerald-600"
                      } transition-colors duration-300`}
                    >
                      See my dreams
                      <ArrowUpRight
                        size={13}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ── bottom flourish ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`text-center mt-14 text-xs tracking-widest uppercase font-medium ${
            d ? "text-white/20" : "text-gray-300"
          }`}
        >
          — life, curated —
        </motion.p>
      </div>
    </section>
  );
};

export default LifeCanvas;
