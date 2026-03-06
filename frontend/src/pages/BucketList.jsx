import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Plus,
  ListChecks,
  Plane,
  BookOpen,
  Mountain,
  Code,
  Music,
  Camera,
  Utensils,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "";

const categoryIcons = {
  travel: Plane,
  learning: BookOpen,
  adventure: Mountain,
  tech: Code,
  music: Music,
  photography: Camera,
  food: Utensils,
};

const categoryColors = {
  travel: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  learning: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  adventure: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  tech: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  music: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  photography: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  food: "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

const BucketList = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all | completed | pending
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bucketListItems, setBucketListItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data } = await axios.get(`${API}/api/bucketlist`);
        setBucketListItems(data);
      } catch {
        setBucketListItems([]);
      }
      setLoading(false);
    };
    fetchItems();
  }, []);

  const categories = [
    ...new Set(bucketListItems.map((item) => item.category)),
  ];

  const filtered = bucketListItems.filter((item) => {
    if (filter === "completed" && !item.completed) return false;
    if (filter === "pending" && item.completed) return false;
    if (selectedCategory && item.category !== selectedCategory) return false;
    return true;
  });

  const completedCount = bucketListItems.filter((i) => i.completed).length;
  const progress = bucketListItems.length
    ? Math.round((completedCount / bucketListItems.length) * 100)
    : 0;

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
            Bucket List
          </span>
          <div className="w-16" />
        </div>
      </motion.div>

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
              <ListChecks size={20} className="text-accent" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white">
              Bucket List
            </h1>
          </div>
          <p className="text-lg text-gray-500 dark:text-white/60">
            Things I want to do at least once in my life.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-white/60">Progress</span>
            <span className="text-sm font-semibold text-accent">
              {completedCount}/{bucketListItems.length} completed
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500"
            />
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {/* Status filters */}
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                filter === f
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
              }`}
            >
              {f}
            </button>
          ))}

          <span className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1 self-center" />

          {/* Category filters */}
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] || Circle;
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat ? null : cat)
                }
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                  selectedCategory === cat
                    ? categoryColors[cat] || "bg-gray-200 dark:bg-white/10 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white"
                    : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                }`}
              >
                <Icon size={11} />
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((item, i) => {
              const Icon = categoryIcons[item.category] || Circle;
              return (
                <motion.div
                  key={item._id || item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={`rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-5 transition-all ${
                    item.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Check icon */}
                    <div className="mt-0.5">
                      {item.completed ? (
                        <CheckCircle2
                          size={20}
                          className="text-accent"
                        />
                      ) : (
                        <Circle size={20} className="text-gray-200 dark:text-white/15" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-base font-medium ${
                            item.completed
                              ? "text-gray-400 dark:text-white/40 line-through"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-400 dark:text-white/40 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Category badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border shrink-0 ${
                        categoryColors[item.category] || "text-gray-400 dark:text-white/40 bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06]"
                      }`}
                    >
                      <Icon size={10} />
                      {item.category}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <ListChecks className="w-12 h-12 text-gray-200 dark:text-white/15 mx-auto mb-4" />
            <p className="text-gray-400 dark:text-white/40">No items match the current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BucketList;
