# Auth Service

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Database Configuration
# Option 1: Use DATABASE_URL (recommended)
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/auth?sslmode=disable

# Option 2: Use individual variables
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=auth
DB_SSLMODE=disable
```

### Database Setup

1. Start PostgreSQL using Docker Compose:
```bash
docker-compose -f deployments/docker-compose.yaml up -d
```

2. Migrations are automatically run when the server starts.

### Running the Server

```bash
go run cmd/server/main.go
```

## Code Generation

Run codegen:
```
go run github.com/deepmap/oapi-codegen/cmd/oapi-codegen@latest -package api -generate types api/openapi.yaml > internal/generated/api.go
```

## Migrations

Migrations are located in the `migrations/` directory:
- `0001_create_users_table.up.sql` - Creates users table
- `0001_create_users_table.down.sql` - Drops users table

Migrations are automatically applied on server startup.