package models

import "time"

type Tag struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Name      string    `gorm:"uniqueIndex;not null" json:"name"`
	Slug      string    `gorm:"uniqueIndex;not null" json:"slug"`
	Color     string    `gorm:"default:blue;not null" json:"color"`
	CreatedAt time.Time `json:"created_at"`
	PostCount int       `gorm:"-" json:"post_count,omitempty"`
}
