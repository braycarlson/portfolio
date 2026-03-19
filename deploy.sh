#!/usr/bin/env bash
#
# Portfolio — Fly.io setup and deploy.
#
# Prerequisites:
#   - flyctl installed and authenticated (fly auth login)
#   - Docker running (for the build step)
#
# Usage:
#   ./deploy.sh setup    — full first-time setup (app + secrets + deploy)
#   ./deploy.sh deploy   — deploy only (assumes app already exists)
#   ./deploy.sh secrets  — set Spotify secrets interactively
#   ./deploy.sh ci       — generate deploy token for GitHub Actions
#   ./deploy.sh status   — show app status
#   ./deploy.sh destroy  — tear everything down (asks for confirmation)

set -euo pipefail

# Git Bash on Windows doesn't inherit the Windows PATH entry for fly.
# Resolve fly.exe when running under WSL.
if ! command -v fly &>/dev/null && ! command -v fly.exe &>/dev/null; then
    for dir in /mnt/c/Users/*/.fly/bin; do
        if [ -x "$dir/fly.exe" ]; then
            export PATH="$PATH:$dir"
            break
        fi
    done
fi

# WSL doesn't resolve "fly" to "fly.exe" — create a wrapper.
if ! command -v fly &>/dev/null && command -v fly.exe &>/dev/null; then
    fly() { fly.exe "$@"; }
    export -f fly
fi

if ! command -v fly &>/dev/null; then
    red "Error: fly not found. Install flyctl or add it to your PATH."
    exit 1
fi

# Same wrapper for GitHub CLI.
if ! command -v gh &>/dev/null && command -v gh.exe &>/dev/null; then
    gh() { gh.exe "$@"; }
    export -f gh
fi

APP_NAME="portfolio"
REGION="yyz"
ENV_FILE=".env.prod"

# ---------------------------------------------------------------
# Colors
# ---------------------------------------------------------------

red()    { printf "\033[0;31m%s\033[0m\n" "$1"; }
green()  { printf "\033[0;32m%s\033[0m\n" "$1"; }
yellow() { printf "\033[0;33m%s\033[0m\n" "$1"; }
bold()   { printf "\033[1m%s\033[0m\n" "$1"; }

# ---------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------

app_exists() {
    fly apps list --json 2>/dev/null | grep -q "\"${APP_NAME}\""
}

# ---------------------------------------------------------------
# Steps
# ---------------------------------------------------------------

step_create_app() {
    bold "Step 1: Create Fly app"

    if app_exists; then
        green "  App '$APP_NAME' already exists, skipping."
    else
        fly apps create "$APP_NAME" --machines
        green "  Created app '$APP_NAME'."
    fi
    echo
}

step_set_secrets() {
    bold "Step 2: Set secrets"
    echo

    if [ ! -f "$ENV_FILE" ]; then
        yellow "  No $ENV_FILE found. Setting secrets interactively."
        echo

        secrets_args=()

        for key in SPOTIFY_CLIENT_ID SPOTIFY_CLIENT_SECRET SPOTIFY_REFRESH_TOKEN CORS_ORIGIN; do
            existing=$(fly secrets list --app "$APP_NAME" 2>/dev/null | grep "$key" || true)

            if [ -n "$existing" ]; then
                yellow "  $key is already set. Press Enter to keep, or type a new value."
            else
                yellow "  $key"
            fi

            printf "  > "
            read -r value

            if [ -n "$value" ]; then
                secrets_args+=("${key}=${value}")
            fi
        done

        if [ ${#secrets_args[@]} -gt 0 ]; then
            fly secrets set --app "$APP_NAME" "${secrets_args[@]}"
            green "  Secrets updated."
        else
            green "  No secrets changed."
        fi

        echo
        return
    fi

    yellow "  Reading secrets from $ENV_FILE"
    echo

    secrets_args=()

    skip_keys="PORT STATIC_DIR"

    while IFS= read -r line || [ -n "$line" ]; do
        line=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        [[ -z "$line" || "$line" == \#* ]] && continue

        if [[ "$line" == *"="* ]]; then
            key="${line%%=*}"
            value="${line#*=}"
            value=$(echo "$value" | sed "s/^['\"]//;s/['\"]$//")
        else
            key="$line"
            value=""
        fi

        for sk in $skip_keys; do
            [[ "$key" == "$sk" ]] && continue 2
        done

        if [ -z "$value" ]; then
            existing=$(fly secrets list --app "$APP_NAME" 2>/dev/null | grep "$key" || true)

            if [ -n "$existing" ]; then
                yellow "  $key is already set. Press Enter to keep, or type a new value."
            else
                yellow "  $key"
            fi

            printf "  > "
            read -r value
        else
            green "  $key=<from .env>"
        fi

        if [ -n "$value" ]; then
            secrets_args+=("${key}=${value}")
        fi
    done < "$ENV_FILE"

    if [ ${#secrets_args[@]} -gt 0 ]; then
        fly secrets set --app "$APP_NAME" "${secrets_args[@]}"
        green "  Secrets updated."
    else
        green "  No secrets changed."
    fi
    echo
}

step_deploy() {
    bold "Deploying..."
    echo

    fly deploy --app "$APP_NAME" --yes

    green "  Deploy complete."
    echo
}

step_status() {
    bold "App status"
    fly status --app "$APP_NAME" 2>/dev/null || red "  App not found."
    echo

    bold "Secrets"
    fly secrets list --app "$APP_NAME" 2>/dev/null || red "  No secrets."
    echo
}

step_ci() {
    bold "GitHub Actions — Auto-deploy setup"
    echo

    if ! command -v gh &>/dev/null; then
        red "  Error: gh (GitHub CLI) not found. Install it from https://cli.github.com"
        echo
        return
    fi

    bold "  Generating deploy token..."
    token=$(fly tokens create deploy --app "$APP_NAME" 2>/dev/null)

    if [ -z "$token" ]; then
        red "  Failed to generate token."
        return
    fi

    green "  Token generated."
    echo

    bold "  Setting FLY_API_TOKEN as a GitHub repo secret..."

    local repo
    repo=$(gh repo view --json nameWithOwner -q .nameWithOwner 2>/dev/null || true)

    if [ -z "$repo" ]; then
        repo=$(git remote get-url origin 2>/dev/null | sed 's|.*github\.com[:/]||;s|\.git$||' || true)
    fi

    if [ -z "$repo" ]; then
        yellow "  Could not detect GitHub repo from git remote."
        yellow "  Run this from your Windows terminal instead:"
        echo
        echo "  gh secret set FLY_API_TOKEN --body \"$token\""
        echo
        return
    fi

    if gh secret set FLY_API_TOKEN --body "$token" --repo "$repo"; then
        green "  FLY_API_TOKEN set. Every push to 'main' will auto-deploy."
    else
        yellow "  Could not set secret automatically."
        yellow "  Run this from your Windows terminal instead:"
        echo
        echo "  gh secret set FLY_API_TOKEN --body \"$token\" --repo $repo"
    fi
    echo
}

step_destroy() {
    echo
    red "This will permanently destroy:"
    red "  - App: $APP_NAME"
    echo

    printf "Type '%s' to confirm: " "$APP_NAME"
    read -r confirmation

    if [ "$confirmation" != "$APP_NAME" ]; then
        yellow "Aborted."
        exit 0
    fi

    echo
    fly apps destroy "$APP_NAME" --yes 2>/dev/null || true
    green "Destroyed."
}

# ---------------------------------------------------------------
# Main
# ---------------------------------------------------------------

case "${1:-}" in
    setup)
        bold "Portfolio — Fly.io Setup"
        echo
        step_create_app
        step_set_secrets
        step_deploy
        echo
        green "Setup complete."
        echo
        ;;
    deploy)
        step_deploy
        ;;
    secrets)
        step_set_secrets
        ;;
    ci)
        step_ci
        ;;
    status)
        step_status
        ;;
    destroy)
        step_destroy
        ;;
    *)
        bold "Usage: ./deploy.sh <command>"
        echo
        echo "  setup    — full first-time setup (app + secrets + deploy)"
        echo "  deploy   — deploy only"
        echo "  secrets  — set secrets from .env"
        echo "  ci       — generate deploy token for GitHub Actions"
        echo "  status   — show app status"
        echo "  destroy  — tear everything down"
        echo
        ;;
esac
