package services

import (
	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type CategoryService struct {
	db *gorm.DB
}

func NewCategoryService(db *gorm.DB) *CategoryService {
	return &CategoryService{db: db}
}

func (s *CategoryService) List() ([]models.Category, error) {
	var categories []models.Category
	err := s.db.Order("sort_order ASC, id ASC").Find(&categories).Error
	if err != nil {
		return nil, err
	}
	for i := range categories {
		var count int64
		s.db.Model(&models.Post{}).Where("category_id = ? AND is_published = ?", categories[i].ID, true).Count(&count)
		categories[i].PostCount = int(count)
	}
	return categories, nil
}

func (s *CategoryService) Create(category *models.Category) error {
	return s.db.Create(category).Error
}

func (s *CategoryService) Update(id uint, updates map[string]interface{}) (*models.Category, error) {
	var category models.Category
	if err := s.db.First(&category, id).Error; err != nil {
		return nil, err
	}
	if err := s.db.Model(&category).Updates(updates).Error; err != nil {
		return nil, err
	}
	return &category, nil
}

func (s *CategoryService) Delete(id uint) error {
	return s.db.Delete(&models.Category{}, id).Error
}
