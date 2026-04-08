import { ApiResponse, PaginatedResponse, Post, Category, Tag, MusicTrack } from "@/types";

const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();
  return json.data;
}

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Public API
export async function getPosts(page = 1, size = 10, category?: string, tag?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);
  return fetchAPI<PaginatedResponse<Post>>(`/api/posts?${params}`);
}

export async function getPost(slug: string) {
  return fetchAPI<Post>(`/api/posts/${slug}`);
}

export async function getCategories() {
  return fetchAPI<Category[]>("/api/categories");
}

export async function getTags() {
  return fetchAPI<Tag[]>("/api/tags");
}

export async function getMusic() {
  return fetchAPI<MusicTrack[]>("/api/music");
}

// Auth
export async function login(username: string, password: string) {
  return fetchAPI<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

// Admin API
export async function adminGetPosts(page = 1, size = 10) {
  return fetchAPI<PaginatedResponse<Post>>(`/api/admin/posts?page=${page}&size=${size}`, {
    headers: authHeaders(),
  });
}

export async function adminCreatePost(data: Record<string, unknown>) {
  return fetchAPI<Post>("/api/admin/posts", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminUpdatePost(id: number, data: Record<string, unknown>) {
  return fetchAPI<Post>(`/api/admin/posts/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminDeletePost(id: number) {
  return fetchAPI<void>(`/api/admin/posts/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function adminCreateCategory(data: { name: string; slug: string }) {
  return fetchAPI<Category>("/api/admin/categories", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateCategory(id: number, data: Record<string, unknown>) {
  return fetchAPI<Category>(`/api/admin/categories/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteCategory(id: number) {
  return fetchAPI<void>(`/api/admin/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function adminCreateTag(data: { name: string; slug: string; color: string }) {
  return fetchAPI<Tag>("/api/admin/tags", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminUpdateTag(id: number, data: Record<string, unknown>) {
  return fetchAPI<Tag>(`/api/admin/tags/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
}

export async function adminDeleteTag(id: number) {
  return fetchAPI<void>(`/api/admin/tags/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function adminUploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  const url = `${API_BASE}/api/admin/upload/image`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const json: ApiResponse<{ url: string }> = await res.json();
  return json.data;
}

export async function adminCreateMusic(formData: FormData) {
  const url = `${API_BASE}/api/admin/music`;
  const res = await fetch(url, {
    method: "POST",
    headers: authHeaders(),
    body: formData,
  });
  const json: ApiResponse<MusicTrack> = await res.json();
  return json.data;
}

export async function adminDeleteMusic(id: number) {
  return fetchAPI<void>(`/api/admin/music/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

export async function adminReorderMusic(ids: number[]) {
  return fetchAPI<void>("/api/admin/music/reorder", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ ids }),
  });
}
