package config

import "os"

type Config struct {
	Port       string
	DBPath     string
	UploadPath string
	JWTSecret  string
	AdminUser  string
	AdminPass  string
}

func Load() *Config {
	return &Config{
		Port:       getEnv("PORT", "8080"),
		DBPath:     getEnv("DB_PATH", "./data/blog.db"),
		UploadPath: getEnv("UPLOAD_PATH", "./uploads"),
		JWTSecret:  getEnv("JWT_SECRET", "change-me-in-production"),
		AdminUser:  getEnv("ADMIN_USER", "admin"),
		AdminPass:  getEnv("ADMIN_PASS", "admin123"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
