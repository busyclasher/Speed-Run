@echo off
echo ========================================
echo Julius Baer AML Platform - Backend
echo ========================================
echo.

cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    echo.
)

echo Activating virtual environment...
call venv\Scripts\activate

if not exist "venv\Lib\site-packages\fastapi" (
    echo Installing dependencies...
    pip install -r requirements.txt
    echo.
)

echo Starting backend API server...
echo API will be available at: http://localhost:8000
echo API Docs at: http://localhost:8000/docs
echo.
python main.py

