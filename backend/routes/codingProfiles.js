const express = require("express");
const axios = require("axios");

const router = express.Router();

const DEFAULT_WEEKS = 24;
const DEFAULT_DAYS = DEFAULT_WEEKS * 7;

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const scaleToHeatmapLevels = (values, targetLength = DEFAULT_WEEKS) => {
  const normalized = Array.isArray(values) ? values.slice(-targetLength) : [];
  while (normalized.length < targetLength) normalized.unshift(0);

  const max = Math.max(...normalized, 0);
  if (max <= 0) return normalized.map(() => 0);

  return normalized.map((value) => {
    const level = Math.round((safeNumber(value) / max) * 7);
    return Math.max(0, Math.min(7, level));
  });
};

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildDailySeries = (entries, days = DEFAULT_DAYS) => {
  const countByDate = new Map();

  (entries || []).forEach((entry) => {
    const parsedDate = entry?.date instanceof Date ? entry.date : new Date(entry?.date);
    if (Number.isNaN(parsedDate.getTime())) return;

    const key = dateKey(parsedDate);
    countByDate.set(key, (countByDate.get(key) || 0) + safeNumber(entry?.count, 0));
  });

  const end = new Date();
  const series = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const d = new Date(end);
    d.setDate(end.getDate() - offset);
    const key = dateKey(d);
    series.push({
      date: key,
      count: countByDate.get(key) || 0,
    });
  }

  return series;
};

const withHeatLevels = (dailySeries) => {
  const levels = scaleToHeatmapLevels(
    dailySeries.map((item) => item.count),
    dailySeries.length || DEFAULT_DAYS
  );

  return dailySeries.map((item, index) => ({
    ...item,
    level: levels[index] ?? 0,
  }));
};

const weekBucketsFromDateCounts = (entries, weeks = DEFAULT_WEEKS) => {
  if (!Array.isArray(entries) || entries.length === 0) {
    return Array.from({ length: weeks }, () => 0);
  }

  const sorted = entries
    .map((entry) => ({
      date: entry.date instanceof Date ? entry.date : new Date(entry.date),
      count: safeNumber(entry.count),
    }))
    .filter((entry) => !Number.isNaN(entry.date.getTime()))
    .sort((a, b) => a.date - b.date);

  if (sorted.length === 0) return Array.from({ length: weeks }, () => 0);

  const windowDays = weeks * 7;
  const endDate = sorted[sorted.length - 1].date;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - windowDays + 1);

  const buckets = Array.from({ length: weeks }, () => 0);

  sorted.forEach((entry) => {
    if (entry.date < startDate || entry.date > endDate) return;
    const diffDays = Math.floor((entry.date - startDate) / (1000 * 60 * 60 * 24));
    const bucketIndex = Math.min(weeks - 1, Math.floor(diffDays / 7));
    buckets[bucketIndex] += entry.count;
  });

  return buckets;
};

const mapTimestampCalendarToEntries = (calendarObject = {}) => {
  return Object.entries(calendarObject).map(([timestamp, count]) => ({
    date: new Date(Number(timestamp) * 1000),
    count: safeNumber(count),
  }));
};

const flattenContributionEntries = (contributionsPayload) => {
  const entries = [];

  const visit = (node) => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    if (typeof node === "object") {
      if (node.date && node.count !== undefined) {
        entries.push({ date: node.date, count: safeNumber(node.count) });
      }

      Object.values(node).forEach(visit);
    }
  };

  visit(contributionsPayload);
  return entries;
};

const getRegexValue = (content, regex, group = 1, fallback = null) => {
  const match = content.match(regex);
  return match?.[group] ?? fallback;
};

const fetchGfgFromStatsCard = async (username) => {
  const encoded = encodeURIComponent(username);
  const { data: svg } = await axios.get(`https://gfgstatscard.vercel.app/${encoded}`, {
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const totalSolved = safeNumber(
    getRegexValue(svg, /id="total-solved-count"[^>]*>([^<]+)</i, 1, "0").replace(/[^0-9]/g, ""),
    0
  );

  const codingScore = safeNumber(
    getRegexValue(svg, /id="overall-score-count"[^>]*>([^<]+)</i, 1, "0").replace(/[^0-9]/g, ""),
    0
  );

  const streakText = getRegexValue(svg, /id="total-streak-text"[^>]*>([^<]+)</i, 1, "0/0");
  const streakParts = String(streakText).match(/(\d+)\s*\/\s*(\d+)/);
  const currentStreak = safeNumber(streakParts?.[1], 0);

  const activity = Array.from({ length: DEFAULT_WEEKS }, (_, index) => {
    const distanceFromEnd = DEFAULT_WEEKS - index;
    return distanceFromEnd <= currentStreak ? 3 : 0;
  });
  const activityEntries = activity.map((count, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (activity.length - 1 - index));
    return { date: day, count };
  });

  return {
    key: "gfg",
    label: "GeeksforGeeks",
    username,
    profileUrl: `https://www.geeksforgeeks.org/user/${username}`,
    totalSolved,
    primaryStatLabel: "Total Solved",
    metricLabel: "Coding Score",
    metricValue: String(codingScore || "--"),
    activity: scaleToHeatmapLevels(activity),
    activityPoints: withHeatLevels(buildDailySeries(activityEntries)),
    source: "live",
  };
};

const fetchGitHub = async (username) => {
  const [profileRes, contributionRes] = await Promise.all([
    axios.get(`https://api.github.com/users/${encodeURIComponent(username)}`, { timeout: 12000 }),
    axios.get(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, { timeout: 12000 }),
  ]);

  const contributionEntries = flattenContributionEntries(contributionRes.data?.contributions);
  const weeklyCounts = weekBucketsFromDateCounts(contributionEntries);
  const activityPoints = withHeatLevels(buildDailySeries(contributionEntries));
  const totalContributions = contributionEntries.reduce((sum, item) => sum + safeNumber(item.count), 0);

  return {
    key: "github",
    label: "GitHub",
    username,
    profileUrl: `https://github.com/${username}`,
    totalSolved: totalContributions,
    primaryStatLabel: "Total Commits",
    metricLabel: "Public Repos",
    metricValue: String(safeNumber(profileRes.data?.public_repos)),
    activity: scaleToHeatmapLevels(weeklyCounts),
    activityPoints,
    source: "live",
  };
};

const fetchLeetCode = async (username) => {
  const encoded = encodeURIComponent(username);

  const [solvedRes, contestRes, calendarRes] = await Promise.all([
    axios.get(`https://alfa-leetcode-api.onrender.com/${encoded}/solved`, { timeout: 15000 }),
    axios.get(`https://alfa-leetcode-api.onrender.com/${encoded}/contest`, { timeout: 15000 }),
    axios.get(`https://alfa-leetcode-api.onrender.com/${encoded}/calendar`, { timeout: 15000 }),
  ]);

  const calendarRaw = calendarRes.data?.submissionCalendar;
  const calendarObject = typeof calendarRaw === "string" ? JSON.parse(calendarRaw || "{}") : (calendarRaw || {});
  const calendarEntries = mapTimestampCalendarToEntries(calendarObject);
  const weeklyCounts = weekBucketsFromDateCounts(calendarEntries);
  const activityPoints = withHeatLevels(buildDailySeries(calendarEntries));

  return {
    key: "leetcode",
    label: "LeetCode",
    username,
    profileUrl: `https://leetcode.com/${username}`,
    totalSolved: safeNumber(solvedRes.data?.solvedProblem),
    primaryStatLabel: "Total Solved",
    metricLabel: "Contest Rating",
    metricValue: String(Math.round(safeNumber(contestRes.data?.contestRating))),
    activity: scaleToHeatmapLevels(weeklyCounts),
    activityPoints,
    source: "live",
  };
};

const fetchCodeChef = async (username) => {
  const { data: html } = await axios.get(`https://www.codechef.com/users/${encodeURIComponent(username)}`, {
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  const totalSolved = safeNumber(getRegexValue(html, /Total Problems Solved:\s*(\d+)/i, 1, "0"));
  const rating = safeNumber(getRegexValue(html, /class='rating'[^>]*>(\d+)\?/i, 1, "0"));
  const stars = safeNumber(getRegexValue(html, /(\d+)&#9733;/i, 1, "0"));

  const ratingHistoryValues = [...html.matchAll(/<a href='https:\/\/www\.codechef\.com\/ratings\/all' class='rating'>(\d+)\?/gi)]
    .map((match) => safeNumber(match[1]))
    .filter((value) => value > 0);

  const activityLevels = scaleToHeatmapLevels(ratingHistoryValues.length ? ratingHistoryValues : [0]);
  const activityEntries = activityLevels.map((count, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (activityLevels.length - 1 - index));
    return { date: day, count };
  });

  return {
    key: "codechef",
    label: "CodeChef",
    username,
    profileUrl: `https://www.codechef.com/users/${username}`,
    totalSolved,
    primaryStatLabel: "Total Solved",
    metricLabel: "Stars / Rating",
    metricValue: `${stars}★ / ${rating}`,
    activity: activityLevels,
    activityPoints: withHeatLevels(buildDailySeries(activityEntries)),
    source: "live",
  };
};

const fetchGfg = async (username) => {
  const encoded = encodeURIComponent(username);

  try {
    const { data } = await axios.get(`https://geeks-for-geeks-api.vercel.app/${encoded}`, {
      timeout: 15000,
    });

    if (data?.error) {
      throw new Error(data.error);
    }

    const totalSolved = safeNumber(
      data?.totalProblemsSolved ??
      data?.solvedStats?.total ??
      data?.stats?.totalSolved,
      0
    );

    const codingScore = safeNumber(
      data?.codingScore ??
      data?.info?.codingScore ??
      data?.stats?.codingScore,
      0
    );

    const activitySource = data?.submissionCalendar || data?.calendar || data?.activity || [];
    let activityValues = [];

    if (Array.isArray(activitySource)) {
      activityValues = activitySource.map((entry) => {
        if (typeof entry === "number") return entry;
        if (entry && typeof entry === "object") {
          return safeNumber(entry.count ?? entry.value ?? entry.submissions, 0);
        }
        return 0;
      });
    } else if (activitySource && typeof activitySource === "object") {
      activityValues = Object.values(activitySource).map((value) => safeNumber(value, 0));
    }

    return {
      key: "gfg",
      label: "GeeksforGeeks",
      username,
      profileUrl: `https://www.geeksforgeeks.org/user/${username}`,
      totalSolved,
      primaryStatLabel: "Total Solved",
      metricLabel: "Coding Score",
      metricValue: String(codingScore || "--"),
      activity: scaleToHeatmapLevels(activityValues.length ? activityValues : [0]),
      activityPoints: withHeatLevels(buildDailySeries(
        (activityValues.length ? activityValues : [0]).map((count, idx, arr) => {
          const day = new Date();
          day.setDate(day.getDate() - (arr.length - 1 - idx));
          return { date: day, count };
        })
      )),
      source: "live",
    };
  } catch (primaryError) {
    try {
      return await fetchGfgFromStatsCard(username);
    } catch (fallbackError) {
      throw new Error(
        `GFG primary failed (${primaryError.message}); fallback failed (${fallbackError.message})`
      );
    }
  }
};

router.get("/live", async (req, res) => {
  const usernames = {
    github: String(req.query.github || "").trim(),
    leetcode: String(req.query.leetcode || "").trim(),
    codechef: String(req.query.codechef || "").trim(),
    gfg: String(req.query.gfg || "").trim(),
  };

  const tasks = [
    ["github", fetchGitHub],
    ["leetcode", fetchLeetCode],
    ["codechef", fetchCodeChef],
    ["gfg", fetchGfg],
  ]
    .filter(([key]) => usernames[key])
    .map(async ([key, fetcher]) => {
      try {
        const data = await fetcher(usernames[key]);
        return [key, { success: true, data }];
      } catch (error) {
        return [
          key,
          {
            success: false,
            error: error.response?.data?.message || error.message || "Failed to fetch live data",
          },
        ];
      }
    });

  const settled = await Promise.all(tasks);
  const platforms = Object.fromEntries(settled);

  return res.json({
    updatedAt: new Date().toISOString(),
    platforms,
  });
});

module.exports = router;
