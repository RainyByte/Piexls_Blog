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
	if err := os.MkdirAll(imageDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to create upload directory"})
		return
	}

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
