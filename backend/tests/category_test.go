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
	body, _ := json.Marshal(map[string]interface{}{"name": "Frontend", "slug": "frontend"})
	req := httptest.NewRequest("POST", "/api/admin/categories", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusCreated {
		t.Fatalf("Create: expected 201, got %d: %s", w.Code, w.Body.String())
	}

	// List
	req = httptest.NewRequest("GET", "/api/categories", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
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
	if w.Code != http.StatusOK {
		t.Fatalf("Update: expected 200, got %d: %s", w.Code, w.Body.String())
	}

	// Delete
	req = httptest.NewRequest("DELETE", "/api/admin/categories/1", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)
	if w.Code != http.StatusOK {
		t.Fatalf("Delete: expected 200, got %d", w.Code)
	}
}
