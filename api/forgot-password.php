<?php
// always include using absolute directory reference so PHP finds the file
require_once __DIR__ . '/config.php';

$data = getPostData();

if (!validateRequired($data, ['email', 'userType'])) {
    sendResponse(['success' => false, 'message' => 'Email and user type are required'], 400);
}

$email = trim($data['email']);
$userType = $data['userType'];
// optional debug flag from client: if present we will echo the OTP in the JSON
$debugMode = !empty($data['debug']);

try {
    $pdo = getDBConnection();

    $table = $userType === 'admin' ? 'admin_users' : 'students';
    $idField = $userType === 'admin' ? 'employee_id' : 'student_id';

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM $table WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user) {
        sendResponse(['success' => false, 'message' => 'Email not found'], 404);
    }

    // Generate 6-digit OTP
    $otp = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);
    $expiresAt = date('Y-m-d H:i:s', strtotime('+10 minutes'));

    // Store OTP (replace any existing)
    $stmt = $pdo->prepare("REPLACE INTO password_resets (email, otp, expires_at, user_type) VALUES (?, ?, ?, ?)");
    $stmt->execute([$email, $otp, $expiresAt, $userType]);

    // Attempt to send an email with the OTP. This uses PHP's built-in mail()
    // function for simplicity; you can replace this with PHPMailer or any other
    // library if you have SMTP credentials configured. On a local XAMPP install
    // mail() may not work out of the box; you'll need to configure sendmail or
    // use a third party service. We still return success so the flow works in
    // development, but we log failures to the server error log.

    $subject = 'Labbird Password Reset Code';
    $message = "Your password reset code is: $otp\n\n" .
               "This code will expire in 10 minutes.\n";
    $headers = 'From: no-reply@mapua.edu.ph' . "\r\n" .
               'Reply-To: no-reply@mapua.edu.ph' . "\r\n" .
               'X-Mailer: PHP/' . phpversion();

    if (!mail($email, $subject, $message, $headers)) {
        // log failure but do not expose details to user
        error_log("[forgot-password] mail() failed for $email");
    }

    // If debug mode is requested (e.g. local development) include the OTP
    // in the JSON response so the front‑end doesn't have to rely on mail().
    $response = ['success' => true, 'message' => 'Verification code sent to your email'];
    if ($debugMode) {
        $response['otp'] = $otp;
    }
    sendResponse($response);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to send verification code'], 500);
}
