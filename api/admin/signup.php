<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['name', 'employeeId', 'email', 'password'])) {
    sendResponse(['success' => false, 'message' => 'All fields are required'], 400);
}

$name = trim($data['name']);
$employeeId = trim($data['employeeId']);
$email = trim($data['email']);
$password = $data['password'];

try {
    $pdo = getDBConnection();

    // Check password length
    if (strlen($password) < 8) {
        sendResponse(['success' => false, 'message' => 'Password must be at least 8 characters long'], 400);
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(['success' => false, 'message' => 'Email already registered'], 409);
    }

    // Check if employee ID already exists
    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE employee_id = ?");
    $stmt->execute([$employeeId]);
    if ($stmt->fetch()) {
        sendResponse(['success' => false, 'message' => 'Employee ID already registered'], 409);
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert admin request
    $stmt = $pdo->prepare("INSERT INTO admin_users (name, employee_id, email, password, status, requested_at) VALUES (?, ?, ?, ?, 'pending', NOW())");
    $stmt->execute([$name, $employeeId, $email, $hashedPassword]);

    sendResponse(['success' => true, 'message' => 'Admin signup request submitted. Please wait for approval.']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Signup request failed'], 500);
}
?>