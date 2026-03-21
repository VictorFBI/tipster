package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/media/internal/db/s3"
	"tipster/backend/media/internal/handlers"
	applogging "tipster/backend/media/internal/logging"

	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
	middlewares "tipster/backend/media/internal/middlewares"
)

func init() {
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../../.env")
}

func checkS3Connection(ctx context.Context) {
	slog.Info("checking_s3_connection")

	_, err := s3.Connect(ctx, "S3_TEMP_BUCKET")
	if err != nil {
		slog.Error("s3_connection_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}

	slog.Info("s3_connection_ok")
}

func main() {
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	slog.SetDefault(slog.New(h))

	ctx := context.Background()

	checkS3Connection(ctx)

	// Setup router
	r := chi.NewRouter()
	slog.Info("server_starting")
	r.Use(middleware.RequestID)
	r.Use(applogging.HTTPMiddleware)

	// Swagger routes
	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	// Media routes (protected by access token)
	r.With(middlewares.RequireAccessToken).Post("/media/presigned-url", handlers.PostPresignedUrl)
	r.With(middlewares.RequireAccessToken).Post("/media/commit", handlers.PostCommit)


	slog.Info("server_listening", slog.String("addr", ":8082"))
	err := http.ListenAndServe(":8082", r)
	if err != nil {
		slog.Error("server_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
