import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Film,
  Tv,
  BookOpen,
  Sparkles,
  Search,
  Filter,
  X,
  ExternalLink,
  Clock,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "";

const typeIcons = {
  movie: Film,
  series: Tv,
  anime: Sparkles,
  book: BookOpen,
};

const typeLabels = {
  movie: "Movies",
  series: "Series",
  anime: "Anime",
  book: "Books",
};

const categoryColors = {
  "must-watch": "bg-red-500/10 text-red-400 border-red-500/20",
  "hidden-gem": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  classic: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  general: "bg-white/5 text-white/40 border-white/10",
};

const Recommendations = () => {
  const navigate = useNavigate();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRecs();
  }, [activeType]);

  const fetchRecs = async () => {
    setLoading(true);
    try {
      const params = activeType ? `?type=${activeType}` : "";
      const { data } = await axios.get(`${API}/api/recommendations${params}`);
      setRecs(data);
    } catch {
      setRecs([]);
    }
    setLoading(false);
  };

  const filtered = searchQuery
    ? recs.filter(
        (r) =>
          r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.director?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recs;

  const grouped = filtered.reduce((acc, rec) => {
    const t = rec.type || "movie";
    if (!acc[t]) acc[t] = [];
    acc[t].push(rec);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back Home</span>
          </button>
          <span className="text-sm font-medium text-white/80 font-display">
            Recommendations
          </span>
          <div className="w-16" />
        </div>
      </motion.div>

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            My Picks
          </h1>
          <p className="text-lg text-white/50 max-w-2xl">
            Movies, series, anime &amp; books I recommend. Handpicked favorites
            that left an impression.
          </p>
        </motion.div>

        {/* Filters + Search */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          {/* Type filter pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType(null)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                !activeType
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              All
            </button>
            {Object.entries(typeLabels).map(([key, label]) => {
              const Icon = typeIcons[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveType(key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                    activeType === key
                      ? "bg-accent/10 border-accent/30 text-accent"
                      : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              type="text"
              placeholder="Search recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 transition-colors"
            />
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-[#111] border border-white/5"
              >
                <div className="aspect-[2/3] shimmer" />
                <div className="p-3 space-y-2">
                  <div className="h-4 shimmer rounded w-3/4" />
                  <div className="h-3 shimmer rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <Film size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 text-lg">No recommendations yet.</p>
            <p className="text-white/20 text-sm mt-1">
              Check back soon for curated picks!
            </p>
          </div>
        )}

        {/* Grouped sections */}
        {!loading &&
          (activeType
            ? // Show flat grid for single type
              filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
                >
                  {filtered.map((rec, i) => (
                    <RecCard
                      key={rec._id}
                      rec={rec}
                      index={i}
                      onClick={() => setSelectedRec(rec)}
                    />
                  ))}
                </motion.div>
              )
            : // Show grouped by type
              Object.entries(grouped).map(([type, items]) => (
                <div key={type} className="mb-14">
                  <div className="flex items-center gap-2 mb-6">
                    {(() => {
                      const Icon = typeIcons[type] || Film;
                      return <Icon size={20} className="text-accent" />;
                    })()}
                    <h2 className="text-2xl font-bold font-display text-white">
                      {typeLabels[type] || type}
                    </h2>
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/5 text-white/30 rounded-full">
                      {items.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {items.map((rec, i) => (
                      <RecCard
                        key={rec._id}
                        rec={rec}
                        index={i}
                        onClick={() => setSelectedRec(rec)}
                      />
                    ))}
                  </div>
                </div>
              )))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRec && (
          <RecDetailModal
            rec={selectedRec}
            onClose={() => setSelectedRec(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Card Component ──────────────────────── */
const RecCard = ({ rec, index, onClick }) => {
  const Icon = typeIcons[rec.type] || Film;
  const catClass = categoryColors[rec.category] || categoryColors.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      onClick={onClick}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-[#111] border border-white/5 hover:border-white/15 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Poster */}
      <div className="aspect-[2/3] relative overflow-hidden">
        {rec.poster && rec.poster !== "N/A" ? (
          <img
            src={rec.poster}
            alt={rec.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
            <Icon size={40} className="text-white/10" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rating badge */}
        {rec.myRating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-yellow-400">
              {rec.myRating}
            </span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg">
          <Icon size={12} className="text-white/60" />
        </div>

        {/* Category badge */}
        {rec.category && rec.category !== "general" && (
          <div
            className={`absolute bottom-2 left-2 right-2 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border text-center backdrop-blur-sm ${catClass}`}
          >
            {rec.category.replace("-", " ")}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
          {rec.title}
        </h3>
        <div className="flex items-center gap-2 mt-1">
          {rec.year && (
            <span className="text-[11px] text-white/30">{rec.year}</span>
          )}
          {rec.imdbRating && rec.imdbRating !== "N/A" && (
            <span className="flex items-center gap-0.5 text-[11px] text-white/30">
              <Star size={8} className="text-yellow-500 fill-yellow-500" />
              {rec.imdbRating}
            </span>
          )}
        </div>
        {rec.genre && (
          <p className="text-[10px] text-white/20 mt-1 truncate">{rec.genre}</p>
        )}
      </div>
    </motion.div>
  );
};

/* ── Detail Modal ─────────────────────────── */
const RecDetailModal = ({ rec, onClose }) => {
  const Icon = typeIcons[rec.type] || Film;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl bg-[#111] border border-white/10 shadow-2xl custom-scrollbar"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Poster side */}
          <div className="md:w-1/3 shrink-0">
            {rec.poster && rec.poster !== "N/A" ? (
              <img
                src={rec.poster}
                alt={rec.title}
                className="w-full h-64 md:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-full flex items-center justify-center bg-white/[0.02]">
                <Icon size={60} className="text-white/10" />
              </div>
            )}
          </div>

          {/* Info side */}
          <div className="p-6 md:p-8 flex-1 min-w-0">
            {/* Type & Category */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20 rounded-full">
                <Icon size={10} />
                {rec.type}
              </span>
              {rec.category && rec.category !== "general" && (
                <span
                  className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full border ${
                    categoryColors[rec.category] || categoryColors.general
                  }`}
                >
                  {rec.category.replace("-", " ")}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
              {rec.title}
            </h2>

            {/* Meta row */}
            <div className="flex items-center gap-4 mb-5 text-sm text-white/40 flex-wrap">
              {rec.year && (
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {rec.year}
                </span>
              )}
              {rec.runtime && rec.runtime !== "N/A" && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {rec.runtime}
                </span>
              )}
              {rec.imdbRating && rec.imdbRating !== "N/A" && (
                <span className="flex items-center gap-1">
                  <Star
                    size={12}
                    className="text-yellow-500 fill-yellow-500"
                  />
                  {rec.imdbRating} IMDb
                </span>
              )}
            </div>

            {/* Ratings */}
            {rec.myRating && (
              <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-accent/5 border border-accent/10">
                <span className="text-sm text-white/50">My Rating:</span>
                <div className="flex items-center gap-1">
                  {[...Array(10)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < rec.myRating
                          ? "text-accent fill-accent"
                          : "text-white/10"
                      }
                    />
                  ))}
                </div>
                <span className="text-accent font-bold text-sm ml-1">
                  {rec.myRating}/10
                </span>
              </div>
            )}

            {/* Genre */}
            {rec.genre && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {rec.genre.split(", ").map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/30 bg-white/5 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Plot */}
            {rec.plot && rec.plot !== "N/A" && (
              <p className="text-sm text-white/50 leading-relaxed mb-4">
                {rec.plot}
              </p>
            )}

            {/* My Review */}
            {rec.myReview && (
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-4">
                <p className="text-xs text-accent font-semibold uppercase tracking-wider mb-2">
                  My Take
                </p>
                <p className="text-sm text-white/60 leading-relaxed italic">
                  "{rec.myReview}"
                </p>
              </div>
            )}

            {/* Director & Actors */}
            <div className="space-y-2 text-sm">
              {rec.director && rec.director !== "N/A" && (
                <p className="text-white/30">
                  <span className="text-white/50 font-medium">Director:</span>{" "}
                  {rec.director}
                </p>
              )}
              {rec.actors && rec.actors !== "N/A" && (
                <p className="text-white/30">
                  <span className="text-white/50 font-medium">Cast:</span>{" "}
                  {rec.actors}
                </p>
              )}
            </div>

            {/* IMDb link */}
            {rec.imdbID && (
              <a
                href={`https://www.imdb.com/title/${rec.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-sm font-medium hover:bg-yellow-500/20 transition-colors"
              >
                <ExternalLink size={14} />
                View on IMDb
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Recommendations;
