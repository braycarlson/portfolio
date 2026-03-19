package main

import (
	"errors"
	"os"
)

type config struct {
	clientID     string
	clientSecret string
	refreshToken string
	origin       string
	port         string
	staticDir    string
}

func loadConfig() config {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	static := os.Getenv("STATIC_DIR")

	if static == "" {
		static = "dist"
	}

	return config{
		clientID:     os.Getenv("SPOTIFY_CLIENT_ID"),
		clientSecret: os.Getenv("SPOTIFY_CLIENT_SECRET"),
		refreshToken: os.Getenv("SPOTIFY_REFRESH_TOKEN"),
		origin:       os.Getenv("CORS_ORIGIN"),
		port:         port,
		staticDir:    static,
	}
}

func (c config) validate() error {
	if c.clientID == "" {
		return errors.New("SPOTIFY_CLIENT_ID is required")
	}

	if c.clientSecret == "" {
		return errors.New("SPOTIFY_CLIENT_SECRET is required")
	}

	if c.refreshToken == "" {
		return errors.New("SPOTIFY_REFRESH_TOKEN is required")
	}

	return nil
}
