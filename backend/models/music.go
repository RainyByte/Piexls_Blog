package models

import "time"

type MusicTrack struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `gorm:"not null" json:"title"`
	Artist    string    `gorm:"default:'Unknown';not null" json:"artist"`
	FilePath  string    `gorm:"not null" json:"file_path"`
	CoverPath string    `gorm:"default:''" json:"cover_path"`
	Duration  int       `gorm:"default:0" json:"duration"`
	SortOrder int       `gorm:"default:0" json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
}
