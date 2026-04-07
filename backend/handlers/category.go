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
