package services

import (
	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type TagService struct {
	db *gorm.DB
}

func NewTagService(db *gorm.DB) *TagService {
	return &TagService{db: db}
}

func (s *TagService) List() ([]models.Tag, error) {
	var tags []models.Tag
	if err := s.db.Order("id ASC").Find(&tags).Error; err != nil {
		return nil, err
	}
	for i := range tags {
		var count int64
		s.db.Table("post_tags").
			Joins("JOIN posts ON posts.id = post_tags.post_id").
			Where("post_tags.tag_id = ? AND posts.is_published = ?", tags[i].ID, true).
			Count(&count)
		tags[i].PostCount = int(count)
	}
	return tags, nil
}

func (s *TagService) Create(tag *models.Tag) error {
	return s.db.Create(tag).Error
}

func (s *TagService) Update(id uint, updates map[string]interface{}) (*models.Tag, error) {
	var tag models.Tag
	if err := s.db.First(&tag, id).Error; err != nil {
		return nil, err
	}
	if err := s.db.Model(&tag).Updates(updates).Error; err != nil {
		return nil, err
	}
	return &tag, nil
}

func (s *TagService) Delete(id uint) error {
	return s.db.Delete(&models.Tag{}, id).Error
}
