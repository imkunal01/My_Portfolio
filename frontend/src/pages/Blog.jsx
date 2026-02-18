import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Placeholder blog posts — connect to backend/CMS later
const blogPosts = [
  {
    id: 1,
    slug: "getting-started-with-nextjs-15",
    title: "Getting Started with Next.js 15",
    excerpt:
      "A comprehensive guide to building modern web applications with the latest features in Next.js 15, including Server Components and PPR.",
    date: "2025-12-15",
    readTime: "8 min read",
    tags: ["Next.js", "React", "Web Dev"],
    coverImage: "",
  },
  {
    id: 2,
    slug: "building-scalable-apis-with-node",
    title: "Building Scalable APIs with Node.js",
    excerpt:
      "Learn best practices for designing and building REST APIs that can handle millions of requests with proper error handling and authentication.",
    date: "2025-11-20",
    readTime: "12 min read",
    tags: ["Node.js", "API", "Backend"],
    coverImage: "",
  },
  {
    id: 3,
    slug: "react-native-vs-flutter",
    title: "React Native vs Flutter in 2025",
    excerpt:
      "A detailed comparison of the two most popular cross-platform mobile development frameworks. Which one should you choose?",
    date: "2025-10-05",
    readTime: "10 min read",
    tags: ["Mobile", "React Native", "Flutter"],
    coverImage: "",
  },
];

const Blog = () => {
  const navigate = useNavigate();
  const [selectedTag, setSelectedTag] = useState(null);

  const allTags = [...new Set(blogPosts.flatMap((p) => p.tags))];
  const filtered = selectedTag
    ? blogPosts.filter((p) => p.tags.includes(selectedTag))
    : blogPosts;

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
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Blog
          </h1>
          <p className="text-lg text-white/50">
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
                : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
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
                  : "bg-white/5 border-white/5 text-white/40 hover:text-white/70"
              }`}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Posts */}
        <div className="space-y-6">
          {filtered.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              className="group rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="p-6 lg:p-8">
                {/* Meta */}
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center gap-1.5 text-xs text-white/30">
                    <Calendar size={12} />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/30">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl lg:text-2xl font-bold font-display text-white mb-3 group-hover:text-accent transition-colors duration-300">
                  {post.title}
                </h2>

                {/* Excerpt */}
                <p className="text-sm text-white/40 leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/30 bg-white/5 rounded-full"
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

        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            No posts found for this tag.
          </div>
        )}

        {/* Coming soon note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/5 border border-accent/10 text-xs text-accent">
            More posts coming soon — admin panel in progress
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Blog;
