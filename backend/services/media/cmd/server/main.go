package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/media/internal/db/s3"
	"tipster/backend/media/internal/handlers"

	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
	middlewares "tipster/backend/media/internal/middlewares"
)

func init() {
	err := godotenv.Load("../../.env")
	if err != nil {
		panic(err)
	}
}

func checkS3Connection(ctx context.Context) {
	log.Println("Checking S3 connection...")

	_, err := s3.Connect(ctx, "S3_TEMP_BUCKET")
	if err != nil {
		log.Fatalf("Failed to connect to S3: %v", err)
	}

	log.Println("S3 connection is OK")
}

func main() {
	ctx := context.Background()

	checkS3Connection(ctx)

	// Setup router
	r := chi.NewRouter()
	log.Println("Server is starting...")
	r.Use(middleware.Logger)

	// Swagger routes
	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	// Media routes (protected by access token)
	r.With(middlewares.RequireAccessToken).Post("/media/presigned-url", handlers.PostPresignedUrl)
	r.With(middlewares.RequireAccessToken).Post("/media/commit", handlers.PostCommit)


	log.Println("Server is running on port 8082")
	err := http.ListenAndServe(":8082", r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
