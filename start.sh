#!/bin/bash

echo "🚀 Building Railway deployment..."

echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🏗️ Building frontend..."
npm run build

echo "📦 Installing backend dependencies..."
cd ../backend
pip install -r requirements.txt

echo "🚀 Starting Flask server with gunicorn..."
exec /opt/venv/bin/python -m gunicorn app:app -b 0.0.0.0:${PORT:-5000}
