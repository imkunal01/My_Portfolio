import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Plus,
  Trash2,
  Star,
  Film,
  Tv,
  BookOpen,
  Sparkles,
  Users,
  Eye,
  Clock,
  LogIn,
  Lock,
  X,
  ChevronDown,
  Loader2,
  Check,
  Edit3,
  UserCheck,
  Globe,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "";

const typeIcons = { movie: Film, series: Tv, anime: Sparkles, book: BookOpen };
const typeLabels = { movie: "Movie", series: "Series", anime: "Anime", book: "Book" };

/* ─────────────────────────────────────────────
   ADMIN PAGE
   ───────────────────────────────────────────── */
const Admin = () => {
  const navigate = useNavigate();
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("recommendations");
  const [keyInput, setKeyInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // Check sessionStorage for persisted key
  useEffect(() => {
    const saved = sessionStorage.getItem("adminKey");
    if (saved) {
      setAdminKey(saved);
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setLoginError("Please enter the admin key");
      return;
    }
    setAdminKey(keyInput.trim());
    sessionStorage.setItem("adminKey", keyInput.trim());
    setAuthenticated(true);
    setLoginError("");
  };

  const handleLogout = () => {
    setAdminKey("");
    setAuthenticated(false);
    sessionStorage.removeItem("adminKey");
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-accent" />
            </div>
            <h1 className="text-2xl font-bold font-display text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Enter your admin key to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Admin Key"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 transition-colors"
                autoFocus
              />
              {loginError && (
                <p className="text-red-400 text-xs mt-1">{loginError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogIn size={16} />
              Sign In
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="mt-6 mx-auto flex items-center gap-2 text-sm text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to site
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { key: "recommendations", label: "Recommendations", icon: Film },
    { key: "visitors", label: "Visitors", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-sm font-medium text-white/80 font-display">
            Admin Panel
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-white/40 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="pt-24 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl w-fit mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                  activeTab === tab.key
                    ? "bg-white/[0.08] text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "recommendations" && (
          <RecommendationsAdmin adminKey={adminKey} />
        )}
        {activeTab === "visitors" && <VisitorsAdmin adminKey={adminKey} />}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   RECOMMENDATIONS ADMIN TAB
   ───────────────────────────────────────────── */
const RecommendationsAdmin = ({ adminKey }) => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);

  const fetchRecs = async () => {
    try {
      const { data } = await axios.get(`${API}/api/recommendations`);
      setRecs(data);
    } catch {
      setRecs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this recommendation?")) return;
    try {
      await axios.delete(`${API}/api/recommendations/${id}`, {
        data: { adminKey },
      });
      setRecs((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white font-display">
            Manage Recommendations
          </h2>
          <p className="text-sm text-white/40 mt-1">
            {recs.length} total recommendations
          </p>
        </div>
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-xl transition-colors"
        >
          {showAddPanel ? <X size={16} /> : <Plus size={16} />}
          {showAddPanel ? "Close" : "Add New"}
        </button>
      </div>

      {/* Add Panel */}
      <AnimatePresence>
        {showAddPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <AddRecommendation
              adminKey={adminKey}
              onAdded={(newRec) => {
                setRecs((prev) => [newRec, ...prev]);
                setShowAddPanel(false);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : recs.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Film size={40} className="mx-auto mb-3 text-white/10" />
          <p>No recommendations yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recs.map((rec) => {
            const Icon = typeIcons[rec.type] || Film;
            return (
              <motion.div
                key={rec._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 hover:border-white/10 transition-all group"
              >
                {/* Poster thumb */}
                <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-white/5">
                  {rec.poster && rec.poster !== "N/A" ? (
                    <img
                      src={rec.poster}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon size={16} className="text-white/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {rec.title}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent/10 text-accent rounded-full">
                      {rec.type}
                    </span>
                    {rec.category && rec.category !== "general" && (
                      <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-white/5 text-white/30 rounded-full">
                        {rec.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                    {rec.year && <span>{rec.year}</span>}
                    {rec.genre && (
                      <span className="truncate max-w-[200px]">
                        {rec.genre}
                      </span>
                    )}
                    {rec.myRating && (
                      <span className="flex items-center gap-0.5">
                        <Star
                          size={10}
                          className="text-accent fill-accent"
                        />
                        {rec.myRating}/10
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleDelete(rec._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   ADD RECOMMENDATION PANEL
   ───────────────────────────────────────────── */
const AddRecommendation = ({ adminKey, onAdded }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedType, setSelectedType] = useState("movie");
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [myRating, setMyRating] = useState(8);
  const [myReview, setMyReview] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualYear, setManualYear] = useState("");
  const [manualPoster, setManualPoster] = useState("");
  const [manualGenre, setManualGenre] = useState("");
  const [manualPlot, setManualPlot] = useState("");
  const searchTimeout = useRef(null);

  // Debounced search
  const handleSearch = (value) => {
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (value.length < 2) {
      setSearchResults([]);
      return;
    }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const typeParam =
          selectedType === "anime" ? "movie" : selectedType === "book" ? "" : selectedType;
        const { data } = await axios.get(
          `${API}/api/recommendations/search?q=${encodeURIComponent(value)}${
            typeParam ? `&type=${typeParam}` : ""
          }`
        );
        setSearchResults(data.results || []);
      } catch {
        setSearchResults([]);
      }
      setSearching(false);
    }, 400);
  };

  // Select a result and fetch full details
  const handleSelect = async (item) => {
    setSelected(item);
    setSearchResults([]);
    setQuery(item.Title);
    setLoadingDetails(true);
    try {
      const { data } = await axios.get(
        `${API}/api/recommendations/details/${item.imdbID}`
      );
      setDetails(data);
    } catch {
      setDetails(null);
    }
    setLoadingDetails(false);
  };

  // Submit
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const body = manualMode
        ? {
            adminKey,
            title: manualTitle,
            year: manualYear,
            type: selectedType,
            poster: manualPoster,
            genre: manualGenre,
            plot: manualPlot,
            myRating,
            myReview,
            category,
          }
        : {
            adminKey,
            title: details?.Title || selected?.Title,
            year: details?.Year || selected?.Year,
            type: selectedType,
            poster: details?.Poster || selected?.Poster,
            imdbID: details?.imdbID || selected?.imdbID,
            imdbRating: details?.imdbRating,
            genre: details?.Genre,
            plot: details?.Plot,
            director: details?.Director,
            actors: details?.Actors,
            runtime: details?.Runtime,
            myRating,
            myReview,
            category,
          };

      const { data } = await axios.post(`${API}/api/recommendations`, body);
      onAdded(data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-[#111] border border-white/10">
      {/* Type selector */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">
          Type:
        </span>
        <div className="flex gap-1 p-1 bg-white/[0.04] rounded-xl">
          {Object.entries(typeLabels).map(([key, label]) => {
            const Icon = typeIcons[key];
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedType(key);
                  setSelected(null);
                  setDetails(null);
                  setSearchResults([]);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedType === key
                    ? "bg-accent/20 text-accent"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Icon size={12} />
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setManualMode(!manualMode);
            setSelected(null);
            setDetails(null);
          }}
          className={`ml-auto text-xs px-3 py-1.5 rounded-lg border transition-all ${
            manualMode
              ? "bg-accent/10 border-accent/30 text-accent"
              : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
          }`}
        >
          {manualMode ? "API Search" : "Manual Entry"}
        </button>
      </div>

      {manualMode ? (
        /* Manual entry form */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title *"
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40"
            />
            <input
              type="text"
              placeholder="Year"
              value={manualYear}
              onChange={(e) => setManualYear(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40"
            />
            <input
              type="text"
              placeholder="Poster URL"
              value={manualPoster}
              onChange={(e) => setManualPoster(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40"
            />
            <input
              type="text"
              placeholder="Genre"
              value={manualGenre}
              onChange={(e) => setManualGenre(e.target.value)}
              className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40"
            />
          </div>
          <textarea
            placeholder="Plot / Description"
            value={manualPlot}
            onChange={(e) => setManualPlot(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 resize-none"
          />
        </div>
      ) : (
        /* OMDB Search */
        <div className="relative mb-6">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder={`Search for a ${selectedType}...`}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 transition-colors"
          />

          {/* Search results dropdown */}
          {(searchResults.length > 0 || searching) && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl z-20 custom-scrollbar">
              {searching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2
                    size={20}
                    className="animate-spin text-white/30"
                  />
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.imdbID}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 w-full p-3 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-white/5">
                      {item.Poster && item.Poster !== "N/A" ? (
                        <img
                          src={item.Poster}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={14} className="text-white/20" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {item.Title}
                      </p>
                      <p className="text-xs text-white/30">
                        {item.Year} • {item.Type}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Selected / Details Preview */}
      {!manualMode && selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-6"
        >
          <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0">
            {(details?.Poster || selected.Poster) !== "N/A" ? (
              <img
                src={details?.Poster || selected.Poster}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            {loadingDetails ? (
              <Loader2
                size={16}
                className="animate-spin text-white/30 mt-2"
              />
            ) : (
              <>
                <h3 className="text-lg font-bold text-white">
                  {details?.Title || selected.Title}
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {details?.Year || selected.Year}
                  {details?.Runtime && ` • ${details.Runtime}`}
                  {details?.imdbRating && ` • ⭐ ${details.imdbRating}`}
                </p>
                {details?.Genre && (
                  <p className="text-xs text-white/30 mt-1">{details.Genre}</p>
                )}
                {details?.Plot && (
                  <p className="text-xs text-white/30 mt-2 line-clamp-2">
                    {details.Plot}
                  </p>
                )}
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Rating, Review, Category */}
      {(selected || manualMode) && (
        <div className="space-y-4 mt-6 pt-6 border-t border-white/5">
          {/* My Rating */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2 block">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMyRating(i + 1)}
                  className="p-0.5"
                >
                  <Star
                    size={20}
                    className={
                      i < myRating
                        ? "text-accent fill-accent"
                        : "text-white/10 hover:text-white/30"
                    }
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-accent">
                {myRating}/10
              </span>
            </div>
          </div>

          {/* Review */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2 block">
              Your Review (optional)
            </label>
            <textarea
              value={myReview}
              onChange={(e) => setMyReview(e.target.value)}
              placeholder="Why do you recommend this?"
              rows={3}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent/40 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-2 block">
              Category
            </label>
            <div className="flex gap-2 flex-wrap">
              {["general", "must-watch", "hidden-gem", "classic"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                    category === cat
                      ? "bg-accent/10 border-accent/30 text-accent"
                      : "bg-white/5 border-white/10 text-white/30 hover:text-white/50"
                  }`}
                >
                  {cat.replace("-", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || (!manualMode && !selected) || (manualMode && !manualTitle)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-colors"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            Add Recommendation
          </button>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   VISITORS ADMIN TAB
   ───────────────────────────────────────────── */
const VisitorsAdmin = ({ adminKey }) => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({ total: 0, named: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/visitors?adminKey=${encodeURIComponent(adminKey)}`
      );
      setVisitors(data.visitors || []);
      setStats(data.stats || { total: 0, named: 0, today: 0 });
    } catch {
      setVisitors([]);
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: "Total Visitors",
            value: stats.total,
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10 border-blue-400/20",
          },
          {
            label: "Named Visitors",
            value: stats.named,
            icon: UserCheck,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10 border-emerald-400/20",
          },
          {
            label: "Today",
            value: stats.today,
            icon: Eye,
            color: "text-accent",
            bg: "bg-accent/10 border-accent/20",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-5 rounded-2xl border transition-all ${stat.bg}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-white/40 uppercase tracking-wider font-semibold">
                  {stat.label}
                </span>
                <Icon size={18} className={stat.color} />
              </div>
              <p className={`text-3xl font-bold font-display ${stat.color}`}>
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Visitors list */}
      <h3 className="text-lg font-bold text-white font-display mb-4">
        Recent Visitors
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-20 text-white/30">
          <Users size={40} className="mx-auto mb-3 text-white/10" />
          <p>No visitors tracked yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {visitors.map((v, i) => (
            <motion.div
              key={v._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.5) }}
              className="flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-white/5 hover:border-white/10 transition-all"
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  v.name && v.name !== "Anonymous"
                    ? "bg-accent/10 border border-accent/20"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    v.name && v.name !== "Anonymous"
                      ? "text-accent"
                      : "text-white/30"
                  }`}
                >
                  {v.name && v.name !== "Anonymous"
                    ? v.name.charAt(0).toUpperCase()
                    : "?"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">
                  {v.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-white/30 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(v.visitedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(v.visitedAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {v.page && (
                    <span className="flex items-center gap-1">
                      <Globe size={10} />
                      {v.page}
                    </span>
                  )}
                </div>
              </div>

              {/* IP */}
              <span className="hidden md:block text-[11px] text-white/20 font-mono">
                {v.ip}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
