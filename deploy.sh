#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# deploy.sh — Deploy Worldline AI-First Academy to Hetzner
#
# Usage:
#   ./deploy.sh             # Deploy with .env.production
#   ./deploy.sh --ssl       # Deploy + setup Let's Encrypt SSL
#
# Prerequisites:
#   - SSH access to root@89.167.118.95
#   - .env.production file exists locally (never committed to git)
#   - Docker + docker compose installed on Hetzner (auto-installed)
# ──────────────────────────────────────────────────────────────────

set -euo pipefail

HETZNER_IP="89.167.118.95"
DEPLOY_PATH="/home/marco/worldline-academy"
DOMAIN="${ACADEMY_DOMAIN:-academy.jouwdomein.com}"
SETUP_SSL="${1:-}"

echo "🚀 Deploying Worldline AI-First Academy to Hetzner..."
echo "   Server:  ${HETZNER_IP}"
echo "   Path:    ${DEPLOY_PATH}"
echo "   Domain:  ${DOMAIN}"
echo ""

# ── Check local requirements ──
if [[ ! -f .env.production ]]; then
  echo "❌ .env.production not found. Create it first (copy from .env.local and adjust)."
  exit 1
fi

# ── Rsync source to Hetzner ──
# Excludes: secrets, build artifacts, node_modules
echo "📦 Syncing source files..."
rsync -avz --delete \
  --exclude='.env*' \
  --exclude='node_modules/' \
  --exclude='.next/' \
  --exclude='.git/' \
  --exclude='nginx/certs/' \
  ./ "root@${HETZNER_IP}:${DEPLOY_PATH}/"

# ── Copy env file ──
echo "🔑 Copying .env.production..."
scp .env.production "root@${HETZNER_IP}:${DEPLOY_PATH}/.env"

# ── Ensure Docker is installed on Hetzner ──
echo "🐳 Ensuring Docker is installed..."
ssh "root@${HETZNER_IP}" "
  if ! command -v docker &>/dev/null; then
    echo 'Installing Docker...'
    curl -fsSL https://get.docker.com | sh
  fi
  if ! command -v docker compose &>/dev/null; then
    echo 'Installing docker compose plugin...'
    apt-get install -y docker-compose-plugin 2>/dev/null || true
  fi
  echo 'Docker ready.'
"

# ── Replace domain in nginx config ──
ssh "root@${HETZNER_IP}" "
  sed -i 's/academy.jouwdomein.com/${DOMAIN}/g' ${DEPLOY_PATH}/nginx/nginx.conf
"

# ── Build + start containers ──
echo "🔨 Building and starting containers..."
ssh "root@${HETZNER_IP}" "
  cd ${DEPLOY_PATH}
  docker compose down --remove-orphans 2>/dev/null || true
  docker compose build --no-cache --pull
  docker compose up -d
  echo '⏳ Waiting for health check...'
  sleep 15
  docker compose ps
"

# ── Optional: Let's Encrypt SSL ──
if [[ "${SETUP_SSL}" == "--ssl" ]]; then
  echo ""
  echo "🔒 Setting up Let's Encrypt SSL for ${DOMAIN}..."
  ssh "root@${HETZNER_IP}" "
    apt-get install -y certbot 2>/dev/null || true
    # Stop nginx temporarily for standalone certbot
    docker compose -f ${DEPLOY_PATH}/docker-compose.yml stop nginx
    certbot certonly --standalone \
      -d ${DOMAIN} \
      --non-interactive \
      --agree-tos \
      -m admin@aetherlink.ai
    # Copy certs to nginx volume
    mkdir -p ${DEPLOY_PATH}/nginx/certs
    cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${DEPLOY_PATH}/nginx/certs/
    cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem   ${DEPLOY_PATH}/nginx/certs/
    # Enable HTTPS in nginx config
    sed -i 's|# return 301|return 301|g' ${DEPLOY_PATH}/nginx/nginx.conf
    # Restart nginx
    docker compose -f ${DEPLOY_PATH}/docker-compose.yml start nginx
    echo '✅ SSL configured!'
  "

  # Add cron for auto-renewal
  ssh "root@${HETZNER_IP}" "
    (crontab -l 2>/dev/null; echo '0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/${DOMAIN}/fullchain.pem ${DEPLOY_PATH}/nginx/certs/ && cp /etc/letsencrypt/live/${DOMAIN}/privkey.pem ${DEPLOY_PATH}/nginx/certs/ && docker compose -f ${DEPLOY_PATH}/docker-compose.yml restart nginx') | crontab -
    echo '🔄 SSL auto-renewal cron added.'
  "
fi

echo ""
echo "✅ Deploy complete!"
echo ""
echo "   App:     http://${DOMAIN}"
if [[ "${SETUP_SSL}" == "--ssl" ]]; then
  echo "   Secure:  https://${DOMAIN}"
fi
echo ""
echo "📋 Next steps:"
echo "   1. Add ${DOMAIN} → ${HETZNER_IP} in your DNS"
echo "   2. In Supabase Dashboard → Auth → URL Configuration:"
echo "      - Site URL:         https://${DOMAIN}"
echo "      - Redirect URLs:    https://${DOMAIN}/auth/callback"
echo "   3. Configure Google OAuth:"
echo "      - https://console.cloud.google.com → APIs & Services → Credentials"
echo "      - Authorized redirect URIs: https://${DOMAIN}/auth/callback"
echo "   4. Configure GitHub OAuth:"
echo "      - https://github.com/settings/developers → OAuth Apps"
echo "      - Authorization callback URL: https://${DOMAIN}/auth/callback"
echo ""
echo "   View logs: ssh root@${HETZNER_IP} 'docker logs worldline-academy -f'"
