#!/bin/bash
set -e

# Support dynamic PORT assigned by Render/Railway (defaults to 8080 or 80)
PORT="${PORT:-8080}"
echo "Configuring Apache to listen on port ${PORT}..."
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Production-safe defaults (real environment variables always take precedence)
export APP_ENV="${APP_ENV:-production}"
export APP_DEBUG="${APP_DEBUG:-false}"
export LOG_CHANNEL="${LOG_CHANNEL:-stderr}"

# Render exposes the public URL of the service; use it when APP_URL is not provided
if [ -z "$APP_URL" ] && [ -n "$RENDER_EXTERNAL_URL" ]; then
    export APP_URL="$RENDER_EXTERNAL_URL"
fi

# Setup .env if it doesn't exist
if [ ! -f /var/www/html/backend/.env ]; then
    echo "Creating .env from .env.example..."
    cp /var/www/html/backend/.env.example /var/www/html/backend/.env
    sed -i 's/^APP_ENV=.*/APP_ENV=production/' /var/www/html/backend/.env
    sed -i 's/^APP_DEBUG=.*/APP_DEBUG=false/' /var/www/html/backend/.env
    sed -i 's/^LOG_CHANNEL=.*/LOG_CHANNEL=stderr/' /var/www/html/backend/.env
fi

# Ensure storage directories exist with correct permissions
mkdir -p /var/www/html/backend/storage/framework/sessions
mkdir -p /var/www/html/backend/storage/framework/views
mkdir -p /var/www/html/backend/storage/framework/cache/data
mkdir -p /var/www/html/backend/storage/logs
mkdir -p /var/www/html/backend/bootstrap/cache
chown -R www-data:www-data /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache
chmod -R 775 /var/www/html/backend/storage /var/www/html/backend/bootstrap/cache

# Generate APP_KEY if empty
if [ -z "$APP_KEY" ]; then
    echo "APP_KEY is empty, generating one for this container..."
    php artisan key:generate --force --no-interaction
fi

# Clear old configuration cache before migrating
php artisan config:clear || true

# Run database migrations with retry loop (Render Postgres can take a moment to accept connections)
echo "Running database migrations..."
MIGRATED=0
for i in $(seq 1 30); do
    if php artisan migrate --force --no-interaction; then
        echo "Database migrations completed successfully!"
        MIGRATED=1
        break
    fi
    echo "Database not ready yet... retrying migration (attempt $i/30)"
    sleep 3
done

if [ "$MIGRATED" -ne 1 ]; then
    echo "ERROR: Database migrations failed after 30 attempts. Check DATABASE_URL / database status."
    exit 1
fi

# Seed default data (seeders are idempotent)
echo "Running database seeder..."
php artisan db:seed --force --no-interaction || echo "Warning: Seeding finished or already seeded."

# Expose uploaded/public files when needed
php artisan storage:link --no-interaction >/dev/null 2>&1 || true

# Cache configuration and compiled views for production
echo "Caching configuration and views..."
php artisan config:cache || true
php artisan view:cache || true

echo "MGM Hardware Management System started on port ${PORT}!"
exec apache2-foreground
