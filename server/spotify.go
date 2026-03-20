package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"sync"
	"time"
)

const (
	tokenExpiryBuffer = 60 * time.Second
	maxErrorBodyBytes = 4096
)

type token struct {
	access  string
	expires time.Time
	mu      sync.Mutex
}

type spotifyClient struct {
	cfg    config
	client *http.Client
	token  token
}

// SpotifyImage represents an image resource returned by the Spotify API.
type SpotifyImage struct {
	Height int    `json:"height"`
	URL    string `json:"url"`
	Width  int    `json:"width"`
}

// SpotifyArtist represents an artist resource returned by the Spotify API.
type SpotifyArtist struct {
	Name string `json:"name"`
}

// NowPlayingResponse is the JSON payload served by the now-playing endpoint.
type NowPlayingResponse struct {
	Album   string `json:"album"`
	Art     string `json:"art"`
	Artist  string `json:"artist"`
	Playing bool   `json:"playing"`
	Track   string `json:"track"`
	URL     string `json:"url"`
}

func firstArtist(artists []SpotifyArtist) string {
	if len(artists) > 0 {
		return artists[0].Name
	}

	return ""
}

func firstImage(images []SpotifyImage) string {
	if len(images) > 0 {
		return images[0].URL
	}

	return ""
}

func newSpotifyClient(cfg config) *spotifyClient {
	return &spotifyClient{
		cfg: cfg,
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (s *spotifyClient) invalidateToken() {
	s.token.mu.Lock()
	s.token.access = ""
	s.token.expires = time.Time{}
	s.token.mu.Unlock()
}

func (s *spotifyClient) handleNowPlaying(
	writer http.ResponseWriter,
	request *http.Request,
) {
	ctx := request.Context()

	access, err := s.accessToken(ctx)

	if err != nil {
		slog.Error("token error", "error", err)
		http.Error(writer, "token error", http.StatusInternalServerError)
		return
	}

	result, err := s.currentlyPlaying(ctx, access)

	if err != nil {
		slog.Error("currently-playing error", "error", err)
		http.Error(writer, "spotify error", http.StatusBadGateway)
		return
	}

	if result == nil {
		result, err = s.recentlyPlayed(ctx, access)

		if err != nil {
			slog.Error("recently-played error", "error", err)
			http.Error(writer, "spotify error", http.StatusBadGateway)
			return
		}
	}

	writer.Header().Set("Content-Type", "application/json")

	if result == nil {
		if _, err := writer.Write([]byte(`{"playing":false}`)); err != nil {
			slog.Error("write error", "error", err)
		}

		return
	}

	writer.Header().Set("Cache-Control", "public, max-age=30")

	if err := json.NewEncoder(writer).Encode(result); err != nil {
		slog.Error("encode error", "error", err)
	}
}

func (s *spotifyClient) accessToken(
	ctx context.Context,
) (string, error) {
	s.token.mu.Lock()
	defer s.token.mu.Unlock()

	if s.token.access != "" && time.Now().Before(s.token.expires) {
		return s.token.access, nil
	}

	credentials := base64.StdEncoding.EncodeToString(
		[]byte(s.cfg.clientID + ":" + s.cfg.clientSecret),
	)

	body := url.Values{}
	body.Set("grant_type", "refresh_token")
	body.Set("refresh_token", s.cfg.refreshToken)

	request, err := http.NewRequestWithContext(
		ctx,
		http.MethodPost,
		"https://accounts.spotify.com/api/token",
		strings.NewReader(body.Encode()),
	)

	if err != nil {
		return "", fmt.Errorf("building token request: %w", err)
	}

	request.Header.Set("Authorization", "Basic "+credentials)
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	response, err := s.client.Do(request)

	if err != nil {
		return "", fmt.Errorf("executing token request: %w", err)
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		limited := io.LimitReader(response.Body, maxErrorBodyBytes)
		raw, _ := io.ReadAll(limited)
		return "", fmt.Errorf("token request returned %d: %s", response.StatusCode, string(raw))
	}

	var result struct {
		AccessToken string `json:"access_token"`
		ExpiresIn   int    `json:"expires_in"`
	}

	if err := json.NewDecoder(response.Body).Decode(&result); err != nil {
		return "", fmt.Errorf("decoding token response: %w", err)
	}

	s.token.access = result.AccessToken
	s.token.expires = time.Now().Add(
		time.Duration(result.ExpiresIn)*time.Second - tokenExpiryBuffer,
	)

	return s.token.access, nil
}

func (s *spotifyClient) spotifyGet(
	ctx context.Context,
	access string,
	endpoint string,
) (*http.Response, error) {
	request, err := http.NewRequestWithContext(
		ctx,
		http.MethodGet,
		endpoint,
		nil,
	)

	if err != nil {
		return nil, fmt.Errorf("building request for %s: %w", endpoint, err)
	}

	request.Header.Set("Authorization", "Bearer "+access)

	response, err := s.client.Do(request)

	if err != nil {
		return nil, fmt.Errorf("executing request for %s: %w", endpoint, err)
	}

	if response.StatusCode == http.StatusUnauthorized {
		response.Body.Close()
		s.invalidateToken()
		return nil, fmt.Errorf("spotify returned 401 for %s", endpoint)
	}

	return response, nil
}

func (s *spotifyClient) currentlyPlaying(
	ctx context.Context,
	access string,
) (*NowPlayingResponse, error) {
	response, err := s.spotifyGet(
		ctx,
		access,
		"https://api.spotify.com/v1/me/player/currently-playing",
	)

	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	if response.StatusCode == http.StatusNoContent ||
		response.StatusCode == http.StatusAccepted {
		return nil, nil
	}

	if response.StatusCode != http.StatusOK {
		limited := io.LimitReader(response.Body, maxErrorBodyBytes)
		raw, _ := io.ReadAll(limited)
		return nil, fmt.Errorf("spotify returned %d: %s", response.StatusCode, string(raw))
	}

	var data struct {
		IsPlaying bool `json:"is_playing"`
		Item      struct {
			Album struct {
				Images []SpotifyImage `json:"images"`
				Name   string         `json:"name"`
			} `json:"album"`
			Artists      []SpotifyArtist   `json:"artists"`
			ExternalURLs map[string]string `json:"external_urls"`
			Name         string            `json:"name"`
		} `json:"item"`
	}

	if err := json.NewDecoder(response.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("decoding currently-playing response: %w", err)
	}

	if data.Item.Name == "" {
		return nil, nil
	}

	return &NowPlayingResponse{
		Album:   data.Item.Album.Name,
		Art:     firstImage(data.Item.Album.Images),
		Artist:  firstArtist(data.Item.Artists),
		Playing: data.IsPlaying,
		Track:   data.Item.Name,
		URL:     data.Item.ExternalURLs["spotify"],
	}, nil
}

func (s *spotifyClient) recentlyPlayed(
	ctx context.Context,
	access string,
) (*NowPlayingResponse, error) {
	response, err := s.spotifyGet(
		ctx,
		access,
		"https://api.spotify.com/v1/me/player/recently-played?limit=1",
	)

	if err != nil {
		return nil, err
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		limited := io.LimitReader(response.Body, maxErrorBodyBytes)
		raw, _ := io.ReadAll(limited)
		return nil, fmt.Errorf("spotify returned %d: %s", response.StatusCode, string(raw))
	}

	var data struct {
		Items []struct {
			Track struct {
				Album struct {
					Images []SpotifyImage `json:"images"`
					Name   string         `json:"name"`
				} `json:"album"`
				Artists      []SpotifyArtist   `json:"artists"`
				ExternalURLs map[string]string `json:"external_urls"`
				Name         string            `json:"name"`
			} `json:"track"`
		} `json:"items"`
	}

	if err := json.NewDecoder(response.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("decoding recently-played response: %w", err)
	}

	if len(data.Items) == 0 {
		return nil, nil
	}

	track := data.Items[0].Track

	return &NowPlayingResponse{
		Album:   track.Album.Name,
		Art:     firstImage(track.Album.Images),
		Artist:  firstArtist(track.Artists),
		Playing: false,
		Track:   track.Name,
		URL:     track.ExternalURLs["spotify"],
	}, nil
}
