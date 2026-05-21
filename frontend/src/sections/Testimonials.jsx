import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Quote } from "lucide-react";
import { testimonials } from "../data/portfolio";

const Testimonials = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  // Duplicate for infinite scroll
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      className="py-20 lg:py-32 overflow-hidden"
    >
      <div className="px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">Testimonials</span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
            <span className="gradient-text">Word on the street</span>
            <br />
            <span className="text-gray-900 dark:text-white">about me</span>
          </h2>
        </motion.div>
      </div>

      {/* Scrolling Testimonials */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="relative"
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-r from-[#fafafa] dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-40 bg-gradient-to-l from-[#fafafa] dark:from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

        <div className="testimonial-scroll flex gap-6 w-max px-6">
          {allTestimonials.map((testimonial, i) => (
            <div
              key={`${testimonial.id}-${i}`}
              className="group w-[85vw] sm:w-[350px] md:w-[420px] shrink-0 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 p-6 lg:p-8 transition-all duration-300 shadow-sm"
            >
              <Quote
                size={24}
                className="text-accent/30 mb-4"
              />
              <p className="text-sm lg:text-base text-gray-600 dark:text-white/70 leading-relaxed mb-6">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-white/[0.06]">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white/40">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Open to Work Marquee */}
      <div className="mt-20 py-4 border-y border-gray-200 dark:border-white/[0.06] overflow-hidden">
        <div className="open-to-work-marquee flex whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, i) => (
            <span key={i} className="flex items-center gap-4 mx-4">
              <span className="text-sm font-semibold text-gray-300 dark:text-white/25 uppercase tracking-wider">
                Open to Work
              </span>
              <span className="text-accent">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
