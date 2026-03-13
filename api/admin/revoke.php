<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

$adminId = $data['adminId'] ?? $data['id'] ?? null;
if (!$adminId) {
    sendResponse(['success' => false, 'message' => 'Admin ID is required'], 400);
}

try {
    $pdo = getDBConnection();

    // Update admin status
    $stmt = $pdo->prepare("UPDATE admin_users SET status = 'revoked' WHERE id = ? AND status = 'approved'");
    $stmt->execute([$adminId]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Admin not found or not approved'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Admin access revoked successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to revoke admin access'], 500);
}
?>