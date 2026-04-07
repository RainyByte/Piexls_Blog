package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
)

func main() {
	cfg := config.Load()

	r := gin.Default()

	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	log.Printf("Starting server on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
