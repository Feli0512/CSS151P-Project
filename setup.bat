@echo off
echo ========================================
echo    Lab Bird - Development Setup
echo ========================================
echo.

echo Checking PHP installation...
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: PHP is not installed or not in PATH
    echo Please install PHP and add it to your system PATH
    pause
    exit /b 1
)

echo PHP is installed.
echo.

echo Checking MySQL connection...
echo (This will fail if MySQL is not running)
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MySQL client not found
    echo Make sure MySQL server is running
) else (
    echo MySQL client found.
)
echo.

echo Starting setup process...
echo.

echo Step 1: Creating database (if it doesn't exist)...
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS labbird_db;" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Could not create database. Please check MySQL credentials.
    pause
    exit /b 1
)
echo Database created successfully.
echo.

echo Step 2: Running PHP setup script...
php api\setup.php
if %errorlevel% neq 0 (
    echo ERROR: Setup script failed.
    pause
    exit /b 1
)
echo.

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Your Lab Bird system is now ready!
echo.
echo Next steps:
echo 1. Open setup.html in your browser
echo 2. Click "Open PHPMyAdmin" to verify database
echo 3. Run "npm run dev" to start the application
echo 4. Access the app at http://localhost:5173
echo.
echo Default admin login:
echo Email: admin@gmail.com
echo Password: admin123
echo.
pause