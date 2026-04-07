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
