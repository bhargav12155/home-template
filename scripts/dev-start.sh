#!/bin/bash
# Local development startup script with DATABASE_URL configured

echo "🚀 Starting local development server with database connection..."

# Set environment variables
export NODE_ENV=development
export DATABASE_URL=postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db
export PORT=3001

# Optional: Add other environment variables as needed
# export AWS_REGION=us-east-2
# export ASSETS_BUCKET=your-bucket-name

echo "📊 Environment configured:"
echo "  NODE_ENV: $NODE_ENV"
echo "  DATABASE_URL: ${DATABASE_URL:0:50}..." # Show first 50 chars only
echo "  PORT: $PORT"

# Test database connection first
echo ""
echo "🔍 Testing database connection..."
npm run db:check

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    echo ""
    echo "🎯 Starting development server..."
    npm run dev
else
    echo "⚠️  Database connection failed, but continuing with server startup..."
    echo "   You may need to run: npm run db:push"
    echo ""
    echo "🎯 Starting development server..."
    npm run dev
fi
