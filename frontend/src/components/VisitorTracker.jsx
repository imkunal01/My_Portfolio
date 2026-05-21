import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Sparkles } from "lucide-react";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "";

const generateSessionId = () => {
  const stored = localStorage.getItem("portfolio_session_id");
  if (stored) return stored;
  const id =
    "v_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  localStorage.setItem("portfolio_session_id", id);
  return id;
};

const VisitorTracker = () => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user already provided name or dismissed
    const alreadyNamed = localStorage.getItem("portfolio_visitor_named");
    const alreadyDismissed = sessionStorage.getItem("portfolio_visitor_dismissed");
    if (alreadyNamed || alreadyDismissed) return;

    // Log the visit
    const sessionId = generateSessionId();
    axios
      .post(`${API}/api/visitors/log`, {
        sessionId,
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      })
      .catch(() => {});

    // Show modal after 15 seconds on page
    const timer = setTimeout(() => {
      const namedCheck = localStorage.getItem("portfolio_visitor_named");
      const dismissedCheck = sessionStorage.getItem("portfolio_visitor_dismissed");
      if (!namedCheck && !dismissedCheck) {
        setShowModal(true);
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const sessionId = generateSessionId();
      await axios.put(`${API}/api/visitors/name`, {
        sessionId,
        name: name.trim(),
      });
      localStorage.setItem("portfolio_visitor_named", "true");
      setSubmitted(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch {
      // Silently handle errors
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("portfolio_visitor_dismissed", "true");
    setDismissed(true);
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[90] w-80 rounded-2xl bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl border border-gray-200 dark:border-white/[0.06] shadow-2xl shadow-gray-300/50 dark:shadow-black/50 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-all"
          >
            <X size={14} />
          </button>

          <div className="p-5">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <Sparkles size={20} className="text-emerald-400" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Thanks, {name}!
                </p>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                  Glad you stopped by ✨
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                    <UserPlus size={18} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Hey there! 👋
                    </p>
                    <p className="text-xs text-gray-400 dark:text-white/40">
                      Mind sharing your name?
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 transition-colors"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className="flex-1 py-2 text-xs text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors rounded-xl"
                    >
                      Maybe later
                    </button>
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="flex-1 py-2 bg-accent hover:bg-accent-light disabled:opacity-40 text-white text-xs font-medium rounded-xl transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorTracker;
