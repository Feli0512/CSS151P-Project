<?php
// Database setup script for Lab Bird system
// Run this once to create the database and tables

require_once 'config.php';

try {
    $pdo = getDBConnection();

    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS labbird_db");
    $pdo->exec("USE labbird_db");

    // Create students table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            student_id VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Create admin_users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            employee_id VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            status ENUM('pending', 'approved', 'rejected', 'revoked') DEFAULT 'pending',
            requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Create equipment table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS equipment (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            department ENUM('Chemistry', 'Physics', 'SOIT') NOT NULL,
            status ENUM('Available', 'Borrowed', 'Damaged', 'Maintenance') DEFAULT 'Available',
            quantity_available INT NOT NULL DEFAULT 0,
            total_quantity INT NOT NULL,
            image_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Create transactions table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS transactions (
            id VARCHAR(50) PRIMARY KEY,
            equipment_id VARCHAR(50) NOT NULL,
            equipment_name VARCHAR(255) NOT NULL,
            department ENUM('Chemistry', 'Physics', 'SOIT') NOT NULL,
            date DATE NOT NULL,
            type ENUM('Borrow', 'Return') NOT NULL,
            status ENUM('Pending', 'Approved', 'Completed', 'Rejected') DEFAULT 'Pending',
            user_name VARCHAR(255) NOT NULL,
            student_id VARCHAR(50) NOT NULL,
            quantity INT NOT NULL,
            expected_return DATE,
            returned_at TIMESTAMP NULL,
            purpose TEXT,
            approved_at TIMESTAMP NULL,
            FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        )
    ");

    // Create reservations table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS reservations (
            id VARCHAR(50) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            department VARCHAR(100) NOT NULL,
            equipment VARCHAR(255) NOT NULL,
            date_needed DATE NOT NULL,
            time_needed VARCHAR(50) NOT NULL,
            purpose TEXT NOT NULL,
            additional_notes TEXT,
            status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Create password_resets table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(6),
            reset_token VARCHAR(64),
            expires_at TIMESTAMP NOT NULL,
            user_type ENUM('student', 'admin') NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Insert default admin
    $defaultAdminPassword = password_hash('admin123', PASSWORD_DEFAULT);
    $pdo->exec("
        INSERT IGNORE INTO admin_users (name, employee_id, email, password, status, requested_at)
        VALUES ('Super Administrator', 'SYS-001', 'admin@gmail.com', '$defaultAdminPassword', 'approved', NOW())
    ");

    // Insert sample equipment data
    $sampleEquipment = [
        ['EQ-001', 'Digital Multimeter', 'Physics', 5, 5],
        ['EQ-002', 'Oscilloscope', 'Physics', 2, 2],
        ['EQ-003', 'Bunsen Burner', 'Chemistry', 10, 10],
        ['EQ-004', 'pH Meter', 'Chemistry', 3, 3],
        ['EQ-005', 'Laptop', 'SOIT', 8, 8],
        ['EQ-006', 'Arduino Kit', 'SOIT', 5, 5],
    ];

    $stmt = $pdo->prepare("INSERT IGNORE INTO equipment (id, name, department, quantity_available, total_quantity) VALUES (?, ?, ?, ?, ?)");
    foreach ($sampleEquipment as $eq) {
        $stmt->execute($eq);
    }

    echo "Database setup completed successfully!\n";
    echo "Default admin credentials:\n";
    echo "Email: admin@gmail.com\n";
    echo "Password: admin123\n";

} catch (Exception $e) {
    echo "Database setup failed: " . $e->getMessage() . "\n";
}
?>