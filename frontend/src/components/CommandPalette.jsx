import { useState, useEffect, useRef, useMemo } from "react";
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
} from "lucide-react";
import { projects, personalInfo } from "../data/portfolio";

/* ── Searchable items ─────────────────────────── */
const pages = [
  { name: "Home", icon: Home, href: "#home", type: "page", route: "/" },
  { name: "About", icon: User, href: "#about", type: "page", route: "/" },
  { name: "Projects", icon: FolderOpen, href: "#projects", type: "page", route: "/" },
  { name: "Blog", icon: FileText, href: null, type: "page", route: "/blog" },
  { name: "Guestbook", icon: MessageSquare, href: null, type: "page", route: "/guestbook" },
  { name: "Bucket List", icon: ListChecks, href: null, type: "page", route: "/bucket-list" },
  { name: "Book a call", icon: Phone, href: "#contact", type: "page", route: "/" },
  { name: "Uses", icon: Monitor, href: "#skills", type: "page", route: "/" },
  { name: "Attribution", icon: Heart, href: null, type: "page", route: "/" },
  { name: "Links", icon: LinkIcon, href: null, type: "page", route: "/" },
];

const connectLinks = [
  {
    name: "GitHub",
    icon: Github,
    href: personalInfo.social.github,
    type: "connect",
    external: true,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    href: personalInfo.social.linkedin,
    type: "connect",
    external: true,
  },
  {
    name: "Twitter / X",
    icon: Twitter,
    href: personalInfo.social.twitter,
    type: "connect",
    external: true,
  },
  {
    name: "Email",
    icon: Mail,
    href: personalInfo.social.email,
    type: "connect",
    external: true,
  },
];

const projectItems = projects.map((p) => ({
  name: p.title,
  icon: FolderOpen,
  type: "project",
  route: `/project/${p.slug}`,
  description: p.description,
  tags: p.tags.map((t) => t.name).join(", "),
}));

const allItems = [
  ...pages.map((p) => ({ ...p, section: "PAGES" })),
  ...projectItems.map((p) => ({ ...p, section: "PROJECTS" })),
  ...connectLinks.map((c) => ({ ...c, section: "CONNECT" })),
];

/* ── Component ────────────────────────────────── */
const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Filter items
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
  }, [query]);

  // Group by section
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return groups;
  }, [filtered]);

  // Flat list for keyboard nav
  const flatList = useMemo(() => filtered, [filtered]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // toggle handled by parent
      }
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Arrow key navigation
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

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item) => {
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
  };

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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/30 dark:bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
          >
            <div className="w-full max-w-[560px] rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] shadow-2xl shadow-gray-300/60 dark:shadow-black/60 overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-white/[0.06]">
                <Search size={18} className="text-gray-400 dark:text-white/40 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="flex-1 bg-transparent text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/25 outline-none"
                />
                <div className="flex items-center gap-2 shrink-0">
                  <button className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors">
                    <Sun size={13} />
                  </button>
                  <button
                    onClick={onClose}
                    className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-[11px] font-mono text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
                  >
                    ESC
                  </button>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
                {Object.keys(grouped).length === 0 && (
                  <div className="px-5 py-10 text-center text-sm text-gray-400 dark:text-white/40">
                    No results found for "{query}"
                  </div>
                )}

                {Object.entries(grouped).map(([section, items]) => (
                  <div key={section}>
                    {/* Section header */}
                    <div className="px-5 pt-4 pb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40">
                        {section}
                      </span>
                    </div>

                    {/* Items */}
                    {items.map((item) => {
                      flatIndex++;
                      const isSelected = flatIndex === selectedIndex;
                      const Icon = item.icon;
                      const idx = flatIndex; // capture for click

                      return (
                        <button
                          key={`${section}-${item.name}`}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                            isSelected
                              ? "bg-gray-100 dark:bg-white/5"
                              : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                          }`}
                        >
                          <Icon
                            size={16}
                            className={`shrink-0 ${
                              isSelected ? "text-gray-600 dark:text-white/70" : "text-gray-300 dark:text-white/25"
                            }`}
                          />
                          <span
                            className={`text-sm font-medium ${
                              isSelected ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-white/70"
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.external && (
                            <span className="ml-auto text-[10px] text-gray-300 dark:text-white/25">
                              ↗
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
