package consumers

import (
	"context"
	"log"

	kafkadb "tipster/backend/auth/internal/db/kafka"
	usersservice "tipster/backend/auth/internal/services/users"
)

const (
	usersUserDeletedTopic = "users.user.deleted"
	usersUserDeletedGroup = "auth"
)

// RunUsersUserDeleted consumes users.user.deleted and removes the auth user by message key (user id).
func RunUsersUserDeleted(ctx context.Context, client *kafkadb.Client) {
	reader := client.NewReader(usersUserDeletedTopic, usersUserDeletedGroup)
	defer reader.Close()

	usersSvc := usersservice.New(ctx)
	defer usersSvc.Close(ctx)

	log.Printf("[consumer] subscribed to topic %s (group %s)", usersUserDeletedTopic, usersUserDeletedGroup)
	for {
		msg, err := reader.ReadMessage(ctx)
		if err != nil {
			if ctx.Err() != nil {
				log.Printf("[consumer] users.user.deleted stopped: %v", ctx.Err())
				return
			}
			log.Printf("[consumer] users.user.deleted read error: %v", err)
			continue
		}
		id := string(msg.Key)
		err = usersSvc.DeleteUserById(ctx, id)
		if err != nil {
			log.Printf("[consumer] users.user.deleted delete user error: id=%s err=%v", id, err)
			continue
		}
		log.Printf("[consumer] users.user.deleted user deleted: id=%s", id)
	}
}
