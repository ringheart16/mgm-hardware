#!/bin/bash
set -e

PORT="${PORT:-8080}"
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

if [ ! -f /var/www/html/.env ]; then
    cp /var/www/html/.env.example /var/www/html/.env
fi

mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/framework/cache/data
mkdir -p /var/www/html/storage/logs
mkdir -p /var/www/html/bootstrap/cache
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force --no-interaction
fi

php artisan config:clear || true

if [ -n "$MYSQLHOST" ] || [ -n "$DB_HOST" ]; then
    DB_TARGET_HOST="${MYSQLHOST:-$DB_HOST}"
    DB_TARGET_PORT="${MYSQLPORT:-${DB_PORT:-3306}}"
    echo "Waiting for database at ${DB_TARGET_HOST}:${DB_TARGET_PORT}..."
    for i in $(seq 1 30); do
        if timeout 2 bash -c "</dev/tcp/${DB_TARGET_HOST}/${DB_TARGET_PORT}" 2>/dev/null; then
            echo "Database connection established!"
            break
        fi
        sleep 2
    done
fi

php artisan migrate --force --no-interaction || echo "Warning: Migration failed."
php artisan db:seed --force --no-interaction || echo "Warning: Seeding failed."

php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "MGM Hardware API Backend started on port ${PORT}!"
exec apache2-foreground