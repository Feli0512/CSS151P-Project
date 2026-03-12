# Lab Bird API

This is the PHP backend for the Lab Bird equipment management system.

## Setup

1. Install XAMPP or WAMP server with PHP and MySQL.
2. Start Apache and MySQL.
3. Open phpMyAdmin (usually http://localhost/phpmyadmin).
4. Create a database named `lab_bird` (or update `db.php` with your credentials).
5. Run `setup.php` in your browser: http://localhost/your-project/api/setup.php
   This will create the tables and insert sample data.

## API Endpoints

### Authentication

- **POST /api/login.php**
  - Body: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "success": true, "user": {...}, "token": "..." }`

- **POST /api/register.php**
  - Body: `{ "name": "John Doe", "student_id": "12345", "email": "user@example.com", "password": "password" }`
  - Response: `{ "success": true, "message": "Account created successfully" }`

### Equipment

- **GET /api/equipment.php?department=Chemistry**
  - Response: `{ "success": true, "data": [...] }`

### Transactions

- **POST /api/borrow.php**
  - Body: `{ "equipment_id": 1, "user_id": 1 }`
  - Response: `{ "success": true, "message": "Borrow request submitted" }`

- **POST /api/return.php**
  - Body: `{ "equipment_id": 1, "user_id": 1 }`
  - Response: `{ "success": true, "message": "Equipment returned successfully" }`

- **GET /api/transactions.php?user_id=1**
  - Response: `{ "success": true, "data": [...] }`

## Database Schema

- **users**: id, name, student_id, email, password, created_at
- **equipment**: id, name, department, status, quantity_available, total_quantity, description, created_at
- **transactions**: id, user_id, equipment_id, type, status, date

## Notes

- Update database credentials in `db.php` if needed.
- In production, use proper JWT tokens and HTTPS.
- The frontend needs to be updated to call these APIs instead of using mock data.