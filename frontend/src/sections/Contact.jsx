import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Send, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { personalInfo } from "../data/portfolio";

const API = import.meta.env.VITE_BACKEND_URL || "";

const Contact = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await fetch(`${API}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setStatus("sent");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-32 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="section-label">From Concept to Creation</span>
          <h2 className="mt-3 text-4xl md:text-5xl lg:text-7xl font-bold font-display leading-tight">
            <span className="gradient-text">Let&apos;s Make It</span>
            <br />
            <span className="gradient-text-accent">Happen!</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Get In Touch
              </h3>
              <p className="text-gray-500 dark:text-white/60 leading-relaxed">
                I&apos;m available for full-time roles & freelance projects. I
                thrive on crafting dynamic web applications and delivering
                seamless user experiences.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white dark:hover:text-white transition-colors truncate">
                    {personalInfo.email}
                  </p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-gray-300 dark:text-white/25 group-hover:text-accent transition-colors shrink-0"
                />
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider">
                    Location
                  </p>
                  <p className="text-sm text-gray-600 dark:text-white/70">
                    {personalInfo.location} — Remote
                  </p>
                </div>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { name: "GitHub", url: personalInfo.social.github },
                { name: "LinkedIn", url: personalInfo.social.linkedin },
                { name: "Twitter", url: personalInfo.social.twitter },
              ].map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-all font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2 block">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] focus:border-accent/50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 text-sm outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] focus:border-accent/50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 text-sm outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-400 dark:text-white/40 uppercase tracking-wider mb-2 block">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] focus:border-accent/50 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 text-sm outline-none transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-accent hover:bg-accent-light text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 cursor-pointer"
              >
                {status === "sending" ? (
                  "Sending..."
                ) : status === "sent" ? (
                  "Message Sent! ✓"
                ) : status === "error" ? (
                  "Send Failed"
                ) : (
                  <>
                    Send Message
                    <Send size={16} />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
