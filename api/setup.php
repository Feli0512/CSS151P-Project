<?php
// Setup script to create database and tables
// Run this once to initialize the database

$host = 'localhost';
$username = 'root';
$password = '';

try {
    // Connect without database
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS lab_bird");
    echo "Database 'lab_bird' created or already exists.\n";

    // Select database
    $pdo->exec("USE lab_bird");

    // Create users table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            student_id VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "Users table created.\n";

    // Create equipment table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS equipment (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            department ENUM('Chemistry', 'Physics', 'SOIT') NOT NULL,
            status ENUM('Available', 'Borrowed', 'Maintenance', 'Damaged') DEFAULT 'Available',
            quantity_available INT NOT NULL DEFAULT 0,
            total_quantity INT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "Equipment table created.\n";

    // Create transactions table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            equipment_id INT NOT NULL,
            quantity INT DEFAULT 1,
            type ENUM('Borrow', 'Return') NOT NULL,
            status ENUM('Pending', 'Approved', 'Completed', 'Rejected') DEFAULT 'Pending',
            purpose TEXT,
            date_needed DATE,
            expected_return DATE,
            date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        )
    ");
    echo "Transactions table created.\n";

    // Insert sample equipment data
    $sampleEquipment = [
        ['Beaker 100ml', 'Chemistry', 10, 10, 'Glass beaker for measuring liquids'],
        ['Test Tube Rack', 'Chemistry', 5, 5, 'Rack for holding test tubes'],
        ['pH Meter', 'Chemistry', 2, 2, 'Digital pH meter'],
        ['Microscope', 'Biology', 3, 3, 'Optical microscope'], // Wait, but departments are Chemistry, Physics, SOIT. Biology not included, but perhaps add or skip.
        // For Physics
        ['Multimeter', 'Physics', 4, 4, 'Digital multimeter'],
        ['Oscilloscope', 'Physics', 1, 1, 'Digital oscilloscope'],
        ['Vernier Caliper', 'Physics', 6, 6, 'Precision measuring tool'],
        // For SOIT
        ['Network Cable Tester', 'SOIT', 3, 3, 'Cable testing device'],
        ['Fiber Optic Splicer', 'SOIT', 1, 1, 'Fiber optic splicing tool'],
        ['Router', 'SOIT', 2, 2, 'Network router']
    ];

    $stmt = $pdo->prepare("INSERT INTO equipment (name, department, quantity_available, total_quantity, description) VALUES (?, ?, ?, ?, ?)");
    foreach ($sampleEquipment as $item) {
        if (in_array($item[1], ['Chemistry', 'Physics', 'SOIT'])) {
            $stmt->execute($item);
        }
    }
    echo "Sample equipment data inserted.\n";

    echo "Database setup completed successfully!\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>