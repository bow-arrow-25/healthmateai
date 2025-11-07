#!/bin/bash

echo "🚀 Building HealthMate Full Stack Application..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🏗️  Building React frontend..."
npm run build

cd ..

echo "✅ Build complete! Ready for deployment."
