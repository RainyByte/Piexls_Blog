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
	body, _ := json.Marshal(map[string]interface{}{"name": "React", "slug": "react", "color": "blue"})
	req := httptest.NewRequest("POST", "/api/admin/tags", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// List
	req = httptest.NewRequest("GET", "/api/tags", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("List: expected 200, got %d", w.Code)
	}

	// Update
	body, _ = json.Marshal(map[string]interface{}{"color": "green"})
	req = httptest.NewRequest("PUT", "/api/admin/tags/1", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("Update: expected 200, got %d: %s", w.Code, w.Body.String())
	}

	// Delete
	req = httptest.NewRequest("DELETE", "/api/admin/tags/1", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("Delete: expected 200, got %d", w.Code)
	}
}
