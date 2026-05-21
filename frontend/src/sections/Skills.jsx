import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { skills } from "../data/portfolio";

const skillCategories = [
  { key: "languages", label: "Programming Languages", color: "accent" },
  { key: "frontend", label: "Frontend", color: "blue-400" },
  { key: "backend", label: "Backend", color: "green-400" },
  { key: "databases", label: "Databases & Caching", color: "yellow-400" },
  { key: "devops", label: "Cloud & DevOps", color: "orange-400" },
  { key: "tools", label: "Tools & Testing", color: "pink-400" },
];

const Skills = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <section id="skills" className="py-20 lg:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <span className="section-label">My Skills</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
          <span className="gradient-text">The Secret</span>{" "}
          <span className="text-gray-900 dark:text-white">Sauce</span>
        </h2>
      </motion.div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, catIndex) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: catIndex * 0.1 }}
            className="bento-card rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-6 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-500 dark:text-white/60 mb-5 uppercase tracking-wider">
              {category.label}
            </h3>
            <div className="flex flex-wrap gap-3">
              {skills[category.key].map((skill) => (
                <div
                  key={skill.name}
                  className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all duration-200 cursor-default"
                >
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                    loading="lazy"
                  />
                  <span className="text-sm text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white dark:hover:text-white transition-colors font-medium">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
