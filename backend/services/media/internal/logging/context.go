package logging

import (
	"context"
	"log/slog"
)

type ctxKey int

const loggerCtxKey ctxKey = iota

// ContextWithLogger attaches a slog.Logger to the context for handlers and downstream code.
func ContextWithLogger(ctx context.Context, l *slog.Logger) context.Context {
	return context.WithValue(ctx, loggerCtxKey, l)
}

// LoggerFromContext returns the request-scoped logger or the default logger.
func LoggerFromContext(ctx context.Context) *slog.Logger {
	if v := ctx.Value(loggerCtxKey); v != nil {
		if l, ok := v.(*slog.Logger); ok && l != nil {
			return l
		}
	}
	return slog.Default()
}
