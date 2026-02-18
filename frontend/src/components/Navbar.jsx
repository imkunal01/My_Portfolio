import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  Link as LinkIcon,
  Monitor,
  Heart,
  LayoutGrid,
  Phone,
  MessageSquare,
  ListChecks,
  Film,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { navLinks, moreLinks, personalInfo } from "../data/portfolio";
import CommandPalette from "./CommandPalette";

const iconMap = {
  link: LinkIcon,
  monitor: Monitor,
  heart: Heart,
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [cmdOpen, setCmdOpen] = useState(false);
  const moreRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* ── scroll spy ─────────────────────────────── */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const ids = ["home", "about", "projects", "skills", "testimonials", "contact"];
      for (const id of [...ids].reverse()) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── close More dropdown on outside click ──── */
  useEffect(() => {
    const handler = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── Ctrl/Cmd+K shortcut ──────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── navigation helper ─────────────────────── */
  const handleNavClick = (href) => {
    setMobileOpen(false);
    setMoreOpen(false);
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleRouteClick = (route) => {
    setMobileOpen(false);
    setMoreOpen(false);
    navigate(route);
  };

  const isActive = (href) => activeSection === href.replace("#", "");

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* ── Logo ─────────────────────────── */}
            <motion.a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#home");
              }}
              className="text-xl font-bold font-display tracking-tight z-10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white">{personalInfo.firstName}</span>
              <span className="text-accent">.</span>
            </motion.a>

            {/* ── Desktop Center Nav ────────────── */}
            <div className="hidden lg:flex items-center gap-0.5 px-1.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-lg">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-xl ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-white/[0.08] rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </a>
              ))}

              {/* Blog link */}
              <button
                onClick={() => handleRouteClick("/blog")}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-xl ${
                  location.pathname === "/blog"
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Blog
              </button>

              {/* More dropdown trigger */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen((v) => !v)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-colors duration-200 ${
                    moreOpen
                      ? "text-white bg-white/[0.08]"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  More
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${
                      moreOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* ── More Mega Dropdown ───────── */}
                <AnimatePresence>
                  {moreOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-full mt-3 w-[560px] rounded-2xl bg-[#111]/95 backdrop-blur-xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden"
                    >
                      <div className="grid grid-cols-[1fr_200px]">
                        {/* Left – Image cards */}
                        <div className="p-3 grid grid-cols-2 gap-3 border-r border-white/5">
                          {moreLinks.cards.map((card) => (
                            <button
                              key={card.name}
                              onClick={() => handleRouteClick(card.route || card.href)}
                              className="group/card rounded-xl overflow-hidden relative text-left"
                            >
                              <div className="aspect-[4/3] relative overflow-hidden rounded-xl">
                                <img
                                  src={card.image}
                                  alt={card.name}
                                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h4 className="text-sm font-semibold text-white mb-0.5">
                                    {card.name}
                                  </h4>
                                  <p className="text-[11px] text-white/50 leading-snug">
                                    {card.description}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Right – Icon items */}
                        <div className="p-3 flex flex-col gap-1">
                          {moreLinks.items.map((item) => {
                            const Icon = iconMap[item.icon] || LinkIcon;
                            return (
                              <button
                                key={item.name}
                                onClick={() => {
                                  if (item.route) {
                                    handleRouteClick(item.route);
                                  } else {
                                    handleNavClick(item.href);
                                  }
                                }}
                                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group/item text-left"
                              >
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/[0.06] flex items-center justify-center shrink-0 group-hover/item:border-white/10 transition-colors">
                                  <Icon size={14} className="text-white/40" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-sm font-medium text-white/80 leading-tight">
                                    {item.name}
                                  </h4>
                                  <p className="text-[11px] text-white/30 leading-snug mt-0.5 truncate">
                                    {item.description}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ── Right side buttons ──────────── */}
            <div className="flex items-center gap-3 z-10">
              {/* Book a Call – desktop */}
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#contact");
                }}
                className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-accent/25"
              >
                <Phone size={14} />
                Book a Call
              </a>

              {/* Command palette icon */}
              <button
                onClick={() => setCmdOpen(true)}
                className="hidden lg:flex w-10 h-10 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.08] transition-all"
                title="Search (Ctrl+K)"
              >
                <LayoutGrid size={16} />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
              >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Full-screen Menu ───────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col items-center justify-center min-h-full gap-5 px-8 py-24">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="text-2xl font-medium text-white/70 hover:text-white transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.button
                onClick={() => handleRouteClick("/blog")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
                className="text-2xl font-medium text-white/70 hover:text-white transition-colors"
              >
                Blog
              </motion.button>

              {/* More section with Guestbook, Bucket List, etc. */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.07 }}
                className="w-full max-w-xs border-t border-white/10 pt-5 mt-2 space-y-4"
              >
                <span className="text-xs uppercase tracking-wider text-white/30 font-semibold">
                  More
                </span>

                {/* Guestbook */}
                <button
                  onClick={() => handleRouteClick("/guestbook")}
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full"
                >
                  <MessageSquare size={16} />
                  <span className="text-base">Guestbook</span>
                </button>

                {/* Bucket List */}
                <button
                  onClick={() => handleRouteClick("/bucket-list")}
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full"
                >
                  <ListChecks size={16} />
                  <span className="text-base">Bucket List</span>
                </button>

                {/* Recommendations */}
                <button
                  onClick={() => handleRouteClick("/recommendations")}
                  className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full"
                >
                  <Film size={16} />
                  <span className="text-base">My Picks</span>
                </button>

                {moreLinks.items.map((item) => {
                  const Icon = iconMap[item.icon] || LinkIcon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.route) handleRouteClick(item.route);
                        else handleNavClick(item.href);
                      }}
                      className="flex items-center gap-3 text-white/60 hover:text-white transition-colors w-full"
                    >
                      <Icon size={16} />
                      <span className="text-base">{item.name}</span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Search button for mobile */}
              <motion.button
                onClick={() => {
                  setMobileOpen(false);
                  setCmdOpen(true);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 2) * 0.07 }}
                className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                <LayoutGrid size={16} />
                Search
              </motion.button>

              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick("#contact");
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 3) * 0.07 }}
                className="mt-2 inline-flex items-center gap-2 px-8 py-3 bg-accent text-white font-medium rounded-xl"
              >
                <Phone size={16} />
                Book a Call
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Command Palette ───────────────────── */}
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  );
};

export default Navbar;
