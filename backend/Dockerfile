FROM php:8.3-cli-alpine

RUN apk add --no-cache postgresql-dev sqlite-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install pdo_pgsql pdo_sqlite mbstring xml \
    && apk del oniguruma-dev libxml2-dev sqlite-dev

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-progress

COPY . .

RUN mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
