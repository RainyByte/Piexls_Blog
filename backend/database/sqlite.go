package database

import (
	"log"
	"os"
	"path/filepath"

	"github.com/zyx/pixel-blog-backend/models"
	gormSqlite "gorm.io/driver/sqlite"
	"gorm.io/gorm"

	// Pure-Go SQLite driver (no CGO required); registers as "sqlite"
	_ "modernc.org/sqlite"
)

func Init(dbPath string) *gorm.DB {
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		log.Fatal("Failed to create database directory:", err)
	}

	db, err := gorm.Open(gormSqlite.Dialector{DriverName: "sqlite", DSN: dbPath}, &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}

	// Enable WAL mode for better concurrent read performance
	db.Exec("PRAGMA journal_mode=WAL")

	// Auto-migrate all models
	err = db.AutoMigrate(
		&models.User{},
		&models.Category{},
		&models.Tag{},
		&models.Post{},
		&models.MusicTrack{},
	)
	if err != nil {
		log.Fatal("Failed to migrate database:", err)
	}

	return db
}
