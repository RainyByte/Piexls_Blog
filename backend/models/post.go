package models

import "time"

type Post struct {
	ID          uint       `gorm:"primaryKey" json:"id"`
	Title       string     `gorm:"not null" json:"title"`
	Slug        string     `gorm:"uniqueIndex;not null" json:"slug"`
	Excerpt     string     `gorm:"default:''" json:"excerpt"`
	Content     string     `gorm:"not null" json:"content"`
	CoverImage  string     `gorm:"default:''" json:"cover_image"`
	CategoryID  *uint      `gorm:"index" json:"category_id"`
	Category    *Category  `gorm:"foreignKey:CategoryID" json:"category,omitempty"`
	Tags        []Tag      `gorm:"many2many:post_tags" json:"tags,omitempty"`
	IsPublished bool       `gorm:"default:false;index" json:"is_published"`
	ReadingTime int        `gorm:"default:1" json:"reading_time"`
	PublishedAt *time.Time `json:"published_at"`
	CreatedAt   time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
