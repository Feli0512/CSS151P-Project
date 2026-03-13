<?php
require_once __DIR__ . '/config.php';

$data = getPostData();

if (!validateRequired($data, ['email', 'code', 'userType'])) {
    sendResponse(['success' => false, 'message' => 'Email, code, and user type are required'], 400);
}

$email = trim($data['email']);
$code = trim($data['code']);
$userType = $data['userType'];

try {
    $pdo = getDBConnection();

    // Check OTP
    $stmt = $pdo->prepare("SELECT id FROM password_resets WHERE email = ? AND otp = ? AND expires_at > NOW() AND user_type = ?");
    $stmt->execute([$email, $code, $userType]);
    $reset = $stmt->fetch();

    if (!$reset) {
        sendResponse(['success' => false, 'message' => 'Invalid or expired verification code'], 400);
    }

    // Generate reset token
    $resetToken = bin2hex(random_bytes(32));

    // Update with reset token
    $stmt = $pdo->prepare("UPDATE password_resets SET reset_token = ?, otp = NULL WHERE id = ?");
    $stmt->execute([$resetToken, $reset['id']]);

    sendResponse([
        'success' => true,
        'reset_token' => $resetToken
    ]);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Verification failed'], 500);
}
