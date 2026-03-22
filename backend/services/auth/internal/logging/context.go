package logging

import (
	"context"
	"log/slog"
)

type ctxKey int

const loggerCtxKey ctxKey = iota

func ContextWithLogger(ctx context.Context, l *slog.Logger) context.Context {
	return context.WithValue(ctx, loggerCtxKey, l)
}

func LoggerFromContext(ctx context.Context) *slog.Logger {
	if v := ctx.Value(loggerCtxKey); v != nil {
		if l, ok := v.(*slog.Logger); ok && l != nil {
			return l
		}
	}
	return slog.Default()
}
