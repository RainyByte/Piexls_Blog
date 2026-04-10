export function getMediaUrl(path?: string | null) {
  if (!path) return "";

  const value = path.trim();
  if (!value) return "";

  // External URLs, data URIs, blob URLs — return as-is
  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    return value;
  }

  // All upload paths are served by nginx (prod) or Next.js rewrites (dev)
  // Always return origin-relative URLs so both SSR and client rendering work.
  if (value.startsWith("/uploads/")) return value;
  if (value.startsWith("uploads/")) return `/${value}`;
  if (value.startsWith("images/") || value.startsWith("music/")) return `/uploads/${value}`;

  // Other absolute paths
  if (value.startsWith("/")) return value;

  return `/${value}`;
}
