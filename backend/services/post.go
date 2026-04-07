package services

import (
	"math"
	"strings"
	"time"

	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type PostService struct {
	db *gorm.DB
}

func NewPostService(db *gorm.DB) *PostService {
	return &PostService{db: db}
}

type PaginatedPosts struct {
	Items      []models.Post `json:"items"`
	Total      int64         `json:"total"`
	Page       int           `json:"page"`
	Size       int           `json:"size"`
	TotalPages int           `json:"total_pages"`
}

type CreatePostRequest struct {
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Excerpt     string `json:"excerpt"`
	Content     string `json:"content"`
	CoverImage  string `json:"cover_image"`
	CategoryID  *uint  `json:"category_id"`
	TagIDs      []uint `json:"tag_ids"`
	IsPublished bool   `json:"is_published"`
}

func (s *PostService) ListPublished(page, size int, categorySlug, tagSlug string) (*PaginatedPosts, error) {
	query := s.db.Model(&models.Post{}).Where("is_published = ?", true)

	if categorySlug != "" {
		var cat models.Category
		if err := s.db.Where("slug = ?", categorySlug).First(&cat).Error; err == nil {
			query = query.Where("category_id = ?", cat.ID)
		}
	}

	if tagSlug != "" {
		var tag models.Tag
		if err := s.db.Where("slug = ?", tagSlug).First(&tag).Error; err == nil {
			query = query.Where("id IN (SELECT post_id FROM post_tags WHERE tag_id = ?)", tag.ID)
		}
	}

	var total int64
	query.Count(&total)

	var posts []models.Post
	err := query.Preload("Category").Preload("Tags").
		Order("published_at DESC, created_at DESC").
		Offset((page - 1) * size).Limit(size).
		Find(&posts).Error

	return &PaginatedPosts{
		Items:      posts,
		Total:      total,
		Page:       page,
		Size:       size,
		TotalPages: int(math.Ceil(float64(total) / float64(size))),
	}, err
}

func (s *PostService) AdminList(page, size int) (*PaginatedPosts, error) {
	var total int64
	s.db.Model(&models.Post{}).Count(&total)

	var posts []models.Post
	err := s.db.Preload("Category").Preload("Tags").
		Order("updated_at DESC").
		Offset((page - 1) * size).Limit(size).
		Find(&posts).Error

	return &PaginatedPosts{
		Items:      posts,
		Total:      total,
		Page:       page,
		Size:       size,
		TotalPages: int(math.Ceil(float64(total) / float64(size))),
	}, err
}

func (s *PostService) GetBySlug(slug string) (*models.Post, error) {
	var post models.Post
	err := s.db.Preload("Category").Preload("Tags").
		Where("slug = ? AND is_published = ?", slug, true).
		First(&post).Error
	return &post, err
}

func (s *PostService) Create(req *CreatePostRequest) (*models.Post, error) {
	wordCount := len(strings.Fields(req.Content))
	readingTime := int(math.Ceil(float64(wordCount) / 200.0))
	if readingTime < 1 {
		readingTime = 1
	}

	post := models.Post{
		Title:       req.Title,
		Slug:        req.Slug,
		Excerpt:     req.Excerpt,
		Content:     req.Content,
		CoverImage:  req.CoverImage,
		CategoryID:  req.CategoryID,
		IsPublished: req.IsPublished,
		ReadingTime: readingTime,
	}

	if req.IsPublished {
		now := time.Now()
		post.PublishedAt = &now
	}

	if err := s.db.Create(&post).Error; err != nil {
		return nil, err
	}

	if len(req.TagIDs) > 0 {
		var tags []models.Tag
		s.db.Where("id IN ?", req.TagIDs).Find(&tags)
		s.db.Model(&post).Association("Tags").Replace(tags)
	}

	s.db.Preload("Category").Preload("Tags").First(&post, post.ID)
	return &post, nil
}

func (s *PostService) Update(id uint, req *CreatePostRequest) (*models.Post, error) {
	var post models.Post
	if err := s.db.First(&post, id).Error; err != nil {
		return nil, err
	}

	post.Title = req.Title
	post.Slug = req.Slug
	post.Excerpt = req.Excerpt
	post.Content = req.Content
	post.CoverImage = req.CoverImage
	post.CategoryID = req.CategoryID
	post.IsPublished = req.IsPublished

	if req.IsPublished && post.PublishedAt == nil {
		now := time.Now()
		post.PublishedAt = &now
	}

	wordCount := len(strings.Fields(req.Content))
	readingTime := int(math.Ceil(float64(wordCount) / 200.0))
	if readingTime < 1 {
		readingTime = 1
	}
	post.ReadingTime = readingTime

	if err := s.db.Save(&post).Error; err != nil {
		return nil, err
	}

	var tags []models.Tag
	if len(req.TagIDs) > 0 {
		s.db.Where("id IN ?", req.TagIDs).Find(&tags)
	}
	s.db.Model(&post).Association("Tags").Replace(tags)

	s.db.Preload("Category").Preload("Tags").First(&post, post.ID)
	return &post, nil
}

func (s *PostService) Delete(id uint) error {
	var post models.Post
	if err := s.db.First(&post, id).Error; err != nil {
		return err
	}
	s.db.Model(&post).Association("Tags").Clear()
	return s.db.Delete(&post).Error
}
