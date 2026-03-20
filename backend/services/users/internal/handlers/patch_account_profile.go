package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"

	api "tipster/backend/users/internal/generated"
	usersservice "tipster/backend/users/internal/services/users"
	middlewares "tipster/backend/users/internal/middlewares"
)

func PatchAccountProfile(w http.ResponseWriter, r *http.Request) {
	accountId, _ := r.Context().Value(middlewares.AccountIDContextKey).(string)
	if accountId == "" {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		log.Println("Error reading body:", err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	log.Println("body:", string(body))

	var patch map[string]*string
	if err := json.Unmarshal(body, &patch); err != nil {
		log.Println("Error decoding body:", err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Invalid request body"})
		return
	}

	log.Println("patch:", patch)

	svc := usersservice.New(r.Context())
	defer svc.Close(r.Context())

	err = svc.PartialEditAccount(r.Context(), accountId, patch)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
