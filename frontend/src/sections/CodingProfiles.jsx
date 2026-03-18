import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowUpRight, Code2, Trophy, BarChart3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { codingProfiles } from "../data/portfolio";

const API = import.meta.env.VITE_BACKEND_URL || "";

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
  const [liveProfiles, setLiveProfiles] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const profiles = useMemo(() => {
    const defaults = codingProfiles.platforms || [];

    if (!liveProfiles) return defaults;

    return defaults.map((platform) => {
      const live = liveProfiles[platform.key];
      if (!live?.success || !live.data) {
        return {
          ...platform,
          source: "fallback",
        };
      }

      return {
        ...platform,
        ...live.data,
      };
    });
  }, [liveProfiles]);

  useEffect(() => {
    const usernameMap = (codingProfiles.platforms || []).reduce((acc, platform) => {
      acc[platform.key] = platform.username;
      return acc;
    }, {});

    const fetchLiveProfiles = async () => {
      try {
        const { data } = await axios.get(`${API}/api/coding-profiles/live`, {
          params: {
            github: usernameMap.github,
            leetcode: usernameMap.leetcode,
            codechef: usernameMap.codechef,
            gfg: usernameMap.gfg,
          },
        });

        setLiveProfiles(data.platforms || null);
        setUpdatedAt(data.updatedAt || null);
      } catch {
        setLiveProfiles(null);
      }
    };

    fetchLiveProfiles();
    const interval = setInterval(fetchLiveProfiles, 5 * 60 * 1000);
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
        <span className="section-label">Coding Journey</span>
        <h2 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight">
          <span className="gradient-text">Problem Solving</span>{" "}
          <span className="text-gray-900 dark:text-white">Profiles</span>
        </h2>
        <p className="mt-4 text-sm text-gray-500 dark:text-white/60 max-w-3xl">
          Live coding activity across GitHub, LeetCode, CodeChef, and GeeksforGeeks. Usernames are taken from the data file and stats refresh automatically.
        </p>
        {updatedAt && (
          <p className="mt-2 text-xs text-gray-400 dark:text-white/40">
            Last synced: {new Date(updatedAt).toLocaleString()}
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6"
      >
        <div className="rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40">Platforms</p>
          <p className="mt-1 text-2xl font-bold font-display text-gray-900 dark:text-white">{profiles.length}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40">Total Solved</p>
          <p className="mt-1 text-2xl font-bold font-display text-accent">{totalSolved}</p>
        </div>
        <div className="rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-4">
          <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40">Update Source</p>
          <p className="mt-1 text-sm font-medium text-gray-600 dark:text-white/70">live platform data</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profiles.map((platform, index) => (
          <motion.div
            key={platform.key}
            initial={{ opacity: 0, y: 25 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            className="bento-card rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/[0.06] p-5 shadow-sm"
          >
            {(() => {
              const heatmapPoints = buildHeatmapPoints(platform);
              const unit = getHeatmapUnit(platform);
              return (
                <>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/[0.06] flex items-center justify-center shrink-0">
                  <img
                    src={platformLogos[platform.key]}
                    alt={platform.label}
                    className="w-6 h-6"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 dark:text-white/40">{platform.label}</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-white/80 mt-1 truncate">@{platform.username}</p>
                </div>
              </div>
              <a
                href={platform.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/[0.06] text-xs font-medium text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Visit
                <ArrowUpRight size={12} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-3">
                <div className="flex items-center gap-2 text-gray-400 dark:text-white/40 text-[10px] uppercase tracking-wider">
                  <Code2 size={12} />
                  {getPrimaryLabel(platform)}
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{platform.totalSolved}</p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-3">
                <div className="flex items-center gap-2 text-gray-400 dark:text-white/40 text-[10px] uppercase tracking-wider">
                  <Trophy size={12} />
                  {platform.metricLabel}
                </div>
                <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">{platform.metricValue}</p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.06] p-3">
              <div className="flex items-center gap-2 text-gray-400 dark:text-white/40 text-[10px] uppercase tracking-wider mb-2">
                <BarChart3 size={12} />
                Activity Heatmap
              </div>
              <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1.5">
                {heatmapPoints.map((point, idx) => (
                  <span
                    key={`${platform.key}-${idx}-${point.date}`}
                    className={`h-3 rounded-sm ${levelClass[getLevel(Number(point.level) || 0)]}`}
                    title={`${point.date || "Unknown date"}: ${point.count} ${unit}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-[10px] text-gray-400 dark:text-white/40">
                Hover cells to see daily {unit}
              </p>
            </div>

            {platform.source === "fallback" && (
              <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-300">
                Live data unavailable for this platform right now. Showing fallback values.
              </p>
            )}
                </>
              );
            })()}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CodingProfiles;
