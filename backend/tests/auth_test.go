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
	"gorm.io/gorm"
)

// setupTestDB creates an in-memory SQLite test database with all models migrated and admin seeded
func setupTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	db := database.Init(":memory:")
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
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})
	return r
}

func TestLoginSuccess(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "testpass"})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
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

	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "wrong"})
	req := httptest.NewRequest("POST", "/api/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("Expected 401, got %d", w.Code)
	}
}

func TestProtectedRouteWithoutToken(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	req := httptest.NewRequest("GET", "/api/admin/ping", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusUnauthorized {
		t.Fatalf("Expected 401, got %d", w.Code)
	}
}

func TestProtectedRouteWithToken(t *testing.T) {
	db := setupTestDB(t)
	r := setupRouter(db)

	// Login first
	body, _ := json.Marshal(map[string]string{"username": "admin", "password": "testpass"})
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

	if w.Code != http.StatusOK {
		t.Fatalf("Expected 200, got %d: %s", w.Code, w.Body.String())
	}
}

func TestMain(m *testing.M) {
	gin.SetMode(gin.TestMode)
	os.Exit(m.Run())
}
