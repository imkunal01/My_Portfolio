import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag, Loader2, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL || "";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState(null);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${API}/api/blog`);
        setBlogPosts(data);
      } catch {
        setBlogPosts([]);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const allTags = [...new Set(blogPosts.flatMap((p) => p.tags || []))];
  const filtered = selectedTag
    ? blogPosts.filter((p) => (p.tags || []).includes(selectedTag))
    : blogPosts;

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
            Blog
          </span>
          <div className="w-16" />
        </div>
      </motion.div>

      <div className="pt-28 pb-20 px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-gray-500 dark:text-white/60">
            Thoughts on code, design, and building products.
          </p>
        </motion.div>

        {/* Tag filter */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
              !selectedTag
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full border transition-all ${
                selectedTag === tag
                  ? "bg-accent/10 border-accent/30 text-accent"
                  : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/[0.06] text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-gray-400 dark:text-white/40" />
          </div>
        ) : (
        <div className="space-y-6">
          {filtered.map((post, i) => (
            <motion.article
              key={post._id || post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className="group rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="p-6 lg:p-8">
                {/* Meta */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/40">
                    <Calendar size={12} />
                    {new Date(post.createdAt || post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  {post.readTime && (
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/40">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-xl lg:text-2xl font-bold font-display text-gray-900 dark:text-white mb-3 group-hover:text-accent transition-colors duration-300">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-gray-400 dark:text-white/40 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {(post.tags || []).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 bg-gray-100 dark:bg-white/5 rounded-full"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 dark:text-white/40">
            <FileText size={40} className="mx-auto mb-3 text-gray-200 dark:text-white/15" />
            <p>{selectedTag ? "No posts found for this tag." : "No blog posts yet. Check back soon!"}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
