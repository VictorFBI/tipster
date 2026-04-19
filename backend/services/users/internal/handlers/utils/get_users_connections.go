package utils

import (
	"net/http"
	"strconv"
	"strings"
)

const listMaxLimit = 100

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

// jwtAccountID is used when the account_id query parameter is absent or empty (authenticated user from JWT).
func ParseAccountIDLimitOffset(r *http.Request, jwtAccountID string) (accountID string, limit int, offset int, errMsg string) {
	var errMsgAcc string
	accountID, errMsgAcc = ResolveAccountIDFromQueryOrJWT(r, jwtAccountID)
	if errMsgAcc != "" {
		return "", 0, 0, errMsgAcc
	}
	q := r.URL.Query()
	limitStr := q.Get("limit")
	if limitStr == "" {
		return "", 0, 0, "limit is required"
	}
	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		return "", 0, 0, "limit must be an integer"
	}
	if limit < 1 || limit > listMaxLimit {
		return "", 0, 0, "limit must be an integer between 1 and 100"
	}
	offsetStr := q.Get("offset")
	if offsetStr == "" {
		return "", 0, 0, "offset is required"
	}
	offset, err2 := strconv.Atoi(offsetStr)
	if err2 != nil {
		return "", 0, 0, "offset must be an integer"
	}
	if offset < 0 {
		return "", 0, 0, "offset must be a non-negative integer"
	}
	return accountID, limit, offset, ""
}
