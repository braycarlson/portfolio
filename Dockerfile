ARG GO_IMAGE="golang:1.26-bookworm"
ARG RUNNER_IMAGE="debian:bookworm-slim"

# --- UI build stage ---

FROM oven/bun:1 AS ui

WORKDIR /app

COPY package.json bun.lock* bun.lockb* ./
RUN bun install

COPY . .

RUN bun run build

# --- Go build stage ---

FROM ${GO_IMAGE} AS builder

WORKDIR /app

COPY server/go.mod server/go.sum* ./
RUN [ -f go.sum ] && go mod download || true

COPY server/ .
RUN CGO_ENABLED=0 GOOS=linux go build -o portfolio .

# --- Runtime stage ---

FROM ${RUNNER_IMAGE}

RUN apt-get update -y && \
    apt-get install -y ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN useradd --create-home --shell /bin/bash portfolio

USER portfolio

COPY --from=builder --chown=portfolio:portfolio /app/portfolio ./
COPY --from=ui --chown=portfolio:portfolio /app/dist ./dist

ENV STATIC_DIR=/app/dist
ENV PORT=8080

EXPOSE 8080

CMD ["./portfolio"]
