#!/usr/bin/env bash
#
# Portfolio — Fly.io setup and deploy.
#
# Prerequisites:
#   - flyctl installed and authenticated (fly auth login)
#   - Docker running (for the build step)
#   - CF_API_TOKEN and CF_ZONE_ID set in .env.prod for Cloudflare DNS
#
# Usage:
#   ./deploy.sh setup    — full first-time setup (app + secrets + deploy)
#   ./deploy.sh deploy   — deploy only (assumes app already exists)
#   ./deploy.sh secrets  — set secrets interactively
#   ./deploy.sh ci       — generate deploy token for GitHub Actions
#   ./deploy.sh domain   — allocate IPs, set Cloudflare DNS, and add Fly certs
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

APP_NAME="braydencarlson"
REGION="yyz"
DOMAIN="braydencarlson.com"
ENV_FILE=".env.prod"

# Cloudflare — loaded from .env or environment.
CF_API_TOKEN="${CF_API_TOKEN:-}"
CF_ZONE_ID="${CF_ZONE_ID:-}"

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
# Cloudflare helpers
# ---------------------------------------------------------------

cf_load_env() {
    if [ -z "$CF_API_TOKEN" ] || [ -z "$CF_ZONE_ID" ]; then
        if [ -f "$ENV_FILE" ]; then
            CF_API_TOKEN="${CF_API_TOKEN:-$(grep -E '^CF_API_TOKEN=' "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- | sed "s/^['\"]//;s/['\"]$//;s/\r//" || true)}"
            CF_ZONE_ID="${CF_ZONE_ID:-$(grep -E '^CF_ZONE_ID=' "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- | sed "s/^['\"]//;s/['\"]$//;s/\r//" || true)}"
        fi
    fi

    if [ -z "$CF_API_TOKEN" ] || [ -z "$CF_ZONE_ID" ]; then
        red "  CF_API_TOKEN and CF_ZONE_ID are required."
        red "  Set them in $ENV_FILE or export them."
        return 1
    fi
}

cf_api() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"

    local args=(
        -s -X "$method"
        -H "Authorization: Bearer $CF_API_TOKEN"
        -H "Content-Type: application/json"
    )

    if [ -n "$data" ]; then
        args+=(-d "$data")
    fi

    curl "${args[@]}" "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_ID}${endpoint}"
}

cf_find_record() {
    local type="$1"
    local name="$2"

    cf_api GET "/dns_records?type=${type}&name=${name}" \
        | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4 || true
}

cf_upsert_record() {
    local type="$1"
    local name="$2"
    local content="$3"
    local proxied="${4:-false}"

    local payload="{\"type\":\"${type}\",\"name\":\"${name}\",\"content\":\"${content}\",\"proxied\":${proxied},\"ttl\":1}"

    local existing_id
    existing_id=$(cf_find_record "$type" "$name")

    local response
    if [ -n "$existing_id" ]; then
        response=$(cf_api PATCH "/dns_records/${existing_id}" "$payload")
    else
        response=$(cf_api POST "/dns_records" "$payload")
    fi

    if echo "$response" | grep -q '"success":true'; then
        if [ -n "$existing_id" ]; then
            green "  Updated ${type} record: ${name} -> ${content}"
        else
            green "  Created ${type} record: ${name} -> ${content}"
        fi
    else
        red "  Failed ${type} record: ${name}"
        echo "  $response"
    fi
}

cf_delete_record() {
    local type="$1"
    local name="$2"

    local existing_id
    existing_id=$(cf_find_record "$type" "$name")

    if [ -n "$existing_id" ]; then
        cf_api DELETE "/dns_records/${existing_id}" > /dev/null
        green "  Deleted ${type} record: ${name}"
    fi
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

    # Secrets already defined in fly.toml [env] — skip these
    # and unset them if they were previously set as secrets.
    skip_keys="PORT STATIC_DIR CF_API_TOKEN CF_ZONE_ID"

    unset_args=()
    for sk in $skip_keys; do
        if fly secrets list --app "$APP_NAME" 2>/dev/null | grep -qw "$sk"; then
            unset_args+=("$sk")
        fi
    done

    if [ ${#unset_args[@]} -gt 0 ]; then
        yellow "  Unsetting secrets managed by fly.toml: ${unset_args[*]}"
        fly secrets unset --app "$APP_NAME" "${unset_args[@]}"
    fi

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

    secrets_args+=("CORS_ORIGIN=https://${DOMAIN}")
    green "  CORS_ORIGIN=https://${DOMAIN}"

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

step_domain() {
    bold "Custom domain setup"
    echo

    cf_load_env || return

    # Allocate IPs if not already present.
    bold "  Allocating IPs..."

    local ip_json
    ip_json=$(fly ips list --app "$APP_NAME" --json 2>/dev/null || echo "[]")

    local ipv4
    ipv4=$(echo "$ip_json" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)

    local ipv6
    ipv6=$(echo "$ip_json" | grep -oE '[0-9a-f]+:[0-9a-f:]+' | head -1 || true)

    if [ -z "$ipv4" ]; then
        fly ips allocate-v4 --app "$APP_NAME" --yes
        ip_json=$(fly ips list --app "$APP_NAME" --json 2>/dev/null || echo "[]")
        ipv4=$(echo "$ip_json" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' | head -1 || true)
    fi

    if [ -z "$ipv6" ]; then
        fly ips allocate-v6 --app "$APP_NAME"
        ip_json=$(fly ips list --app "$APP_NAME" --json 2>/dev/null || echo "[]")
        ipv6=$(echo "$ip_json" | grep -oE '[0-9a-f]+:[0-9a-f:]+' | head -1 || true)
    fi

    green "  IPv4: $ipv4"
    green "  IPv6: $ipv6"
    echo

    # Set Cloudflare DNS records (not proxied — Fly handles SSL).
    bold "  Configuring Cloudflare DNS..."

    cf_upsert_record "A"    "$DOMAIN"        "$ipv4" false
    cf_upsert_record "AAAA" "$DOMAIN"        "$ipv6" false
    cf_upsert_record "A"    "www.${DOMAIN}"  "$ipv4" false
    cf_upsert_record "AAAA" "www.${DOMAIN}"  "$ipv6" false

    echo

    # Add certs in Fly.
    bold "  Requesting Fly TLS certificates..."

    local certs_json
    certs_json=$(fly certs list --app "$APP_NAME" --json 2>/dev/null || echo "[]")

    if echo "$certs_json" | grep -q "\"$DOMAIN\""; then
        green "  Certificate for $DOMAIN already exists."
    else
        fly certs add "$DOMAIN" --app "$APP_NAME" 2>&1 || true
    fi

    if echo "$certs_json" | grep -q "\"www.${DOMAIN}\""; then
        green "  Certificate for www.${DOMAIN} already exists."
    else
        fly certs add "www.${DOMAIN}" --app "$APP_NAME" 2>&1 || true
    fi

    echo
    green "  DNS and certificates configured."
    yellow "  Fly will issue SSL automatically once DNS propagates."
    echo
    fly certs list --app "$APP_NAME" 2>/dev/null || true
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
    red "  - Cloudflare DNS records for $DOMAIN"
    echo

    printf "Type '%s' to confirm: " "$APP_NAME"
    read -r confirmation

    if [ "$confirmation" != "$APP_NAME" ]; then
        yellow "Aborted."
        exit 0
    fi

    echo

    # Clean up Cloudflare DNS records.
    if cf_load_env 2>/dev/null; then
        bold "Removing Cloudflare DNS records..."
        cf_delete_record "A"     "$DOMAIN"
        cf_delete_record "AAAA"  "$DOMAIN"
        cf_delete_record "A"     "www.${DOMAIN}"
        cf_delete_record "AAAA"  "www.${DOMAIN}"
        echo
    fi

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
        step_ci
        step_domain
        echo
        green "Setup complete. Your app is live at https://${DOMAIN}"
        echo
        yellow "Make sure your DNS records are configured (see output above)."
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
    domain)
        step_domain
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
        echo "  domain   — allocate IPs, set Cloudflare DNS, and add Fly certs"
        echo "  status   — show app status"
        echo "  destroy  — tear everything down"
        echo
        ;;
esac
