# Pixel Blog — Design Spec

## Context

A pixel-art styled personal blog for recording software development markdown notes. Deployed on a Debian 12 cloud server (2c2g). Reference: https://pixel-blog.com/

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 14 (App Router) + React 18 + TypeScript | SSR/SSG, standalone output (~150MB image) |
| Backend | Go + Gin + GORM | Single binary, minimal RAM, ideal for 2c2g |
| Database | SQLite (modernc.org/sqlite, pure Go) | Zero config, WAL mode for concurrent reads |
| State | Zustand | Lightweight (~1KB), two stores only (music, theme) |
| Styling | Tailwind CSS + CSS variables | Pixel design tokens, dark/light theme via `data-theme` |
| Markdown | react-markdown + remark-gfm + rehype-highlight | Server-side rendering, syntax highlighting |
| Deploy | Docker Compose (Nginx + Next.js + Go) | One-command deploy, volume mounts for data persistence |

## System Architecture

```
┌─────────────── Docker Compose ───────────────────┐
│                                                   │
│  ┌──────────┐   ┌────────────┐   ┌────────────┐  │
│  │  Nginx   │──▶│  Next.js   │   │  Go + Gin  │  │
│  │  :80     │   │  :3000     │   │  :8080     │  │
│  │          │──▶│  (SSR/ISR) │   │  REST API  │  │
│  │          │   └────────────┘   └─────┬──────┘  │
│  │          │──▶ /api/ ──────────────▶ │         │
│  │          │──▶ /uploads/ (static)    │         │
│  └──────────┘                    ┌─────┴──────┐  │
│                                  │   SQLite    │  │
│     Volumes:                     │  (WAL mode) │  │
│     ./data/blog.db               └────────────┘  │
│     ./backend/uploads/                           │
└──────────────────────────────────────────────────┘
```

- Nginx: reverse proxy + static file serving for uploads
- Next.js: SSR/ISR for public pages, CSR for admin panel
- Go: REST API, auth, file uploads, DB operations
- Server-side: Next.js calls `http://backend:8080` (Docker internal)
- Client-side: calls `/api/` (proxied by Nginx to Go)

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | auto-increment |
| username | TEXT UNIQUE | |
| password | TEXT | bcrypt hash |
| created_at | DATETIME | |

### categories
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | TEXT UNIQUE | |
| slug | TEXT UNIQUE | |
| sort_order | INTEGER | default 0 |
| created_at | DATETIME | |

### tags
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| name | TEXT UNIQUE | |
| slug | TEXT UNIQUE | |
| color | TEXT | 'blue' / 'yellow' / 'green' / 'red' |
| created_at | DATETIME | |

### posts
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| title | TEXT | |
| slug | TEXT UNIQUE | |
| excerpt | TEXT | |
| content | TEXT | raw markdown |
| cover_image | TEXT | upload path |
| category_id | INTEGER FK | -> categories.id, ON DELETE SET NULL |
| is_published | INTEGER | 0=draft, 1=published |
| reading_time | INTEGER | estimated minutes |
| published_at | DATETIME | |
| created_at | DATETIME | |
| updated_at | DATETIME | |

### post_tags (junction)
| Column | Type | Notes |
|--------|------|-------|
| post_id | INTEGER FK | -> posts.id, ON DELETE CASCADE |
| tag_id | INTEGER FK | -> tags.id, ON DELETE CASCADE |
| PRIMARY KEY | (post_id, tag_id) | |

### music_tracks
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| title | TEXT | |
| artist | TEXT | default 'Unknown' |
| file_path | TEXT | relative path under uploads/music/ |
| cover_path | TEXT | album cover image |
| duration | INTEGER | seconds |
| sort_order | INTEGER | |
| created_at | DATETIME | |

Indexes on: `posts.slug`, `posts.is_published`, `posts.category_id`, `categories.slug`, `tags.slug`.

## API Design

### Public (no auth)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | Paginated published posts. `?page=1&size=10&category=slug&tag=slug` |
| GET | `/api/posts/:slug` | Single post with category + tags |
| GET | `/api/categories` | All categories with post counts |
| GET | `/api/tags` | All tags with post counts |
| GET | `/api/music` | All tracks ordered by sort_order |

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Returns JWT (24h expiry, HS256) |
| POST | `/api/auth/refresh` | Refresh token (within 48h) |

### Admin (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/posts` | All posts including drafts |
| POST | `/api/admin/posts` | Create post |
| PUT | `/api/admin/posts/:id` | Update post |
| DELETE | `/api/admin/posts/:id` | Delete post |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |
| POST | `/api/admin/tags` | Create tag |
| PUT | `/api/admin/tags/:id` | Update tag |
| DELETE | `/api/admin/tags/:id` | Delete tag |
| POST | `/api/admin/upload/image` | Upload image (5MB max), returns `{ url }` |
| POST | `/api/admin/music` | Upload music track (20MB max) + metadata |
| PUT | `/api/admin/music/:id` | Update track metadata |
| DELETE | `/api/admin/music/:id` | Delete track + file |
| PUT | `/api/admin/music/reorder` | Bulk reorder `{ ids: [3,1,2] }` |

Response envelope: `{ code, data, message }`. Paginated: `{ code, data: { items, total, page, size, total_pages } }`.

### Auth implementation
- Single admin user, seeded on first startup via `ADMIN_USER` / `ADMIN_PASS` env vars
- bcrypt (cost 10) for password hashing
- JWT HS256 with `JWT_SECRET` env var, 24h expiry
- Token in `Authorization: Bearer <token>` header

## Frontend Architecture

### Page Routes & Rendering

| Route | Strategy | Notes |
|-------|----------|-------|
| `/` | SSR | Post list, `revalidate: 60` |
| `/posts/[slug]` | SSG + ISR | `revalidate: 3600`, `generateStaticParams` |
| `/category/[slug]` | SSR | Filtered list |
| `/tag/[slug]` | SSR | Filtered list |
| `/admin/*` | CSR | `'use client'`, auth-guarded layout |

### Component Hierarchy

```
RootLayout (fonts, ThemeProvider, metadata)
├── Header (logo, nav links, ThemeToggle)
├── MainLayout (CSS Grid: sidebar + content)
│   ├── Sidebar (sticky)
│   │   ├── ProfileCard (Squirtle avatar, name, bio)
│   │   ├── CategoryFilter (list with post counts)
│   │   ├── TagCloud (colored pixel tags)
│   │   └── MusicPlayer
│   │       ├── VinylRecord (spinning animation)
│   │       ├── TrackInfo (title + artist)
│   │       ├── PlayerControls (prev/play/next)
│   │       └── ProgressBar
│   └── Content
│       ├── PostList > PostCard[]
│       └── PixelPagination
└── MobileNav (< 768px: hamburger + bottom music bar)
```

### State Management (Zustand)

**musicStore**: playlist, currentIndex, isPlaying, volume, currentTime, duration, repeatMode. Actions: play, pause, toggle, next, prev, seek, setVolume, cycleRepeat.

**themeStore**: `theme: 'light' | 'dark'`, `toggle()`. Init from localStorage -> prefers-color-scheme.

Admin data fetching via `@tanstack/react-query`.

## Pixel UI Component System

### Design Tokens (`globals.css`)

```css
:root {
  --color-bg: #FFFFFF;
  --color-bg-secondary: #F5F5F5;
  --color-text: #2D2D2D;
  --color-text-secondary: #6B6B6B;
  --color-border: #2D2D2D;
  --color-shadow: #2D2D2D;
  --color-primary: #4A90D9;
  --color-yellow: #F5A623;
  --color-green: #7ED6A4;
  --color-red: #E85D75;
  --pixel-border: 3px;
  --pixel-shadow: 3px;
  --font-pixel: 'Press Start 2P', monospace;
  --font-body: 'Inter', sans-serif;
  --font-code: 'JetBrains Mono', monospace;
}

[data-theme="dark"] {
  --color-bg: #1A1A2E;
  --color-bg-secondary: #25253E;
  --color-text: #E0E0E0;
  --color-text-secondary: #A0A0B0;
  --color-border: #E0E0E0;
  --color-shadow: #E0E0E0;
}
```

### Component Rules

1. `border: var(--pixel-border) solid var(--color-border)`
2. `box-shadow: var(--pixel-shadow) var(--pixel-shadow) 0px var(--color-shadow)`
3. `border-radius: 0` (sharp corners always)
4. `image-rendering: pixelated` on pixel art
5. Hover: shadow shrinks to `1px 1px`, element translates `2px 2px` (press effect)
6. Active: shadow `0px 0px`, translate `3px 3px`

### Components

- **PixelButton**: variants (primary/secondary/danger), sizes (sm/md/lg), press animation
- **PixelCard**: border + shadow wrapper, optional hover lift
- **PixelTag**: color-coded (blue/yellow/green/red), 2px border, Press Start 2P 0.6rem
- **PixelInput / PixelSelect**: pixel borders, primary color focus state
- **PixelToggle**: pixel-style switch for dark/light, draft/published
- **PixelModal**: centered overlay with pixel border card
- **PixelPagination**: row of small pixel buttons, active = filled primary

### Typography

- Headings / Nav: Press Start 2P, small sizes with letter-spacing
- Body text: Inter, 16px base
- Code blocks: JetBrains Mono, pixel-bordered container with syntax highlighting

## Music Player

### Vinyl Record Animation

60x60px circular element with album cover fill. CSS:
```css
.vinyl { border-radius: 50%; border: 3px solid var(--color-border); }
.vinyl-spinning { animation: spin 4s linear infinite; }
.vinyl-paused { animation-play-state: paused; }
```
Center hole via pseudo-element. Resumes rotation from paused angle.

### Audio Management

Single `<audio>` element via React ref in MusicPlayer (root layout, persists across navigation). Events: `onTimeUpdate` -> store, `onLoadedMetadata` -> duration, `onEnded` -> next/replay. Playlist loaded from `/api/music` on app mount.

### Sidebar Placement

Desktop: music player at sidebar bottom. Mobile: fixed 48px bottom bar with mini vinyl + track name + play/pause.

## Admin Panel

### Auth Guard

Admin layout checks JWT in localStorage, redirects to `/admin/login` if missing/expired.

### Markdown Editor

Use `@uiw/react-md-editor` — split-pane with live preview, styled with pixel borders. Image upload: click toolbar button -> upload to `/api/admin/upload/image` -> insert `![alt](url)` at cursor.

### Post Editor Fields

Title, slug (auto-generated, editable), excerpt, category (dropdown), tags (multi-select chips), cover image (dropzone), status toggle (draft/published), markdown editor (60vh), save/publish buttons.

### Music Management

Track list with reorder (up/down buttons), upload modal (mp3 + title + artist + cover), delete with file cleanup.

## Dark/Light Theme

Inline `<script>` in `<head>` reads localStorage / prefers-color-scheme and sets `data-theme` attribute before React hydrates (no flash). ThemeToggle button with sun/moon pixel icon in header.

## Responsive Design

| Breakpoint | Layout |
|------------|--------|
| >= 1024px | Two-column: 260px sticky sidebar + flexible content |
| 768-1023px | Two-column: 200px sidebar + content |
| < 768px | Single column, sidebar hidden |

Mobile: categories become horizontal scrollable chips, music player becomes fixed bottom bar, hamburger menu for navigation.

CSS Grid: `grid-template-columns: 260px 1fr` -> `1fr` on mobile.

## Docker Compose

```yaml
services:
  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./backend/uploads:/var/www/uploads:ro
    depends_on: [frontend, backend]

  frontend:
    build: ./frontend
    environment: [API_URL=http://backend:8080]
    expose: ["3000"]

  backend:
    build: ./backend
    environment:
      - DB_PATH=/data/blog.db
      - UPLOAD_PATH=/uploads
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_USER=${ADMIN_USER}
      - ADMIN_PASS=${ADMIN_PASS}
      - GIN_MODE=release
    volumes:
      - ./data:/data
      - ./backend/uploads:/uploads
    expose: ["8080"]
```

Frontend Dockerfile: multi-stage (deps -> build -> standalone runner). `next.config.js` output: 'standalone'.

Backend Dockerfile: multi-stage (go build -> alpine). Pure Go SQLite = no CGO needed.

Nginx: proxy `/` -> frontend:3000, `/api/` -> backend:8080, `/uploads/` -> static files with 30d cache.

## Pixel Decorative Elements

- Squirtle pixel sprite as profile avatar (sidebar ProfileCard)
- Pixel grid pattern (7x5 colored squares) as decorative background element
- Press Start 2P font throughout nav and headings for 8-bit feel
- 3px border + shadow on all interactive elements for consistent pixel depth

## Verification

1. `docker compose up --build` locally, verify all 3 services start
2. Visit homepage: check two-column layout, pixel styling, post list renders
3. Toggle dark/light mode: verify no flash, all colors switch correctly
4. Open on mobile viewport: sidebar collapses, single column, bottom music bar
5. Login to admin: create a post with markdown + image, verify it appears on homepage
6. Upload music track: verify vinyl spins, playback works, persists across page nav
7. Test pagination, category/tag filtering
8. Deploy to Debian server: `docker compose up -d`, verify via public URL
