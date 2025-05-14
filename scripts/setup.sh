#!/bin/bash

# Start PostgreSQL container
echo "Starting PostgreSQL container..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run database migrations
echo "Running database migrations..."
npx prisma migrate dev

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Setup completed successfully!" 