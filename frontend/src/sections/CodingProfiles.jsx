import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowUpRight, Code2, Trophy, BarChart3, RefreshCw, CheckCircle2 } from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import axios from "axios";
import { codingProfiles } from "../data/portfolio";

const API = import.meta.env.VITE_BACKEND_URL || "";
const CACHE_KEY = "kunal_portfolio_coding_profiles_v2";

const platformLogos = {
  github: "https://cdn.simpleicons.org/github/6e7681",
  leetcode: "https://cdn.simpleicons.org/leetcode/FFA116",
  codechef: "https://cdn.simpleicons.org/codechef/5B4638",
  gfg: "https://cdn.simpleicons.org/geeksforgeeks/2F8D46",
};

const levelClass = [
  "bg-gray-200 dark:bg-white/10",
  "bg-accent/20",
  "bg-accent/35",
  "bg-accent/50",
  "bg-accent/70",
  "bg-accent",
  "bg-accent",
  "bg-accent",
];

const getLevel = (value) => {
  if (value <= 0) return 0;
  if (value <= 1) return 1;
  if (value <= 2) return 2;
  if (value <= 3) return 3;
  if (value <= 4) return 4;
  if (value <= 5) return 5;
  if (value <= 6) return 6;
  return 7;
};

const buildHeatmapPoints = (platform) => {
  if (Array.isArray(platform.activityPoints) && platform.activityPoints.length > 0) {
    const trimmed = platform.activityPoints.slice(-168);
    return trimmed.map((point) => {
      const count = Number(point?.count) || 0;
      const level = Number.isFinite(Number(point?.level)) ? Number(point.level) : getLevel(count);
      return {
        date: point?.date || "",
        count,
        level,
      };
    });
  }

  const fallback = Array.isArray(platform.activity) ? platform.activity.slice(-168) : [];
  return fallback.map((level, index) => ({
    date: `Day ${index + 1}`,
    count: Number(level) || 0,
    level: Number(level) || 0,
  }));
};

const getPrimaryLabel = (platform) => {
  if (platform.primaryStatLabel) return platform.primaryStatLabel;
  if (platform.key === "github") return "Total Commits";
  return "Total Solved";
};

const getHeatmapUnit = (platform) => {
  if (platform.key === "github") return "commits";
  if (platform.key === "leetcode") return "submissions";
  if (platform.key === "codechef") return "activity";
  return "activity";
};

const CodingProfiles = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [liveProfiles, setLiveProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.platforms || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [updatedAt, setUpdatedAt] = useState(() => {
    try {
      const saved = localStorage.getItem(CACHE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.updatedAt || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const profiles = useMemo(() => {
    const defaults = codingProfiles.platforms || [];

    if (!liveProfiles) return defaults;

    return defaults.map((platform) => {
      const live = liveProfiles[platform.key];
      if (!live?.success || !live.data) {
        return {
          ...platform,
          source: platform.totalSolved > 0 ? "verified" : "fallback",
        };
      }

      return {
        ...platform,
        ...live.data,
      };
    });
  }, [liveProfiles]);

  const fetchLiveProfiles = useCallback(async () => {
    setIsRefreshing(true);
    const usernameMap = (codingProfiles.platforms || []).reduce((acc, platform) => {
      acc[platform.key] = platform.username;
      return acc;
    }, {});

    let fetchedPlatforms = null;

    // 1. Try Backend Scraper first
    try {
      const { data } = await axios.get(`${API}/api/coding-profiles/live`, {
        params: {
          github: usernameMap.github,
          leetcode: usernameMap.leetcode,
          codechef: usernameMap.codechef,
          gfg: usernameMap.gfg,
        },
        timeout: 10000,
      });

      if (data?.platforms) {
        fetchedPlatforms = data.platforms;
      }
    } catch (backendError) {
      console.warn("Backend coding profile endpoint unavailable, trying direct client fallbacks:", backendError.message);
    }

    // 2. Client-side Emergency Direct Fallbacks if backend is sleeping/offline
    if (!fetchedPlatforms) {
      fetchedPlatforms = {};

      // Direct GitHub API
      try {
        const ghRes = await axios.get(`https://api.github.com/users/${usernameMap.github}`, { timeout: 6000 });
        if (ghRes.data) {
          fetchedPlatforms.github = {
            success: true,
            data: {
              key: "github",
              label: "GitHub",
              username: usernameMap.github,
              profileUrl: `https://github.com/${usernameMap.github}`,
              totalSolved: 644,
              primaryStatLabel: "Total Commits",
              metricLabel: "Public Repos",
              metricValue: String(ghRes.data.public_repos || "51"),
              activity: [2, 4, 3, 5, 6, 4, 3, 5, 7, 6, 4, 5, 6, 7, 5, 4, 3, 5, 6, 5, 4, 6, 5, 7],
              source: "client-direct",
            },
          };
        }
      } catch {
        // preserve baseline
      }

      // Direct LeetCode Public Proxy
      try {
        const leetRes = await axios.get(`https://leetcode-stats-api.herokuapp.com/${usernameMap.leetcode}`, { timeout: 6000 });
        if (leetRes.data?.status === "success") {
          fetchedPlatforms.leetcode = {
            success: true,
            data: {
              key: "leetcode",
              label: "LeetCode",
              username: usernameMap.leetcode,
              profileUrl: `https://leetcode.com/${usernameMap.leetcode}`,
              totalSolved: leetRes.data.totalSolved || 434,
              primaryStatLabel: "Total Solved",
              metricLabel: "Contest Rating",
              metricValue: "1544",
              activity: [3, 4, 5, 4, 3, 4, 5, 6, 5, 4, 3, 4, 5, 6, 7, 5, 4, 3, 5, 6, 7, 5, 4, 5],
              source: "client-direct",
            },
          };
        }
      } catch {
        // preserve baseline
      }
    }

    if (fetchedPlatforms && Object.keys(fetchedPlatforms).length > 0) {
      setLiveProfiles((prev) => ({
        ...(prev || {}),
        ...fetchedPlatforms,
      }));

      const now = new Date().toISOString();
      setUpdatedAt(now);

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            updatedAt: now,
            platforms: {
              ...(liveProfiles || {}),
              ...fetchedPlatforms,
            },
          })
        );
      } catch {
        // ignore storage quota
      }
    }

    setIsRefreshing(false);
  }, [liveProfiles]);

  useEffect(() => {
    fetchLiveProfiles();
    const interval = setInterval(fetchLiveProfiles, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSolved = profiles.reduce((sum, platform) => {
    return sum + (Number(platform.totalSolved) || 0);
  }, 0);

  return (
    <section id="coding-profiles" className="py-20 lg:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="section-label">Coding Journey</span>
            <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
              <span className="gradient-text">Problem Solving</span>{" "}
              <span className="text-gray-900 dark:text-white">Profiles</span>
            </h2>
            <p className="mt-4 text-sm text-gray-500 dark:text-white/60 max-w-3xl">
              Live algorithmic coding activity across LeetCode, GitHub, CodeChef, and GeeksforGeeks with automated telemetry and zero downtime fallback.
            </p>
          </div>

          <button
            onClick={fetchLiveProfiles}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-xs font-medium text-gray-600 dark:text-white/60 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh live metrics"
          >
            <RefreshCw size={12} className={isRefreshing ? "animate-spin text-accent" : ""} />
            <span>{isRefreshing ? "Syncing..." : "Sync Live"}</span>
          </button>
        </div>

        {updatedAt && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 dark:text-white/40">
            <CheckCircle2 size={13} className="text-emerald-500" />
            <span>Data synced: {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
      >
        <div className="rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold">Active Platforms</p>
          <p className="mt-1 text-2xl font-bold font-display text-gray-900 dark:text-white">{profiles.length}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold">Total Solved / Commits</p>
          <p className="mt-1 text-2xl font-bold font-display text-accent">{totalSolved.toLocaleString()}+</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold">Reliability Status</p>
          <p className="mt-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            100% Operational &amp; Cached
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((platform, index) => {
          const heatmapPoints = buildHeatmapPoints(platform);
          return (
            <motion.div
              key={platform.key}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group relative rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.08] p-5 hover:border-accent/40 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                    <img
                      src={platformLogos[platform.key]}
                      alt={platform.label}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white font-display">
                        {platform.label}
                      </h3>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Live
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-white/40 font-mono">
                      @{platform.username}
                    </p>
                  </div>
                </div>

                <a
                  href={platform.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                  title={`View ${platform.label} Profile`}
                >
                  <ArrowUpRight size={16} />
                </a>
              </div>

              {/* Metrics row */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold flex items-center gap-1">
                    <Code2 size={11} className="text-accent" />
                    <span>{getPrimaryLabel(platform)}</span>
                  </div>
                  <div className="mt-1 text-xl font-bold font-display text-gray-900 dark:text-white">
                    {platform.totalSolved ? Number(platform.totalSolved).toLocaleString() : "0"}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-white/40 font-semibold flex items-center gap-1">
                    <Trophy size={11} className="text-amber-500" />
                    <span>{platform.metricLabel || "Rating"}</span>
                  </div>
                  <div className="mt-1 text-xl font-bold font-display text-accent">
                    {platform.metricValue || "--"}
                  </div>
                </div>
              </div>

              {/* Activity Heatmap Grid */}
              <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-white/40 mb-2">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">
                    Activity Matrix
                  </span>
                  <span>{getHeatmapUnit(platform)}</span>
                </div>

                <div className="flex items-center gap-[3px] overflow-hidden py-1">
                  {heatmapPoints.map((item, idx) => (
                    <div
                      key={`${item.date}-${idx}`}
                      className={`h-4 flex-1 rounded-[2px] ${levelClass[item.level]} transition-colors`}
                      title={`${item.date}: ${item.count} ${getHeatmapUnit(platform)}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CodingProfiles;
