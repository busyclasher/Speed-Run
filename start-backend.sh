#!/bin/bash

echo "========================================"
echo "Julius Baer AML Platform - Backend"
echo "========================================"
echo ""

cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo ""
fi

echo "Activating virtual environment..."
source venv/bin/activate

if [ ! -f "venv/lib/python*/site-packages/fastapi/__init__.py" ]; then
    echo "Installing dependencies..."
    pip install -r requirements.txt
    echo ""
fi

echo "Starting backend API server..."
echo "API will be available at: http://localhost:8000"
echo "API Docs at: http://localhost:8000/docs"
echo ""
python main.py

