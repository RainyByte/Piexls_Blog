package tests

import (
	"bytes"
	"encoding/json"
	"net/http"
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

	// Seed test data
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

	catID := uint(1)
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

	if w.Code != http.StatusCreated {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// Get by slug (public)
	req = httptest.NewRequest("GET", "/api/posts/hello-pixel-world", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
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

	if w.Code != http.StatusOK {
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

	if w.Code != http.StatusCreated {
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
