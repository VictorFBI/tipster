package accountsservice

import (
	"context"
	"errors"
	"fmt"
	"log"
	"strings"

	"tipster/backend/accounts/internal/db/postgresql"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
)

var (
	ErrAccountAlreadyExists  = errors.New("Account already exists")
	ErrAccountNotFound       = errors.New("Account not found")
	ErrInvalidAccountID      = errors.New("Invalid account ID")
)

type AccountBase struct {
	Id              string
	FirstName        *string
	LastName         *string
	Username         *string
	AvatarUrl        *string
	Bio              *string
	CreatedAt     *string
	UpdatedAt     *string
}

type AccountWithSecureClaims struct {
	AccountBase
	WalletAddress *string
}

type Account struct {
	AccountBase
}

type AccountsService struct {
	postgres *pgx.Conn
}

func New(ctx context.Context) *AccountsService {
	postgres, err := postgresql.Connect(ctx)
	if err != nil {
		panic(err)
	}
	return &AccountsService{
		postgres: postgres,
	}
}

// GetAccountById retrieves a Account by id
func (as *AccountsService) GetAccountById(ctx context.Context, id string) (*Account, error) {
	var Account Account
	err := as.postgres.QueryRow(ctx,
		"SELECT id, first_name, last_name, username, avatar_url, bio, created_at::text, updated_at::text FROM accounts WHERE id = $1",
		id,
	).Scan(&Account.Id, &Account.FirstName, &Account.LastName, &Account.Username, &Account.AvatarUrl, &Account.Bio, &Account.CreatedAt, &Account.UpdatedAt)

	if err != nil {
		log.Println("Error getting account by id:", err)
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAccountNotFound
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidAccountID
		}
		return nil, err
	}

	return &Account, nil
}

// GetAccountByIdWithSecureClaims retrieves a Account by id with secure claims
func (as *AccountsService) GetAccountByIdWithSecureClaims(ctx context.Context, id string) (*AccountWithSecureClaims, error) {
	var Account AccountWithSecureClaims
	err := as.postgres.QueryRow(ctx,
		"SELECT id, first_name, last_name, username, avatar_url, bio, wallet_address, created_at::text, updated_at::text FROM accounts WHERE id = $1",
		id,
	).Scan(&Account.Id, &Account.FirstName, &Account.LastName, &Account.Username, &Account.AvatarUrl, &Account.Bio, &Account.WalletAddress, &Account.CreatedAt, &Account.UpdatedAt)

	if err != nil {
		log.Println("Error getting account by id:", err)
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, ErrAccountNotFound
		}
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "22P02" {
			return nil, ErrInvalidAccountID
		}
		return nil, err
	}

	return &Account, nil
}

// AddAccount adds a new Account to the database
func (as *AccountsService) CreateAccount(ctx context.Context, id string) error {
	err := as.postgres.QueryRow(ctx,
		"INSERT INTO accounts (id) VALUES ($1) ON CONFLICT DO NOTHING RETURNING id",
		id,
	).Scan(&id)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// No rows returned means ON CONFLICT triggered (email already exists)
			return ErrAccountAlreadyExists
		}
		return err
	}

	// If we got here, Account was successfully inserted (id was returned)
	return nil
}


// PartialEditAccount updates only fields present in patch (PATCH semantics).
// Keys in patch = fields to update. patch["last_name"] = nil means set last_name to NULL.
func (as *AccountsService) PartialEditAccount(ctx context.Context, accountId string, patch map[string]*string) error {
	var set []string
	var args []interface{}
	pos := 1
	for col, v := range patch {
		set = append(set, col+" = $"+fmt.Sprint(pos))
		args = append(args, v)
		pos++
	}
	if len(set) == 0 {
		return nil
	}
	set = append(set, "updated_at = CURRENT_TIMESTAMP")
	args = append(args, accountId)
	q := "UPDATE accounts SET " + strings.Join(set, ", ") + " WHERE id = $" + fmt.Sprint(pos)
	_, err := as.postgres.Exec(ctx, q, args...)
	return err
}

// Close closes the PostgreSQL postgresection
func (as *AccountsService) Close(ctx context.Context) error {
	return as.postgres.Close(ctx)
}
