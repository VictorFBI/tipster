package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/users/internal/consumers"
	"tipster/backend/users/internal/db/kafka"
	"tipster/backend/users/internal/db/postgresql"
	"tipster/backend/users/internal/handlers"
	applogging "tipster/backend/users/internal/logging"
	middlewares "tipster/backend/users/internal/middlewares"

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
	checkKafkaConnection(ctx)

	kafkaClient, err := kafka.Connect(ctx)
	if err != nil {
		slog.Error("kafka_consumer_connect_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
	go consumers.RunAuthUserCreated(ctx, kafkaClient)

	r := chi.NewRouter()
	slog.Info("server_starting")
	r.Use(middleware.RequestID)
	r.Use(applogging.HTTPMiddleware("users"))

	r.Get("/swagger/doc.json", handlers.OpenAPIDoc)
	r.Get("/swagger/*", httpSwagger.Handler(
		httpSwagger.URL("/swagger/doc.json"),
	))

	r.With(middlewares.RequireAccessToken).Get("/users/search", handlers.GetUsersSearch)
	r.With(middlewares.RequireAccessToken).Post("/users/subscribe", handlers.PostUsersSubscribe)
	r.With(middlewares.RequireAccessToken).Post("/users/unsubscribe", handlers.PostUsersUnsubscribe)
	r.With(middlewares.RequireAccessToken).Get("/users/profile", handlers.GetAccountProfile)
	r.With(middlewares.RequireAccessToken).Patch("/users/profile", handlers.PatchAccountProfile)
	r.With(middlewares.RequireAccessToken).Get("/users/profile/me", handlers.GetAccountProfileMe)
	r.With(middlewares.RequireAccessToken).Delete("/users/profile/me", handlers.DeleteAccountProfileMe)

	slog.Info("server_listening", slog.String("addr", ":8081"))
	err = http.ListenAndServe(":8081", r)
	if err != nil {
		slog.Error("server_failed", slog.String("error", err.Error()))
		os.Exit(1)
	}
}
