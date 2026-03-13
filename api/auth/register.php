<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['name', 'studentId', 'email', 'password'])) {
    sendResponse(['success' => false, 'message' => 'All fields are required'], 400);
}

$name = trim($data['name']);
$studentId = trim($data['studentId']);
$email = trim($data['email']);
$password = $data['password'];

try {
    $pdo = getDBConnection();

    // Validate email domain
    if (!preg_match('/@mymail\.mapua\.edu\.ph$/', $email)) {
        sendResponse(['success' => false, 'message' => 'Only @mymail.mapua.edu.ph emails are allowed'], 400);
    }

    // Check password length
    if (strlen($password) < 8) {
        sendResponse(['success' => false, 'message' => 'Password must be at least 8 characters long'], 400);
    }

    // Check if email already exists
    $stmt = $pdo->prepare("SELECT id FROM students WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        sendResponse(['success' => false, 'message' => 'Email already registered'], 409);
    }

    // Check if student ID already exists
    $stmt = $pdo->prepare("SELECT id FROM students WHERE student_id = ?");
    $stmt->execute([$studentId]);
    if ($stmt->fetch()) {
        sendResponse(['success' => false, 'message' => 'Student ID already registered'], 409);
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new student
    $stmt = $pdo->prepare("INSERT INTO students (name, student_id, email, password, registered_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->execute([$name, $studentId, $email, $hashedPassword]);

    sendResponse(['success' => true, 'message' => 'Account created successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Registration failed'], 500);
}
?>