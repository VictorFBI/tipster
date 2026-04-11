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
	"tipster/backend/content/internal/db/redis"
	"tipster/backend/content/internal/handlers"
	applogging "tipster/backend/content/internal/logging"

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

func checkRedisConnection(ctx context.Context) {
	slog.Info("checking_redis")
	redisConn, err := redis.Connect(ctx)
	if err != nil {
		slog.Error("redis_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	err = redisConn.Close()
	if err != nil {
		slog.Error("redis_close_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	slog.Info("redis_ok")
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
	checkRedisConnection(ctx)
	checkKafkaConnection(ctx)

	r := chi.NewRouter()
	slog.Info("server_starting")
	r.Use(middleware.RequestID)
	r.Use(applogging.HTTPMiddleware("content"))

	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	r.Get("/content/me", handlers.Me)
	r.Post("/content/login", handlers.Login)
	r.Post("/content/logout", handlers.Logout)
	r.Post("/content/register", handlers.Register)
	r.Post("/content/refresh", handlers.Refresh)
	r.Post("/content/send-email/registration", handlers.SendEmailRegistration)
	r.Post("/content/send-email/reset-password", handlers.SendEmailResetPassword)
	r.Post("/content/confirm-email/registration", handlers.ConfirmEmailRegistration)
	r.Post("/content/confirm-email/reset-password", handlers.ConfirmEmailResetPassword)
	r.Post("/content/reset-password", handlers.ResetPassword)

	slog.Info("server_listening", slog.String("addr", ":8080"))
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		slog.Error("server_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
