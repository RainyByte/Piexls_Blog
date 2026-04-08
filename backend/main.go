package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/zyx/pixel-blog-backend/config"
	"github.com/zyx/pixel-blog-backend/database"
	"github.com/zyx/pixel-blog-backend/handlers"
	"github.com/zyx/pixel-blog-backend/middleware"
)

func main() {
	cfg := config.Load()

	db := database.Init(cfg.DBPath)
	database.SeedAdmin(db, cfg.AdminUser, cfg.AdminPass)

	r := gin.Default()
	r.Use(middleware.CORS())

	// Static files
	r.Static("/uploads", cfg.UploadPath)

	// Health check
	r.GET("/api/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// Init handlers
	authHandler := handlers.NewAuthHandler(db, cfg)
	postHandler := handlers.NewPostHandler(db)
	catHandler := handlers.NewCategoryHandler(db)
	tagHandler := handlers.NewTagHandler(db)
	musicHandler := handlers.NewMusicHandler(db, cfg)
	uploadHandler := handlers.NewUploadHandler(cfg)

	// Public routes
	public := r.Group("/api")
	{
		public.GET("/posts", postHandler.List)
		public.GET("/posts/:slug", postHandler.GetBySlug)
		public.GET("/categories", catHandler.List)
		public.GET("/tags", tagHandler.List)
		public.GET("/music", musicHandler.List)
		public.POST("/auth/login", authHandler.Login)
		public.POST("/auth/refresh", authHandler.Refresh)
	}

	// Admin routes
	admin := r.Group("/api/admin")
	admin.Use(middleware.JWTAuth(cfg.JWTSecret))
	{
		admin.GET("/posts", postHandler.AdminList)
		admin.POST("/posts", postHandler.Create)
		admin.PUT("/posts/:id", postHandler.Update)
		admin.DELETE("/posts/:id", postHandler.Delete)

		admin.POST("/categories", catHandler.Create)
		admin.PUT("/categories/:id", catHandler.Update)
		admin.DELETE("/categories/:id", catHandler.Delete)

		admin.POST("/tags", tagHandler.Create)
		admin.PUT("/tags/:id", tagHandler.Update)
		admin.DELETE("/tags/:id", tagHandler.Delete)

		admin.POST("/music", musicHandler.Create)
		admin.PUT("/music/:id", musicHandler.Update)
		admin.DELETE("/music/:id", musicHandler.Delete)
		admin.PUT("/music/reorder", musicHandler.Reorder)

		admin.POST("/upload/image", uploadHandler.UploadImage)
	}

	log.Printf("Starting server on :%s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
