<?php
require_once __DIR__ . '/config.php';

$data = getPostData();

if (!validateRequired($data, ['email', 'userType'])) {
    sendResponse(['success' => false, 'message' => 'Email and user type are required'], 400);
}

$email = trim($data['email']);
$userType = $data['userType'];
$debugMode = !empty($data['debug']);

try {
    $pdo = getDBConnection();

    // Invalidate old OTP
    $stmt = $pdo->prepare("UPDATE password_resets SET otp = NULL WHERE email = ? AND user_type = ?");
    $stmt->execute([$email, $userType]);

    // Generate new 6-digit OTP
    $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

    // Update with new OTP
    $stmt = $pdo->prepare("UPDATE password_resets SET otp = ?, expires_at = ? WHERE email = ? AND user_type = ?");
    $stmt->execute([$otp, $expiresAt, $email, $userType]);

    // Check if update affected any rows (user exists)
    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'No reset request found'], 404);
    }

    // Attempt to send the email exactly like the forgot-password endpoint.
    $subject = 'Labbird Password Reset Code';
    $message = "Your new password reset code is: $otp\n\n" .
               "This code will expire in 10 minutes.\n";
    $headers = 'From: no-reply@mapua.edu.ph' . "\r\n" .
               'Reply-To: no-reply@mapua.edu.ph' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    if (!mail($email, $subject, $message, $headers)) {
        error_log("[resend-code] mail() failed for $email");
    }

    $response = ['success' => true, 'message' => 'New verification code sent'];
    if ($debugMode) {
        $response['otp'] = $otp;
    }
    sendResponse($response);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to resend code'], 500);
}
