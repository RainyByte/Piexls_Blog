// backend/tests/music_test.go
package tests

import (
	"bytes"
	"encoding/json"
	"fmt"
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
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse login response: %v", err)
	}
	data, ok := resp["data"].(map[string]interface{})
	if !ok {
		t.Fatalf("unexpected login response: %s", w.Body.String())
	}
	token := data["token"].(string)

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

	var createResp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &createResp); err != nil {
		t.Fatalf("failed to parse create response: %v", err)
	}
	trackData := createResp["data"].(map[string]interface{})
	trackID := fmt.Sprintf("%.0f", trackData["id"].(float64))

	// List
	req = httptest.NewRequest("GET", "/api/music", nil)
	w = httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != 200 {
		t.Fatalf("List: expected 200, got %d", w.Code)
	}

	var listResp map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &listResp); err != nil {
		t.Fatalf("failed to parse list response: %v", err)
	}
	items, ok := listResp["data"].([]interface{})
	if !ok {
		t.Fatalf("expected data to be array, got: %s", w.Body.String())
	}
	if len(items) != 1 {
		t.Fatalf("Expected 1 track, got %d", len(items))
	}

	// Delete
	req = httptest.NewRequest("DELETE", "/api/admin/music/"+trackID, nil)
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
	if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
		t.Fatalf("failed to parse upload response: %v", err)
	}
	data, ok := resp["data"].(map[string]interface{})
	if !ok {
		t.Fatalf("expected data map in response: %s", w.Body.String())
	}
	url, ok := data["url"].(string)
	if !ok || url == "" {
		t.Fatal("Expected non-empty url")
	}
}
