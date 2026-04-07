package database

import (
	"log"

	"github.com/zyx/pixel-blog-backend/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedAdmin(db *gorm.DB, username, password string) {
	if password == "" {
		log.Fatal("ADMIN_PASS environment variable must be set")
	}

	var count int64
	if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
		log.Fatal("Failed to count users:", err)
	}
	if count > 0 {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal("Failed to hash admin password:", err)
	}

	admin := models.User{
		Username: username,
		Password: string(hash),
	}
	if err := db.Create(&admin).Error; err != nil {
		log.Fatal("Failed to seed admin user:", err)
	}

	log.Printf("Admin user '%s' created", username)
}
