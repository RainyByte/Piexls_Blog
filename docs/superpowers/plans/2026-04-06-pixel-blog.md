# Pixel Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-art styled personal blog with Go backend, Next.js frontend, admin panel, music player, and Docker Compose deployment.

**Architecture:** Frontend-backend separation. Go + Gin serves a REST API with SQLite (GORM). Next.js App Router handles SSR/ISR for public pages and CSR for admin. Nginx reverse-proxies everything. Docker Compose orchestrates all three services.

**Tech Stack:** Go 1.22, Gin, GORM, modernc.org/sqlite, Next.js 14, React 18, TypeScript, Tailwind CSS, Zustand, react-markdown, Docker Compose, Nginx

**Spec:** `docs/superpowers/specs/2026-04-06-pixel-blog-design.md`

---

## File Structure

```
Piexls_Blog/
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── nginx.conf
├── backend/
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   ├── main.go
│   ├── config/
│   │   └── config.go
│   ├── database/
│   │   ├── sqlite.go
│   │   └── seed.go
│   ├── models/
│   │   ├── user.go
│   │   ├── post.go
│   │   ├── category.go
│   │   ├── tag.go
│   │   └── music.go
│   ├── handlers/
│   │   ├── auth.go
│   │   ├── post.go
│   │   ├── category.go
│   │   ├── tag.go
│   │   ├── music.go
│   │   └── upload.go
│   ├── middleware/
│   │   ├── auth.go
│   │   └── cors.go
│   ├── services/
│   │   ├── auth.go
│   │   ├── post.go
│   │   ├── category.go
│   │   ├── tag.go
│   │   └── music.go
│   └── tests/
│       ├── auth_test.go
│       ├── post_test.go
│       ├── category_test.go
│       ├── tag_test.go
│       └── music_test.go
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── public/
│   │   ├── fonts/
│   │   │   ├── PressStart2P-Regular.ttf
│   │   │   ├── Inter-Variable.woff2
│   │   │   └── JetBrainsMono-Variable.woff2
│   │   └── images/
│   │       └── squirtle-sprite.png
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── globals.css
│   │   │   ├── posts/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   └── admin/
│   │   │       ├── layout.tsx
│   │   │       ├── login/
│   │   │       │   └── page.tsx
│   │   │       ├── posts/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── categories/
│   │   │       │   └── page.tsx
│   │   │       ├── tags/
│   │   │       │   └── page.tsx
│   │   │       └── music/
│   │   │           └── page.tsx
│   │   ├── components/
│   │   │   ├── pixel/
│   │   │   │   ├── PixelButton.tsx
│   │   │   │   ├── PixelCard.tsx
│   │   │   │   ├── PixelTag.tsx
│   │   │   │   ├── PixelInput.tsx
│   │   │   │   ├── PixelSelect.tsx
│   │   │   │   ├── PixelToggle.tsx
│   │   │   │   ├── PixelModal.tsx
│   │   │   │   ├── PixelPagination.tsx
│   │   │   │   └── index.ts
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   └── MobileNav.tsx
│   │   │   ├── blog/
│   │   │   │   ├── PostCard.tsx
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostContent.tsx
│   │   │   │   ├── CategoryFilter.tsx
│   │   │   │   └── TagCloud.tsx
│   │   │   ├── music/
│   │   │   │   ├── MusicPlayer.tsx
│   │   │   │   ├── VinylRecord.tsx
│   │   │   │   └── PlayerControls.tsx
│   │   │   ├── admin/
│   │   │   │   ├── MarkdownEditor.tsx
│   │   │   │   ├── ImageUploader.tsx
│   │   │   │   └── MusicUploader.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── markdown.ts
│   │   │   └── constants.ts
│   │   ├── stores/
│   │   │   ├── musicStore.ts
│   │   │   └── themeStore.ts
│   │   └── types/
│   │       └── index.ts
│   └── __tests__/
│       ├── components/
│       │   ├── PixelButton.test.tsx
│       │   └── ThemeToggle.test.tsx
│       └── lib/
│           └── api.test.ts
└── data/
    └── .gitkeep
```

---

## Phase 1: Backend Foundation

### Task 1: Initialize Go project and config

**Files:**
- Create: `backend/go.mod`
- Create: `backend/main.go`
- Create: `backend/config/config.go`

- [ ] **Step 1: Initialize Go module**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
mkdir -p backend && cd backend
go mod init github.com/zyx/pixel-blog-backend
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/sqlite
go get github.com/golang-jwt/jwt/v5
go get golang.org/x/crypto/bcrypt
```

Note: `gorm.io/driver/sqlite` with the default build tag uses `modernc.org/sqlite` (pure Go, no CGO). Verify by checking that `CGO_ENABLED=0 go build` succeeds after all code is written.

- [ ] **Step 3: Create config.go**

```go
// backend/config/config.go
package config

import "os"

type Config struct {
	Port       string
	DBPath     string
	UploadPath string
	JWTSecret  string
	AdminUser  string
	AdminPass  string
}

func Load() *Config {
	return &Config{
		Port:       getEnv("PORT", "8080"),
		DBPath:     getEnv("DB_PATH", "./data/blog.db"),
		UploadPath: getEnv("UPLOAD_PATH", "./uploads"),
		JWTSecret:  getEnv("JWT_SECRET", "change-me-in-production"),
		AdminUser:  getEnv("ADMIN_USER", "admin"),
		AdminPass:  getEnv("ADMIN_PASS", "admin123"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
```

- [ ] **Step 4: Create main.go skeleton**

```go
// backend/main.go
package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
)

func main() {
	cfg := config.Load()

	r := gin.Default()

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	log.Printf("Starting server on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
```

- [ ] **Step 5: Verify it compiles and runs**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go run main.go &
curl http://localhost:8080/api/health
# Expected: {"status":"ok"}
kill %1
```

- [ ] **Step 6: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git init
echo -e "data/blog.db\nbackend/uploads/\n.superpowers/\n.env\nfrontend/node_modules/\nfrontend/.next/" > .gitignore
git add backend/go.mod backend/go.sum backend/main.go backend/config/config.go .gitignore
git commit -m "feat: initialize Go backend with Gin and config"
```

---

### Task 2: Database models and migration

**Files:**
- Create: `backend/database/sqlite.go`
- Create: `backend/database/seed.go`
- Create: `backend/models/user.go`
- Create: `backend/models/category.go`
- Create: `backend/models/tag.go`
- Create: `backend/models/post.go`
- Create: `backend/models/music.go`
- Modify: `backend/main.go`

- [ ] **Step 1: Create all model files**

```go
// backend/models/user.go
package models

import "time"

type User struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Username  string    `gorm:"uniqueIndex;not null" json:"username"`
	Password  string    `gorm:"not null" json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
```

```go
// backend/models/category.go
package models

import "time"

type Category struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex;not null" json:"name"`
	Slug      string    `gorm:"uniqueIndex;not null" json:"slug"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	PostCount int       `gorm:"-" json:"post_count,omitempty"`
}
```

```go
// backend/models/tag.go
package models

import "time"

type Tag struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex;not null" json:"name"`
	Slug      string    `gorm:"uniqueIndex;not null" json:"slug"`
	Color     string    `gorm:"default:blue;not null" json:"color"`
	CreatedAt time.Time `json:"created_at"`
	PostCount int       `gorm:"-" json:"post_count,omitempty"`
}
```

```go
// backend/models/post.go
package models

import "time"

type Post struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `gorm:"not null" json:"title"`
	Slug        string     `gorm:"uniqueIndex;not null" json:"slug"`
	Excerpt     string     `gorm:"default:''" json:"excerpt"`
	Content     string     `gorm:"not null" json:"content"`
	CoverImage  string     `gorm:"default:''" json:"cover_image"`
	CategoryID  *uint      `gorm:"index" json:"category_id"`
	Category    *Category  `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Tags        []Tag      `gorm:"many2many:post_tags" json:"tags,omitempty"`
	IsPublished bool       `gorm:"default:false;index" json:"is_published"`
	ReadingTime int        `gorm:"default:1" json:"reading_time"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
```

```go
// backend/models/music.go
package models

import "time"

type MusicTrack struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"not null" json:"title"`
	Artist    string    `gorm:"default:Unknown;not null" json:"artist"`
	FilePath  string    `gorm:"not null" json:"file_path"`
	CoverPath string    `gorm:"default:''" json:"cover_path"`
	Duration  int       `gorm:"default:0" json:"duration"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
}
```

- [ ] **Step 2: Create database init and seed**

```go
// backend/database/sqlite.go
package database

import (
	"log"
	"os"
	"path/filepath"

	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Init(dbPath string) *gorm.DB {
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Fatal("Failed to create database directory:", err)
	}

	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}

	// Enable WAL mode for better concurrent read performance
	db.Exec("PRAGMA journal_mode=WAL")

	// Auto-migrate all models
	err = db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Tag{},
		&models.Post{},
		&models.MusicTrack{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	return db
}
```

```go
// backend/database/seed.go
package database

import (
	"log"

	"github.com/zyx/pixel-blog-backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedAdmin(db *gorm.DB, username, password string) {
	var count int64
	db.Model(&models.User{}).Count(&count)
	if count > 0 {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	if err != nil {
		log.Fatal("Failed to hash admin password:", err)
	}

	admin := models.User{
		Username: username,
		Password: string(hash),
	}
	if err := db.Create(&admin).Error; err != nil {
		log.Fatal("Failed to seed admin user:", err)
	}

	log.Printf("Admin user '%s' created", username)
}
```

- [ ] **Step 3: Update main.go to init DB**

```go
// backend/main.go
package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/database"
)

func main() {
	cfg := config.Load()

	db := database.Init(cfg.DBPath)
	database.SeedAdmin(db, cfg.AdminUser, cfg.AdminPass)

	r := gin.Default()

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	_ = db // will be used by handlers in next tasks

	log.Printf("Starting server on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
```

- [ ] **Step 4: Verify it compiles**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
mkdir -p data
go build -o /dev/null ./...
# Expected: no errors
```

- [ ] **Step 5: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
mkdir -p data && touch data/.gitkeep
git add backend/models/ backend/database/ backend/main.go data/.gitkeep
git commit -m "feat: add database models and SQLite init with auto-migration"
```

---

### Task 3: Auth handler and JWT middleware

**Files:**
- Create: `backend/middleware/auth.go`
- Create: `backend/middleware/cors.go`
- Create: `backend/services/auth.go`
- Create: `backend/handlers/auth.go`
- Create: `backend/tests/auth_test.go`
- Modify: `backend/main.go`

- [ ] **Step 1: Write auth test**

```go
// backend/tests/auth_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/database"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"github.com/zyx/pixel-blog-backend/models"
)

func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatal(err)
	}
	db.AutoMigrate(&models.User{}, &models.Category{}, &models.Tag{}, &models.Post{}, &models.MusicTrack{})
	database.SeedAdmin(db, "admin", "testpass")
	return db
}

func setupRouter(db *gorm.DB) *gin.Engine {
	gin.SetMode(gin.TestMode)
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()
	authHandler := handlers.NewAuthHandler(db, cfg)
	r.POST("/api/auth/login", authHandler.Login)
	r.POST("/api/auth/refresh", authHandler.Refresh)

	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	admin.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})
	return r
}

func TestLoginSuccess(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	body, _ := json.Marshal(map[string]string{
		"username": "admin",
		"password": "testpass",
	})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	data := resp["data"].(map[string]interface{})
	if data["token"] == nil || data["token"] == "" {
		t.Fatal("Expected token in response")
	}
}

func TestLoginWrongPassword(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	body, _ := json.Marshal(map[string]string{
		"username": "admin",
		"password": "wrong",
	})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 401 {
		t.Fatalf("Expected 401, got %d", w.Code)
	}
}

func TestProtectedRouteWithoutToken(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	req := httptest.NewRequest("GET", "/api/admin/ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 401 {
		t.Fatalf("Expected 401, got %d", w.Code)
	}
}

func TestProtectedRouteWithToken(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	// Login first
	body, _ := json.Marshal(map[string]string{
		"username": "admin",
		"password": "testpass",
	})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	token := resp["data"].(map[string]interface{})["token"].(string)

	// Access protected route
	req = httptest.NewRequest("GET", "/api/admin/ping", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}
```

- [ ] **Step 2: Create CORS middleware**

```go
// backend/middleware/cors.go
package middleware

import (
	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
```

- [ ] **Step 3: Create JWT middleware**

```go
// backend/middleware/auth.go
package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTAuth(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")
		if header == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "missing token"})
			c.Abort()
			return
		}

		parts := strings.SplitN(header, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid token format"})
			c.Abort()
			return
		}

		token, err := jwt.Parse(parts[1], func(t *jwt.Token) (interface{}, error) {
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid claims"})
			c.Abort()
			return
		}

		c.Set("user_id", claims["user_id"])
		c.Next()
	}
}
```

- [ ] **Step 4: Create auth service**

```go
// backend/services/auth.go
package services

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/zyx/pixel-blog-backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type AuthService struct {
	db     *gorm.DB
	secret string
}

func NewAuthService(db *gorm.DB, secret string) *AuthService {
	return &AuthService{db: db, secret: secret}
}

func (s *AuthService) Login(username, password string) (string, error) {
	var user models.User
	if err := s.db.Where("username = ?", username).First(&user).Error; err != nil {
		return "", errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid credentials")
	}

	return s.generateToken(user.ID)
}

func (s *AuthService) RefreshToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		return []byte(s.secret), nil
	})
	if err != nil || !token.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", errors.New("invalid claims")
	}

	// Only refresh if within 48h of creation
	iat, _ := claims.GetIssuedAt()
	if iat == nil || time.Since(iat.Time) > 48*time.Hour {
		return "", errors.New("token too old to refresh")
	}

	userID := uint(claims["user_id"].(float64))
	return s.generateToken(userID)
}

func (s *AuthService) generateToken(userID uint) (string, error) {
	claims := jwt.MapClaims{
		"user_id": userID,
		"iat":     time.Now().Unix(),
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.secret))
}
```

- [ ] **Step 5: Create auth handler**

```go
// backend/handlers/auth.go
package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/services"
	"gorm.io/gorm"
)

type AuthHandler struct {
	service *services.AuthService
}

func NewAuthHandler(db *gorm.DB, cfg *config.Config) *AuthHandler {
	return &AuthHandler{
		service: services.NewAuthService(db, cfg.JWTSecret),
	}
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req loginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "username and password required"})
		return
	}

	token, err := h.service.Login(req.Username, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"data":    gin.H{"token": token},
		"message": "ok",
	})
}

func (h *AuthHandler) Refresh(c *gin.Context) {
	header := c.GetHeader("Authorization")
	parts := strings.SplitN(header, " ", 2)
	if len(parts) != 2 {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": "missing token"})
		return
	}

	token, err := h.service.RefreshToken(parts[1])
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"code": 401, "message": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"data":    gin.H{"token": token},
		"message": "ok",
	})
}
```

- [ ] **Step 6: Run tests**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go test ./tests/ -v -run TestLogin
go test ./tests/ -v -run TestProtected
# Expected: all 4 tests PASS
```

- [ ] **Step 7: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/middleware/ backend/services/auth.go backend/handlers/auth.go backend/tests/auth_test.go
git commit -m "feat: add JWT auth with login, refresh, and middleware"
```

---

### Task 4: Category CRUD

**Files:**
- Create: `backend/services/category.go`
- Create: `backend/handlers/category.go`
- Create: `backend/tests/category_test.go`

- [ ] **Step 1: Write category test**

```go
// backend/tests/category_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
)

func setupCategoryRouter(t *testing.T) (*gin.Engine, string) {
	db := setupTestDB(t)
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()

	authHandler := handlers.NewAuthHandler(db, cfg)
	catHandler := handlers.NewCategoryHandler(db)

	r.GET("/api/categories", catHandler.List)
	r.POST("/api/auth/login", authHandler.Login)

	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	admin.POST("/categories", catHandler.Create)
	admin.PUT("/categories/:id", catHandler.Update)
	admin.DELETE("/categories/:id", catHandler.Delete)

	// Get token
	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "testpass"})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	token := resp["data"].(map[string]interface{})["token"].(string)

	return r, token
}

func TestCategoryCRUD(t *testing.T) {
	r, token := setupCategoryRouter(t)

	// Create
	body, _ := json.Marshal(map[string]interface{}{
		"name": "Frontend",
		"slug": "frontend",
	})
	req := httptest.NewRequest("POST", "/api/admin/categories", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 201 {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// List
	req = httptest.NewRequest("GET", "/api/categories", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("List: expected 200, got %d", w.Code)
	}
	var listResp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &listResp)
	items := listResp["data"].([]interface{})
	if len(items) != 1 {
		t.Fatalf("Expected 1 category, got %d", len(items))
	}

	// Update
	body, _ = json.Marshal(map[string]interface{}{"name": "前端"})
	req = httptest.NewRequest("PUT", "/api/admin/categories/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Update: expected 200, got %d: %s", w.Code, w.Body.String())
	}

	// Delete
	req = httptest.NewRequest("DELETE", "/api/admin/categories/1", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Delete: expected 200, got %d", w.Code)
	}
}
```

- [ ] **Step 2: Create category service**

```go
// backend/services/category.go
package services

import (
	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type CategoryService struct {
	db *gorm.DB
}

func NewCategoryService(db *gorm.DB) *CategoryService {
	return &CategoryService{db: db}
}

func (s *CategoryService) List() ([]models.Category, error) {
	var categories []models.Category
	err := s.db.Order("sort_order ASC, id ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}

	// Attach post counts
	for i := range categories {
		var count int64
		s.db.Model(&models.Post{}).Where("category_id = ? AND is_published = ?", categories[i].ID, true).Count(&count)
		categories[i].PostCount = int(count)
	}

	return categories, nil
}

func (s *CategoryService) Create(category *models.Category) error {
	return s.db.Create(category).Error
}

func (s *CategoryService) Update(id uint, updates map[string]interface{}) (*models.Category, error) {
	var category models.Category
	if err := s.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	if err := s.db.Model(&category).Updates(updates).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (s *CategoryService) Delete(id uint) error {
	return s.db.Delete(&models.Category{}, id).Error
}
```

- [ ] **Step 3: Create category handler**

```go
// backend/handlers/category.go
package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/models"
	"github.com/zyx/pixel-blog-backend/services"
	"gorm.io/gorm"
)

type CategoryHandler struct {
	service *services.CategoryService
}

func NewCategoryHandler(db *gorm.DB) *CategoryHandler {
	return &CategoryHandler{service: services.NewCategoryService(db)}
}

func (h *CategoryHandler) List(c *gin.Context) {
	categories, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": categories, "message": "ok"})
}

func (h *CategoryHandler) Create(c *gin.Context) {
	var category models.Category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	if err := h.service.Create(&category); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"code": 201, "data": category, "message": "ok"})
}

func (h *CategoryHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}

	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}

	category, err := h.service.Update(uint(id), updates)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "category not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": category, "message": "ok"})
}

func (h *CategoryHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "deleted"})
}
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go test ./tests/ -v -run TestCategory
# Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/services/category.go backend/handlers/category.go backend/tests/category_test.go
git commit -m "feat: add category CRUD with service and handler"
```

---

### Task 5: Tag CRUD

**Files:**
- Create: `backend/services/tag.go`
- Create: `backend/handlers/tag.go`
- Create: `backend/tests/tag_test.go`

- [ ] **Step 1: Write tag test**

```go
// backend/tests/tag_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
)

func setupTagRouter(t *testing.T) (*gin.Engine, string) {
	db := setupTestDB(t)
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()

	authHandler := handlers.NewAuthHandler(db, cfg)
	tagHandler := handlers.NewTagHandler(db)

	r.GET("/api/tags", tagHandler.List)
	r.POST("/api/auth/login", authHandler.Login)

	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	admin.POST("/tags", tagHandler.Create)
	admin.PUT("/tags/:id", tagHandler.Update)
	admin.DELETE("/tags/:id", tagHandler.Delete)

	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "testpass"})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	token := resp["data"].(map[string]interface{})["token"].(string)

	return r, token
}

func TestTagCRUD(t *testing.T) {
	r, token := setupTagRouter(t)

	// Create
	body, _ := json.Marshal(map[string]interface{}{
		"name":  "React",
		"slug":  "react",
		"color": "blue",
	})
	req := httptest.NewRequest("POST", "/api/admin/tags", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 201 {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// List
	req = httptest.NewRequest("GET", "/api/tags", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("List: expected 200, got %d", w.Code)
	}

	// Update
	body, _ = json.Marshal(map[string]interface{}{"color": "green"})
	req = httptest.NewRequest("PUT", "/api/admin/tags/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Update: expected 200, got %d: %s", w.Code, w.Body.String())
	}

	// Delete
	req = httptest.NewRequest("DELETE", "/api/admin/tags/1", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Delete: expected 200, got %d", w.Code)
	}
}
```

- [ ] **Step 2: Create tag service**

```go
// backend/services/tag.go
package services

import (
	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type TagService struct {
	db *gorm.DB
}

func NewTagService(db *gorm.DB) *TagService {
	return &TagService{db: db}
}

func (s *TagService) List() ([]models.Tag, error) {
	var tags []models.Tag
	if err := s.db.Order("id ASC").Find(&tags).Error; err != nil {
		return nil, err
	}

	for i := range tags {
		var count int64
		s.db.Table("post_tags").
			Joins("JOIN posts ON posts.id = post_tags.post_id").
			Where("post_tags.tag_id = ? AND posts.is_published = ?", tags[i].ID, true).
			Count(&count)
		tags[i].PostCount = int(count)
	}

	return tags, nil
}

func (s *TagService) Create(tag *models.Tag) error {
	return s.db.Create(tag).Error
}

func (s *TagService) Update(id uint, updates map[string]interface{}) (*models.Tag, error) {
	var tag models.Tag
	if err := s.db.First(&tag, id).Error; err != nil {
		return nil, err
	}
	if err := s.db.Model(&tag).Updates(updates).Error; err != nil {
		return nil, err
	}
	return &tag, nil
}

func (s *TagService) Delete(id uint) error {
	return s.db.Delete(&models.Tag{}, id).Error
}
```

- [ ] **Step 3: Create tag handler**

```go
// backend/handlers/tag.go
package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/models"
	"github.com/zyx/pixel-blog-backend/services"
	"gorm.io/gorm"
)

type TagHandler struct {
	service *services.TagService
}

func NewTagHandler(db *gorm.DB) *TagHandler {
	return &TagHandler{service: services.NewTagService(db)}
}

func (h *TagHandler) List(c *gin.Context) {
	tags, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": tags, "message": "ok"})
}

func (h *TagHandler) Create(c *gin.Context) {
	var tag models.Tag
	if err := c.ShouldBindJSON(&tag); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	if err := h.service.Create(&tag); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"code": 201, "data": tag, "message": "ok"})
}

func (h *TagHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	tag, err := h.service.Update(uint(id), updates)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "tag not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": tag, "message": "ok"})
}

func (h *TagHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "deleted"})
}
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go test ./tests/ -v -run TestTag
# Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/services/tag.go backend/handlers/tag.go backend/tests/tag_test.go
git commit -m "feat: add tag CRUD with service and handler"
```

---

### Task 6: Post CRUD with pagination and filtering

**Files:**
- Create: `backend/services/post.go`
- Create: `backend/handlers/post.go`
- Create: `backend/tests/post_test.go`

- [ ] **Step 1: Write post test**

```go
// backend/tests/post_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
	"github.com/zyx/pixel-blog-backend/models"
)

func setupPostRouter(t *testing.T) (*gin.Engine, string) {
	db := setupTestDB(t)
	cfg := &config.Config{JWTSecret: "test-secret"}
	r := gin.New()

	// Seed a category and tag for testing
	db.Create(&models.Category{Name: "Frontend", Slug: "frontend"})
	db.Create(&models.Tag{Name: "React", Slug: "react", Color: "blue"})

	authHandler := handlers.NewAuthHandler(db, cfg)
	postHandler := handlers.NewPostHandler(db)

	r.GET("/api/posts", postHandler.List)
	r.GET("/api/posts/:slug", postHandler.GetBySlug)
	r.POST("/api/auth/login", authHandler.Login)

	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	admin.GET("/posts", postHandler.AdminList)
	admin.POST("/posts", postHandler.Create)
	admin.PUT("/posts/:id", postHandler.Update)
	admin.DELETE("/posts/:id", postHandler.Delete)

	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "testpass"})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	token := resp["data"].(map[string]interface{})["token"].(string)

	return r, token
}

func TestPostCreateAndGet(t *testing.T) {
	r, token := setupPostRouter(t)

	// Create a published post
	catID := 1
	body, _ := json.Marshal(map[string]interface{}{
		"title":        "Hello Pixel World",
		"slug":         "hello-pixel-world",
		"content":      "# Hello\n\nThis is a test post.",
		"excerpt":      "A test post",
		"category_id":  catID,
		"tag_ids":      []int{1},
		"is_published": true,
	})
	req := httptest.NewRequest("POST", "/api/admin/posts", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 201 {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// Get by slug (public)
	req = httptest.NewRequest("GET", "/api/posts/hello-pixel-world", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("GetBySlug: expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	data := resp["data"].(map[string]interface{})
	if data["title"] != "Hello Pixel World" {
		t.Fatalf("Expected title 'Hello Pixel World', got '%s'", data["title"])
	}

	// Public list should show published posts
	req = httptest.NewRequest("GET", "/api/posts?page=1&size=10", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("List: expected 200, got %d", w.Code)
	}
	json.Unmarshal(w.Body.Bytes(), &resp)
	pageData := resp["data"].(map[string]interface{})
	if pageData["total"].(float64) != 1 {
		t.Fatalf("Expected total 1, got %v", pageData["total"])
	}
}

func TestPostDraftNotInPublicList(t *testing.T) {
	r, token := setupPostRouter(t)

	// Create a draft
	body, _ := json.Marshal(map[string]interface{}{
		"title":        "Draft Post",
		"slug":         "draft-post",
		"content":      "Draft content",
		"is_published": false,
	})
	req := httptest.NewRequest("POST", "/api/admin/posts", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 201 {
		t.Fatalf("Create draft: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// Public list should be empty
	req = httptest.NewRequest("GET", "/api/posts?page=1&size=10", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	pageData := resp["data"].(map[string]interface{})
	if pageData["total"].(float64) != 0 {
		t.Fatalf("Expected 0 published posts, got %v", pageData["total"])
	}

	// Admin list should show it
	req = httptest.NewRequest("GET", "/api/admin/posts?page=1&size=10", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	json.Unmarshal(w.Body.Bytes(), &resp)
	pageData = resp["data"].(map[string]interface{})
	if pageData["total"].(float64) != 1 {
		t.Fatalf("Admin list: expected 1, got %v", pageData["total"])
	}
}
```

- [ ] **Step 2: Create post service**

```go
// backend/services/post.go
package services

import (
	"math"
	"strings"
	"time"

	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type PostService struct {
	db *gorm.DB
}

func NewPostService(db *gorm.DB) *PostService {
	return &PostService{db: db}
}

type PaginatedPosts struct {
	Items      []models.Post `json:"items"`
	Total      int64         `json:"total"`
	Page       int           `json:"page"`
	Size       int           `json:"size"`
	TotalPages int           `json:"total_pages"`
}

type CreatePostRequest struct {
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Excerpt     string `json:"excerpt"`
	Content     string `json:"content"`
	CoverImage  string `json:"cover_image"`
	CategoryID  *uint  `json:"category_id"`
	TagIDs      []uint `json:"tag_ids"`
	IsPublished bool   `json:"is_published"`
}

func (s *PostService) ListPublished(page, size int, categorySlug, tagSlug string) (*PaginatedPosts, error) {
	query := s.db.Model(&models.Post{}).Where("is_published = ?", true)

	if categorySlug != "" {
		var cat models.Category
		if err := s.db.Where("slug = ?", categorySlug).First(&cat).Error; err == nil {
			query = query.Where("category_id = ?", cat.ID)
		}
	}

	if tagSlug != "" {
		var tag models.Tag
		if err := s.db.Where("slug = ?", tagSlug).First(&tag).Error; err == nil {
			query = query.Where("id IN (SELECT post_id FROM post_tags WHERE tag_id = ?)", tag.ID)
		}
	}

	var total int64
	query.Count(&total)

	var posts []models.Post
	err := query.Preload("Category").Preload("Tags").
		Order("published_at DESC, created_at DESC").
		Offset((page - 1) * size).Limit(size).
		Find(&posts).Error

	return &PaginatedPosts{
		Items:      posts,
		Total:      total,
		Page:       page,
		Size:       size,
		TotalPages: int(math.Ceil(float64(total) / float64(size))),
	}, err
}

func (s *PostService) AdminList(page, size int) (*PaginatedPosts, error) {
	var total int64
	s.db.Model(&models.Post{}).Count(&total)

	var posts []models.Post
	err := s.db.Preload("Category").Preload("Tags").
		Order("updated_at DESC").
		Offset((page - 1) * size).Limit(size).
		Find(&posts).Error

	return &PaginatedPosts{
		Items:      posts,
		Total:      total,
		Page:       page,
		Size:       size,
		TotalPages: int(math.Ceil(float64(total) / float64(size))),
	}, err
}

func (s *PostService) GetBySlug(slug string) (*models.Post, error) {
	var post models.Post
	err := s.db.Preload("Category").Preload("Tags").
		Where("slug = ? AND is_published = ?", slug, true).
		First(&post).Error
	return &post, err
}

func (s *PostService) Create(req *CreatePostRequest) (*models.Post, error) {
	// Estimate reading time: ~200 words per minute for Chinese, ~250 for English
	wordCount := len(strings.Fields(req.Content))
	readingTime := int(math.Ceil(float64(wordCount) / 200.0))
	if readingTime < 1 {
		readingTime = 1
	}

	post := models.Post{
		Title:       req.Title,
		Slug:        req.Slug,
		Excerpt:     req.Excerpt,
		Content:     req.Content,
		CoverImage:  req.CoverImage,
		CategoryID:  req.CategoryID,
		IsPublished: req.IsPublished,
		ReadingTime: readingTime,
	}

	if req.IsPublished {
		now := time.Now()
		post.PublishedAt = &now
	}

	if err := s.db.Create(&post).Error; err != nil {
		return nil, err
	}

	// Associate tags
	if len(req.TagIDs) > 0 {
		var tags []models.Tag
		s.db.Where("id IN ?", req.TagIDs).Find(&tags)
		s.db.Model(&post).Association("Tags").Replace(tags)
	}

	// Reload with associations
	s.db.Preload("Category").Preload("Tags").First(&post, post.ID)
	return &post, nil
}

func (s *PostService) Update(id uint, req *CreatePostRequest) (*models.Post, error) {
	var post models.Post
	if err := s.db.First(&post, id).Error; err != nil {
		return nil, err
	}

	post.Title = req.Title
	post.Slug = req.Slug
	post.Excerpt = req.Excerpt
	post.Content = req.Content
	post.CoverImage = req.CoverImage
	post.CategoryID = req.CategoryID
	post.IsPublished = req.IsPublished

	if req.IsPublished && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	wordCount := len(strings.Fields(req.Content))
	readingTime := int(math.Ceil(float64(wordCount) / 200.0))
	if readingTime < 1 {
		readingTime = 1
	}
	post.ReadingTime = readingTime

	if err := s.db.Save(&post).Error; err != nil {
		return nil, err
	}

	// Update tags
	var tags []models.Tag
	if len(req.TagIDs) > 0 {
		s.db.Where("id IN ?", req.TagIDs).Find(&tags)
	}
	s.db.Model(&post).Association("Tags").Replace(tags)

	s.db.Preload("Category").Preload("Tags").First(&post, post.ID)
	return &post, nil
}

func (s *PostService) Delete(id uint) error {
	// Clear tag associations first
	var post models.Post
	if err := s.db.First(&post, id).Error; err != nil {
		return err
	}
	s.db.Model(&post).Association("Tags").Clear()
	return s.db.Delete(&post).Error
}
```

- [ ] **Step 3: Create post handler**

```go
// backend/handlers/post.go
package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/services"
	"gorm.io/gorm"
)

type PostHandler struct {
	service *services.PostService
}

func NewPostHandler(db *gorm.DB) *PostHandler {
	return &PostHandler{service: services.NewPostService(db)}
}

func (h *PostHandler) List(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "10"))
	category := c.Query("category")
	tag := c.Query("tag")

	if page < 1 {
		page = 1
	}
	if size < 1 || size > 50 {
		size = 10
	}

	result, err := h.service.ListPublished(page, size, category, tag)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": result, "message": "ok"})
}

func (h *PostHandler) AdminList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	size, _ := strconv.Atoi(c.DefaultQuery("size", "10"))

	if page < 1 {
		page = 1
	}
	if size < 1 || size > 50 {
		size = 10
	}

	result, err := h.service.AdminList(page, size)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": result, "message": "ok"})
}

func (h *PostHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")
	post, err := h.service.GetBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "post not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": post, "message": "ok"})
}

func (h *PostHandler) Create(c *gin.Context) {
	var req services.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	post, err := h.service.Create(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"code": 201, "data": post, "message": "ok"})
}

func (h *PostHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	var req services.CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	post, err := h.service.Update(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "post not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": post, "message": "ok"})
}

func (h *PostHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "deleted"})
}
```

- [ ] **Step 4: Run tests**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go test ./tests/ -v -run TestPost
# Expected: PASS
```

- [ ] **Step 5: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/services/post.go backend/handlers/post.go backend/tests/post_test.go
git commit -m "feat: add post CRUD with pagination and category/tag filtering"
```

---

### Task 7: Music CRUD and file upload handlers

**Files:**
- Create: `backend/services/music.go`
- Create: `backend/handlers/music.go`
- Create: `backend/handlers/upload.go`
- Create: `backend/tests/music_test.go`

- [ ] **Step 1: Write music test**

```go
// backend/tests/music_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
)

func setupMusicRouter(t *testing.T) (*gin.Engine, string, string) {
	db := setupTestDB(t)
	uploadDir := t.TempDir()
	cfg := &config.Config{JWTSecret: "test-secret", UploadPath: uploadDir}
	r := gin.New()

	authHandler := handlers.NewAuthHandler(db, cfg)
	musicHandler := handlers.NewMusicHandler(db, cfg)
	uploadHandler := handlers.NewUploadHandler(cfg)

	r.GET("/api/music", musicHandler.List)
	r.POST("/api/auth/login", authHandler.Login)

	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	admin.POST("/music", musicHandler.Create)
	admin.PUT("/music/:id", musicHandler.Update)
	admin.DELETE("/music/:id", musicHandler.Delete)
	admin.PUT("/music/reorder", musicHandler.Reorder)
	admin.POST("/upload/image", uploadHandler.UploadImage)

	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "testpass"})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	token := resp["data"].(map[string]interface{})["token"].(string)

	return r, token, uploadDir
}

func TestMusicCRUD(t *testing.T) {
	r, token, uploadDir := setupMusicRouter(t)

	// Create a fake mp3 file for upload
	musicDir := filepath.Join(uploadDir, "music")
	os.MkdirAll(musicDir, 0755)

	// Create via multipart upload
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	writer.WriteField("title", "Pixel Dreams")
	writer.WriteField("artist", "Chiptune Artist")
	writer.WriteField("duration", "180")
	part, _ := writer.CreateFormFile("file", "test.mp3")
	part.Write([]byte("fake mp3 content"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/admin/music", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 201 {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// List
	req = httptest.NewRequest("GET", "/api/music", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("List: expected 200, got %d", w.Code)
	}

	var listResp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &listResp)
	items := listResp["data"].([]interface{})
	if len(items) != 1 {
		t.Fatalf("Expected 1 track, got %d", len(items))
	}

	// Delete
	req = httptest.NewRequest("DELETE", "/api/admin/music/1", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Delete: expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestImageUpload(t *testing.T) {
	r, token, _ := setupMusicRouter(t)

	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	part, _ := writer.CreateFormFile("file", "test.png")
	// Minimal valid PNG header
	part.Write([]byte("\x89PNG\r\n\x1a\n"))
	writer.Close()

	req := httptest.NewRequest("POST", "/api/admin/upload/image", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("Upload: expected 200, got %d: %s", w.Code, w.Body.String())
	}

	var resp map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &resp)
	data := resp["data"].(map[string]interface{})
	url := data["url"].(string)
	if url == "" {
		t.Fatal("Expected non-empty url")
	}
}
```

- [ ] **Step 2: Create music service**

```go
// backend/services/music.go
package services

import (
	"os"
	"path/filepath"

	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type MusicService struct {
	db         *gorm.DB
	uploadPath string
}

func NewMusicService(db *gorm.DB, uploadPath string) *MusicService {
	return &MusicService{db: db, uploadPath: uploadPath}
}

func (s *MusicService) List() ([]models.MusicTrack, error) {
	var tracks []models.MusicTrack
	err := s.db.Order("sort_order ASC, id ASC").Find(&tracks).Error
	return tracks, err
}

func (s *MusicService) Create(track *models.MusicTrack) error {
	// Set sort_order to the end
	var maxOrder int
	s.db.Model(&models.MusicTrack{}).Select("COALESCE(MAX(sort_order), 0)").Scan(&maxOrder)
	track.SortOrder = maxOrder + 1
	return s.db.Create(track).Error
}

func (s *MusicService) Update(id uint, updates map[string]interface{}) (*models.MusicTrack, error) {
	var track models.MusicTrack
	if err := s.db.First(&track, id).Error; err != nil {
		return nil, err
	}
	if err := s.db.Model(&track).Updates(updates).Error; err != nil {
		return nil, err
	}
	return &track, nil
}

func (s *MusicService) Delete(id uint) error {
	var track models.MusicTrack
	if err := s.db.First(&track, id).Error; err != nil {
		return err
	}

	// Delete file
	if track.FilePath != "" {
		os.Remove(filepath.Join(s.uploadPath, track.FilePath))
	}
	if track.CoverPath != "" {
		os.Remove(filepath.Join(s.uploadPath, track.CoverPath))
	}

	return s.db.Delete(&track).Error
}

func (s *MusicService) Reorder(ids []uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		for i, id := range ids {
			if err := tx.Model(&models.MusicTrack{}).Where("id = ?", id).Update("sort_order", i).Error; err != nil {
				return err
			}
		}
		return nil
	})
}
```

- [ ] **Step 3: Create music handler**

```go
// backend/handlers/music.go
package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/models"
	"github.com/zyx/pixel-blog-backend/services"
	"gorm.io/gorm"
)

type MusicHandler struct {
	service    *services.MusicService
	uploadPath string
}

func NewMusicHandler(db *gorm.DB, cfg *config.Config) *MusicHandler {
	return &MusicHandler{
		service:    services.NewMusicService(db, cfg.UploadPath),
		uploadPath: cfg.UploadPath,
	}
}

func (h *MusicHandler) List(c *gin.Context) {
	tracks, err := h.service.List()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": tracks, "message": "ok"})
}

func (h *MusicHandler) Create(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "music file required"})
		return
	}

	if file.Size > 20<<20 { // 20MB
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "file too large (max 20MB)"})
		return
	}

	// Save file
	musicDir := filepath.Join(h.uploadPath, "music")
	os.MkdirAll(musicDir, 0755)
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	filePath := filepath.Join(musicDir, filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to save file"})
		return
	}

	title := c.PostForm("title")
	artist := c.DefaultPostForm("artist", "Unknown")
	duration, _ := strconv.Atoi(c.DefaultPostForm("duration", "0"))

	track := models.MusicTrack{
		Title:    title,
		Artist:   artist,
		FilePath: filepath.Join("music", filename),
		Duration: duration,
	}

	// Handle cover image
	coverFile, err := c.FormFile("cover")
	if err == nil {
		coverDir := filepath.Join(h.uploadPath, "images")
		os.MkdirAll(coverDir, 0755)
		coverExt := filepath.Ext(coverFile.Filename)
		coverName := fmt.Sprintf("%s%s", uuid.New().String(), coverExt)
		coverPath := filepath.Join(coverDir, coverName)
		if err := c.SaveUploadedFile(coverFile, coverPath); err == nil {
			track.CoverPath = filepath.Join("images", coverName)
		}
	}

	if err := h.service.Create(&track); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"code": 201, "data": track, "message": "ok"})
}

func (h *MusicHandler) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	var updates map[string]interface{}
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	track, err := h.service.Update(uint(id), updates)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "track not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "data": track, "message": "ok"})
}

func (h *MusicHandler) Delete(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid id"})
		return
	}
	if err := h.service.Delete(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "deleted"})
}

type reorderRequest struct {
	IDs []uint `json:"ids" binding:"required"`
}

func (h *MusicHandler) Reorder(c *gin.Context) {
	var req reorderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": err.Error()})
		return
	}
	if err := h.service.Reorder(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"code": 200, "message": "reordered"})
}
```

- [ ] **Step 4: Create upload handler**

```go
// backend/handlers/upload.go
package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/zyx/pixel-blog-backend/config"
)

type UploadHandler struct {
	uploadPath string
}

func NewUploadHandler(cfg *config.Config) *UploadHandler {
	return &UploadHandler{uploadPath: cfg.UploadPath}
}

var allowedImageTypes = map[string]bool{
	".jpg": true, ".jpeg": true, ".png": true, ".gif": true, ".webp": true,
}

func (h *UploadHandler) UploadImage(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "file required"})
		return
	}

	if file.Size > 5<<20 { // 5MB
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "file too large (max 5MB)"})
		return
	}

	ext := strings.ToLower(filepath.Ext(file.Filename))
	if !allowedImageTypes[ext] {
		c.JSON(http.StatusBadRequest, gin.H{"code": 400, "message": "invalid image type"})
		return
	}

	imageDir := filepath.Join(h.uploadPath, "images")
	os.MkdirAll(imageDir, 0755)

	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	savePath := filepath.Join(imageDir, filename)
	if err := c.SaveUploadedFile(file, savePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to save file"})
		return
	}

	url := fmt.Sprintf("/uploads/images/%s", filename)
	c.JSON(http.StatusOK, gin.H{
		"code":    200,
		"data":    gin.H{"url": url},
		"message": "ok",
	})
}
```

- [ ] **Step 5: Install uuid dependency and run tests**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go get github.com/google/uuid
go test ./tests/ -v -run TestMusic
go test ./tests/ -v -run TestImageUpload
# Expected: all PASS
```

- [ ] **Step 6: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/services/music.go backend/handlers/music.go backend/handlers/upload.go backend/tests/music_test.go backend/go.mod backend/go.sum
git commit -m "feat: add music CRUD, file upload, and image upload handlers"
```

---

### Task 8: Wire up all routes in main.go

**Files:**
- Modify: `backend/main.go`

- [ ] **Step 1: Update main.go with all routes**

```go
// backend/main.go
package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/database"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
)

func main() {
	cfg := config.Load()

	db := database.Init(cfg.DBPath)
	database.SeedAdmin(db, cfg.AdminUser, cfg.AdminPass)

	r := gin.Default()
	r.Use(middleware.CORS())

	// Static files
	r.Static("/uploads", cfg.UploadPath)

	// Health check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Init handlers
	authHandler := handlers.NewAuthHandler(db, cfg)
	postHandler := handlers.NewPostHandler(db)
	catHandler := handlers.NewCategoryHandler(db)
	tagHandler := handlers.NewTagHandler(db)
	musicHandler := handlers.NewMusicHandler(db, cfg)
	uploadHandler := handlers.NewUploadHandler(cfg)

	// Public routes
	public := r.Group("/api")
	{
		public.GET("/posts", postHandler.List)
		public.GET("/posts/:slug", postHandler.GetBySlug)
		public.GET("/categories", catHandler.List)
		public.GET("/tags", tagHandler.List)
		public.GET("/music", musicHandler.List)
		public.POST("/auth/login", authHandler.Login)
		public.POST("/auth/refresh", authHandler.Refresh)
	}

	// Admin routes
	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	{
		admin.GET("/posts", postHandler.AdminList)
		admin.POST("/posts", postHandler.Create)
		admin.PUT("/posts/:id", postHandler.Update)
		admin.DELETE("/posts/:id", postHandler.Delete)

		admin.POST("/categories", catHandler.Create)
		admin.PUT("/categories/:id", catHandler.Update)
		admin.DELETE("/categories/:id", catHandler.Delete)

		admin.POST("/tags", tagHandler.Create)
		admin.PUT("/tags/:id", tagHandler.Update)
		admin.DELETE("/tags/:id", tagHandler.Delete)

		admin.POST("/music", musicHandler.Create)
		admin.PUT("/music/:id", musicHandler.Update)
		admin.DELETE("/music/:id", musicHandler.Delete)
		admin.PUT("/music/reorder", musicHandler.Reorder)

		admin.POST("/upload/image", uploadHandler.UploadImage)
	}

	log.Printf("Starting server on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
```

- [ ] **Step 2: Run all tests**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
go test ./tests/ -v
# Expected: all tests PASS
```

- [ ] **Step 3: Verify server starts**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/backend
mkdir -p data uploads/images uploads/music
go run main.go &
sleep 1
curl http://localhost:8080/api/health
curl http://localhost:8080/api/posts?page=1
curl http://localhost:8080/api/categories
curl http://localhost:8080/api/tags
curl http://localhost:8080/api/music
kill %1
# Expected: all return 200 with JSON responses
```

- [ ] **Step 4: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/main.go
git commit -m "feat: wire up all API routes in main.go"
```

---

## Phase 2: Frontend Foundation

### Task 9: Initialize Next.js project with Tailwind and pixel tokens

**Files:**
- Create: `frontend/package.json` (via npx)
- Create: `frontend/tailwind.config.ts`
- Create: `frontend/src/app/globals.css`
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/next.config.js`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
npx create-next-app@14 frontend --typescript --tailwind --eslint --app --src-dir --no-import-alias
```

- [ ] **Step 2: Install dependencies**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/frontend
npm install zustand @tanstack/react-query react-markdown remark-gfm rehype-highlight rehype-slug rehype-raw @uiw/react-md-editor
```

- [ ] **Step 3: Configure next.config.js**

```js
// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8080'}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${process.env.API_URL || 'http://localhost:8080'}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

- [ ] **Step 4: Set up globals.css with pixel design tokens**

```css
/* frontend/src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: 'Press Start 2P';
  src: url('/fonts/PressStart2P-Regular.ttf') format('truetype');
  font-display: swap;
}

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

* {
  box-sizing: border-box;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background: var(--color-bg);
  transition: background 0.2s, color 0.2s;
}

/* Pixel component base styles */
.pixel-border {
  border: var(--pixel-border) solid var(--color-border);
  box-shadow: var(--pixel-shadow) var(--pixel-shadow) 0px var(--color-shadow);
}

.pixel-border-hover {
  transition: transform 0.1s, box-shadow 0.1s;
}

.pixel-border-hover:hover {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px var(--color-shadow);
}

.pixel-border-hover:active {
  transform: translate(3px, 3px);
  box-shadow: 0px 0px 0px var(--color-shadow);
}

/* Code blocks */
pre code {
  font-family: var(--font-code);
}

/* Pixel art rendering */
.pixel-art {
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
```

- [ ] **Step 5: Update tailwind.config.ts**

```ts
// frontend/tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-secondary": "var(--color-bg-secondary)",
        text: "var(--color-text)",
        "text-secondary": "var(--color-text-secondary)",
        border: "var(--color-border)",
        shadow: "var(--color-shadow)",
        primary: "var(--color-primary)",
        yellow: "var(--color-yellow)",
        green: "var(--color-green)",
        red: "var(--color-red)",
      },
      fontFamily: {
        pixel: ["var(--font-pixel)"],
        body: ["var(--font-body)"],
        code: ["var(--font-code)"],
      },
      animation: {
        "spin-slow": "spin 4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 6: Create root layout**

```tsx
// frontend/src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel Blog",
  description: "A pixel-art styled dev blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (!t) {
                  t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                document.documentElement.setAttribute('data-theme', t);
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 7: Download fonts to public/fonts/**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/frontend
mkdir -p public/fonts public/images
# Download Press Start 2P from Google Fonts
curl -L "https://fonts.gstatic.com/s/pressstart2p/v15/e3t4euO8T-267oIAQAu6jDQyK3nVivM.ttf" -o public/fonts/PressStart2P-Regular.ttf
```

Note: Inter and JetBrains Mono can be loaded via `next/font` or Google Fonts CDN. For simplicity, use Google Fonts link in layout or `next/font/google`.

- [ ] **Step 8: Verify dev server starts**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/frontend
npm run dev &
sleep 3
curl -s http://localhost:3000 | head -20
kill %1
# Expected: HTML output with "Pixel Blog"
```

- [ ] **Step 9: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/package.json frontend/package-lock.json frontend/tsconfig.json frontend/next.config.js frontend/tailwind.config.ts frontend/postcss.config.js frontend/src/app/globals.css frontend/src/app/layout.tsx frontend/public/fonts/ frontend/.eslintrc.json
git commit -m "feat: initialize Next.js frontend with Tailwind and pixel design tokens"
```

---

### Task 10: TypeScript types and API client

**Files:**
- Create: `frontend/src/types/index.ts`
- Create: `frontend/src/lib/api.ts`
- Create: `frontend/src/lib/constants.ts`

- [ ] **Step 1: Create shared types**

```ts
// frontend/src/types/index.ts
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
```

- [ ] **Step 2: Create API client**

```ts
// frontend/src/lib/api.ts
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
```

- [ ] **Step 3: Create constants**

```ts
// frontend/src/lib/constants.ts
export const POSTS_PER_PAGE = 10;

export const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-primary/15", text: "text-primary" },
  yellow: { bg: "bg-yellow/15", text: "text-yellow" },
  green: { bg: "bg-green/15", text: "text-green" },
  red: { bg: "bg-red/15", text: "text-red" },
};
```

- [ ] **Step 4: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/types/ frontend/src/lib/
git commit -m "feat: add TypeScript types, API client, and constants"
```

---

### Task 11: Pixel UI component library

**Files:**
- Create: `frontend/src/components/pixel/PixelButton.tsx`
- Create: `frontend/src/components/pixel/PixelCard.tsx`
- Create: `frontend/src/components/pixel/PixelTag.tsx`
- Create: `frontend/src/components/pixel/PixelInput.tsx`
- Create: `frontend/src/components/pixel/PixelSelect.tsx`
- Create: `frontend/src/components/pixel/PixelToggle.tsx`
- Create: `frontend/src/components/pixel/PixelModal.tsx`
- Create: `frontend/src/components/pixel/PixelPagination.tsx`
- Create: `frontend/src/components/pixel/index.ts`

- [ ] **Step 1: Create PixelButton**

```tsx
// frontend/src/components/pixel/PixelButton.tsx
"use client";

import { ButtonHTMLAttributes } from "react";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-primary text-white",
  secondary: "bg-bg-secondary text-text",
  danger: "bg-red text-white",
};

const sizeStyles = {
  sm: "px-3 py-1 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function PixelButton({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: PixelButtonProps) {
  return (
    <button
      className={`font-pixel pixel-border pixel-border-hover cursor-pointer ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 2: Create PixelCard**

```tsx
// frontend/src/components/pixel/PixelCard.tsx
interface PixelCardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  padding?: "sm" | "md" | "lg";
  className?: string;
}

const paddingStyles = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export default function PixelCard({
  children,
  hoverable = false,
  padding = "md",
  className = "",
}: PixelCardProps) {
  return (
    <div
      className={`pixel-border bg-bg ${paddingStyles[padding]} ${
        hoverable ? "pixel-border-hover cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Create PixelTag**

```tsx
// frontend/src/components/pixel/PixelTag.tsx
import { TAG_COLORS } from "@/lib/constants";

interface PixelTagProps {
  color?: "blue" | "yellow" | "green" | "red";
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function PixelTag({
  color = "blue",
  children,
  onClick,
  className = "",
}: PixelTagProps) {
  const colors = TAG_COLORS[color] || TAG_COLORS.blue;
  return (
    <span
      onClick={onClick}
      className={`inline-block px-2 py-1 text-[0.6rem] font-pixel border-2 border-border ${colors.bg} ${colors.text} ${
        onClick ? "cursor-pointer hover:opacity-80" : ""
      } ${className}`}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Create PixelInput**

```tsx
// frontend/src/components/pixel/PixelInput.tsx
"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface PixelInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function PixelInput({ label, className = "", ...props }: PixelInputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-pixel text-xs text-text-secondary">{label}</label>}
      <input
        className={`px-3 py-2 bg-bg border-[3px] border-border text-text font-body outline-none focus:border-primary transition-colors ${className}`}
        {...props}
      />
    </div>
  );
}

interface PixelTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function PixelTextarea({ label, className = "", ...props }: PixelTextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-pixel text-xs text-text-secondary">{label}</label>}
      <textarea
        className={`px-3 py-2 bg-bg border-[3px] border-border text-text font-body outline-none focus:border-primary transition-colors resize-y ${className}`}
        {...props}
      />
    </div>
  );
}
```

- [ ] **Step 5: Create PixelSelect**

```tsx
// frontend/src/components/pixel/PixelSelect.tsx
"use client";

import { SelectHTMLAttributes } from "react";

interface PixelSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export default function PixelSelect({ label, options, className = "", ...props }: PixelSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-pixel text-xs text-text-secondary">{label}</label>}
      <select
        className={`px-3 py-2 bg-bg border-[3px] border-border text-text font-body outline-none focus:border-primary ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 6: Create PixelToggle**

```tsx
// frontend/src/components/pixel/PixelToggle.tsx
"use client";

interface PixelToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export default function PixelToggle({ checked, onChange, label }: PixelToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 border-[3px] border-border transition-colors ${
          checked ? "bg-primary" : "bg-bg-secondary"
        }`}
      >
        <div
          className={`absolute top-0 w-4 h-full bg-text transition-transform ${
            checked ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
      {label && <span className="font-pixel text-xs">{label}</span>}
    </label>
  );
}
```

- [ ] **Step 7: Create PixelModal**

```tsx
// frontend/src/components/pixel/PixelModal.tsx
"use client";

interface PixelModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function PixelModal({ open, onClose, title, children }: PixelModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative pixel-border bg-bg p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-pixel text-sm">{title}</h2>
          <button onClick={onClose} className="font-pixel text-lg hover:text-primary">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Create PixelPagination**

```tsx
// frontend/src/components/pixel/PixelPagination.tsx
"use client";

interface PixelPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PixelPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PixelPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex gap-2 items-center justify-center mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-3 py-1 font-pixel text-xs pixel-border pixel-border-hover disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ◀
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 font-pixel text-xs pixel-border pixel-border-hover ${
            page === currentPage ? "bg-primary text-white" : "bg-bg"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-3 py-1 font-pixel text-xs pixel-border pixel-border-hover disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ▶
      </button>
    </div>
  );
}
```

- [ ] **Step 9: Create barrel export**

```ts
// frontend/src/components/pixel/index.ts
export { default as PixelButton } from "./PixelButton";
export { default as PixelCard } from "./PixelCard";
export { default as PixelTag } from "./PixelTag";
export { default as PixelInput, PixelTextarea } from "./PixelInput";
export { default as PixelSelect } from "./PixelSelect";
export { default as PixelToggle } from "./PixelToggle";
export { default as PixelModal } from "./PixelModal";
export { default as PixelPagination } from "./PixelPagination";
```

- [ ] **Step 10: Verify build**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog/frontend
npx tsc --noEmit
# Expected: no type errors
```

- [ ] **Step 11: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/components/pixel/
git commit -m "feat: add pixel UI component library"
```

---

### Task 12: Theme toggle and Zustand stores

**Files:**
- Create: `frontend/src/stores/themeStore.ts`
- Create: `frontend/src/stores/musicStore.ts`
- Create: `frontend/src/components/ThemeToggle.tsx`

- [ ] **Step 1: Create theme store**

```ts
// frontend/src/stores/themeStore.ts
import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: (typeof window !== "undefined"
    ? (document.documentElement.getAttribute("data-theme") as Theme) || "light"
    : "light"),
  toggle: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return { theme: next };
    }),
}));
```

- [ ] **Step 2: Create music store**

```ts
// frontend/src/stores/musicStore.ts
import { create } from "zustand";
import { MusicTrack } from "@/types";

type RepeatMode = "none" | "all" | "one";

interface MusicState {
  playlist: MusicTrack[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  setPlaylist: (tracks: MusicTrack[]) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (dur: number) => void;
  cycleRepeat: () => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  playlist: [],
  currentIndex: 0,
  isPlaying: false,
  volume: 70,
  currentTime: 0,
  duration: 0,
  repeatMode: "none",
  setPlaylist: (tracks) => set({ playlist: tracks }),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () => {
    const { playlist, currentIndex, repeatMode } = get();
    if (playlist.length === 0) return;
    if (repeatMode === "one") {
      set({ currentTime: 0 });
      return;
    }
    const nextIndex = (currentIndex + 1) % playlist.length;
    if (nextIndex === 0 && repeatMode === "none") {
      set({ isPlaying: false, currentIndex: 0, currentTime: 0 });
    } else {
      set({ currentIndex: nextIndex, currentTime: 0 });
    }
  },
  prev: () => {
    const { playlist, currentIndex } = get();
    if (playlist.length === 0) return;
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    set({ currentIndex: prevIndex, currentTime: 0 });
  },
  seek: (time) => set({ currentTime: time }),
  setVolume: (vol) => set({ volume: vol }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (dur) => set({ duration: dur }),
  cycleRepeat: () =>
    set((s) => {
      const modes: RepeatMode[] = ["none", "all", "one"];
      const idx = modes.indexOf(s.repeatMode);
      return { repeatMode: modes[(idx + 1) % modes.length] };
    }),
}));
```

- [ ] **Step 3: Create ThemeToggle component**

```tsx
// frontend/src/components/ThemeToggle.tsx
"use client";

import { useThemeStore } from "@/stores/themeStore";

export default function ThemeToggle() {
  const { theme, toggle } = useThemeStore();

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 flex items-center justify-center pixel-border pixel-border-hover bg-bg text-lg"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/stores/ frontend/src/components/ThemeToggle.tsx
git commit -m "feat: add theme and music Zustand stores with ThemeToggle"
```

---

### Task 13: Layout components (Header, Sidebar, ProfileCard, MobileNav)

**Files:**
- Create: `frontend/src/components/layout/Header.tsx`
- Create: `frontend/src/components/layout/Sidebar.tsx`
- Create: `frontend/src/components/layout/ProfileCard.tsx`
- Create: `frontend/src/components/layout/MobileNav.tsx`

- [ ] **Step 1: Create Header**

```tsx
// frontend/src/components/layout/Header.tsx
"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  return (
    <header className="pixel-border bg-bg mb-6">
      <div className="max-w-[1100px] mx-auto px-4 md:px-10 py-3 flex items-center justify-between">
        <Link href="/" className="font-pixel text-sm md:text-base text-primary hover:opacity-80">
          🎮 PIXEL BLOG
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="font-pixel text-[0.6rem] hover:text-primary">
            Home
          </Link>
          <Link href="/admin" className="font-pixel text-[0.6rem] hover:text-primary">
            Admin
          </Link>
          <ThemeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create ProfileCard**

```tsx
// frontend/src/components/layout/ProfileCard.tsx
import { PixelCard } from "@/components/pixel";

export default function ProfileCard() {
  return (
    <PixelCard className="text-center">
      <div className="w-16 h-16 mx-auto mb-3 pixel-border overflow-hidden">
        <img
          src="/images/squirtle-sprite.png"
          alt="Avatar"
          className="w-full h-full pixel-art object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect fill='%234A90D9' width='64' height='64'/><text x='32' y='40' text-anchor='middle' font-size='32'>🐢</text></svg>";
          }}
        />
      </div>
      <h2 className="font-pixel text-xs mb-1">Pixel Dev</h2>
      <p className="text-text-secondary text-xs">开发者 / 博主</p>
    </PixelCard>
  );
}
```

- [ ] **Step 3: Create Sidebar**

```tsx
// frontend/src/components/layout/Sidebar.tsx
import ProfileCard from "./ProfileCard";
import CategoryFilter from "@/components/blog/CategoryFilter";
import TagCloud from "@/components/blog/TagCloud";
import MusicPlayer from "@/components/music/MusicPlayer";
import { Category, Tag } from "@/types";

interface SidebarProps {
  categories: Category[];
  tags: Tag[];
  currentCategory?: string;
  currentTag?: string;
}

export default function Sidebar({ categories, tags, currentCategory, currentTag }: SidebarProps) {
  return (
    <aside className="hidden md:flex flex-col gap-4 sticky top-6 self-start">
      <ProfileCard />
      <CategoryFilter categories={categories} currentSlug={currentCategory} />
      <TagCloud tags={tags} currentSlug={currentTag} />
      <MusicPlayer />
    </aside>
  );
}
```

- [ ] **Step 4: Create MobileNav**

```tsx
// frontend/src/components/layout/MobileNav.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Category } from "@/types";

interface MobileNavProps {
  categories: Category[];
}

export default function MobileNav({ categories }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger button in header area for mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 right-14 z-50 w-8 h-8 flex items-center justify-center pixel-border bg-bg font-pixel text-xs"
      >
        {isOpen ? "×" : "☰"}
      </button>

      {/* Slide-out drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-64 bg-bg pixel-border p-4 overflow-y-auto">
            <h3 className="font-pixel text-xs mb-4 mt-10">分类</h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="text-sm hover:text-primary"
                >
                  📁 {cat.name} ({cat.post_count || 0})
                </Link>
              ))}
            </div>
            <hr className="my-4 border-border" />
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="text-sm hover:text-primary"
            >
              ⚙️ Admin
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/components/layout/
git commit -m "feat: add layout components (Header, Sidebar, ProfileCard, MobileNav)"
```

---

### Task 14: Blog components (PostCard, PostList, PostContent, CategoryFilter, TagCloud)

**Files:**
- Create: `frontend/src/components/blog/PostCard.tsx`
- Create: `frontend/src/components/blog/PostList.tsx`
- Create: `frontend/src/components/blog/PostContent.tsx`
- Create: `frontend/src/components/blog/CategoryFilter.tsx`
- Create: `frontend/src/components/blog/TagCloud.tsx`
- Create: `frontend/src/lib/markdown.ts`

- [ ] **Step 1: Create CategoryFilter**

```tsx
// frontend/src/components/blog/CategoryFilter.tsx
import Link from "next/link";
import { PixelCard } from "@/components/pixel";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  currentSlug?: string;
}

export default function CategoryFilter({ categories, currentSlug }: CategoryFilterProps) {
  return (
    <PixelCard>
      <h3 className="font-pixel text-[0.65rem] mb-3">分类</h3>
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className={`text-sm hover:text-primary ${!currentSlug ? "text-primary font-bold" : ""}`}
        >
          📁 全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className={`text-sm hover:text-primary ${
              currentSlug === cat.slug ? "text-primary font-bold" : ""
            }`}
          >
            📁 {cat.name} ({cat.post_count || 0})
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
```

- [ ] **Step 2: Create TagCloud**

```tsx
// frontend/src/components/blog/TagCloud.tsx
import Link from "next/link";
import { PixelCard, PixelTag } from "@/components/pixel";
import { Tag } from "@/types";

interface TagCloudProps {
  tags: Tag[];
  currentSlug?: string;
}

export default function TagCloud({ tags, currentSlug }: TagCloudProps) {
  if (tags.length === 0) return null;

  return (
    <PixelCard>
      <h3 className="font-pixel text-[0.65rem] mb-3">标签</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link key={tag.id} href={`/tag/${tag.slug}`}>
            <PixelTag
              color={tag.color}
              className={currentSlug === tag.slug ? "ring-2 ring-primary" : ""}
            >
              {tag.name}
            </PixelTag>
          </Link>
        ))}
      </div>
    </PixelCard>
  );
}
```

- [ ] **Step 3: Create PostCard**

```tsx
// frontend/src/components/blog/PostCard.tsx
import Link from "next/link";
import { PixelCard, PixelTag } from "@/components/pixel";
import { Post } from "@/types";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <PixelCard hoverable>
      <Link href={`/posts/${post.slug}`} className="block">
        {post.cover_image && (
          <div className="mb-3 -mx-4 -mt-4 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-40 object-cover"
            />
          </div>
        )}
        <div className="flex gap-2 mb-2 flex-wrap">
          {post.category && (
            <PixelTag color="blue">{post.category.name}</PixelTag>
          )}
          {post.tags?.map((tag) => (
            <PixelTag key={tag.id} color={tag.color}>
              {tag.name}
            </PixelTag>
          ))}
        </div>
        <h2 className="font-pixel text-[0.7rem] leading-relaxed mb-2">{post.title}</h2>
        {post.excerpt && (
          <p className="text-text-secondary text-sm mb-2 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="text-text-secondary text-xs">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString("zh-CN")
            : new Date(post.created_at).toLocaleDateString("zh-CN")}
          {" · "}
          {post.reading_time} min read
        </div>
      </Link>
    </PixelCard>
  );
}
```

- [ ] **Step 4: Create PostList**

```tsx
// frontend/src/components/blog/PostList.tsx
import PostCard from "./PostCard";
import { Post } from "@/types";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-pixel text-sm text-text-secondary">暂无文章</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create markdown renderer config**

```ts
// frontend/src/lib/markdown.ts
export const markdownOptions = {
  remarkPlugins: [],
  rehypePlugins: [],
};

// These will be dynamically imported in PostContent to avoid SSR issues
```

- [ ] **Step 6: Create PostContent**

```tsx
// frontend/src/components/blog/PostContent.tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import "highlight.js/styles/github-dark.css";

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
        components={{
          pre: ({ children }) => (
            <pre className="pixel-border bg-bg-secondary p-4 overflow-x-auto font-code text-sm">
              {children}
            </pre>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-bg-secondary px-1 py-0.5 border border-border text-sm font-code">
                  {children}
                </code>
              );
            }
            return <code className={className}>{children}</code>;
          },
          h1: ({ children }) => (
            <h1 className="font-pixel text-base mb-4 mt-8">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-pixel text-sm mb-3 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-pixel text-xs mb-2 mt-4">{children}</h3>
          ),
          a: ({ children, href }) => (
            <a href={href} className="text-primary hover:underline">
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img src={src} alt={alt || ""} className="pixel-border max-w-full" />
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="pixel-border w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border px-3 py-2 bg-bg-secondary font-pixel text-xs text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-border px-3 py-2">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/components/blog/ frontend/src/lib/markdown.ts
git commit -m "feat: add blog components (PostCard, PostList, PostContent, CategoryFilter, TagCloud)"
```

---

### Task 15: Music player with vinyl record animation

**Files:**
- Create: `frontend/src/components/music/VinylRecord.tsx`
- Create: `frontend/src/components/music/PlayerControls.tsx`
- Create: `frontend/src/components/music/MusicPlayer.tsx`

- [ ] **Step 1: Create VinylRecord**

```tsx
// frontend/src/components/music/VinylRecord.tsx
"use client";

interface VinylRecordProps {
  coverUrl?: string;
  isPlaying: boolean;
}

export default function VinylRecord({ coverUrl, isPlaying }: VinylRecordProps) {
  return (
    <div
      className={`w-[60px] h-[60px] rounded-full border-[3px] border-border overflow-hidden relative flex-shrink-0 ${
        isPlaying ? "animate-spin-slow" : ""
      }`}
      style={{ animationPlayState: isPlaying ? "running" : "paused" }}
    >
      {coverUrl ? (
        <img src={coverUrl} alt="Cover" className="w-full h-full object-cover pixel-art" />
      ) : (
        <div className="w-full h-full bg-text flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-bg-secondary border-2 border-border" />
        </div>
      )}
      {/* Center hole */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-bg border-2 border-border" />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create PlayerControls**

```tsx
// frontend/src/components/music/PlayerControls.tsx
"use client";

interface PlayerControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  repeatMode: "none" | "all" | "one";
  onCycleRepeat: () => void;
}

const repeatIcons = { none: "➡️", all: "🔁", one: "🔂" };

export default function PlayerControls({
  isPlaying,
  onToggle,
  onPrev,
  onNext,
  repeatMode,
  onCycleRepeat,
}: PlayerControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button onClick={onPrev} className="w-6 h-6 flex items-center justify-center text-xs hover:text-primary">
        ⏮
      </button>
      <button
        onClick={onToggle}
        className="w-8 h-8 flex items-center justify-center pixel-border pixel-border-hover bg-bg text-sm"
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <button onClick={onNext} className="w-6 h-6 flex items-center justify-center text-xs hover:text-primary">
        ⏭
      </button>
      <button
        onClick={onCycleRepeat}
        className="w-6 h-6 flex items-center justify-center text-[0.5rem] hover:text-primary"
        title={`Repeat: ${repeatMode}`}
      >
        {repeatIcons[repeatMode]}
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Create MusicPlayer**

```tsx
// frontend/src/components/music/MusicPlayer.tsx
"use client";

import { useEffect, useRef } from "react";
import { useMusicStore } from "@/stores/musicStore";
import { getMusic } from "@/lib/api";
import { PixelCard } from "@/components/pixel";
import VinylRecord from "./VinylRecord";
import PlayerControls from "./PlayerControls";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    playlist,
    currentIndex,
    isPlaying,
    volume,
    repeatMode,
    setPlaylist,
    play,
    pause,
    toggle,
    next,
    prev,
    seek,
    setCurrentTime,
    setDuration,
    setVolume,
    cycleRepeat,
    currentTime,
    duration,
  } = useMusicStore();

  // Load playlist on mount
  useEffect(() => {
    getMusic().then(setPlaylist).catch(() => {});
  }, [setPlaylist]);

  // Sync audio element with store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || playlist.length === 0) return;

    const track = playlist[currentIndex];
    if (!track) return;

    const src = `/uploads/${track.file_path}`;
    if (audio.src !== window.location.origin + src) {
      audio.src = src;
      if (isPlaying) audio.play().catch(() => {});
    }
  }, [currentIndex, playlist]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  const currentTrack = playlist[currentIndex];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (playlist.length === 0) return null;

  return (
    <PixelCard padding="sm">
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={next}
      />
      <h3 className="font-pixel text-[0.5rem] mb-2 text-text-secondary">🎵 Now Playing</h3>
      <div className="flex items-center gap-3">
        <VinylRecord
          coverUrl={currentTrack?.cover_path ? `/uploads/${currentTrack.cover_path}` : undefined}
          isPlaying={isPlaying}
        />
        <div className="flex-1 min-w-0">
          <p className="font-pixel text-[0.5rem] truncate">{currentTrack?.title || "---"}</p>
          <p className="text-[0.6rem] text-text-secondary truncate">
            {currentTrack?.artist || "Unknown"}
          </p>
          <PlayerControls
            isPlaying={isPlaying}
            onToggle={toggle}
            onPrev={prev}
            onNext={next}
            repeatMode={repeatMode}
            onCycleRepeat={cycleRepeat}
          />
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 flex items-center gap-2 text-[0.5rem] text-text-secondary">
        <span>{formatTime(currentTime)}</span>
        <div
          className="flex-1 h-1 bg-bg-secondary border border-border cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const time = pct * duration;
            seek(time);
            if (audioRef.current) audioRef.current.currentTime = time;
          }}
        >
          <div
            className="h-full bg-primary"
            style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : "0%" }}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      {/* Volume */}
      <div className="mt-1 flex items-center gap-2">
        <span className="text-[0.5rem]">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-[var(--color-primary)]"
        />
      </div>
    </PixelCard>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/components/music/
git commit -m "feat: add music player with vinyl record animation and playback controls"
```

---

### Task 16: Public pages (Home, Post detail, Category, Tag)

**Files:**
- Create: `frontend/src/app/page.tsx`
- Create: `frontend/src/app/posts/[slug]/page.tsx`
- Create: `frontend/src/app/category/[slug]/page.tsx`
- Create: `frontend/src/app/tag/[slug]/page.tsx`

- [ ] **Step 1: Create home page**

```tsx
// frontend/src/app/page.tsx
import { getPosts, getCategories, getTags } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import PostList from "@/components/blog/PostList";
import { PixelPagination } from "@/components/pixel";
import HomePagination from "./HomePagination";

interface Props {
  searchParams: { page?: string };
}

export const revalidate = 60;

export default async function HomePage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const [postsData, categories, tags] = await Promise.all([
    getPosts(page, 10),
    getCategories(),
    getTags(),
  ]);

  return (
    <>
      <Header />
      <MobileNav categories={categories} />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} />
          <div>
            <PostList posts={postsData.items} />
            <HomePagination currentPage={page} totalPages={postsData.total_pages} />
          </div>
        </div>
      </main>
    </>
  );
}
```

Create a client component for pagination with router navigation:

```tsx
// frontend/src/app/HomePagination.tsx
"use client";

import { useRouter } from "next/navigation";
import { PixelPagination } from "@/components/pixel";

interface Props {
  currentPage: number;
  totalPages: number;
}

export default function HomePagination({ currentPage, totalPages }: Props) {
  const router = useRouter();
  return (
    <PixelPagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={(p) => router.push(`/?page=${p}`)}
    />
  );
}
```

- [ ] **Step 2: Create post detail page**

```tsx
// frontend/src/app/posts/[slug]/page.tsx
import { getPost, getCategories, getTags, getPosts } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PostContent from "@/components/blog/PostContent";
import { PixelCard, PixelTag } from "@/components/pixel";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const data = await getPosts(1, 100);
    return data.items.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

interface Props {
  params: { slug: string };
}

export default async function PostPage({ params }: Props) {
  let post;
  try {
    post = await getPost(params.slug);
  } catch {
    notFound();
  }

  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} />
          <article>
            <PixelCard padding="lg">
              <div className="flex gap-2 mb-3 flex-wrap">
                {post.category && (
                  <Link href={`/category/${post.category.slug}`}>
                    <PixelTag color="blue">{post.category.name}</PixelTag>
                  </Link>
                )}
                {post.tags?.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`}>
                    <PixelTag color={tag.color}>{tag.name}</PixelTag>
                  </Link>
                ))}
              </div>
              <h1 className="font-pixel text-sm md:text-base leading-relaxed mb-2">
                {post.title}
              </h1>
              <div className="text-text-secondary text-xs mb-6">
                {post.published_at
                  ? new Date(post.published_at).toLocaleDateString("zh-CN")
                  : new Date(post.created_at).toLocaleDateString("zh-CN")}
                {" · "}
                {post.reading_time} min read
              </div>
              {post.cover_image && (
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full pixel-border mb-6"
                />
              )}
              <PostContent content={post.content} />
            </PixelCard>
          </article>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Create category filter page**

```tsx
// frontend/src/app/category/[slug]/page.tsx
import { getPosts, getCategories, getTags } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PostList from "@/components/blog/PostList";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export default async function CategoryPage({ params }: Props) {
  const [postsData, categories, tags] = await Promise.all([
    getPosts(1, 50, params.slug),
    getCategories(),
    getTags(),
  ]);

  const category = categories.find((c) => c.slug === params.slug);

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <h1 className="font-pixel text-sm mb-6">
          📁 {category?.name || params.slug}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} currentCategory={params.slug} />
          <PostList posts={postsData.items} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Create tag filter page**

```tsx
// frontend/src/app/tag/[slug]/page.tsx
import { getPosts, getCategories, getTags } from "@/lib/api";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PostList from "@/components/blog/PostList";

export const revalidate = 60;

interface Props {
  params: { slug: string };
}

export default async function TagPage({ params }: Props) {
  const [postsData, categories, tags] = await Promise.all([
    getPosts(1, 50, undefined, params.slug),
    getCategories(),
    getTags(),
  ]);

  const tag = tags.find((t) => t.slug === params.slug);

  return (
    <>
      <Header />
      <main className="max-w-[1100px] mx-auto px-4 md:px-10">
        <h1 className="font-pixel text-sm mb-6">
          🏷️ {tag?.name || params.slug}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 md:gap-12">
          <Sidebar categories={categories} tags={tags} currentTag={params.slug} />
          <PostList posts={postsData.items} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/app/page.tsx frontend/src/app/HomePagination.tsx frontend/src/app/posts/ frontend/src/app/category/ frontend/src/app/tag/
git commit -m "feat: add public pages (home, post detail, category filter, tag filter)"
```

---

## Phase 3: Admin Panel

### Task 17: Admin login and auth-guarded layout

**Files:**
- Create: `frontend/src/app/admin/layout.tsx`
- Create: `frontend/src/app/admin/login/page.tsx`

- [ ] **Step 1: Create admin login page**

```tsx
// frontend/src/app/admin/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { PixelButton, PixelInput, PixelCard } from "@/components/pixel";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      router.push("/admin/posts");
    } catch {
      setError("用户名或密码错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg p-4">
      <PixelCard padding="lg" className="w-full max-w-sm">
        <h1 className="font-pixel text-sm text-center mb-6">🔐 Admin Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <PixelInput
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PixelInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red text-xs font-pixel">{error}</p>}
          <PixelButton type="submit" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </PixelButton>
        </form>
      </PixelCard>
    </div>
  );
}
```

- [ ] **Step 2: Create admin layout with auth guard**

```tsx
// frontend/src/app/admin/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin/posts", label: "📝 文章" },
  { href: "/admin/categories", label: "📁 分类" },
  { href: "/admin/tags", label: "🏷️ 标签" },
  { href: "/admin/music", label: "🎵 音乐" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setAuthed(true);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Check token expiry
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.push("/admin/login");
        return;
      }
    } catch {
      localStorage.removeItem("token");
      router.push("/admin/login");
      return;
    }

    setAuthed(true);
  }, [pathname, router]);

  if (!authed) return null;

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-bg">
      <header className="pixel-border bg-bg mb-4">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="font-pixel text-xs text-primary">
            🎮 PIXEL BLOG
          </Link>
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-pixel text-[0.55rem] ${
                  pathname.startsWith(item.href) ? "text-primary" : "hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <button
              onClick={() => {
                localStorage.removeItem("token");
                router.push("/admin/login");
              }}
              className="font-pixel text-[0.55rem] text-red hover:opacity-80"
            >
              退出
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-4">{children}</main>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/app/admin/layout.tsx frontend/src/app/admin/login/
git commit -m "feat: add admin login page and auth-guarded layout"
```

---

### Task 18: Admin post management (list, create, edit)

**Files:**
- Create: `frontend/src/app/admin/posts/page.tsx`
- Create: `frontend/src/app/admin/posts/new/page.tsx`
- Create: `frontend/src/app/admin/posts/[id]/edit/page.tsx`
- Create: `frontend/src/components/admin/MarkdownEditor.tsx`
- Create: `frontend/src/components/admin/ImageUploader.tsx`

- [ ] **Step 1: Create MarkdownEditor**

```tsx
// frontend/src/components/admin/MarkdownEditor.tsx
"use client";

import dynamic from "next/dynamic";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div data-color-mode="auto" className="pixel-border">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v || "")}
        height={500}
        preview="live"
      />
    </div>
  );
}
```

- [ ] **Step 2: Create ImageUploader**

```tsx
// frontend/src/components/admin/ImageUploader.tsx
"use client";

import { useRef, useState } from "react";
import { adminUploadImage } from "@/lib/api";
import { PixelButton } from "@/components/pixel";

interface ImageUploaderProps {
  onUpload: (url: string) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = await adminUploadImage(file);
      onUpload(data.url);
    } catch (err) {
      alert("上传失败");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      <PixelButton
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? "上传中..." : "📷 上传图片"}
      </PixelButton>
    </>
  );
}
```

- [ ] **Step 3: Create admin posts list page**

```tsx
// frontend/src/app/admin/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminGetPosts, adminDeletePost } from "@/lib/api";
import { Post, PaginatedResponse } from "@/types";
import { PixelButton, PixelCard } from "@/components/pixel";

export default function AdminPostsPage() {
  const [data, setData] = useState<PaginatedResponse<Post> | null>(null);
  const [page, setPage] = useState(1);

  const load = async () => {
    const result = await adminGetPosts(page, 20);
    setData(result);
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeletePost(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">📝 文章管理</h1>
        <Link href="/admin/posts/new">
          <PixelButton size="sm">+ 新建文章</PixelButton>
        </Link>
      </div>

      <PixelCard>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-2 font-pixel text-xs">标题</th>
              <th className="text-left py-2 font-pixel text-xs">状态</th>
              <th className="text-left py-2 font-pixel text-xs">日期</th>
              <th className="text-right py-2 font-pixel text-xs">操作</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((post) => (
              <tr key={post.id} className="border-b border-border/30">
                <td className="py-2">{post.title}</td>
                <td className="py-2">
                  <span className={`font-pixel text-[0.5rem] ${post.is_published ? "text-green" : "text-yellow"}`}>
                    {post.is_published ? "已发布" : "草稿"}
                  </span>
                </td>
                <td className="py-2 text-text-secondary text-xs">
                  {new Date(post.updated_at).toLocaleDateString("zh-CN")}
                </td>
                <td className="py-2 text-right">
                  <Link href={`/admin/posts/${post.id}/edit`}>
                    <PixelButton variant="secondary" size="sm" className="mr-2">
                      编辑
                    </PixelButton>
                  </Link>
                  <PixelButton variant="danger" size="sm" onClick={() => handleDelete(post.id)}>
                    删除
                  </PixelButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PixelCard>
    </div>
  );
}
```

- [ ] **Step 4: Create new post page**

```tsx
// frontend/src/app/admin/posts/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminCreatePost, getCategories, getTags } from "@/lib/api";
import { Category, Tag } from "@/types";
import { PixelButton, PixelInput, PixelSelect, PixelToggle, PixelTag } from "@/components/pixel";
import { PixelTextarea } from "@/components/pixel/PixelInput";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageUploader from "@/components/admin/ImageUploader";

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
    getTags().then(setAllTags).catch(() => {});
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    const generated = title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
      .replace(/^-|-$/g, "");
    setSlug(generated);
  }, [title]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await adminCreatePost({
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        category_id: categoryId ? Number(categoryId) : null,
        tag_ids: selectedTagIds,
        is_published: isPublished,
      });
      router.push("/admin/posts");
    } catch (err) {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <h1 className="font-pixel text-sm mb-4">✏️ 新建文章</h1>
      <div className="flex flex-col gap-4">
        <PixelInput label="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <PixelTextarea label="摘要" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />

        <PixelSelect
          label="分类"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: "", label: "-- 无分类 --" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <div>
          <label className="font-pixel text-xs text-text-secondary block mb-1">标签</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <PixelTag
                key={tag.id}
                color={tag.color}
                onClick={() => toggleTag(tag.id)}
                className={selectedTagIds.includes(tag.id) ? "ring-2 ring-primary" : "opacity-60"}
              >
                {tag.name}
              </PixelTag>
            ))}
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-text-secondary block mb-1">封面图</label>
          <div className="flex items-center gap-3">
            <ImageUploader onUpload={setCoverImage} />
            {coverImage && (
              <img src={coverImage} alt="Cover" className="h-12 pixel-border" />
            )}
          </div>
        </div>

        <PixelToggle checked={isPublished} onChange={setIsPublished} label="发布" />

        <MarkdownEditor value={content} onChange={setContent} />

        <div className="flex gap-3">
          <PixelButton onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中..." : isPublished ? "发布" : "保存草稿"}
          </PixelButton>
          <PixelButton variant="secondary" onClick={() => router.back()}>
            取消
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Create edit post page**

```tsx
// frontend/src/app/admin/posts/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adminUpdatePost, adminGetPosts, getCategories, getTags } from "@/lib/api";
import { Post, Category, Tag } from "@/types";
import { PixelButton, PixelInput, PixelSelect, PixelToggle, PixelTag } from "@/components/pixel";
import { PixelTextarea } from "@/components/pixel/PixelInput";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import ImageUploader from "@/components/admin/ImageUploader";

interface Props {
  params: { id: string };
}

export default function EditPostPage({ params }: Props) {
  const router = useRouter();
  const postId = Number(params.id);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [cats, tags, postsData] = await Promise.all([
        getCategories(),
        getTags(),
        adminGetPosts(1, 100),
      ]);
      setCategories(cats);
      setAllTags(tags);

      const post = postsData.items.find((p) => p.id === postId);
      if (post) {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCategoryId(post.category_id ? String(post.category_id) : "");
        setSelectedTagIds(post.tags?.map((t) => t.id) || []);
        setCoverImage(post.cover_image);
        setIsPublished(post.is_published);
      }
      setLoaded(true);
    };
    loadData();
  }, [postId]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await adminUpdatePost(postId, {
        title,
        slug,
        excerpt,
        content,
        cover_image: coverImage,
        category_id: categoryId ? Number(categoryId) : null,
        tag_ids: selectedTagIds,
        is_published: isPublished,
      });
      router.push("/admin/posts");
    } catch {
      alert("保存失败");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  if (!loaded) return <p className="font-pixel text-xs">Loading...</p>;

  return (
    <div>
      <h1 className="font-pixel text-sm mb-4">✏️ 编辑文章</h1>
      <div className="flex flex-col gap-4">
        <PixelInput label="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
        <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <PixelTextarea label="摘要" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />

        <PixelSelect
          label="分类"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={[
            { value: "", label: "-- 无分类 --" },
            ...categories.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <div>
          <label className="font-pixel text-xs text-text-secondary block mb-1">标签</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <PixelTag
                key={tag.id}
                color={tag.color}
                onClick={() => toggleTag(tag.id)}
                className={selectedTagIds.includes(tag.id) ? "ring-2 ring-primary" : "opacity-60"}
              >
                {tag.name}
              </PixelTag>
            ))}
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-text-secondary block mb-1">封面图</label>
          <div className="flex items-center gap-3">
            <ImageUploader onUpload={setCoverImage} />
            {coverImage && <img src={coverImage} alt="Cover" className="h-12 pixel-border" />}
          </div>
        </div>

        <PixelToggle checked={isPublished} onChange={setIsPublished} label="发布" />

        <MarkdownEditor value={content} onChange={setContent} />

        <div className="flex gap-3">
          <PixelButton onClick={handleSubmit} disabled={saving}>
            {saving ? "保存中..." : "保存"}
          </PixelButton>
          <PixelButton variant="secondary" onClick={() => router.back()}>
            取消
          </PixelButton>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/app/admin/posts/ frontend/src/components/admin/
git commit -m "feat: add admin post management (list, create, edit) with Markdown editor"
```

---

### Task 19: Admin category, tag, and music management pages

**Files:**
- Create: `frontend/src/app/admin/categories/page.tsx`
- Create: `frontend/src/app/admin/tags/page.tsx`
- Create: `frontend/src/app/admin/music/page.tsx`
- Create: `frontend/src/components/admin/MusicUploader.tsx`

- [ ] **Step 1: Create category management page**

```tsx
// frontend/src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getCategories, adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/lib/api";
import { Category } from "@/types";
import { PixelButton, PixelInput, PixelCard, PixelModal } from "@/components/pixel";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const load = () => getCategories().then(setCategories).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editId) {
      await adminUpdateCategory(editId, { name, slug });
    } else {
      await adminCreateCategory({ name, slug });
    }
    setShowModal(false);
    setEditId(null);
    setName("");
    setSlug("");
    load();
  };

  const handleEdit = (cat: Category) => {
    setEditId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteCategory(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">📁 分类管理</h1>
        <PixelButton size="sm" onClick={() => { setEditId(null); setName(""); setSlug(""); setShowModal(true); }}>
          + 新建
        </PixelButton>
      </div>

      <PixelCard>
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
            <div>
              <span className="font-bold">{cat.name}</span>
              <span className="text-text-secondary text-xs ml-2">/{cat.slug}</span>
              <span className="text-text-secondary text-xs ml-2">({cat.post_count || 0} 篇)</span>
            </div>
            <div className="flex gap-2">
              <PixelButton variant="secondary" size="sm" onClick={() => handleEdit(cat)}>编辑</PixelButton>
              <PixelButton variant="danger" size="sm" onClick={() => handleDelete(cat.id)}>删除</PixelButton>
            </div>
          </div>
        ))}
        {categories.length === 0 && <p className="text-text-secondary text-sm py-4 text-center">暂无分类</p>}
      </PixelCard>

      <PixelModal open={showModal} onClose={() => setShowModal(false)} title={editId ? "编辑分类" : "新建分类"}>
        <div className="flex flex-col gap-3">
          <PixelInput label="名称" value={name} onChange={(e) => setName(e.target.value)} />
          <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <PixelButton onClick={handleSave}>保存</PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
```

- [ ] **Step 2: Create tag management page**

```tsx
// frontend/src/app/admin/tags/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getTags, adminCreateTag, adminUpdateTag, adminDeleteTag } from "@/lib/api";
import { Tag } from "@/types";
import { PixelButton, PixelInput, PixelSelect, PixelCard, PixelModal, PixelTag } from "@/components/pixel";

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [color, setColor] = useState("blue");

  const load = () => getTags().then(setTags).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (editId) {
      await adminUpdateTag(editId, { name, slug, color });
    } else {
      await adminCreateTag({ name, slug, color });
    }
    setShowModal(false);
    setEditId(null);
    setName("");
    setSlug("");
    setColor("blue");
    load();
  };

  const handleEdit = (tag: Tag) => {
    setEditId(tag.id);
    setName(tag.name);
    setSlug(tag.slug);
    setColor(tag.color);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteTag(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">🏷️ 标签管理</h1>
        <PixelButton size="sm" onClick={() => { setEditId(null); setName(""); setSlug(""); setColor("blue"); setShowModal(true); }}>
          + 新建
        </PixelButton>
      </div>

      <PixelCard>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 p-2 border border-border/30">
              <PixelTag color={tag.color}>{tag.name}</PixelTag>
              <button onClick={() => handleEdit(tag)} className="text-xs hover:text-primary">✏️</button>
              <button onClick={() => handleDelete(tag.id)} className="text-xs hover:text-red">🗑️</button>
            </div>
          ))}
        </div>
        {tags.length === 0 && <p className="text-text-secondary text-sm py-4 text-center">暂无标签</p>}
      </PixelCard>

      <PixelModal open={showModal} onClose={() => setShowModal(false)} title={editId ? "编辑标签" : "新建标签"}>
        <div className="flex flex-col gap-3">
          <PixelInput label="名称" value={name} onChange={(e) => setName(e.target.value)} />
          <PixelInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
          <PixelSelect
            label="颜色"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            options={[
              { value: "blue", label: "蓝色" },
              { value: "yellow", label: "黄色" },
              { value: "green", label: "绿色" },
              { value: "red", label: "红色" },
            ]}
          />
          <PixelButton onClick={handleSave}>保存</PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
```

- [ ] **Step 3: Create music management page**

```tsx
// frontend/src/app/admin/music/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { getMusic, adminCreateMusic, adminDeleteMusic, adminReorderMusic } from "@/lib/api";
import { MusicTrack } from "@/types";
import { PixelButton, PixelInput, PixelCard, PixelModal } from "@/components/pixel";

export default function AdminMusicPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const load = () => getMusic().then(setTracks).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !title) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("artist", artist || "Unknown");

    const cover = coverRef.current?.files?.[0];
    if (cover) formData.append("cover", cover);

    try {
      await adminCreateMusic(formData);
      setShowModal(false);
      setTitle("");
      setArtist("");
      load();
    } catch {
      alert("上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定删除？")) return;
    await adminDeleteMusic(id);
    load();
  };

  const moveTrack = async (index: number, direction: -1 | 1) => {
    const newTracks = [...tracks];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newTracks.length) return;
    [newTracks[index], newTracks[swapIndex]] = [newTracks[swapIndex], newTracks[index]];
    setTracks(newTracks);
    await adminReorderMusic(newTracks.map((t) => t.id));
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-pixel text-sm">🎵 音乐管理</h1>
        <PixelButton size="sm" onClick={() => setShowModal(true)}>
          + 上传音乐
        </PixelButton>
      </div>

      <PixelCard>
        {tracks.map((track, i) => (
          <div key={track.id} className="flex items-center justify-between py-3 border-b border-border/30 last:border-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveTrack(i, -1)} disabled={i === 0} className="text-xs disabled:opacity-30">▲</button>
                <button onClick={() => moveTrack(i, 1)} disabled={i === tracks.length - 1} className="text-xs disabled:opacity-30">▼</button>
              </div>
              {track.cover_path ? (
                <img src={`/uploads/${track.cover_path}`} alt="" className="w-10 h-10 pixel-border object-cover" />
              ) : (
                <div className="w-10 h-10 pixel-border bg-bg-secondary flex items-center justify-center">🎵</div>
              )}
              <div>
                <p className="font-bold text-sm">{track.title}</p>
                <p className="text-text-secondary text-xs">{track.artist} · {formatDuration(track.duration)}</p>
              </div>
            </div>
            <PixelButton variant="danger" size="sm" onClick={() => handleDelete(track.id)}>
              删除
            </PixelButton>
          </div>
        ))}
        {tracks.length === 0 && <p className="text-text-secondary text-sm py-4 text-center">暂无音乐</p>}
      </PixelCard>

      <PixelModal open={showModal} onClose={() => setShowModal(false)} title="上传音乐">
        <div className="flex flex-col gap-3">
          <PixelInput label="歌曲名" value={title} onChange={(e) => setTitle(e.target.value)} />
          <PixelInput label="艺术家" value={artist} onChange={(e) => setArtist(e.target.value)} placeholder="Unknown" />
          <div>
            <label className="font-pixel text-xs text-text-secondary block mb-1">MP3 文件</label>
            <input ref={fileRef} type="file" accept=".mp3,audio/mpeg" className="text-sm" />
          </div>
          <div>
            <label className="font-pixel text-xs text-text-secondary block mb-1">封面图（可选）</label>
            <input ref={coverRef} type="file" accept="image/*" className="text-sm" />
          </div>
          <PixelButton onClick={handleUpload} disabled={uploading}>
            {uploading ? "上传中..." : "上传"}
          </PixelButton>
        </div>
      </PixelModal>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add frontend/src/app/admin/categories/ frontend/src/app/admin/tags/ frontend/src/app/admin/music/
git commit -m "feat: add admin pages for category, tag, and music management"
```

---

## Phase 4: Docker & Deployment

### Task 20: Dockerfiles and docker-compose.yml

**Files:**
- Create: `backend/Dockerfile`
- Create: `frontend/Dockerfile`
- Create: `docker-compose.yml`
- Create: `nginx/nginx.conf`
- Create: `.env.example`

- [ ] **Step 1: Create backend Dockerfile**

```dockerfile
# backend/Dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o server main.go

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
CMD ["./server"]
```

- [ ] **Step 2: Create frontend Dockerfile**

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

- [ ] **Step 3: Create nginx.conf**

```nginx
# nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    sendfile      on;
    keepalive_timeout 65;

    upstream frontend {
        server frontend:3000;
    }

    upstream backend {
        server backend:8080;
    }

    server {
        listen 80;
        server_name _;

        client_max_body_size 25M;

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }

        # Static uploads (served by Nginx directly)
        location /uploads/ {
            alias /var/www/uploads/;
            expires 30d;
            add_header Cache-Control "public, immutable";
        }

        # Frontend (Next.js)
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

- [ ] **Step 4: Create docker-compose.yml**

```yaml
# docker-compose.yml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./backend/uploads:/var/www/uploads:ro
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      - API_URL=http://backend:8080
    expose:
      - "3000"
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
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
    expose:
      - "8080"
    restart: unless-stopped
```

- [ ] **Step 5: Create .env.example**

```bash
# .env.example
JWT_SECRET=your-secret-key-change-this
ADMIN_USER=admin
ADMIN_PASS=your-strong-password
```

- [ ] **Step 6: Verify docker-compose config**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
docker compose config
# Expected: valid YAML output, no errors
```

- [ ] **Step 7: Commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
git add backend/Dockerfile frontend/Dockerfile docker-compose.yml nginx/nginx.conf .env.example
git commit -m "feat: add Docker Compose setup with Nginx, multi-stage Dockerfiles"
```

---

### Task 21: Build and verify full stack

- [ ] **Step 1: Create .env file**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
cp .env.example .env
# Edit .env with real values (or keep defaults for testing)
```

- [ ] **Step 2: Create required directories**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
mkdir -p data backend/uploads/images backend/uploads/music
```

- [ ] **Step 3: Build and start all services**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
docker compose up --build -d
```

- [ ] **Step 4: Verify services are running**

```bash
docker compose ps
# Expected: 3 services (nginx, frontend, backend) all "Up"

curl http://localhost/api/health
# Expected: {"status":"ok"}

curl http://localhost
# Expected: HTML from Next.js
```

- [ ] **Step 5: Test the full workflow**

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

# 2. Create a category
curl -s -X POST http://localhost/api/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"前端","slug":"frontend"}'

# 3. Create a tag
curl -s -X POST http://localhost/api/admin/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"React","slug":"react","color":"blue"}'

# 4. Create a published post
curl -s -X POST http://localhost/api/admin/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Hello Pixel World","slug":"hello-pixel-world","content":"# Hello\n\nWelcome to **Pixel Blog**!","excerpt":"First post","category_id":1,"tag_ids":[1],"is_published":true}'

# 5. Verify post appears in public API
curl -s http://localhost/api/posts | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Total posts: {d[\"data\"][\"total\"]}')"
# Expected: Total posts: 1

# 6. Verify post detail
curl -s http://localhost/api/posts/hello-pixel-world | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['title'])"
# Expected: Hello Pixel World
```

- [ ] **Step 6: Test in browser**

Open http://localhost in browser and verify:
1. Home page shows the post with pixel styling
2. Sidebar shows categories, tags
3. Dark/light mode toggle works
4. Navigate to /admin/login, login with admin credentials
5. Create/edit a post in admin panel
6. Verify markdown preview works

- [ ] **Step 7: Clean up and final commit**

```bash
cd /Users/zyx/Documents/Workspace/VsCode/Piexls_Blog
docker compose down
git add -A
git status
git commit -m "feat: complete pixel blog - full stack verified"
```

---

## Verification Checklist

After all tasks are complete, verify each requirement from the spec:

1. **Frontend-backend separation** — Next.js on :3000, Go on :8080, Nginx proxies both
2. **Desktop + mobile responsive** — Check with browser DevTools at 1024px, 768px, 375px
3. **Pixel UI components** — 3px borders, box-shadows, Press Start 2P font, sharp corners
4. **Markdown writing** — Create a post in admin with headers, code blocks, images, tables
5. **Pixel character (Squirtle)** — Visible in sidebar ProfileCard
6. **Dark/light mode** — Toggle works, no flash on page load, persists across refresh
7. **Music playback** — Upload an mp3, verify it plays, persists across page navigation
8. **Vinyl record animation** — Spins while playing, pauses when stopped
9. **Docker deploy** — `docker compose up -d` on Debian 12 server works
