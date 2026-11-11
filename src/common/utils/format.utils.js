export const formatCurrency = (value, options = {}) => {
  if (value == null || value === "") return "—";
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "—";

  const { compact = false, maxFractionDigits } = options;
  if (compact) return formatCompactCurrency(numericValue);

  const abs = Math.abs(numericValue);
  const digits =
    maxFractionDigits != null
      ? maxFractionDigits
      : abs > 0 && abs < 1
        ? 3
        : abs < 10
          ? 2
          : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(numericValue);
};

export const formatFollowers = (count) => {
  if (typeof count !== "number" || Number.isNaN(count) || count < 0) return "—";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return count.toLocaleString();
};

export const formatCompactCurrency = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "—";
  if (Math.abs(numericValue) >= 1_000_000) {
    return `$${(numericValue / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (Math.abs(numericValue) >= 1_000) {
    return `$${(numericValue / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return `$${numericValue.toLocaleString()}`;
};

export const formatNumber = (value, options = {}) => {
  if (value == null || value === "") return "—";
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) return "—";

  const { compact = false } = options;
  if (compact) {
    if (Math.abs(numericValue) >= 1_000_000) {
      return `${(numericValue / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (Math.abs(numericValue) >= 1_000) {
      return `${(numericValue / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }
  }

  return new Intl.NumberFormat("en-US").format(numericValue);
};

export const formatPercent = (value, digits) => {
  if (value == null || !Number.isFinite(Number(value))) return "—";
  const n = Number(value);
  const resolvedDigits = digits != null ? digits : Number.isInteger(n) ? 0 : 1;
  return `${n.toFixed(resolvedDigits)}%`;
};

export const extractFileName = (url) => {
  if (!url) return "";
  try {
    return decodeURIComponent(url.split("/").pop() || "");
  } catch {
    return url;
  }
};
