export interface Category {
  id: number;
  name: string;
  slug: string;
  sort_order: number;
  post_count?: number;
  created_at: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  color: "blue" | "yellow" | "green" | "red";
  post_count?: number;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category_id: number | null;
  category?: Category;
  tags?: Tag[];
  is_published: boolean;
  reading_time: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  file_path: string;
  cover_path: string;
  duration: number;
  sort_order: number;
  created_at: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}
