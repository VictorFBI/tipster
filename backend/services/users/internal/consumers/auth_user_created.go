package consumers

import (
	"context"
	"errors"
	"log"

	"tipster/backend/users/internal/db/kafka"
	"tipster/backend/users/internal/services/users"
)

const (
	authUserCreatedTopic = "auth.user.created"
	authUserCreatedGroup = "users"
)

// RunAuthUserCreated consumes messages from auth.user.created and creates account via UsersService
func RunAuthUserCreated(ctx context.Context, client *kafka.Client) {
	reader := client.NewReader(authUserCreatedTopic, authUserCreatedGroup)
	defer reader.Close()

	usersSvc := usersservice.New(ctx)
	defer usersSvc.Close(ctx)

	log.Printf("[consumer] subscribed to topic %s (group %s)", authUserCreatedTopic, authUserCreatedGroup)
	for {
		msg, err := reader.ReadMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				log.Printf("[consumer] auth.user.created stopped: %v", ctx.Err())
				return
			}
			log.Printf("[consumer] auth.user.created read error: %v", err)
			continue
		}
		id := string(msg.Key)
		err = usersSvc.CreateAccount(ctx, id)
		if err != nil {
			if errors.Is(err, usersservice.ErrAccountAlreadyExists) {
				log.Printf("[consumer] auth.user.created account already exists: id=%s", id)
				continue
			}
			log.Printf("[consumer] auth.user.created create account error: id=%s err=%v", id, err)
			continue
		}
		log.Printf("[consumer] auth.user.created account created: id=%s", id)
	}
}
