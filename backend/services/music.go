// backend/services/music.go
package services

import (
	"os"
	"path/filepath"

	"github.com/zyx/pixel-blog-backend/models"
	"gorm.io/gorm"
)

type MusicService struct {
	db         *gorm.DB
	uploadPath string
}

func NewMusicService(db *gorm.DB, uploadPath string) *MusicService {
	return &MusicService{db: db, uploadPath: uploadPath}
}

func (s *MusicService) List() ([]models.MusicTrack, error) {
	var tracks []models.MusicTrack
	err := s.db.Order("sort_order ASC, id ASC").Find(&tracks).Error
	return tracks, err
}

func (s *MusicService) Create(track *models.MusicTrack) error {
	var maxOrder int
	if err := s.db.Model(&models.MusicTrack{}).Select("COALESCE(MAX(sort_order), 0)").Scan(&maxOrder).Error; err != nil {
		maxOrder = 0
	}
	track.SortOrder = maxOrder + 1
	return s.db.Create(track).Error
}

func (s *MusicService) Update(id uint, updates map[string]interface{}) (*models.MusicTrack, error) {
	var track models.MusicTrack
	if err := s.db.First(&track, id).Error; err != nil {
		return nil, err
	}
	if err := s.db.Model(&track).Updates(updates).Error; err != nil {
		return nil, err
	}
	return &track, nil
}

func (s *MusicService) Delete(id uint) error {
	var track models.MusicTrack
	if err := s.db.First(&track, id).Error; err != nil {
		return err
	}

	// Best-effort cleanup; ignore errors if files already removed
	if track.FilePath != "" {
		os.Remove(filepath.Join(s.uploadPath, track.FilePath))
	}
	if track.CoverPath != "" {
		os.Remove(filepath.Join(s.uploadPath, track.CoverPath))
	}

	return s.db.Delete(&track).Error
}

func (s *MusicService) Reorder(ids []uint) error {
	return s.db.Transaction(func(tx *gorm.DB) error {
		for i, id := range ids {
			if err := tx.Model(&models.MusicTrack{}).Where("id = ?", id).Update("sort_order", i).Error; err != nil {
				return err
			}
		}
		return nil
	})
}
