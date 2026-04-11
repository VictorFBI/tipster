generate-api:
	go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest -package api -generate types api/openapi.yaml > internal/generated/api.go

migrate-up:
	migrate -path ./migrations/postgresql -database "postgres://postgres:postgres@localhost:5434/content?sslmode=disable" up

migrate-down:
	migrate -path ./migrations/postgresql -database "postgres://postgres:postgres@localhost:5434/content?sslmode=disable" down