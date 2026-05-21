import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Film,
  Tv,
  BookOpen,
  Sparkles,
  Search,
  X,
  ExternalLink,
  Clock,
  Calendar,
  Play,
  ChevronRight,
  Heart,
  TrendingUp,
  Award,
  Gem,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { optimizeCloudinaryUrl } from "../utils/imageOptimization";

const API = import.meta.env.VITE_BACKEND_URL || "";

const getPosterUrl = (rec, variant = "default") => {
  if (!rec) return "";

  if (variant === "thumb" && rec.posterThumb) return rec.posterThumb;
  if (variant === "backdrop" && rec.posterBackdrop) return rec.posterBackdrop;
  if (variant === "default" && rec.posterOptimized) return rec.posterOptimized;

  const source = rec.poster;
  if (!source || source === "N/A") return "";

  if (variant === "thumb") {
    return optimizeCloudinaryUrl(source, { width: 360, height: 540, crop: "fill" });
  }
  if (variant === "backdrop") {
    return optimizeCloudinaryUrl(source, { width: 1280, height: 720, crop: "fill" });
  }
  return optimizeCloudinaryUrl(source, { width: 720, height: 1080, crop: "fill" });
};

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

const typeEmoji = {
  movie: "🎬",
  series: "📺",
  anime: "⚡",
  book: "📚",
};

const categoryConfig = {
  "must-watch": {
    label: "Must Watch",
    icon: TrendingUp,
    border: "border-red-500/30",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
  "hidden-gem": {
    label: "Hidden Gem",
    icon: Gem,
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  classic: {
    label: "Classic",
    icon: Award,
    border: "border-amber-500/30",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  general: {
    label: "Recommended",
    icon: Heart,
    border: "border-gray-300 dark:border-white/10",
    text: "text-gray-500 dark:text-white/60",
    bg: "bg-gray-100 dark:bg-white/5",
  },
};

const Recommendations = () => {
  const navigate = useNavigate();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

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
          r.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.actors?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recs;

  const grouped = filtered.reduce((acc, rec) => {
    const t = rec.type || "movie";
    if (!acc[t]) acc[t] = [];
    acc[t].push(rec);
    return acc;
  }, {});

  // Stats
  const typeCounts = recs.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  // Featured rec (highest rated)
  const featured = recs.length
    ? [...recs].sort((a, b) => (b.myRating || 0) - (a.myRating || 0))[0]
    : null;

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
          <span className="text-sm font-medium text-gray-700 dark:text-white/80 font-display tracking-wide">
            My Picks
          </span>
          <div className="w-16" />
        </div>
      </motion.div>

      {/* ── Hero / Featured Section ──────────── */}
      {!loading && featured && !searchQuery && !activeType && (
        <div className="relative pt-16">
          {/* Background poster blur */}
          <div className="absolute inset-0 overflow-hidden">
            {featured.poster && featured.poster !== "N/A" && (
              <img
                src={getPosterUrl(featured, "backdrop")}
                alt=""
                className="w-full h-full object-cover opacity-[0.08] scale-110 blur-2xl"
                loading="eager"
                decoding="async"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#fafafa]/50 dark:from-[#0a0a0a]/50 via-[#fafafa]/80 dark:via-[#0a0a0a]/80 to-[#fafafa] dark:to-[#0a0a0a]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col lg:flex-row gap-8 items-start"
            >
              {/* Featured poster */}
              <div
                className="relative shrink-0 cursor-pointer group"
                onClick={() => setSelectedRec(featured)}
              >
                <div className="w-44 md:w-52 rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/50 dark:shadow-black/50 ring-1 ring-gray-300 dark:ring-white/10">
                  {featured.poster && featured.poster !== "N/A" ? (
                    <img
                      src={getPosterUrl(featured, "default")}
                      alt={featured.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="eager"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                      <Film size={40} className="text-gray-200 dark:text-white/15" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-accent/30">
                    <Play size={22} className="text-gray-900 dark:text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>

              {/* Featured info */}
              <div className="flex-1 min-w-0 lg:pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 rounded-full">
                    Top Pick
                  </span>
                  {featured.category && featured.category !== "general" && (() => {
                    const fCat = categoryConfig[featured.category];
                    return (
                      <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${fCat?.bg} ${fCat?.text} ${fCat?.border}`}>
                        {fCat?.label || featured.category}
                      </span>
                    );
                  })()}
                </div>

                <h1
                  className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-gray-900 dark:text-white mb-3 cursor-pointer hover:text-accent transition-colors"
                  onClick={() => setSelectedRec(featured)}
                >
                  {featured.title}
                </h1>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-400 dark:text-white/40 flex-wrap">
                  {featured.year && <span>{featured.year}</span>}
                  {featured.runtime && featured.runtime !== "N/A" && (
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {featured.runtime}
                    </span>
                  )}
                  {featured.genre && (
                    <span>{featured.genre.split(", ").slice(0, 3).join(" • ")}</span>
                  )}
                </div>

                <div className="flex items-center gap-5 mb-5 flex-wrap">
                  {featured.myRating && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < Math.round(featured.myRating / 2)
                                ? "text-accent fill-accent"
                                : "text-gray-200 dark:text-white/15"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-accent font-bold">{featured.myRating}/10</span>
                    </div>
                  )}
                  {featured.imdbRating && featured.imdbRating !== "N/A" && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 rounded-lg">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">{featured.imdbRating}</span>
                      <span className="text-[10px] text-yellow-400/60 uppercase">IMDb</span>
                    </div>
                  )}
                </div>

                {featured.plot && featured.plot !== "N/A" && (
                  <p className="text-sm text-gray-400 dark:text-white/40 leading-relaxed max-w-xl line-clamp-3 mb-5">
                    {featured.plot}
                  </p>
                )}

                {featured.myReview && (
                  <div className="inline-flex items-start gap-2 px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] max-w-lg">
                    <span className="text-accent text-lg leading-none mt-0.5">"</span>
                    <p className="text-sm text-gray-500 dark:text-white/60 italic leading-relaxed line-clamp-2">
                      {featured.myReview}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Main Content ────────────────────── */}
      <div className={`px-6 lg:px-8 max-w-7xl mx-auto ${!featured || searchQuery || activeType ? "pt-28" : "pt-6"} pb-20`}>
        {/* Header (when no featured) */}
        {(!featured || searchQuery || activeType) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-3">
              My Picks
            </h1>
            <p className="text-base text-gray-400 dark:text-white/40 max-w-xl">
              Handpicked movies, series, anime &amp; books that left an impression.
            </p>
          </motion.div>
        )}

        {/* ── Stats Bar ─────────────────────── */}
        {!loading && recs.length > 0 && !searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-3 mb-8 overflow-x-auto pb-1"
          >
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] shrink-0">
              <Heart size={13} className="text-accent" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{recs.length}</span>
              <span className="text-xs text-gray-400 dark:text-white/40">total</span>
            </div>
            {Object.entries(typeCounts).map(([type, count]) => (
              <button
                key={type}
                onClick={() => setActiveType(activeType === type ? null : type)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border shrink-0 transition-all ${
                  activeType === type
                    ? "bg-accent/10 border-accent/30 text-accent"
                    : "bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-500 dark:hover:text-white/50 hover:border-gray-300 dark:hover:border-white/10"
                }`}
              >
                <span className="text-sm">{typeEmoji[type] || "📌"}</span>
                <span className="text-sm font-semibold">{count}</span>
                <span className="text-xs">{typeLabels[type]}</span>
              </button>
            ))}
          </motion.div>
        )}

        {/* ── Filters + Search ──────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-10"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType(null)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                !activeType
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
              }`}
            >
              All
            </button>
            {Object.entries(typeLabels).map(([key, label]) => {
              const Icon = typeIcons[key];
              return (
                <button
                  key={key}
                  onClick={() => setActiveType(activeType === key ? null : key)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                    activeType === key
                      ? "bg-accent/10 border-accent/30 text-accent"
                      : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                  }`}
                >
                  <Icon size={12} />
                  {label}
                </button>
              );
            })}
          </div>

          <div className={`relative sm:ml-auto transition-all duration-300 ${searchFocused ? "sm:w-80" : "sm:w-64"}`}>
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40" />
            <input
              type="text"
              placeholder="Search by title, genre, actor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-10 pr-9 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-white/20 focus:outline-none focus:border-accent/40 focus:bg-gray-100 dark:focus:bg-white/5 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-500 dark:hover:text-white/50">
                <X size={14} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-[2/3] shimmer rounded-xl" />
                <div className="pt-3 space-y-2">
                  <div className="h-3.5 shimmer rounded w-3/4" />
                  <div className="h-2.5 shimmer rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] flex items-center justify-center mx-auto mb-5">
              <Film size={32} className="text-gray-200 dark:text-white/15" />
            </div>
            <p className="text-gray-400 dark:text-white/40 text-lg font-display font-semibold">
              {searchQuery ? "No matches found" : "No recommendations yet"}
            </p>
            <p className="text-gray-200 dark:text-white/15 text-sm mt-2 max-w-sm mx-auto">
              {searchQuery
                ? `Nothing matched "${searchQuery}". Try a different search.`
                : "Check back soon — handpicked content is on the way!"}
            </p>
          </motion.div>
        )}

        {/* ── Content Grid ──────────────────── */}
        {!loading &&
          filtered.length > 0 &&
          (activeType || searchQuery ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((rec, i) => (
                <RecCard key={rec._id} rec={rec} index={i} onClick={() => setSelectedRec(rec)} />
              ))}
            </motion.div>
          ) : (
            Object.entries(grouped).map(([type, items]) => (
              <RecSection key={type} type={type} items={items} onSelect={setSelectedRec} onFilterType={() => setActiveType(type)} />
            ))
          ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRec && <RecDetailModal rec={selectedRec} onClose={() => setSelectedRec(null)} />}
      </AnimatePresence>
    </div>
  );
};

/* ── Section Component ────────────────────── */
const RecSection = ({ type, items, onSelect, onFilterType }) => {
  const scrollRef = useRef(null);
  const Icon = typeIcons[type] || Film;

  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Icon size={16} className="text-accent" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900 dark:text-white">
            {typeLabels[type] || type}
          </h2>
          <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 rounded-full">
            {items.length}
          </span>
        </div>
        <button
          onClick={onFilterType}
          className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/40 hover:text-accent transition-colors group"
        >
          <span>View all</span>
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div ref={scrollRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {items.map((rec, i) => (
          <RecCard key={rec._id} rec={rec} index={i} onClick={() => onSelect(rec)} />
        ))}
      </div>
    </div>
  );
};

/* ── Card Component ──────────────────────── */
const RecCard = ({ rec, index, onClick }) => {
  const Icon = typeIcons[rec.type] || Film;
  const cat = categoryConfig[rec.category] || categoryConfig.general;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2.5 ring-1 ring-gray-200 dark:ring-white/5 group-hover:ring-gray-300 transition-all duration-300">
        {rec.poster && rec.poster !== "N/A" ? (
          <>
            {!imageLoaded && <div className="absolute inset-0 shimmer" />}
            <img
              src={getPosterUrl(rec, "thumb")}
              alt={rec.title}
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-white/[0.03]">
            <Icon size={36} className="text-gray-200 dark:text-white/15" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-11 h-11 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-accent/20 scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={16} className="text-gray-900 dark:text-white ml-0.5" fill="white" />
          </div>
        </div>

        {/* Rating badge */}
        {rec.myRating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/40 dark:bg-black/70 backdrop-blur-md rounded-lg">
            <Star size={9} className="text-accent fill-accent" />
            <span className="text-[11px] font-bold text-accent">{rec.myRating}</span>
          </div>
        )}

        {/* Category pill */}
        {rec.category && rec.category !== "general" && (
          <div className={`absolute bottom-2 left-2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md border backdrop-blur-md ${cat.bg} ${cat.text} ${cat.border}`}>
            {cat.label}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        <h3 className="text-[13px] font-semibold text-gray-800 dark:text-white/90 truncate group-hover:text-accent transition-colors duration-200">
          {rec.title}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          {rec.year && <span className="text-[11px] text-gray-300 dark:text-white/25">{rec.year}</span>}
          {rec.imdbRating && rec.imdbRating !== "N/A" && (
            <span className="flex items-center gap-0.5 text-[11px] text-gray-300 dark:text-white/25">
              <Star size={8} className="text-yellow-500 fill-yellow-500" />
              {rec.imdbRating}
            </span>
          )}
          {rec.genre && (
            <span className="text-[10px] text-gray-200 dark:text-white/15 truncate">
              {rec.genre.split(", ")[0]}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ── Detail Modal ─────────────────────────── */
const RecDetailModal = ({ rec, onClose }) => {
  const Icon = typeIcons[rec.type] || Film;
  const cat = categoryConfig[rec.category] || categoryConfig.general;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 dark:bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-[#111] border border-gray-300 dark:border-white/10 shadow-2xl shadow-gray-300/60 dark:shadow-black/60"
      >
        {/* Background blur from poster */}
        {rec.poster && rec.poster !== "N/A" && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={getPosterUrl(rec, "backdrop")} alt="" className="w-full h-40 object-cover opacity-[0.06] blur-2xl scale-150" loading="lazy" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-all backdrop-blur-sm border border-gray-200 dark:border-white/[0.06]"
        >
          <X size={16} />
        </button>

        <div className="relative overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="flex flex-col md:flex-row">
            {/* Poster side */}
            <div className="md:w-[280px] shrink-0 p-5 md:p-6">
              <div className="rounded-xl overflow-hidden ring-1 ring-gray-300 dark:ring-white/10 shadow-xl shadow-gray-300/40 dark:shadow-black/40">
                {rec.poster && rec.poster !== "N/A" ? (
                  <img src={getPosterUrl(rec, "default")} alt={rec.title} className="w-full aspect-[2/3] object-cover" loading="lazy" decoding="async" />
                ) : (
                  <div className="w-full aspect-[2/3] flex items-center justify-center bg-gray-50 dark:bg-white/[0.03]">
                    <Icon size={50} className="text-gray-200 dark:text-white/15" />
                  </div>
                )}
              </div>

              {/* IMDb link under poster */}
              {rec.imdbID && (
                <a
                  href={`https://www.imdb.com/title/${rec.imdbID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-xl text-sm font-medium hover:bg-yellow-500/20 transition-colors w-full"
                >
                  <ExternalLink size={14} />
                  View on IMDb
                </a>
              )}
            </div>

            {/* Info side */}
            <div className="p-5 md:p-6 md:pl-0 flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-accent/10 text-accent border border-accent/20 rounded-full">
                  <Icon size={10} />
                  {typeLabels[rec.type] || rec.type}
                </span>
                {rec.category && rec.category !== "general" && (
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full border ${cat.bg} ${cat.text} ${cat.border}`}>
                    {cat.label}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 dark:text-white mb-3 leading-tight">
                {rec.title}
              </h2>

              {/* Meta row */}
              <div className="flex items-center gap-3 mb-5 text-sm text-gray-400 dark:text-white/40 flex-wrap">
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
                {rec.genre && (
                  <span>{rec.genre.split(", ").slice(0, 3).join(" · ")}</span>
                )}
              </div>

              {/* Rating cards */}
              <div className="flex items-stretch gap-3 mb-5 flex-wrap">
                {rec.myRating && (
                  <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < Math.round(rec.myRating / 2) ? "text-accent fill-accent" : "text-gray-200 dark:text-white/15"}
                        />
                      ))}
                    </div>
                    <span className="text-accent font-bold text-sm">{rec.myRating}/10</span>
                    <span className="text-[10px] text-accent/50 uppercase">My Rating</span>
                  </div>
                )}
                {rec.imdbRating && rec.imdbRating !== "N/A" && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-yellow-400 font-bold text-sm">{rec.imdbRating}</span>
                    <span className="text-[10px] text-yellow-400/50 uppercase">IMDb</span>
                  </div>
                )}
              </div>

              {/* Genre pills */}
              {rec.genre && (
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {rec.genre.split(", ").map((g) => (
                    <span key={g} className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-300 dark:text-white/25 bg-gray-100 dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/[0.06]">
                      {g}
                    </span>
                  ))}
                </div>
              )}

              {/* Synopsis */}
              {rec.plot && rec.plot !== "N/A" && (
                <div className="mb-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-white/25 mb-2">Synopsis</h3>
                  <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">{rec.plot}</p>
                </div>
              )}

              {/* My Review */}
              {rec.myReview && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] mb-5">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-accent/60 mb-2">My Take</h3>
                  <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed italic">"{rec.myReview}"</p>
                </div>
              )}

              {/* Credits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {rec.director && rec.director !== "N/A" && (
                  <div className="px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-200 dark:text-white/15 mb-1">Director</p>
                    <p className="text-gray-400 dark:text-white/40">{rec.director}</p>
                  </div>
                )}
                {rec.actors && rec.actors !== "N/A" && (
                  <div className="px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06]">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-200 dark:text-white/15 mb-1">Cast</p>
                    <p className="text-gray-400 dark:text-white/40 line-clamp-2">{rec.actors}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Recommendations;
