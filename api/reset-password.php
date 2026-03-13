<?php
require_once __DIR__ . '/config.php';

$data = getPostData();

if (!validateRequired($data, ['email', 'reset_token', 'new_password', 'userType'])) {
    sendResponse(['success' => false, 'message' => 'All fields are required'], 400);
}

$email = trim($data['email']);
$resetToken = $data['reset_token'];
$newPassword = $data['new_password'];
$userType = $data['userType'];

try {
    $pdo = getDBConnection();

    // Validate reset token
    $stmt = $pdo->prepare("SELECT id FROM password_resets WHERE email = ? AND reset_token = ? AND user_type = ?");
    $stmt->execute([$email, $resetToken, $userType]);
    $reset = $stmt->fetch();

    if (!$reset) {
        sendResponse(['success' => false, 'message' => 'Invalid reset token'], 400);
    }

    // Check password length
    if (strlen($newPassword) < 8) {
        sendResponse(['success' => false, 'message' => 'Password must be at least 8 characters long'], 400);
    }

    // Hash new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update password
    $table = $userType === 'admin' ? 'admin_users' : 'students';
    $stmt = $pdo->prepare("UPDATE $table SET password = ? WHERE email = ?");
    $stmt->execute([$hashedPassword, $email]);

    // Delete reset record
    $stmt = $pdo->prepare("DELETE FROM password_resets WHERE id = ?");
    $stmt->execute([$reset['id']]);

    sendResponse(['success' => true, 'message' => 'Password updated successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Password reset failed'], 500);
}
