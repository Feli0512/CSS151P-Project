<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

if (!validateRequired($data, ['email', 'password'])) {
    sendResponse(['success' => false, 'message' => 'Email and password are required'], 400);
}

$email = trim($data['email']);
$password = $data['password'];

try {
    $pdo = getDBConnection();

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id, name, email, student_id, password FROM students WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(['success' => false, 'message' => 'Invalid email or password'], 401);
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendResponse(['success' => false, 'message' => 'Invalid email or password'], 401);
    }

    // Generate JWT token (simplified - in production use proper JWT library)
    $token = bin2hex(random_bytes(32));

    // Store token (in production, store in database with expiry)
    // For demo, just return user data

    sendResponse([
        'success' => true,
        'user' => [
            'name' => $user['name'],
            'email' => $user['email'],
            'studentId' => $user['student_id'],
            'role' => 'student'
        ],
        'token' => $token
    ]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Login failed'], 500);
}
?>