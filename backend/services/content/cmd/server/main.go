package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/content/internal/db/kafka"
	"tipster/backend/content/internal/db/postgresql"
	"tipster/backend/content/internal/handlers"
	"tipster/backend/content/internal/handlers/comments"
	"tipster/backend/content/internal/handlers/likes"
	"tipster/backend/content/internal/handlers/posts"
	likedhandlers "tipster/backend/content/internal/handlers/posts/liked"
	"tipster/backend/content/internal/handlers/stats"
	applogging "tipster/backend/content/internal/logging"
	middlewares "tipster/backend/content/internal/middlewares"

	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"
)

func init() {
	_ = godotenv.Load(".env")
	_ = godotenv.Load("../../.env")
}

func checkPostgreSQLConnection(ctx context.Context) {
	slog.Info("checking_postgresql")
	pgConn, err := postgresql.Connect(ctx)
	if err != nil {
		slog.Error("postgresql_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	err = pgConn.Close(ctx)
	if err != nil {
		slog.Error("postgresql_close_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("postgresql_ok")
}

func checkKafkaConnection(ctx context.Context) {
	slog.Info("checking_kafka")
	kafkaConn, err := kafka.Connect(ctx)
	if err != nil {
		slog.Error("kafka_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	err = kafkaConn.Close()
	if err != nil {
		slog.Error("kafka_close_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("kafka_ok")
}

func checkMediaServiceURL() {
	if os.Getenv("MEDIA_SERVICE_BASE_URL") == "" {
		slog.Warn("media_service_skipped", slog.String("reason", "MEDIA_SERVICE_BASE_URL unset; image attachments will fail until configured"))
		return
	}
	slog.Info("media_service_url_ok", slog.String("base", os.Getenv("MEDIA_SERVICE_BASE_URL")))
}

func main() {
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})
	slog.SetDefault(slog.New(h))

	ctx := context.Background()

	if err := postgresql.RunMigrations(); err != nil {
		slog.Error("migrations_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("migrations_ok")

	checkPostgreSQLConnection(ctx)
	checkKafkaConnection(ctx)
	checkMediaServiceURL()

	r := chi.NewRouter()
	slog.Info("server_starting")
	r.Use(middleware.RequestID)
	r.Use(applogging.HTTPMiddleware("content"))

	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	r.With(middlewares.RequireAccessToken).Get("/content/posts/liked", likedhandlers.GetContentPostsLiked)
	r.With(middlewares.RequireAccessToken).Get("/content/stats", stats.GetContentStats)
	r.With(middlewares.RequireAccessToken).Get("/content/posts", posts.GetContentPosts)
	r.With(middlewares.RequireAccessToken).Post("/content/posts", posts.PostContentPosts)
	r.With(middlewares.RequireAccessToken).Patch("/content/posts", posts.PatchContentPosts)
	r.With(middlewares.RequireAccessToken).Delete("/content/posts", posts.DeleteContentPosts)

	r.With(middlewares.RequireAccessToken).Post("/content/comments", comments.PostContentComments)
	r.With(middlewares.RequireAccessToken).Patch("/content/comments", comments.PatchContentComments)
	r.With(middlewares.RequireAccessToken).Delete("/content/comments", comments.DeleteContentComments)

	r.With(middlewares.RequireAccessToken).Post("/content/likes", likes.PostContentLikes)
	r.With(middlewares.RequireAccessToken).Delete("/content/likes", likes.DeleteContentLikes)

	slog.Info("server_listening", slog.String("addr", ":8083"))
	err := http.ListenAndServe(":8083", r)
	if err != nil {
		slog.Error("server_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
