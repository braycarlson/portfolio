set dotenv-load

set windows-shell := ["cmd", "/c"]

clear := if os() == "windows" { "cls" } else { "clear" }

# List all available recipes.
default:
    @just --list

# Install all dependencies.
setup:
    {{clear}}
    bun install
    cd server && go mod download

# Start the Vue development server.
ui:
    {{clear}}
    bun run dev

# Start the Go server locally.
server:
    {{clear}}
    cd server && go run .

# Build the Vue frontend.
build:
    {{clear}}
    bun run build

# Lint the frontend.
lint:
    {{clear}}
    docker compose exec app bun run lint

# Lint and auto-fix the frontend.
lint-fix:
    {{clear}}
    docker compose exec app bun run lint:fix

# Run type checking.
type-check:
    {{clear}}
    docker compose exec app bun run type-check

# Run type checking and linting.
check:
    {{clear}}
    docker compose exec app bun run type-check
    docker compose exec app bun run lint

# Format all source files.
format:
    {{clear}}
    docker compose exec app bun run format

# --- Docker ---

# Start all services for local development.
up:
    {{clear}}
    docker compose up --build

# Stop all Docker services.
down:
    {{clear}}
    docker compose down

# Tail logs for all Docker services.
logs:
    {{clear}}
    docker compose logs -f

# Tail logs for a specific Docker service.
logs-service service:
    {{clear}}
    docker compose logs -f {{service}}

# Remove all Docker containers and rebuild from scratch.
docker-reset:
    {{clear}}
    docker compose down -v
    docker compose up --build

# --- Fly.io ---

# Full first-time setup: app + secrets + deploy.
fly-setup:
    {{clear}}
    bash deploy.sh setup

# Deploy to Fly.io.
fly-deploy:
    {{clear}}
    bash deploy.sh deploy

# Generate deploy token for GitHub Actions auto-deploy.
fly-ci:
    {{clear}}
    bash deploy.sh ci

# Set Fly.io secrets from .env.
fly-secrets:
    {{clear}}
    bash deploy.sh secrets

# Allocate IPs, set Cloudflare DNS, and add Fly certs.
fly-domain:
    {{clear}}
    bash deploy.sh domain

# Show Fly.io app status.
fly-status:
    {{clear}}
    bash deploy.sh status

# Destroy the Fly.io app.
fly-destroy:
    {{clear}}
    bash deploy.sh destroy
