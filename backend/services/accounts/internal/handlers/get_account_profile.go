package handlers

import (
	"encoding/json"
	"net/http"

	api "tipster/backend/accounts/internal/generated"
	accountsservice "tipster/backend/accounts/internal/services/accounts"
)

func GetAccountProfile(w http.ResponseWriter, r *http.Request) {
	accountId := r.URL.Query().Get("account_id")
	if accountId == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(api.ErrorResponse{Message: "Account ID is required"})
		return
	}
	svc := accountsservice.New(r.Context())
	defer svc.Close(r.Context())

	account, err := svc.GetAccountById(r.Context(), accountId)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if account == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}
	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(account)
}
