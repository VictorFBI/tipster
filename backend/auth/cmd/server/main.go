package main

import (
	"context"
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"tipster/backend/auth/internal/db/postgresql"
	"tipster/backend/auth/internal/handlers"
)

func main() {
	ctx := context.Background()

	// Connect to database
	log.Println("Connecting to database...")
	conn, err := postgresql.Connect(ctx)
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
	r.Post("/auth/register", handlers.Register)
	r.Post("/auth/send-email/registration", handlers.SendEmailRegistration)

	log.Println("Server is running on port 8080")
	err = http.ListenAndServe(":8080", r)
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
