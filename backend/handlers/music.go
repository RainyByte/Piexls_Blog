// backend/handlers/music.go
package handlers

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"

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

	musicDir := filepath.Join(h.uploadPath, "music")
	if err := os.MkdirAll(musicDir, 0755); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to create upload directory"})
		return
	}
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
	filePath := filepath.Join(musicDir, filename)
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": "failed to save file"})
		return
	}

	title := c.PostForm("title")
	artist := c.DefaultPostForm("artist", "Unknown")
	// duration defaults to 0 if not provided or invalid
	duration, _ := strconv.Atoi(c.DefaultPostForm("duration", "0"))

	track := models.MusicTrack{
		Title:    title,
		Artist:   artist,
		FilePath: filepath.Join("music", filename),
		Duration: duration,
	}

	// Handle optional cover image
	coverFile, err := c.FormFile("cover")
	if err == nil {
		if coverFile.Size <= 5<<20 {
			coverExt := strings.ToLower(filepath.Ext(coverFile.Filename))
			if allowedImageTypes[coverExt] {
				coverDir := filepath.Join(h.uploadPath, "images")
				os.MkdirAll(coverDir, 0755)
				coverName := fmt.Sprintf("%s%s", uuid.New().String(), coverExt)
				coverPath := filepath.Join(coverDir, coverName)
				if err := c.SaveUploadedFile(coverFile, coverPath); err == nil {
					track.CoverPath = filepath.Join("images", coverName)
				}
			}
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
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"code": 404, "message": "track not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"code": 500, "message": err.Error()})
		}
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
