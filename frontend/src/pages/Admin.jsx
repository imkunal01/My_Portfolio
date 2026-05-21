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
  FileText,
  ListChecks,
  MessageSquare,
  Tag,
  CheckCircle2,
  Circle,
  Plane,
  Mountain,
  Code,
  Music,
  Camera,
  Utensils,
  Dumbbell,
  ToggleLeft,
  ToggleRight,
  Briefcase,
  Image,
  Link as LinkIcon,
  Upload,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { optimizeCloudinaryUrl } from "../utils/imageOptimization";

const API = import.meta.env.VITE_BACKEND_URL || "";

const typeIcons = { movie: Film, series: Tv, anime: Sparkles, book: BookOpen };
const typeLabels = { movie: "Movie", series: "Series", anime: "Anime", book: "Book" };

const resolveMediaUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/")) return `${API}${url}`;
  return optimizeCloudinaryUrl(url);
};

const projectThumbUrl = (project) => {
  if (project?.imageOptimized) return project.imageOptimized;
  return optimizeCloudinaryUrl(resolveMediaUrl(project?.image), { width: 240, height: 180, crop: "fill" });
};

const recThumbUrl = (rec) => {
  if (rec?.posterThumb) return rec.posterThumb;
  return optimizeCloudinaryUrl(rec?.poster, { width: 240, height: 360, crop: "fill" });
};

/* ─────────────────────────────────────────────
   ADMIN PAGE
   ───────────────────────────────────────────── */
const Admin = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [keyInput, setKeyInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Check localStorage for persisted token & verify it
  useEffect(() => {
    const saved = localStorage.getItem("adminToken");
    if (saved) {
      axios
        .get(`${API}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${saved}` },
        })
        .then(() => {
          setToken(saved);
          setAuthenticated(true);
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
        });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!keyInput.trim()) {
      setLoginError("Please enter the admin key");
      return;
    }
    setLoginLoading(true);
    setLoginError("");
    try {
      const { data } = await axios.post(`${API}/api/auth/login`, {
        adminKey: keyInput.trim(),
      });
      setToken(data.token);
      localStorage.setItem("adminToken", data.token);
      setAuthenticated(true);
    } catch (err) {
      setLoginError(err.response?.data?.error || "Login failed");
    }
    setLoginLoading(false);
  };

  const handleLogout = () => {
    setToken("");
    setAuthenticated(false);
    localStorage.removeItem("adminToken");
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
            <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-white">
              Admin Panel
            </h1>
            <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
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
                className="w-full px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 transition-colors"
                autoFocus
              />
              {loginError && (
                <p className="text-red-400 text-xs mt-1">{loginError}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-50 text-gray-900 dark:text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loginLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <button
            onClick={() => navigate("/")}
            className="mt-6 mx-auto flex items-center gap-2 text-sm text-gray-400 dark:text-white/40 hover:text-gray-500 dark:hover:text-white/50 transition-colors"
          >
            <ArrowLeft size={14} />
            Back to site
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { key: "projects", label: "Projects", icon: Briefcase },
    { key: "recommendations", label: "Picks", icon: Film },
    { key: "blog", label: "Blog", icon: FileText },
    { key: "bucketlist", label: "Bucket List", icon: ListChecks },
    { key: "guestbook", label: "Guestbook", icon: MessageSquare },
    { key: "contacts", label: "Contacts", icon: Mail },
    { key: "visitors", label: "Visitors", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-sm font-medium text-gray-700 dark:text-white/80 font-display">
            Admin Panel
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 dark:text-white/40 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/[0.06] rounded-2xl w-full sm:w-fit mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-medium rounded-xl transition-all shrink-0 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-[#111] text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {activeTab === "projects" && <ProjectsAdmin token={token} />}
        {activeTab === "recommendations" && (
          <RecommendationsAdmin token={token} />
        )}
        {activeTab === "blog" && <BlogAdmin token={token} />}
        {activeTab === "bucketlist" && <BucketListAdmin token={token} />}
        {activeTab === "guestbook" && <GuestbookAdmin token={token} />}
        {activeTab === "contacts" && <ContactsAdmin token={token} />}
        {activeTab === "visitors" && <VisitorsAdmin token={token} />}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PROJECTS ADMIN TAB
   ───────────────────────────────────────────── */
const ProjectsAdmin = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const sortProjectsByPriority = (items) => {
    return [...items].sort((a, b) => {
      const aPriority = Number.isFinite(Number(a.priority)) ? Number(a.priority) : 0;
      const bPriority = Number.isFinite(Number(b.priority)) ? Number(b.priority) : 0;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return (a.title || "").localeCompare(b.title || "");
    });
  };

  const fetchProjects = async () => {
    try {
      const { data } = await axios.get(`${API}/api/projects`);
      setProjects(sortProjectsByPriority(data));
    } catch {
      setProjects([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      await axios.delete(`${API}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const { data } = await axios.patch(
        `${API}/api/projects/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? data : p))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Toggle failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Manage Projects
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            {projects.length} total projects
          </p>
        </div>
        <button
          onClick={() => {
            setShowAddPanel(!showAddPanel);
            setEditingProject(null);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-light text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
        >
          {showAddPanel ? <X size={16} /> : <Plus size={16} />}
          {showAddPanel ? "Close" : "Add New"}
        </button>
      </div>

      {/* Add/Edit Panel */}
      <AnimatePresence>
        {showAddPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            className="overflow-hidden mb-8"
            transition={{ duration: 0.3 }}
          >
            <AddProject
              token={token}
              editingProject={editingProject}
              onSaved={(project) => {
                if (editingProject) {
                  setProjects((prev) =>
                    sortProjectsByPriority(prev.map((p) => (p._id === project._id ? project : p)))
                  );
                } else {
                  setProjects((prev) => sortProjectsByPriority([project, ...prev]));
                }
                setShowAddPanel(false);
                setEditingProject(null);
              }}
              onCancel={() => {
                setShowAddPanel(false);
                setEditingProject(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <Briefcase size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
          <p>No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-4 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all group"
            >
              <div className="flex items-start gap-3 w-full sm:w-auto">
                {/* Project Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-white/5">
                  {project.image ? (
                    <img
                      src={projectThumbUrl(project)}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase size={24} className="text-gray-300 dark:text-white/25" />
                    </div>
                  )}
                </div>

                {/* Mobile-only actions (top-right) */}
                <div className="flex items-center gap-1 sm:hidden ml-auto">
                  <button
                    onClick={() => handleToggleActive(project._id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  >
                    {project.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProject(project);
                      setShowAddPanel(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-accent hover:bg-accent/10 transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/50 rounded-full">
                    Priority {project.priority ?? 0}
                  </span>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent/10 text-accent rounded-full">
                    {project.category}
                  </span>
                  <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 rounded-full">
                    {project.quarter}
                  </span>
                  {!project.isActive && (
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-white/50 mt-1 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {project.tags?.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/60 rounded-full"
                    >
                      <img src={tag.icon} alt={tag.name} className="w-2.5 h-2.5" />
                      {tag.name}
                    </span>
                  ))}
                  {project.tags?.length > 3 && (
                    <span className="text-[10px] text-gray-400 dark:text-white/40">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Desktop Actions */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={() => handleToggleActive(project._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  title={project.isActive ? "Hide project" : "Show project"}
                >
                  {project.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                </button>
                <button
                  onClick={() => {
                    setEditingProject(project);
                    setShowAddPanel(true);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   ADD/EDIT PROJECT PANEL
   ───────────────────────────────────────────── */
const AddProject = ({ token, editingProject, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    quarter: "",
    priority: 0,
    description: "",
    longDescription: "",
    outcome: "",
    link: "",
    github: "",
    isActive: true,
  });

  const [tags, setTags] = useState([]);
  const [features, setFeatures] = useState([]);
  const [techStack, setTechStack] = useState([]);
  const [challenges, setChallenges] = useState([]);
  
  const [mainImage, setMainImage] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Current editing states for arrays
  const [currentTag, setCurrentTag] = useState({ name: "", icon: "" });
  const [currentFeature, setCurrentFeature] = useState({ title: "", description: "" });
  const [currentTech, setCurrentTech] = useState({ name: "", url: "", description: "" });
  const [currentChallenge, setCurrentChallenge] = useState({ title: "", description: "" });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title || "",
        slug: editingProject.slug || "",
        category: editingProject.category || "",
        quarter: editingProject.quarter || "",
        priority: editingProject.priority ?? 0,
        description: editingProject.description || "",
        longDescription: editingProject.longDescription || "",
        outcome: editingProject.outcome || "",
        link: editingProject.link || "",
        github: editingProject.github || "",
        isActive: editingProject.isActive ?? true,
      });
      setTags(editingProject.tags || []);
      setFeatures(editingProject.features || []);
      setTechStack(editingProject.techStack || []);
      setChallenges(editingProject.challenges || []);
    }
  }, [editingProject]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const projectData = {
        ...formData,
        priority: Math.max(0, Number(formData.priority) || 0),
        tags,
        features,
        techStack,
        challenges,
      };

      const formPayload = new FormData();
      formPayload.append("data", JSON.stringify(projectData));

      if (mainImage) {
        formPayload.append("image", mainImage);
      }

      screenshots.forEach((file) => {
        formPayload.append("screenshots", file);
      });

      const url = editingProject
        ? `${API}/api/projects/${editingProject._id}`
        : `${API}/api/projects`;
      
      const method = editingProject ? "put" : "post";

      const { data } = await axios[method](url, formPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onSaved(data);
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    }
    setSubmitting(false);
  };

  const addTag = () => {
    if (currentTag.name && currentTag.icon) {
      setTags((prev) => [...prev, currentTag]);
      setCurrentTag({ name: "", icon: "" });
    }
  };

  const addFeature = () => {
    if (currentFeature.title && currentFeature.description) {
      setFeatures((prev) => [...prev, currentFeature]);
      setCurrentFeature({ title: "", description: "" });
    }
  };

  const addTech = () => {
    if (currentTech.name) {
      setTechStack((prev) => [...prev, currentTech]);
      setCurrentTech({ name: "", url: "", description: "" });
    }
  };

  const addChallenge = () => {
    if (currentChallenge.title && currentChallenge.description) {
      setChallenges((prev) => [...prev, currentChallenge]);
      setCurrentChallenge({ title: "", description: "" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-accent/5 via-purple-500/5 to-pink-500/5 border border-accent/20"
    >
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
        {editingProject ? "Edit Project" : "Add New Project"}
      </h3>

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="Project name"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="Auto-generated from title"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="E-COMMERCE, MOBILE APP, etc."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Quarter *
            </label>
            <input
              type="text"
              name="quarter"
              value={formData.quarter}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="Q1 2025"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Priority (lower = higher)
            </label>
            <input
              type="number"
              name="priority"
              min="0"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="0"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Short Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={2}
            className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
            placeholder="Brief one-line description"
          />
        </div>

        {/* Long Description */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Long Description *
          </label>
          <textarea
            name="longDescription"
            value={formData.longDescription}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
            placeholder="Detailed project description"
          />
        </div>

        {/* Outcome */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Outcome
          </label>
          <textarea
            name="outcome"
            value={formData.outcome}
            onChange={handleInputChange}
            rows={2}
            className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
            placeholder="What was achieved"
          />
        </div>

        {/* Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Live Link
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="https://project.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              GitHub Link
            </label>
            <input
              type="url"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-accent/40 transition-colors"
              placeholder="https://github.com/..."
            />
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-accent/10 file:text-accent hover:file:bg-accent/20 file:cursor-pointer focus:outline-none transition-colors"
            />
            {editingProject?.image && !mainImage && (
              <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                Current: {editingProject.image}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
              Screenshots (Multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setScreenshots(Array.from(e.target.files))}
              className="w-full px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-accent/10 file:text-accent hover:file:bg-accent/20 file:cursor-pointer focus:outline-none transition-colors"
            />
            {screenshots.length > 0 && (
              <p className="text-xs text-gray-400 dark:text-white/40 mt-1">
                {screenshots.length} file(s) selected
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Technologies / Tags
          </label>
          <div className="flex flex-col sm:flex-row gap-2 mb-2">
            <input
              type="text"
              value={currentTag.name}
              onChange={(e) => setCurrentTag({ ...currentTag, name: e.target.value })}
              placeholder="Tag name (e.g., REACT)"
              className="flex-1 px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
            />
            <input
              type="url"
              value={currentTag.icon}
              onChange={(e) => setCurrentTag({ ...currentTag, icon: e.target.value })}
              placeholder="Icon URL"
              className="flex-1 px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium rounded-lg transition-colors shrink-0"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs text-gray-700 dark:text-white/70 rounded-lg"
              >
                <img src={tag.icon} alt={tag.name} className="w-3 h-3" />
                {tag.name}
                <button
                  type="button"
                  onClick={() => setTags((prev) => prev.filter((_, i) => i !== idx))}
                  className="ml-1 text-gray-400 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Key Features
          </label>
          <div className="space-y-2 mb-2">
            <input
              type="text"
              value={currentFeature.title}
              onChange={(e) => setCurrentFeature({ ...currentFeature, title: e.target.value })}
              placeholder="Feature title"
              className="w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={currentFeature.description}
                onChange={(e) => setCurrentFeature({ ...currentFeature, description: e.target.value })}
                placeholder="Feature description"
                rows={2}
                className="flex-1 px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium rounded-lg transition-colors h-fit shrink-0"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                      {feature.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFeatures((prev) => prev.filter((_, i) => i !== idx))}
                    className="ml-2 text-gray-400 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Tech Stack
          </label>
          <div className="space-y-2 mb-2">
            <input
              type="text"
              value={currentTech.name}
              onChange={(e) => setCurrentTech({ ...currentTech, name: e.target.value })}
              placeholder="Technology name"
              className="w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
            />
            <input
              type="url"
              value={currentTech.url}
              onChange={(e) => setCurrentTech({ ...currentTech, url: e.target.value })}
              placeholder="URL (optional)"
              className="w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={currentTech.description}
                onChange={(e) => setCurrentTech({ ...currentTech, description: e.target.value })}
                placeholder="Description (optional)"
                rows={2}
                className="flex-1 px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
              />
              <button
                type="button"
                onClick={addTech}
                className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium rounded-lg transition-colors h-fit shrink-0"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {techStack.map((tech, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                      {tech.name}
                      {tech.url && (
                        <a
                          href={tech.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-accent hover:underline"
                        >
                          <LinkIcon size={10} className="inline" />
                        </a>
                      )}
                    </h4>
                    {tech.description && (
                      <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                        {tech.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setTechStack((prev) => prev.filter((_, i) => i !== idx))}
                    className="ml-2 text-gray-400 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2">
            Challenges & Solutions
          </label>
          <div className="space-y-2 mb-2">
            <input
              type="text"
              value={currentChallenge.title}
              onChange={(e) => setCurrentChallenge({ ...currentChallenge, title: e.target.value })}
              placeholder="Challenge title"
              className="w-full px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <textarea
                value={currentChallenge.description}
                onChange={(e) => setCurrentChallenge({ ...currentChallenge, description: e.target.value })}
                placeholder="How you solved it"
                rows={2}
                className="flex-1 px-3 py-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-none focus:border-accent/40"
              />
              <button
                type="button"
                onClick={addChallenge}
                className="px-4 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium rounded-lg transition-colors h-fit shrink-0"
              >
                Add
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="p-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                      {challenge.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-white/60 mt-1">
                      {challenge.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChallenges((prev) => prev.filter((_, i) => i !== idx))}
                    className="ml-2 text-gray-400 hover:text-red-400"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-light disabled:opacity-50 text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={16} />
                {editingProject ? "Update Project" : "Create Project"}
              </>
            )}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-white/70 font-medium rounded-xl transition-colors text-center"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

/* ─────────────────────────────────────────────
   RECOMMENDATIONS ADMIN TAB
   ───────────────────────────────────────────── */
const RecommendationsAdmin = ({ token }) => {
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
        headers: { Authorization: `Bearer ${token}` },
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Manage Recommendations
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            {recs.length} total recommendations
          </p>
        </div>
        <button
          onClick={() => setShowAddPanel(!showAddPanel)}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-light text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
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
            animate={{ opacity: 1, height: "auto", overflow: "visible" }}
            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
            className="overflow-hidden mb-8"
            transition={{ duration: 0.3 }}
          >
            <AddRecommendation
              token={token}
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
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : recs.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <Film size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
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
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all group"
              >
                {/* Poster thumb */}
                <div className="w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-white/5">
                  {rec.poster && rec.poster !== "N/A" ? (
                    <img
                      src={recThumbUrl(rec)}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon size={16} className="text-gray-300 dark:text-white/25" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {rec.title}
                    </h3>
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-accent/10 text-accent rounded-full">
                      {rec.type}
                    </span>
                    {rec.category && rec.category !== "general" && (
                      <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 rounded-full">
                        {rec.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-white/40">
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
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
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
const AddRecommendation = ({ token, onAdded }) => {
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

      const { data } = await axios.post(`${API}/api/recommendations`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAdded(data);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add");
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-300 dark:border-white/10">
      {/* Type selector */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold">
          Type:
        </span>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-xl">
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
                    : "text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
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
              : "bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gray-500 dark:hover:text-white/50"
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
              className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40"
            />
            <input
              type="text"
              placeholder="Year"
              value={manualYear}
              onChange={(e) => setManualYear(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40"
            />
            <input
              type="text"
              placeholder="Poster URL"
              value={manualPoster}
              onChange={(e) => setManualPoster(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40"
            />
            <input
              type="text"
              placeholder="Genre"
              value={manualGenre}
              onChange={(e) => setManualGenre(e.target.value)}
              className="px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40"
            />
          </div>
          <textarea
            placeholder="Plot / Description"
            value={manualPlot}
            onChange={(e) => setManualPlot(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 resize-none"
          />
        </div>
      ) : (
        /* OMDB Search */
        <div className="relative mb-6">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40"
          />
          <input
            type="text"
            placeholder={`Search for a ${selectedType}...`}
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 transition-colors"
          />

          {/* Search results dropdown */}
          {(searchResults.length > 0 || searching) && (
            <div className="absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-xl bg-white dark:bg-[#111] border border-gray-300 dark:border-white/10 shadow-xl z-20 custom-scrollbar">
              {searching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2
                    size={20}
                    className="animate-spin text-gray-400 dark:text-white/40"
                  />
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.imdbID}
                    onClick={() => handleSelect(item)}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100 dark:bg-white/5">
                      {item.Poster && item.Poster !== "N/A" ? (
                        <img
                          src={optimizeCloudinaryUrl(item.Poster, { width: 240, height: 360, crop: "fill" })}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film size={14} className="text-gray-300 dark:text-white/25" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.Title}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-white/40">
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
          className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] mb-6"
        >
          <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0">
            {(details?.Poster || selected.Poster) !== "N/A" ? (
              <img
                src={optimizeCloudinaryUrl(details?.Poster || selected.Poster, { width: 400, height: 600, crop: "fill" })}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            {loadingDetails ? (
              <Loader2
                size={16}
                className="animate-spin text-gray-400 dark:text-white/40 mt-2"
              />
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {details?.Title || selected.Title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5">
                  {details?.Year || selected.Year}
                  {details?.Runtime && ` • ${details.Runtime}`}
                  {details?.imdbRating && ` • ⭐ ${details.imdbRating}`}
                </p>
                {details?.Genre && (
                  <p className="text-xs text-gray-400 dark:text-white/40 mt-1">{details.Genre}</p>
                )}
                {details?.Plot && (
                  <p className="text-xs text-gray-400 dark:text-white/40 mt-2 line-clamp-2">
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
        <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-white/[0.06]">
          {/* My Rating */}
          <div>
            <label className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold mb-2 block">
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
                        : "text-gray-200 dark:text-white/15 hover:text-gray-400"
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
            <label className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold mb-2 block">
              Your Review (optional)
            </label>
            <textarea
              value={myReview}
              onChange={(e) => setMyReview(e.target.value)}
              placeholder="Why do you recommend this?"
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold mb-2 block">
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
                      : "bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gray-500 dark:hover:text-white/50"
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
            className="flex items-center justify-center gap-2 w-full py-3 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 dark:text-white font-medium rounded-xl transition-colors"
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
   GUESTBOOK ADMIN TAB
   ───────────────────────────────────────────── */
const GuestbookAdmin = ({ token }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const { data } = await axios.get(`${API}/api/guestbook/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEntries(data);
      } catch {
        setEntries([]);
      }
      setLoading(false);
    };
    fetchEntries();
  }, [token]);

  const handleToggleApproval = async (entry) => {
    try {
      const { data } = await axios.patch(
        `${API}/api/guestbook/${entry._id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEntries((prev) =>
        prev.map((e) => (e._id === entry._id ? data : e))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this guestbook entry?")) return;
    try {
      await axios.delete(`${API}/api/guestbook/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const approvedCount = entries.filter((e) => e.approved).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Guestbook Entries
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            {entries.length} total · {approvedCount} approved · {entries.length - approvedCount} hidden
          </p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
          <p>No guestbook entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <motion.div
              key={entry._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white dark:bg-[#111] border transition-all group ${
                entry.approved
                  ? "border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10"
                  : "border-red-500/10 opacity-60"
              }`}
            >
              {/* Avatar */}
              <img
                src={optimizeCloudinaryUrl(entry.avatar, { width: 80, height: 80, crop: "fill" })}
                alt={entry.name}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 dark:bg-white/5 shrink-0 mt-0.5"
                loading="lazy"
                decoding="async"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {entry.name}
                  </span>
                  <span className="text-[11px] text-gray-300 dark:text-white/25">
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {!entry.approved && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed">
                  {entry.message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  onClick={() => handleToggleApproval(entry)}
                  className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                    entry.approved
                      ? "text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-400/10"
                      : "text-gray-300 dark:text-white/25 hover:text-emerald-400 hover:bg-emerald-400/10"
                  }`}
                  title={entry.approved ? "Hide entry" : "Approve entry"}
                >
                  {entry.approved ? <Eye size={14} /> : <CheckCircle2 size={14} />}
                </button>
                <button
                  onClick={() => handleDelete(entry._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   VISITORS ADMIN TAB
   ───────────────────────────────────────────── */
const VisitorsAdmin = ({ token }) => {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({ total: 0, named: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const { data } = await axios.get(
        `${API}/api/visitors`,
        { headers: { Authorization: `Bearer ${token}` } }
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
                <span className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold">
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
      <h3 className="text-lg font-bold text-gray-900 dark:text-white font-display mb-4">
        Recent Visitors
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : visitors.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <Users size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
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
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all"
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                  v.name && v.name !== "Anonymous"
                    ? "bg-accent/10 border border-accent/20"
                    : "bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10"
                }`}
              >
                <span
                  className={`text-sm font-bold ${
                    v.name && v.name !== "Anonymous"
                      ? "text-accent"
                      : "text-gray-400 dark:text-white/40"
                  }`}
                >
                  {v.name && v.name !== "Anonymous"
                    ? v.name.charAt(0).toUpperCase()
                    : "?"}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {v.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400 dark:text-white/40 flex-wrap">
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
              <span className="hidden md:block text-[11px] text-gray-300 dark:text-white/25 font-mono">
                {v.ip}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   BLOG ADMIN TAB
   ───────────────────────────────────────────── */
const BlogAdmin = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [readTime, setReadTime] = useState("");
  const [published, setPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`${API}/api/blog/admin`, authHeaders);
      setPosts(data);
    } catch {
      setPosts([]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setTitle(""); setSlug(""); setExcerpt(""); setContent("");
    setTagsInput(""); setCoverImage(""); setReadTime(""); setPublished(true);
    setEditing(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (post) => {
    setEditing(post._id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content || "");
    setTagsInput((post.tags || []).join(", "));
    setCoverImage(post.coverImage || "");
    setReadTime(post.readTime || "");
    setPublished(post.published);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !excerpt.trim()) return alert("Title and excerpt are required");
    setSubmitting(true);
    try {
      const body = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim(),
        content,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        coverImage,
        readTime: readTime.trim(),
        published,
      };

      if (editing) {
        const { data } = await axios.put(`${API}/api/blog/${editing}`, body, authHeaders);
        setPosts((prev) => prev.map((p) => (p._id === editing ? data : p)));
      } else {
        const { data } = await axios.post(`${API}/api/blog`, body, authHeaders);
        setPosts((prev) => [data, ...prev]);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save post");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog post?")) return;
    try {
      await axios.delete(`${API}/api/blog/${id}`, authHeaders);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const togglePublish = async (post) => {
    try {
      const { data } = await axios.put(
        `${API}/api/blog/${post._id}`,
        { published: !post.published },
        authHeaders
      );
      setPosts((prev) => prev.map((p) => (p._id === post._id ? data : p)));
    } catch {
      alert("Failed to toggle");
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">Manage Blog</h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">{posts.length} posts</p>
        </div>
        <button
          onClick={() => (showForm ? (setShowForm(false), resetForm()) : openAddForm())}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-light text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "New Post"}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-300 dark:border-white/10 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Slug (auto-generated if empty)" value={slug} onChange={(e) => setSlug(e.target.value)} className={inputClass} />
              </div>
              <textarea placeholder="Excerpt / Summary *" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className={`${inputClass} resize-none`} />
              <textarea placeholder="Full content (Markdown supported)" value={content} onChange={(e) => setContent(e.target.value)} rows={8} className={`${inputClass} resize-none font-mono text-xs`} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="text" placeholder="Tags (comma-separated)" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Cover Image URL" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClass} />
                <input type="text" placeholder="Read time (e.g. 5 min read)" value={readTime} onChange={(e) => setReadTime(e.target.value)} className={inputClass} />
              </div>
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setPublished(!published)}
                  className={`flex items-center gap-2 text-sm transition-colors ${published ? "text-emerald-400" : "text-gray-400 dark:text-white/40"}`}
                >
                  {published ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !title.trim() || !excerpt.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editing ? "Update Post" : "Publish Post"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <FileText size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
          <p>No blog posts yet. Write your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <motion.div
              key={post._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all group"
            >
              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full shrink-0 ${post.published ? "bg-emerald-400" : "bg-white/20"}`} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{post.title}</h3>
                  {!post.published && (
                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 rounded-full">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-white/40">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {post.readTime && (
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                  )}
                  {post.tags?.length > 0 && (
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <Tag size={10} />
                      {post.tags.join(", ")}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => togglePublish(post)}
                  className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
                    post.published
                      ? "text-emerald-400/50 hover:text-emerald-400 hover:bg-emerald-400/10"
                      : "text-gray-300 dark:text-white/25 hover:text-gray-500 dark:hover:text-white/50 hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                  title={post.published ? "Unpublish" : "Publish"}
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => openEditForm(post)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-accent hover:bg-accent/10 transition-all"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   BUCKET LIST ADMIN TAB
   ───────────────────────────────────────────── */
const bucketCategoryIcons = {
  travel: Plane,
  learning: BookOpen,
  adventure: Mountain,
  tech: Code,
  music: Music,
  photography: Camera,
  food: Utensils,
  fitness: Dumbbell,
  other: ListChecks,
};

const bucketCategories = [
  "travel", "learning", "adventure", "tech", "music", "photography", "food", "fitness", "other",
];

const BucketListAdmin = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form state
  const [itemTitle, setItemTitle] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemCategory, setItemCategory] = useState("other");
  const [itemCompleted, setItemCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await axios.get(`${API}/api/bucketlist`);
      setItems(data);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setItemTitle(""); setItemDesc(""); setItemCategory("other"); setItemCompleted(false); setEditing(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditing(item._id);
    setItemTitle(item.title);
    setItemDesc(item.description || "");
    setItemCategory(item.category || "other");
    setItemCompleted(item.completed);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!itemTitle.trim()) return alert("Title is required");
    setSubmitting(true);
    try {
      const body = {
        title: itemTitle.trim(),
        description: itemDesc.trim(),
        category: itemCategory,
        completed: itemCompleted,
      };

      if (editing) {
        const { data } = await axios.put(`${API}/api/bucketlist/${editing}`, body, authHeaders);
        setItems((prev) => prev.map((it) => (it._id === editing ? data : it)));
      } else {
        const { data } = await axios.post(`${API}/api/bucketlist`, body, authHeaders);
        setItems((prev) => [...prev, data]);
      }
      setShowForm(false);
      resetForm();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save");
    }
    setSubmitting(false);
  };

  const handleToggle = async (item) => {
    try {
      const { data } = await axios.patch(`${API}/api/bucketlist/${item._id}/toggle`, {}, authHeaders);
      setItems((prev) => prev.map((it) => (it._id === item._id ? data : it)));
    } catch {
      alert("Failed to toggle");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this bucket list item?")) return;
    try {
      await axios.delete(`${API}/api/bucketlist/${id}`, authHeaders);
      setItems((prev) => prev.filter((it) => it._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const completedCount = items.filter((i) => i.completed).length;
  const inputClass =
    "w-full px-4 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:border-accent/40 transition-colors";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">Manage Bucket List</h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            {completedCount}/{items.length} completed
          </p>
        </div>
        <button
          onClick={() => (showForm ? (setShowForm(false), resetForm()) : openAddForm())}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-light text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Close" : "Add Item"}
        </button>
      </div>

      {/* Progress */}
      {items.length > 0 && (
        <div className="mb-6 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 dark:text-white/40">Progress</span>
            <span className="text-xs font-semibold text-accent">
              {Math.round((completedCount / items.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-purple-500 transition-all duration-500"
              style={{ width: `${(completedCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-300 dark:border-white/10 space-y-4">
              <input type="text" placeholder="What do you want to do? *" value={itemTitle} onChange={(e) => setItemTitle(e.target.value)} className={inputClass} />
              <input type="text" placeholder="Description (optional)" value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} className={inputClass} />

              {/* Category pills */}
              <div>
                <label className="text-xs text-gray-400 dark:text-white/40 uppercase tracking-wider font-semibold mb-2 block">Category</label>
                <div className="flex gap-2 flex-wrap">
                  {bucketCategories.map((cat) => {
                    const CatIcon = bucketCategoryIcons[cat] || Circle;
                    return (
                      <button
                        key={cat}
                        onClick={() => setItemCategory(cat)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                          itemCategory === cat
                            ? "bg-accent/10 border-accent/30 text-accent"
                            : "bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-gray-500 dark:hover:text-white/50"
                        }`}
                      >
                        <CatIcon size={10} />
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setItemCompleted(!itemCompleted)}
                  className={`flex items-center gap-2 text-sm transition-colors ${itemCompleted ? "text-emerald-400" : "text-gray-400 dark:text-white/40"}`}
                >
                  {itemCompleted ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  {itemCompleted ? "Completed" : "Pending"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !itemTitle.trim()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-gray-900 dark:text-white text-sm font-medium rounded-xl transition-colors"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  {editing ? "Update" : "Add Item"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <ListChecks size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
          <p>No bucket list items yet. Add your first goal!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const CatIcon = bucketCategoryIcons[item.category] || Circle;
            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all group ${
                  item.completed ? "opacity-60" : ""
                }`}
              >
                {/* Toggle check */}
                <button onClick={() => handleToggle(item)} className="shrink-0">
                  {item.completed ? (
                    <CheckCircle2 size={20} className="text-accent" />
                  ) : (
                    <Circle size={20} className="text-gray-200 dark:text-white/15 hover:text-gray-400 transition-colors" />
                  )}
                </button>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className={`text-sm font-medium ${item.completed ? "text-gray-400 dark:text-white/40 line-through" : "text-gray-900 dark:text-white"}`}>
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-gray-300 dark:text-white/25 mt-0.5 truncate">{item.description}</p>
                  )}
                </div>

                {/* Category badge */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-300 dark:text-white/25 bg-gray-100 dark:bg-white/5 rounded-full shrink-0">
                  <CatIcon size={9} />
                  {item.category}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditForm(item)}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-accent hover:bg-accent/10 transition-all"
                  >
                    <Edit3 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   CONTACTS ADMIN TAB
   ───────────────────────────────────────────── */
const ContactsAdmin = ({ token }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const { data } = await axios.get(`${API}/api/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(data);
      } catch {
        setSubmissions([]);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await axios.delete(`${API}/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmissions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-display">
            Contact Submissions
          </h2>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
            {submissions.length} total
          </p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-gray-400 dark:text-white/40">
          <Mail size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
          <p>No contact submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <motion.div
              key={sub._id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  {/* Name & email */}
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {sub.name}
                    </span>
                    <a
                      href={`mailto:${sub.email}`}
                      className="text-xs text-accent hover:underline truncate"
                    >
                      {sub.email}
                    </a>
                    {sub.emailSent ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 rounded-full flex items-center gap-1">
                        <Check size={10} /> Email Sent
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-400 rounded-full">
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-sm text-gray-500 dark:text-white/60 leading-relaxed whitespace-pre-wrap">
                    {sub.message}
                  </p>

                  {/* Date */}
                  <p className="text-[11px] text-gray-300 dark:text-white/25 mt-2">
                    {new Date(sub.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 dark:text-white/25 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Admin;
