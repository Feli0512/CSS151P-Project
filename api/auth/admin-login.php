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

    // Check if admin exists and is approved
    $stmt = $pdo->prepare("SELECT id, name, email, employee_id, password, status FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(['success' => false, 'message' => 'Invalid email or password'], 401);
    }

    if ($user['status'] !== 'approved') {
        $message = $user['status'] === 'pending' ? 'Account is pending approval' : 'Account access denied';
        sendResponse(['success' => false, 'message' => $message], 403);
    }

    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendResponse(['success' => false, 'message' => 'Invalid email or password'], 401);
    }

    // Generate JWT token
    $token = bin2hex(random_bytes(32));

    sendResponse([
        'success' => true,
        'user' => [
            'name' => $user['name'],
            'email' => $user['email'],
            'studentId' => $user['employee_id'], // Using studentId field for consistency
            'role' => 'admin'
        ],
        'token' => $token
    ]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Login failed'], 500);
}
?>