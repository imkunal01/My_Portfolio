import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MessageSquare, Send, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { optimizeCloudinaryUrl } from "../utils/imageOptimization";

const API = import.meta.env.VITE_BACKEND_URL || "";

const Guestbook = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get(`${API}/api/guestbook`);
        setEntries(data);
      } catch {
        setEntries([]);
      }
      setLoading(false);
    };
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || submitting) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/api/guestbook`, {
        name: name.trim(),
        message: message.trim(),
      });
      setEntries([data, ...entries]);
      setName("");
      setMessage("");
    } catch (err) {
      alert(err.response?.data?.error || "Failed to sign guestbook");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back Home</span>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-white/80 font-display">
            Guestbook
          </span>
          <div className="w-16" />
        </div>
      </motion.div>

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <MessageSquare size={20} className="text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">
              Guestbook
            </h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-white/60">
            Leave a message and let me know you were here!
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-12 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <User size={14} className="text-gray-400 dark:text-white/40" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 outline-none"
            />
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a message..."
            rows={3}
            className="w-full bg-gray-50 dark:bg-white/[0.03] rounded-xl p-4 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-white/20 outline-none border border-gray-200 dark:border-white/[0.06] focus:border-accent/30 transition-colors resize-none mb-4"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!name.trim() || !message.trim() || submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-light text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {submitting ? "Signing..." : "Sign Guestbook"}
            </button>
          </div>
        </motion.form>

        {/* Entries */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-gray-200 dark:text-white/15 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-white/40">No messages yet. Be the first to sign!</p>
          </div>
        ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {entries.map((entry, i) => (
              <motion.div
                key={entry._id || entry.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-5"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={optimizeCloudinaryUrl(entry.avatar, { width: 96, height: 96, crop: "fill" })}
                    alt={entry.name}
                    className="w-9 h-9 rounded-full bg-gray-100 dark:bg-white/5"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {entry.name}
                      </span>
                      <span className="text-[11px] text-gray-300 dark:text-white/25">
                        {new Date(entry.createdAt || entry.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">
                      {entry.message}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        )}
      </div>
    </div>
  );
};

export default Guestbook;
