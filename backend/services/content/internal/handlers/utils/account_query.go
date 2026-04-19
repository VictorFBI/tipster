package utils

import (
	"net/http"
	"strings"
)

// ResolveAccountIDFromQueryOrJWT uses account_id from the query when set; otherwise jwtAccountID (JWT subject).
func ResolveAccountIDFromQueryOrJWT(r *http.Request, jwtAccountID string) (accountID string, errMsg string) {
	accountID = strings.TrimSpace(r.URL.Query().Get("account_id"))
	if accountID == "" {
		accountID = strings.TrimSpace(jwtAccountID)
	}
	if accountID == "" {
		return "", "account_id is required"
	}
	return accountID, ""
}
