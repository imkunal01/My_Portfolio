import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  X,
  Home,
  User,
  FolderOpen,
  FileText,
  MessageSquare,
  ListChecks,
  Phone,
  Monitor,
  Heart,
  Link as LinkIcon,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Sun,
  Moon,
  Film,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { projects, personalInfo, navLinks } from "../data/portfolio";
import { useTheme } from "./ThemeContext";

const API = import.meta.env.VITE_BACKEND_URL || "";

/* ── Static items ─────────────────────────────────────── */
const pages = [
  { name: "Home",       icon: Home,        href: "#home",        type: "page", route: "/",        section: "PAGES" },
  { name: "About",      icon: User,        href: "#about",       type: "page", route: "/",        section: "PAGES" },
  { name: "Projects",   icon: FolderOpen,  href: "#projects",    type: "page", route: "/",        section: "PAGES" },
  { name: "Skills",     icon: Monitor,     href: "#skills",      type: "page", route: "/",        section: "PAGES" },
  { name: "Contact",    icon: Phone,       href: "#contact",     type: "page", route: "/",        section: "PAGES" },
  { name: "Blog",       icon: FileText,    href: null,           type: "page", route: "/blog",    section: "PAGES" },
  { name: "Guestbook",  icon: MessageSquare, href: null,         type: "page", route: "/guestbook", section: "PAGES" },
  { name: "Bucket List",icon: ListChecks,  href: null,           type: "page", route: "/bucket-list", section: "PAGES" },
  { name: "My Picks",   icon: Film,        href: null,           type: "page", route: "/recommendations", section: "PAGES" },
];

const connectLinks = [
  { name: "GitHub",      icon: Github,   href: personalInfo.social.github,   type: "connect", external: true, section: "CONNECT" },
  { name: "LinkedIn",    icon: Linkedin, href: personalInfo.social.linkedin, type: "connect", external: true, section: "CONNECT" },
  { name: "Twitter / X", icon: Twitter,  href: personalInfo.social.twitter,  type: "connect", external: true, section: "CONNECT" },
  { name: "Email",       icon: Mail,     href: personalInfo.social.email,    type: "connect", external: true, section: "CONNECT" },
];

const projectItems = projects.map((p) => ({
  name: p.title,
  icon: FolderOpen,
  type: "project",
  route: `/project/${p.slug}`,
  description: p.description,
  tags: p.tags.map((t) => t.name).join(", "),
  section: "PROJECTS",
}));

const staticItems = [
  ...pages,
  ...projectItems,
  ...connectLinks,
];

/* ── Highlight matched text ───────────────────────────── */
const Highlight = ({ text, query }) => {
  if (!query.trim()) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <mark className="bg-accent/20 text-accent rounded px-0.5 not-italic">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  );
};

/* ── Component ────────────────────────────────────────── */
const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [blogItems, setBlogItems] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  /* ── Fetch blog posts when palette opens ─────────── */
  useEffect(() => {
    if (!isOpen || blogItems.length > 0) return;
    fetch(`${API}/api/blog?limit=20`)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        setBlogItems(
          data.map((post) => ({
            name: post.title,
            icon: FileText,
            type: "blog",
            route: `/blog`,
            description: post.excerpt || post.summary || "",
            tags: (post.tags || []).join(", "),
            section: "BLOG",
          }))
        );
      })
      .catch(() => {});
  }, [isOpen]);

  /* ── All searchable items (includes live blog) ─── */
  const allItems = useMemo(() => [...staticItems, ...blogItems], [blogItems]);

  /* ── Filter ──────────────────────────────────────── */
  const filtered = useMemo(() => {
    if (!query.trim()) return allItems;
    const q = query.toLowerCase();
    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tags && item.tags.toLowerCase().includes(q))
    );
  }, [query, allItems]);

  /* ── Group by section ────────────────────────────── */
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return groups;
  }, [filtered]);

  const flatList = useMemo(() => filtered, [filtered]);

  /* ── Scroll selected item into view ─────────────── */
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${selectedIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  /* ── Focus on open ───────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  /* ── Keyboard shortcuts (Ctrl+K / Escape) ────────── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  /* ── Arrow nav & Enter ───────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatList[selectedIndex]) handleSelect(flatList[selectedIndex]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, selectedIndex, flatList]);

  useEffect(() => setSelectedIndex(0), [query]);

  const handleSelect = useCallback((item) => {
    onClose();
    if (item.external) {
      window.open(item.href, "_blank");
      return;
    }
    if (item.route && item.route !== "/") {
      navigate(item.route);
      return;
    }
    if (item.href) {
      if (location.pathname !== "/") {
        navigate("/" + item.href);
      } else {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [onClose, navigate, location.pathname]);

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/30 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4"
          >
            <div className="w-full max-w-[580px] rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] shadow-2xl shadow-gray-300/60 dark:shadow-black/60 overflow-hidden">

              {/* ── Search input ─────────────────── */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-white/[0.06]">
                <Search size={16} className="text-gray-400 dark:text-white/30 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pages, projects, blog…"
                  className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Theme toggle — now wired up! */}
                  <button
                    onClick={toggleTheme}
                    title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                  >
                    {isDark ? <Sun size={13} /> : <Moon size={13} />}
                  </button>
                  <button
                    onClick={onClose}
                    className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-[11px] font-mono text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
                  >
                    ESC
                  </button>
                </div>
              </div>

              {/* ── Results ──────────────────────── */}
              <div
                ref={listRef}
                className="max-h-[50vh] sm:max-h-[420px] overflow-y-auto custom-scrollbar"
              >
                {Object.keys(grouped).length === 0 ? (
                  <div className="px-5 py-10 text-center text-sm text-gray-400 dark:text-white/40">
                    No results for &ldquo;{query}&rdquo;
                  </div>
                ) : (
                  Object.entries(grouped).map(([section, items]) => (
                    <div key={section}>
                      {/* Section header */}
                      <div className="px-4 pt-4 pb-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35">
                          {section}
                        </span>
                        <div className="flex-1 h-px bg-gray-100 dark:bg-white/[0.04]" />
                      </div>

                      {/* Items */}
                      {items.map((item) => {
                        flatIndex++;
                        const isSelected = flatIndex === selectedIndex;
                        const Icon = item.icon;
                        const idx = flatIndex;

                        return (
                          <button
                            key={`${section}-${item.name}`}
                            data-idx={idx}
                            onClick={() => handleSelect(item)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isSelected
                                ? "bg-gray-100 dark:bg-white/[0.06]"
                                : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                            }`}
                          >
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-accent/10 border border-accent/20"
                                  : "bg-gray-100 dark:bg-white/[0.04] border border-gray-200 dark:border-white/[0.06]"
                              }`}
                            >
                              <Icon
                                size={14}
                                className={isSelected ? "text-accent" : "text-gray-400 dark:text-white/30"}
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <span
                                className={`text-sm font-medium block truncate ${
                                  isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-white/70"
                                }`}
                              >
                                <Highlight text={item.name} query={query} />
                              </span>
                              {item.description && query && (
                                <span className="text-[11px] text-gray-400 dark:text-white/35 truncate block mt-0.5">
                                  <Highlight text={item.description.slice(0, 60)} query={query} />
                                </span>
                              )}
                            </div>

                            {item.external ? (
                              <span className="ml-auto text-[10px] text-gray-300 dark:text-white/20 shrink-0">↗</span>
                            ) : isSelected ? (
                              <ArrowRight size={12} className="ml-auto text-accent shrink-0" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* ── Footer hint ──────────────────── */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 dark:border-white/[0.04] bg-gray-50/60 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 text-[10px] text-gray-400 dark:text-white/25">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-[9px] font-mono">↑↓</kbd>
                    navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-[9px] font-mono">↵</kbd>
                    select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-[9px] font-mono">ESC</kbd>
                    close
                  </span>
                </div>
                <span className="text-[10px] text-gray-300 dark:text-white/20 flex items-center gap-1">
                  <Sparkles size={10} />
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
