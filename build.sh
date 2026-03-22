#!/bin/bash
echo "🚀 Building for Render..."
cd frontend
npm install
npm run build
cd ../backend
pip install -r requirements.txt
echo "✅ Build complete!"
