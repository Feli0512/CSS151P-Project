<?php
require_once __DIR__ . '/../config.php';

$data = getPostData();

// support both `id` and `adminId` keys for backward compatibility
$adminId = $data['adminId'] ?? $data['id'] ?? null;
if (!$adminId) {
    sendResponse(['success' => false, 'message' => 'Admin ID is required'], 400);
}

try {
    $pdo = getDBConnection();

    // Update admin status
    $stmt = $pdo->prepare("UPDATE admin_users SET status = 'approved' WHERE id = ? AND status = 'pending'");
    $stmt->execute([$adminId]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Admin not found or not pending'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Admin approved successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to approve admin'], 500);
}
?>