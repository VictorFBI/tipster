package cron

import (
	"context"
	"log/slog"
	"time"

	registrationconfirmationservice "tipster/backend/auth/internal/services/registrationconfirmation"
	usersservice "tipster/backend/auth/internal/services/users"
)

const (
	staleUnverifiedInterval = 5 * time.Minute
	staleUnverifiedMaxAge   = 15 * time.Minute
)

// RunStaleUnverifiedCleanup runs every staleUnverifiedInterval and removes users that still have is_email_verified=false and were created more than staleUnverifiedMaxAge ago.
func RunStaleUnverifiedCleanup(ctx context.Context) {
	go func() {
		usersSvc := usersservice.New(ctx)
		defer usersSvc.Close(ctx)
		regSvc := registrationconfirmationservice.New(ctx)
		defer regSvc.Close()

		ticker := time.NewTicker(staleUnverifiedInterval)
		defer ticker.Stop()

		run := func() {
			ids, err := usersSvc.DeleteUnverifiedUsersOlderThan(ctx, staleUnverifiedMaxAge)
			if err != nil {
				slog.Error("stale_unverified_cleanup_failed", slog.String("error", err.Error()))
				return
			}
			for _, id := range ids {
				if err := regSvc.DeleteConfirmationClaims(ctx, id); err != nil {
					slog.Error("stale_unverified_redis_cleanup_failed", slog.String("user_id", id), slog.String("error", err.Error()))
				}
			}
			if len(ids) > 0 {
				slog.Info("stale_unverified_cleanup_ok", slog.Int("deleted", len(ids)))
			}
		}

		run()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				run()
			}
		}
	}()
}
