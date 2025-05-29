#!/bin/sh

# Apply Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

# Run seed script
echo "Seeding database..."
node backend/dist/prisma/seed.js

# Start the server
echo "Starting backend..."
node backend/dist/main.js
