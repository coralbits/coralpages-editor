FROM node:20-slim AS frontend-builder

WORKDIR /app

# Copy dependency files
COPY ./src/ /app/src/
COPY ./scripts/ /app/scripts/
COPY ./.parcelrc /app/.parcelrc
COPY ./.postcssrc /app/.postcssrc
COPY ./package-lock.json /app/package-lock.json
COPY ./package.json /app/package.json
# COPY ./parcel.config.js /app/parcel.config.js
COPY ./tsconfig.json /app/tsconfig.json

# Install nodejs dependencies
RUN npm install

# Remove dist folder if it exists, to avoid dev modes
RUN rm -rf dist

# Build the frontend
RUN npm run build
RUN ls -al 
RUN test -d dist

FROM docker.io/library/caddy:latest

RUN mkdir -p /var/www
# Copy built CSS from frontend-builder
COPY --from=frontend-builder /app/dist/ /var/www/
COPY Caddyfile /etc/caddy/Caddyfile
# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
