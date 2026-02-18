import { motion } from "framer-motion";
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
} from "lucide-react";
import { personalInfo, experience } from "../data/portfolio";
import kunalImg from "../assets/Kunal.png";

const cardBase =
  "bento-card rounded-2xl bg-[#111] border border-white/5 p-6 h-full";

const About = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

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
          <span className="text-white/60 text-2xl md:text-3xl lg:text-4xl">
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
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111] to-transparent" />
            </div>
            <div className="text-center w-full">
              <h3 className="text-lg font-bold text-white font-display">
                {personalInfo.name}
              </h3>
              <p className="text-xs text-accent mt-1">{personalInfo.title}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-white/40 text-xs">
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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                About
              </h3>
            </div>
            <div className="space-y-3">
              {personalInfo.bio.map((para, i) => (
                <p
                  key={i}
                  className="text-sm lg:text-base text-white/50 leading-relaxed"
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
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Quick Info
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-accent">CS</div>
                <div className="text-[10px] text-white/40 mt-1">Student</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-white">Web3</div>
                <div className="text-[10px] text-white/40 mt-1">Enthusiast</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-white">
                  <Code2 size={22} className="mx-auto" />
                </div>
                <div className="text-[10px] text-white/40 mt-1">Full Stack</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/5">
                <div className="text-xl font-bold text-green-400">✓</div>
                <div className="text-[10px] text-white/40 mt-1">Available</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 4. Social Links Card ── */}
        <motion.div {...fadeUp(0.25)} className="md:col-span-1 lg:col-span-1">
          <div className={cardBase}>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Connect
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={personalInfo.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium group"
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium group"
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
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white/60 hover:text-white transition-all text-sm font-medium group"
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
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40">
                Experience
              </h3>
            </div>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div
                  key={exp.id}
                  className="relative pl-4 border-l-2 border-accent/20"
                >
                  <h4 className="text-sm font-semibold text-white">
                    {exp.role}
                  </h4>
                  <p className="text-xs text-accent mt-0.5">{exp.company}</p>
                  <p className="text-xs text-white/30 mt-0.5">{exp.period}</p>
                  <p className="text-xs text-white/40 mt-2 leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
