package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/users/internal/consumers"
	"tipster/backend/users/internal/db/kafka"
	"tipster/backend/users/internal/db/postgresql"
	"tipster/backend/users/internal/handlers"
	middlewares "tipster/backend/users/internal/middlewares"

	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
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
	checkKafkaConnection(ctx)

	kafkaClient, err := kafka.Connect(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to Kafka for consumer: %v", err)
	}
	go consumers.RunAuthUserCreated(ctx, kafkaClient)

	// Setup router
	r := chi.NewRouter()
	log.Println("Server is starting...")
	r.Use(middleware.Logger)

	// Swagger routes
	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	// Users routes (protected by access token)
	r.With(middlewares.RequireAccessToken).Get("/users/profile", handlers.GetAccountProfile)
	r.With(middlewares.RequireAccessToken).Patch("/users/profile", handlers.PatchAccountProfile)
	r.With(middlewares.RequireAccessToken).Get("/users/profile/me", handlers.GetAccountProfileMe)

	log.Println("Server is running on port 8081")
	err = http.ListenAndServe(":8081", r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
