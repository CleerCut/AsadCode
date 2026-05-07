const AGE_ORDER = ["13-17", "18-24", "25-34", "35-44", "45-54", "55-64", "65-", "65+"];

function sortAgeRanges(ranges) {
  return [...ranges].sort((a, b) => {
    const ia = AGE_ORDER.indexOf(a);
    const ib = AGE_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return String(a).localeCompare(String(b));
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function parseFlexibleNumber(value) {
  if (value == null) return null;
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }
  if (typeof value !== "string") return null;
  const raw = value.trim();
  if (!raw) return null;
  const normalized = raw.replace(/,/g, "").replace(/%/g, "").toUpperCase();
  const suffix = normalized.slice(-1);
  const base = parseFloat(normalized);
  if (!Number.isFinite(base) || base < 0) return null;
  if (suffix === "K") return base * 1_000;
  if (suffix === "M") return base * 1_000_000;
  if (suffix === "B") return base * 1_000_000_000;
  return base;
}

function pickFirstNumber(...vals) {
  for (const v of vals) {
    const n = parseFlexibleNumber(v);
    if (n != null) return n;
  }
  return null;
}

export function getCreatorFollowerWeight(user) {
  const directFollowers = pickFirstNumber(
    user.followers,
    user.totalFollowers,
    user.total_followers,
    user.creator_profile?.total_followers,
    user.creator_profile?.totalFollowers,
    user.profile?.total_followers,
    user.profile?.totalFollowers
  );
  if (directFollowers != null && directFollowers > 0) return directFollowers;

  const platformStats = user.platformStats || user.platforms || null;
  if (platformStats && typeof platformStats === "object") {
    let platformSum = 0;
    for (const stat of Object.values(platformStats)) {
      if (!stat || typeof stat !== "object") continue;
      const f = pickFirstNumber(
        stat.followers,
        stat.follower_count,
        stat.followers_count,
        stat.subscriber_count,
        stat.subscribers
      );
      if (f != null) platformSum += f;
    }
    if (platformSum > 0) return platformSum;
  }

  const accounts = user.social_accounts || [];
  let sum = 0;
  for (const acc of accounts) {
    if (acc.is_active === false) continue;
    const pd = acc.profile_data || {};
    const cnt = pickFirstNumber(
      pd.follower_count,
      pd.subscriber_count,
      pd.followers,
      pd.followers_count,
      pd.reputation?.follower_count,
      pd.reputation?.subscriber_count
    );
    if (cnt != null) sum += cnt;
  }
  if (sum > 0) return sum;
  return 0;
}

function collectGenderWeights(user, genderWeights) {
  const g = user.creator_profile?.audience_gender;
  if (!g || typeof g !== "string") return;
  const weight = getCreatorFollowerWeight(user);
  if (weight <= 0) return;
  const gender = g.toLowerCase();
  if (gender.includes("male") && !gender.includes("female")) {
    genderWeights.male += weight * 0.65;
    genderWeights.female += weight * 0.28;
    genderWeights.others += weight * 0.07;
  } else if (gender.includes("female")) {
    genderWeights.female += weight * 0.65;
    genderWeights.male += weight * 0.28;
    genderWeights.others += weight * 0.07;
  } else {
    genderWeights.male += weight * 0.38;
    genderWeights.female += weight * 0.37;
    genderWeights.others += weight * 0.25;
  }
}

function aggregateFromDistribution(users, resolver, keyResolver, outputKey) {
  const bucket = {};
  for (const user of users) {
    const dist = resolver(user);
    if (!Array.isArray(dist) || dist.length === 0) continue;
    const w = getCreatorFollowerWeight(user);
    if (w <= 0) continue;
    for (const item of dist) {
      const key = keyResolver(item);
      if (!key) continue;
      const pct = pickFirstNumber(item?.percentage, item?.value, item?.weight);
      if (pct == null || pct <= 0) continue;
      bucket[key] = (bucket[key] ?? 0) + pct * w;
    }
  }
  const denom = Object.values(bucket).reduce((a, v) => a + v, 0);
  if (denom <= 0) return [];
  const keys = Object.keys(bucket);
  const sortedKeys = outputKey === "range" ? sortAgeRanges(keys) : keys;
  const out = sortedKeys.map((key) => ({
    [outputKey]: key,
    percentage: Math.round(((bucket[key] ?? 0) / denom) * 100),
  }));
  const s = out.reduce((a, i) => a + i.percentage, 0);
  if (s !== 100 && out.length > 0) out[out.length - 1].percentage += 100 - s;
  return out;
}

function aggregateAgeFromRanges(users) {
  const bucket = {};
  for (const user of users) {
    const ranges = user.creator_profile?.audience_age_ranges;
    if (!Array.isArray(ranges) || ranges.length === 0) continue;
    const w = getCreatorFollowerWeight(user);
    if (w <= 0) continue;
    const share = 100 / ranges.length;
    for (const range of ranges) {
      const key = String(range);
      bucket[key] = (bucket[key] ?? 0) + (w * share) / 100;
    }
  }
  const denom = Object.values(bucket).reduce((a, v) => a + v, 0);
  if (denom <= 0) return [];
  const sortedKeys = sortAgeRanges(Object.keys(bucket));
  const out = sortedKeys.map((range) => ({
    range,
    percentage: Math.round(((bucket[range] ?? 0) / denom) * 100),
  }));
  const s = out.reduce((a, i) => a + i.percentage, 0);
  if (s !== 100 && out.length > 0) out[out.length - 1].percentage += 100 - s;
  return out;
}

function aggregateCountriesFromRanges(users) {
  const bucket = {};
  for (const user of users) {
    const codes = user.creator_profile?.audience_countries;
    if (!Array.isArray(codes) || codes.length === 0) continue;
    const w = getCreatorFollowerWeight(user);
    if (w <= 0) continue;
    const share = 100 / codes.length;
    for (const c of codes) {
      const code = String(c).toUpperCase();
      if (!code) continue;
      bucket[code] = (bucket[code] ?? 0) + (w * share) / 100;
    }
  }
  const denom = Object.values(bucket).reduce((a, v) => a + v, 0);
  if (denom <= 0) return [];
  const out = Object.entries(bucket)
    .map(([country_code, val]) => ({
      country_code,
      percentage: Math.round((val / denom) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);
  const s = out.reduce((a, i) => a + i.percentage, 0);
  if (s !== 100 && out.length > 0) out[out.length - 1].percentage += 100 - s;
  return out;
}

function readAccountDistribution(user, key) {
  const accounts = user.social_accounts || [];
  for (const acc of accounts) {
    if (acc.is_active === false) continue;
    const pd = acc.profile_data || {};
    if (Array.isArray(pd[key]) && pd[key].length > 0) {
      return pd[key];
    }
  }
  return null;
}

function extractAudienceDistributions(users) {
  const ageFromDistribution = aggregateFromDistribution(
    users,
    (u) =>
      readAccountDistribution(u, "audience_age_distribution") ||
      u.audience_age_distribution ||
      u.creator_profile?.audience_age_distribution ||
      null,
    (item) => String(item?.range || item?.name || ""),
    "range"
  );

  const countryFromDistribution = aggregateFromDistribution(
    users,
    (u) =>
      readAccountDistribution(u, "audience_country_distribution") ||
      u.audience_country_distribution ||
      u.creator_profile?.audience_country_distribution ||
      null,
    (item) => String(item?.country_code || item?.code || "").toUpperCase(),
    "country_code"
  );

  const genderFromDistribution = aggregateFromDistribution(
    users,
    (u) =>
      readAccountDistribution(u, "audience_gender_distribution") ||
      u.audience_gender_distribution ||
      u.creator_profile?.audience_gender_distribution ||
      null,
    (item) => String(item?.gender || item?.name || "").toLowerCase(),
    "gender"
  ).filter((g) => g.gender === "male" || g.gender === "female");

  const age = ageFromDistribution.length > 0 ? ageFromDistribution : aggregateAgeFromRanges(users);
  const country =
    countryFromDistribution.length > 0 ? countryFromDistribution : aggregateCountriesFromRanges(users);

  let gender = genderFromDistribution;
  if (gender.length === 0) {
    const genderWeights = { male: 0, female: 0, others: 0 };
    users.forEach((u) => collectGenderWeights(u, genderWeights));
    const gwSum = genderWeights.male + genderWeights.female + genderWeights.others;
    if (gwSum > 0) {
      const m = Math.round((genderWeights.male / gwSum) * 100);
      const f = Math.round((genderWeights.female / gwSum) * 100);
      gender = [];
      if (m > 0) gender.push({ gender: "male", percentage: m });
      if (f > 0) gender.push({ gender: "female", percentage: f });
      if (gender.length >= 2) {
        const sum = gender.reduce((a, i) => a + i.percentage, 0);
        if (sum !== 100) gender[gender.length - 1].percentage += 100 - sum;
      }
    }
  }

  return { age, country, gender };
}

function extractCreatorPerformanceSignals(user, phylloMetricsByCreatorId = {}) {
  const accounts = user.social_accounts || [];
  const viewCandidates = [];
  const erCandidates = [];
  for (const acc of accounts) {
    if (acc.is_active === false) continue;
    const pd = acc.profile_data || {};
    const v = pickFirstNumber(
      pd.median_views,
      pd.typical_views,
      pd.average_views,
      pd.average_view,
      pd.avg_views,
      pd.avg_view,
      pd.avg_views_per_post,
      pd.median_typical_views,
      pd.views_avg,
      pd.mean_views,
      pd.average_video_views,
      pd.average_reels_views
    );
    const er = pickFirstNumber(pd.engagement_rate, pd.engagementRate);
    if (v != null) viewCandidates.push(v);
    if (er != null) erCandidates.push(er);
  }
  // Some flows attach raw Phyllo per-platform stats under platformStats/platforms.
  const platformStats = user.platformStats || user.platforms || null;
  if (platformStats && typeof platformStats === "object") {
    for (const stat of Object.values(platformStats)) {
      if (!stat || typeof stat !== "object") continue;
      const v = pickFirstNumber(
        stat.median_views,
        stat.typical_views,
        stat.average_views,
        stat.avg_views,
        stat.avg_views_per_post
      );
      const er = pickFirstNumber(stat.engagement_rate, stat.engagementRate);
      if (v != null) viewCandidates.push(v);
      if (er != null) erCandidates.push(er);
    }
  }
  const creatorId = String(user?.id ?? user?.creatorUserId ?? "");
  const phylloMetrics = creatorId ? phylloMetricsByCreatorId[creatorId] : null;
  const phylloViews = pickFirstNumber(
    phylloMetrics?.metrics?.averageViews?.value,
    phylloMetrics?.metrics?.average_views?.value
  );
  const phylloEr = pickFirstNumber(
    phylloMetrics?.metrics?.engagementRate?.value,
    phylloMetrics?.metrics?.engagement_rate?.value
  );
  if (phylloViews != null) viewCandidates.push(phylloViews);
  if (phylloEr != null) erCandidates.push(phylloEr);
  const avgViews =
    viewCandidates.length > 0
      ? viewCandidates.reduce((a, b) => a + b, 0) / viewCandidates.length
      : null;
  const engagementRate =
    erCandidates.length > 0
      ? erCandidates.reduce((a, b) => a + b, 0) / erCandidates.length
      : null;
  return { avgViews, engagementRate };
}

export function buildPredictedShortlistAudienceAndPerformance(
  transformedCreators,
  phylloMetricsByCreatorId = {}
) {
  const users = Array.isArray(transformedCreators) ? transformedCreators : [];
  const performance = {
    totalFollowers: 0,
    averageViews: null,
    averageEngagementRate: null,
  };

  if (users.length === 0) {
    return {
      audienceData: { has_data: false },
      performance,
      viewsSampleCount: 0,
      engagementSampleCount: 0,
    };
  }

  let totalFollowers = 0;
  const viewsVals = [];
  const erVals = [];

  for (const user of users) {
    totalFollowers += getCreatorFollowerWeight(user);
    const sig = extractCreatorPerformanceSignals(user, phylloMetricsByCreatorId);
    if (sig.avgViews != null) viewsVals.push(sig.avgViews);
    if (sig.engagementRate != null) erVals.push(sig.engagementRate);
  }

  performance.totalFollowers = Math.round(totalFollowers);
  performance.averageViews =
    viewsVals.length > 0
      ? Math.round(viewsVals.reduce((a, b) => a + b, 0) / viewsVals.length)
      : null;
  performance.averageEngagementRate =
    erVals.length > 0
      ? Math.round((erVals.reduce((a, b) => a + b, 0) / erVals.length) * 100) / 100
      : null;

  const {
    age: audience_age_distribution,
    country: audience_country_distribution,
    gender: audience_gender_distribution,
  } = extractAudienceDistributions(users);

  const hasAudienceCharts =
    (audience_gender_distribution && audience_gender_distribution.length > 0) ||
    audience_age_distribution.length > 0 ||
    audience_country_distribution.length > 0;

  const audienceData = {
    has_data: hasAudienceCharts,
    audience_gender_distribution,
    audience_age_distribution:
      audience_age_distribution.length > 0 ? audience_age_distribution : undefined,
    audience_country_distribution:
      audience_country_distribution.length > 0 ? audience_country_distribution : undefined,
    is_estimated: true,
  };

  return {
    audienceData,
    performance,
    viewsSampleCount: viewsVals.length,
    engagementSampleCount: erVals.length,
  };
}
