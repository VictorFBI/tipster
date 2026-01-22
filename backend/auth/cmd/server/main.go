package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/auth/internal/db/postgresql"
	"tipster/backend/auth/internal/db/redis"
	"tipster/backend/auth/internal/handlers"

	httpSwagger "github.com/swaggo/http-swagger"
)

func checkPostgreSQLConnection(ctx context.Context) {
	log.Println("Checking PostgreSQL connection...")
	pgConn, err := postgresql.Connect(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to PostgreSQL: %v", err)
	}
	err = pgConn.Close(ctx)
	if err != nil {
		log.Fatalf("Failed to close PostgreSQL connection: %v", err)
	}
	log.Println("PostgreSQL connection is OK")
}

func checkRedisConnection(ctx context.Context) {
	log.Println("Checking Redis connection...")
	redisConn, err := redis.Connect(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
	err = redisConn.Close()
	if err != nil {
		log.Fatalf("Failed to close Redis connection: %v", err)
	}
	log.Println("Redis connection is OK")
}

func main() {
	ctx := context.Background()

	checkPostgreSQLConnection(ctx)
	checkRedisConnection(ctx)

	// Setup router
	r := chi.NewRouter()
	log.Println("Server is starting...")
	r.Use(middleware.Logger)

	// Swagger routes
	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	// Auth routes
	r.Post("/auth/login", handlers.Login)
	r.Post("/auth/register", handlers.Register)
	r.Post("/auth/send-email/registration", handlers.SendEmailRegistration)

	log.Println("Server is running on port 8080")
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
