# Lab Bird - Quick Setup Guide

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
1. Double-click `setup.bat`
2. Enter your MySQL root password when prompted
3. The script npwill automatically:
   - Check PHP and MySQL installation
   - Create the database
   - Run the setup script
   - Insert sample data

### Option 2: Manual Setup
1. Open `setup.html` in your browser
2. Click "PHPMyAdmin" to create the database manually
3. Click "Database Setup" to run the PHP setup script

## 📋 Prerequisites

### Required Software:
- **PHP 7.4+** with MySQL extension
- **MySQL/MariaDB** server
- **Apache/Nginx** web server
- **PHPMyAdmin** (optional, for database management)

### Installation (Windows):
1. Download XAMPP: https://www.apachefriends.org/
2. Install XAMPP with Apache, MySQL, PHP, and PHPMyAdmin
3. Start Apache and MySQL from XAMPP control panel

## 🔗 Quick Access Links

- **Application**: http://localhost:5173 (after running `npm run dev`)
- **PHPMyAdmin**: http://localhost/phpmyadmin
- **API Setup**: http://localhost/setup.html (then click "Database Setup")

## 👤 Default Credentials

### Admin Account:
- **Email**: admin@gmail.com
- **Password**: admin123

### Sample Student Account:
- **Email**: juan.delacruz@mymail.mapua.edu.ph
- **Password**: student123

## 📁 Project Structure

```
CSS151 updated/
├── setup.html          # Quick access links
├── setup.bat           # Automated setup script
├── api/               # PHP backend
│   ├── config.php     # Database configuration
│   ├── setup.php      # Database setup script
│   └── ...           # API endpoints
├── src/               # React frontend
└── package.json       # Node.js dependencies
```

## 🛠️ Troubleshooting

### PHP not found:
- Add PHP to your system PATH
- Or use full path: `C:\xampp\php\php.exe`

### MySQL connection failed:
- Make sure MySQL server is running
- Check username/password in `api/config.php`

### Setup script fails:
- Check file permissions
- Ensure database user has CREATE privileges

### Frontend not loading:
- Run `npm install`
- Run `npm run dev`
- Check if port 5173 is available

## 📞 Support

If you encounter issues:
1. Check the console/terminal for error messages
2. Verify all prerequisites are installed
3. Ensure services are running (Apache, MySQL)
4. Check file permissions in the `api/` directory

## 🎯 Next Steps

After setup:
1. Open the application at http://localhost:5173
2. Login with admin credentials
3. Explore the admin dashboard
4. Test student registration and borrowing features
5. Customize the system as needed
