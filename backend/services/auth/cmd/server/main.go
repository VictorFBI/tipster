package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/auth/internal/db/postgresql"
	"tipster/backend/auth/internal/db/redis"
	"tipster/backend/auth/internal/db/kafka"
	"tipster/backend/auth/internal/handlers"
	applogging "tipster/backend/auth/internal/logging"

	httpSwagger "github.com/swaggo/http-swagger"
	"github.com/joho/godotenv"
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
	h := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.TimeKey {
				return slog.Attr{}
			}
			return a
		},
	})
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
	r.Use(applogging.HTTPMiddleware("auth"))

	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

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

	slog.Info("server_listening", slog.String("addr", ":8080"))
	err := http.ListenAndServe(":8080", r)
	if err != nil {
		slog.Error("server_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
