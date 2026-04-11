package postgresql

import (
	"database/sql"
	"errors"
	"fmt"
	"net/url"
	"os"
	"path/filepath"

	"github.com/golang-migrate/migrate/v4"
	pgxv5 "github.com/golang-migrate/migrate/v4/database/pgx/v5"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/jackc/pgx/v5/stdlib"
)

// RunMigrations applies all pending .up.sql migrations from migrationsDir (e.g. migrations/postgresql).
// Uses the same env vars as Connect. Optional MIGRATIONS_PATH overrides the directory.
func RunMigrations() error {
	migrationsDir := os.Getenv("MIGRATIONS_PATH")
	if migrationsDir == "" {
		migrationsDir = "migrations/postgresql"
	}
	absDir, err := filepath.Abs(migrationsDir)
	if err != nil {
		return fmt.Errorf("migrations path: %w", err)
	}

	dsn, err := postgresURLForMigrate()
	if err != nil {
		return err
	}

	db, err := sql.Open("pgx", dsn)
	if err != nil {
		return fmt.Errorf("migrate open db: %w", err)
	}
	defer db.Close()

	driver, err := pgxv5.WithInstance(db, &pgxv5.Config{})
	if err != nil {
		return fmt.Errorf("migrate pgx driver: %w", err)
	}

	sourceURL := "file://" + filepath.ToSlash(absDir)
	m, err := migrate.NewWithDatabaseInstance(sourceURL, "pgx5", driver)
	if err != nil {
		return fmt.Errorf("migrate new: %w", err)
	}
	defer m.Close()

	if err := m.Up(); err != nil && !errors.Is(err, migrate.ErrNoChange) {
		return fmt.Errorf("migrate up: %w", err)
	}
	return nil
}

func postgresURLForMigrate() (string, error) {
	host := getEnvOrDefault("DB_HOST", "localhost")
	port := getEnvOrDefault("DB_PORT", "5432")
	user := getEnvOrDefault("DB_USER", "postgres")
	password := os.Getenv("DB_PASSWORD")
	dbname := getEnvOrDefault("DB_NAME", "content")
	sslmode := getEnvOrDefault("DB_SSLMODE", "disable")
	if password == "" {
		return "", fmt.Errorf("DB_PASSWORD environment variable is not set")
	}
	u := url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(user, password),
		Host:   fmt.Sprintf("%s:%s", host, port),
		Path:   "/" + dbname,
	}
	q := u.Query()
	q.Set("sslmode", sslmode)
	u.RawQuery = q.Encode()
	return u.String(), nil
}
