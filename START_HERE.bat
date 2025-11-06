@echo off
echo ========================================
echo    HealthMate - Quick Start Script
echo ========================================
echo.
echo This script will help you set up HealthMate
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Node.js found: 
node --version
echo.

REM Check if MongoDB is running
echo [2/5] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo MongoDB is running!
) else (
    echo WARNING: MongoDB service not found or not running
    echo You can either:
    echo   1. Install MongoDB locally
    echo   2. Use MongoDB Atlas (cloud) - Update MONGODB_URI in backend\.env
)
echo.

REM Setup Backend
echo [3/5] Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
) else (
    echo Backend dependencies already installed
)

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit backend\.env with your configuration!
) else (
    echo .env file already exists
)
cd ..
echo.

REM Setup Frontend
echo [4/5] Setting up Frontend...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)
cd ..
echo.

echo [5/5] Setup Complete!
echo.
echo ========================================
echo           NEXT STEPS
echo ========================================
echo.
echo 1. Edit backend\.env file if needed (optional)
echo 2. Open TWO terminal windows:
echo.
echo    Terminal 1 - Backend:
echo    cd backend
echo    npm run dev
echo.
echo    Terminal 2 - Frontend:
echo    cd frontend
echo    npm start
echo.
echo 3. Open browser to http://localhost:3000
echo.
echo ========================================
echo.
pause
