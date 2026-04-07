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
