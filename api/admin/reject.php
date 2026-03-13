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
    $stmt = $pdo->prepare("UPDATE admin_users SET status = 'rejected' WHERE id = ? AND status = 'pending'");
    $stmt->execute([$adminId]);

    if ($stmt->rowCount() === 0) {
        sendResponse(['success' => false, 'message' => 'Admin not found or not pending'], 404);
    }

    sendResponse(['success' => true, 'message' => 'Admin rejected successfully']);

} catch (Exception $e) {
    sendResponse(['success' => false, 'message' => 'Failed to reject admin'], 500);
}
?>