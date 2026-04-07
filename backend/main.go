package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/database"
)

func main() {
	cfg := config.Load()

	db := database.Init(cfg.DBPath)
	database.SeedAdmin(db, cfg.AdminUser, cfg.AdminPass)

	r := gin.Default()

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	_ = db // will be used by handlers in next tasks

	log.Printf("Starting server on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
