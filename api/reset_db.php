<?php
// Reset database script - drops and recreates the database

$host = 'localhost';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Drop database
    $pdo->exec("DROP DATABASE IF EXISTS lab_bird");
    echo "Database dropped.\n";

    // Now run the setup script
    require_once 'setup.php';

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
