#!/bin/sh

# Apply Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

# Run seed script
echo "Seeding database..."
node backend/dist/prisma/seed.js


echo "===== Debug listing /app/backend/dist ====="
ls -l /app/backend/dist

# Start the server
echo "Starting backend..."
node backend/dist/main.js
