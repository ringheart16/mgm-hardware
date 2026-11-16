#!/bin/bash
set -e

# Support dynamic PORT assigned by Railway (defaults to 8080 or 80)
PORT="${PORT:-8080}"
echo "Configuring Apache to listen on port ${PORT}..."
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Setup .env if it doesn't exist
if [ ! -f /var/www/html/backend/.env ]; then
    echo "Creating .env from .env.example..."
    cp /var/www/html/backend/.env.example /var/www/html/backend/.env
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
    echo "Checking APP_KEY..."
    php artisan key:generate --force --no-interaction
fi

# Clear old configuration cache before migrating
php artisan config:clear || true

# Wait for MySQL if host is specified
if [ -n "$MYSQLHOST" ] || [ -n "$DB_HOST" ]; then
    DB_TARGET_HOST="${MYSQLHOST:-$DB_HOST}"
    DB_TARGET_PORT="${MYSQLPORT:-${DB_PORT:-3306}}"
    echo "Waiting for database at ${DB_TARGET_HOST}:${DB_TARGET_PORT}..."
    for i in $(seq 1 30); do
        if timeout 2 bash -c "</dev/tcp/${DB_TARGET_HOST}/${DB_TARGET_PORT}" 2>/dev/null; then
            echo "Database connection established!"
            break
        fi
        echo "Database not ready yet... waiting (attempt $i/30)"
        sleep 2
    done
fi

# Run database migrations
echo "Running migrations..."
php artisan migrate --force --no-interaction || echo "Warning: Migration failed or database not ready."

# Seed default data
echo "Running database seeder..."
php artisan db:seed --force --no-interaction || echo "Warning: Seeding failed or already seeded."

# Cache configuration, routes, and views for production
echo "Caching configuration and routes..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "MGM Hardware Management System started on port ${PORT}!"
exec apache2-foreground