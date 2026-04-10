const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function ensureLeadingSlash(value: string) {
  return value.startsWith("/") ? value : `/${value}`;
}

export function getMediaUrl(path?: string | null) {
  if (!path) return "";

  const value = path.trim();
  if (!value) return "";

  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  const base = trimTrailingSlash(API_BASE);

  if (value.startsWith("/uploads/")) {
    return `${base}${value}`;
  }

  if (value.startsWith("uploads/")) {
    return `${base}/${value}`;
  }

  if (value.startsWith("images/") || value.startsWith("music/")) {
    return `${base}/uploads/${value}`;
  }

  if (value.startsWith("/")) {
    return value;
  }

  return `${base}${ensureLeadingSlash(value)}`;
}
