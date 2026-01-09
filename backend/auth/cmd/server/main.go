package main

import (
	"context"
	"log"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/auth/internal/db/postgresql"
	"tipster/backend/auth/internal/handlers"
)

func main() {
	ctx := context.Background()

	// Connect to database
	log.Println("Connecting to database...")
	conn, err := db.Connect(ctx)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer conn.Close(ctx)
	log.Println("Database connection established")


	// Setup router
	r := chi.NewRouter()
	log.Println("Server is starting...")
	r.Use(middleware.Logger)

	r.Post("/auth/login", handlers.Login)
}
