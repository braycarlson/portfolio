package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	cfg := loadConfig()

	if err := cfg.validate(); err != nil {
		slog.Error("invalid config", "error", err)
		os.Exit(1)
	}

	spotify := newSpotifyClient(cfg)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /api/spotify/now-playing", spotify.handleNowPlaying)

	fs := http.FileServer(http.Dir(cfg.staticDir))

	mux.HandleFunc("GET /", func(writer http.ResponseWriter, request *http.Request) {
		path := cfg.staticDir + request.URL.Path

		if _, err := os.Stat(path); err == nil {
			fs.ServeHTTP(writer, request)
			return
		}

		request.URL.Path = "/"
		fs.ServeHTTP(writer, request)
	})

	server := &http.Server{
		Addr:         ":" + cfg.port,
		Handler:      cors(cfg.origin, mux),
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	ctx, stop := signal.NotifyContext(
		context.Background(),
		syscall.SIGINT,
		syscall.SIGTERM,
	)

	defer stop()

	go func() {
		slog.Info("listening", "port", cfg.port)

		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("server error", "error", err)
			os.Exit(1)
		}
	}()

	<-ctx.Done()

	slog.Info("shutting down")

	shutdown, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdown); err != nil {
		slog.Error("shutdown error", "error", err)
		os.Exit(1)
	}
}
