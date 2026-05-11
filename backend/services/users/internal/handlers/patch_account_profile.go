package handlers

import (
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"strings"

	api "tipster/backend/users/internal/generated"
	"tipster/backend/users/internal/clients/media"
	"tipster/backend/users/internal/handlers/helpers"
	"tipster/backend/users/internal/logging"
	middlewares "tipster/backend/users/internal/middlewares"
	usersservice "tipster/backend/users/internal/services/users"
)

func PatchAccountProfile(w http.ResponseWriter, r *http.Request) {
	log := logging.LoggerFromContext(r.Context()).With(slog.String("handler", "patch_account_profile"))
	accountId, _ := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if accountId == "" {
		log.Warn("unauthorized", slog.String("reason", "missing_account_in_context"))
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Warn("bad_request", slog.String("reason", "read_body_failed"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	var patch map[string]*string
	if err := json.Unmarshal(body, &patch); err != nil {
		log.Warn("bad_request", slog.String("reason", "invalid_json"), slog.String("error", err.Error()))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	if avatarPtr, ok := patch["avatar_url"]; ok && avatarPtr != nil {
		if strings.TrimSpace(*avatarPtr) == "" {
			patch["avatar_url"] = nil
		} else {
			keyNorm, needCommit, persistURL, err := helpers.ResolveAvatarForPatch(*avatarPtr)
			if err != nil {
				log.Warn("bad_request", slog.String("reason", "invalid_avatar_url"), slog.String("error", err.Error()))
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusBadRequest)
				json.NewEncoder(w).Encode(api.ErrorResponse{Message: err.Error()})
				return
			} else {
				acc, err := svc.GetAccountById(r.Context(), accountId)
				if err != nil {
					if errors.Is(err, usersservice.ErrAccountNotFound) {
						log.Warn("patch_profile_failed", slog.String("reason", "account_not_found"))
						w.WriteHeader(http.StatusNotFound)
						return
					}
					log.Error("patch_profile_failed", slog.String("reason", "get_account"), slog.String("error", err.Error()))
					w.WriteHeader(http.StatusInternalServerError)
					return
				}
				oldKey := ""
				if acc.AvatarUrl != nil {
					oldKey = helpers.StoredAvatarObjectKey(*acc.AvatarUrl)
				}
				if needCommit && keyNorm != oldKey {
					authz := r.Header.Get("Authorization")
					if err := media.Commit(r.Context(), []string{keyNorm}, authz); err != nil {
						if st, msg, ok := helpers.MapMediaCommitErr(err); ok {
							log.Warn("patch_profile_failed", slog.String("reason", "media_commit"), slog.String("error", err.Error()))
							w.Header().Set("Content-Type", "application/json")
							w.WriteHeader(st)
							json.NewEncoder(w).Encode(api.ErrorResponse{Message: msg})
							return
						}
						log.Error("patch_profile_failed", slog.String("reason", "media_commit"), slog.String("error", err.Error()))
						w.WriteHeader(http.StatusInternalServerError)
						return
					}
				}
				toStore := persistURL
				patch["avatar_url"] = &toStore
			}
		}
	}

	err = svc.PartialEditAccount(r.Context(), accountId, patch)
	if err != nil {
		log.Error("patch_profile_failed", slog.String("error", err.Error()))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Info("patch_account_profile_ok")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
