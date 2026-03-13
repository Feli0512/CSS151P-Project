# Lab Bird PHP Backend

This is the PHP backend for the Lab Bird equipment borrowing system.

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `labbird_db`
2. Run the setup script: `php api/setup.php`

This will create all necessary tables and insert sample data.

### 2. Web Server Configuration
Configure your web server (Apache/Nginx) to serve the `api/` directory.

For Apache, add to your virtual host:
```
<Directory "/path/to/project/api">
    AllowOverride All
    Require all granted
</Directory>
```

### 3. Email Configuration (Optional)
For password reset functionality, configure PHPMailer in the password reset files.

## API Endpoints

### Authentication
- `POST /api/auth/login.php` - Student login
- `POST /api/auth/admin-login.php` - Admin login
- `POST /api/auth/register.php` - Student registration

### Password Reset
- `POST /api/forgot-password.php` - Send OTP
- `POST /api/verify-code.php` - Verify OTP
- `POST /api/reset-password.php` - Reset password
- `POST /api/resend-code.php` - Resend OTP

### Equipment
- `GET /api/equipment/list.php` - Get all equipment

### Transactions
- `POST /api/transactions/borrow.php` - Submit borrow request
- `POST /api/transactions/return.php` - Return equipment
- `POST /api/transactions/approve.php` - Approve borrow request
- `POST /api/transactions/reject.php` - Reject borrow request
- `GET /api/transactions/list.php` - Get transactions (with optional filters)

### Reservations
- `POST /api/reservations/submit.php` - Submit reservation
- `GET /api/reservations/list.php` - Get all reservations
- `POST /api/reservations/approve.php` - Approve reservation
- `POST /api/reservations/reject.php` - Reject reservation
- `POST /api/reservations/delete.php` - Delete reservation

### Admin Management
- `POST /api/admin/signup.php` - Admin signup request
- `GET /api/admin/list.php` - Get all admin users
- `POST /api/admin/approve.php` - Approve admin
- `POST /api/admin/reject.php` - Reject admin
- `POST /api/admin/revoke.php` - Revoke admin access

## Database Schema

### Tables
- `students` - Student users
- `admin_users` - Admin users
- `equipment` - Lab equipment
- `transactions` - Borrow/return transactions
- `reservations` - Equipment reservations
- `password_resets` - Password reset tokens

## Security Notes
- All passwords are hashed using `password_hash()`
- Input validation is performed on all endpoints
- CORS headers should be configured for frontend access
- In production, implement proper JWT token validation
- Rate limiting should be added for password reset endpoints

## Step-by-Step Integration Process

1. **Set up the database** using `setup.php`
2. **Configure your web server** to serve the API endpoints
3. **Update frontend API calls** to use the PHP endpoints instead of localStorage
4. **Test authentication flow** (login, register, password reset)
5. **Test equipment operations** (borrow, return, approve/reject)
6. **Test admin functions** (user management, reservations)
7. **Configure email sending** for password resets
8. **Add proper error handling** and logging
9. **Implement security measures** (HTTPS, input sanitization, rate limiting)
10. **Deploy to production** environment