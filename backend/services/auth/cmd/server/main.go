package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/auth/internal/db/postgresql"
	"tipster/backend/auth/internal/db/redis"
	"tipster/backend/auth/internal/db/kafka"
	"tipster/backend/auth/internal/handlers"

	httpSwagger "github.com/swaggo/http-swagger"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic(err)
	}
}

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

func checkKafkaConnection(ctx context.Context) {
	log.Println("Checking Kafka connection...")

	kafkaConn, err := kafka.Connect(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to Kafka: %v", err)
	}

	err = kafkaConn.Close()
	if err != nil {
		log.Fatalf("Failed to close Kafka connection: %v", err)
	}

	log.Println("Kafka connection is OK")
}

func main() {
	ctx := context.Background()

	checkPostgreSQLConnection(ctx)
	checkRedisConnection(ctx)
	checkKafkaConnection(ctx)

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
	r.Get("/auth/me", handlers.Me)
	r.Post("/auth/login", handlers.Login)
	r.Post("/auth/logout", handlers.Logout)
	r.Post("/auth/register", handlers.Register)
	r.Post("/auth/refresh", handlers.Refresh)
	r.Post("/auth/send-email/registration", handlers.SendEmailRegistration)
	r.Post("/auth/send-email/reset-password", handlers.SendEmailResetPassword)
	r.Post("/auth/confirm-email/registration", handlers.ConfirmEmailRegistration)
	r.Post("/auth/confirm-email/reset-password", handlers.ConfirmEmailResetPassword)
	r.Post("/auth/reset-password", handlers.ResetPassword)

	log.Println("Server is running on port 8080")
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
